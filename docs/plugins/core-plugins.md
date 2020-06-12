---
layout: docs
title: Develop Core Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
    * [@RegisterPlugin annotation](#@register-plugin-annotation) 
    * [Plugin Configuration](#plugin-configuration)
    * [Dependency injection](#dependency-injection)
    * [Request and Response Generic Classes](#request-and-response-generic-classes)
* [Services](#services)
* [Interceptors](#interceptors)
* [Initializers](#initializers)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}

## Introduction

Plugins allow to extend RESTHeart:

- **Services** to extend the API adding web services.
- **Interceptors** to snoop and modify requests and responses at different stages of the request lifecycle.
- **Initializers**  to execute initialization logic at system startup time.

It is also possible developing security plugins to customize the security layer. Refer to [Develop Security Plugins](/docs/plugins/security-plugins) for more information.

For code examples of Plugins please refer to [RESTHeart Examples](https://github.com/softInstigate/restheart-examples) repository on GitHub.

### @RegisterPlugin annotation

All plugins must be a annotated with `@RegisterPlugin` to:
- allow RESTHeart to find plugins' implementation classes in deployed jars (see [How to Deploy Plugins](/docs/plugins/deploy))
- specify parameters such us the URI of a Service or the intercept point of an Interceptor.

An example follows:

```java
@RegisterPlugin(name = "foo service", 
    description = "just an example service", 
    defaultUri="/foo",
    enabledByDefault=false) 
public class MyPluginimplements JsonService {
...
}
```

### Plugin Configuration

A plugins has a name as defined by the the `@RegisterPlugin` annotation. To define a configuration for a plugin just use its name under the `plugins-args` yml object:

```
plugins-args:
    ping:
        enabled: true
        secured: false
        uri: /ping
        msg: 'Ping!'
```

`enabled` `secured` and `uri` are special configuration options that are automatically managed by RESTHeart:

- *enabled*: for enabling or disabling the plugin via configuration overwriting the `enabledByDefault` property of `@RegisterPlugin`
- *uri*: applies to Services to bind them to the URI overwriting the `defaultUri` property of `@RegisterPlugin`
- *secured*: applies to Services, with `secured: true` the service request goes thought the authentication and authorization phases, with `secured: false` the service is fully open.

{: .bs-callout .bs-callout-warning }
Service have `secured: false` by default. If a service is deployed and has no configuration it will be fully open. If your service needs to be protected, add a configuration for it with `secured: true`

The plugin consumes the configuration with a method annotated with `@InjectConfiguration`:

```java
@InjectConfiguration
public void init(Map<String, Object> args) throws ConfigurationException {
    this.msg = argValue(args, "msg");
}
```

`argValue()` is an helper method to simplify retrieving the value of the configuration argument.

### Dependency injection

Other dependency injections than `@InjectConfiguration` are:

-   `@InjectPluginsRegistry` - allows a plugin to get the reference of other plugins.
-   `@InjectMongoClient` - injects the `MongoClient` object that has been already initialized and connected to MongoDB by the mongo service.

```java
private PluginsRegistry registry;

@InjectPluginsRegistry
public void init(PluginsRegistry registry) {
    this.registry = registry;
}
```

### Request and Response Generic Classes

*Services* and *Interceptor* are generic classes. They use type parameters for Request and Response classes.

Many concrete implementations of specialized Request and Response exist in the `org.restheart.exchange` package to simplify development:

- `JsonRequest` and `JsonResponse`
- `BsonRequest` and `BsonResponse`
- `MongoRequest` and `MongoResponse`
- `ByteArrayRequest` and `ByteArrayResponse`
- `BsonFromCsvRequest`

Those implementations differ on the data type used to hold the request and response content. For example, `ByteArrayRequest` and `BsonRequest` hold content as `byte[]` and `BsonValue` respectively.

Different implementation can also provide some helper methods to cope with specific request parameter. For instance, the `MongoRequest`, i.e. the request used by the MongoService, has the method `getPageSize()` because this is a query parameter used by that service.

When a request hits RESTHeart, it determines which service will handle it. The Service implementation is responsible of instantiating the correct Request and Response objects that will be used along the whole exchange processing chain.

## Services

Depending on the required content type, the Service class implements one of the specialized `org.restheart.plugins.Service` interfaces:

- `ByteArrayService`
- `JsonService`
- `BsonService`

The code of example [mongo-status-service](https://github.com/SoftInstigate/restheart-examples/tree/master/mongo-status-service) implementing `BsonService` and using the `MongoClient` obtained via `@InjectMongoClient` follows:

```java
@RegisterPlugin(
        name = "serverstatus",
        description = "returns MongoDB serverStatus",
        enabledByDefault = true,
        defaultURI = "/status")
public class MongoServerStatusService implements BsonService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MongoServerStatusService.class);

    private MongoClient mongoClient;

    private static final BsonDocument DEFAULT_COMMAND
            = new BsonDocument("serverStatus", new BsonInt32(1));

    @InjectMongoClient
    public void init(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    @Override
    public void handle(BsonRequest request, BsonResponse response) throws Exception {
        if (request.isGet()) {
            var commandQP = request.getExchange().getQueryParameters().get("command");

            final var command = commandQP != null
                    ? BsonDocument.parse(commandQP.getFirst())
                    : DEFAULT_COMMAND;
            
            LOGGER.debug("### command=" + command);
            
            var serverStatus = mongoClient.getDatabase("admin")
                    .runCommand(command, BsonDocument.class);
            
            response.setContent(serverStatus);
            response.setStatusCode(HttpStatus.SC_OK);
            response.setContentTypeAsJson();
        } else {
            // Any other HTTP verb is a bad request
            response.setStatusCode(HttpStatus.SC_BAD_REQUEST);
        }
    }
}
```

The key method is `handle()` that is executed when a request to the service URI hits RESTHeart.

### Crate Service with type

To implement a Service that handles different types of Request and Response, the it must implement the base `Service` interface. 

The base `Service` interface requires to implement methods to initialize and retrieve the Request and Response objects. 

The following example shows how to handle XML content:

```java
@RegisterPlugin(
        name = "myXmlService",
        description = "example service consuming XML requests",
        enabledByDefault = true,
        defaultURI = "/xml")
public class MyXmlService implements Service<XmlRequest, XmlResponse> {
    @Override
    default Consumer<HttpServerExchange> requestInitializer() {
        return e -> XmlRequest.init(e);
    }

    @Override
    default Consumer<HttpServerExchange> responseInitializer() {
        return e -> XmlResponse.init(e);
    }

    @Override
    default Function<HttpServerExchange, JsonRequest> request() {
        return e -> XmlRequest.of(e);
    }

    @Override
    default Function<HttpServerExchange, JsonResponse> response() {
        return e -> XmlResponse.of(e);
    }
}
```

The example follows a pattern that delegates the actual initialization (in `requestInitializer()` and `responseInitializer()`) and retrieval of the object from the exchange (in `request()` and `response()`) to the concrete class, as follows:

```java
public class XmlRequest extends ServiceRequest<Document> {
    private XmlRequest(HttpServerExchange exchange) {
        super(exchange);
    }
    
    public static XmlRequest init(HttpServerExchange exchange) {
        var ret = new XmlRequest(exchange);
        
        try {
            ret.injectContent();
        } catch (Throwable ieo) {
            ret.setInError(true);
        }
        
        return ret;
    }
    
    public static XmlRequest of(HttpServerExchange exchange) {
        return of(exchange, XmlRequest.class);
    }
    
    public void injectContent() throws SAXException, IOException {
        var dBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
        var rawContent = ChannelReader.read(wrapped.getRequestChannel());
	    
        setContent(xdBuilder.parse(rawContent)ml);
    }
}
```

## Interceptors

Interceptors allows to snoop and modify requests and responses.

A Request Interceptor applies before the request is proxied or handled by a _Service_ thus allowing to modify the request. Its implementation class must implement the interface `org.restheart.security.plugins.RequestInterceptor` .

A Response Interceptor applies after the request has been proxied or handled by a _Service_ thus allowing to modify the response. Its implementation class must implement the interface `org.restheart.security.plugins.ResponseInterceptor`.

Those interfaces both extend the base interface `org.restheart.security.plugins.Interceptor`

```java
public interface Interceptor {
  /**
   * implements the interceptor logic
   *
   * @param exchange
   * @throws Exception
   */
  public void handleRequest(final HttpServerExchange exchange) throws Exception;

  /**
   *
   * @param exchange
   * @return true if the interceptor must handle the request
   */
  public boolean resolve(final HttpServerExchange exchange);
}
```

The `handleRequest()` method is invoked only if the `resolve()` method returns true.

Example interceptor implementations can be found in the package``org.restheart.security.plugins.interceptors`.

If the request is errored, than it is not processed further and the response eventually set is returned.

```java
var request = ByteArrayRequest.wrap(hse);

response.setInError(true);

// or using the helper mehtod endExchangeWithMessage()

response.endExchangeWithMessage(HttpStatus.SC_FORBIDDEN, "you can't do that");
```

### Intercept Point

The Request Interceptor can be executed before or after the authentication and authorization phases. This is controlled defining the intercept point by optionally overriding the method `interceptPoint()` which default behavior is returning `BEFORE_AUTH`.

If the Interceptor needs to deal with the `SecurityContext`, for instance it needs to check the user roles as in `ByteArrayRequest.wrap(echange).isAccountInRole("admin")`, then the Request Interceptor must be executed the authentication and authorization phases after intercept point must be `AFTER_AUTH`.

### Accessing the Content in Request Interceptors

In some cases, you need to access the request content. For example you want to modify request content with a `RequestInterceptor` or to implement an `Authorizer` that checks the content to authorize the request.

Accessing the content from the _HttpServerExchange_ object using the exchange _InputStream_ in proxied requests leads to an error because Undertow allows reading the content just once.

In order to simplify accessing the content, the `ByteArrayRequest.wrap(exchange).readContent()` and `JsonRequest.wrap(exchange).readContent()` helper methods are available. They are very efficient since they use the non blocking `RequestBufferingHandler` under to hood.
However, since accessing the request content might lead to significant performance overhead, a _RequestInterceptor_ that resolves the request and overrides the `requiresContent()` to return true must be implemented to make data available.

`RequestInterceptor` defines the following methods with a default implementation.

```java
public interface RequestInterceptor extends Interceptor {
  public enum IPOINT { BEFORE_AUTH, AFTER_AUTH }

    /**
     *
     * @return true if the Interceptor requires to access the request content
     */
    default boolean requiresContent() {
        return false;
    }

    /**
     *
     * @return the intecept point
     */
    default IPOINT interceptPoint() {
        return BEFORE_AUTH;
    }
}
```

Please note that, in order to mitigate DoS attacks, the size of the Request content available with `readContent()` is limited to 16 Mbytes.

### Accessing the Content in Response Interceptors

In some cases, you need to access the response content. For example you want the modify the response from a proxied resource before sending it to the client.

In order to simplify accessing the content, the `ByteArrayRequest.wrap(exchange).readContent()` and `JsonResponse.wrap(exchange).readContent()` helper methods are available. Since accessing the response content might lead to significant performance overhead because the full response must be read by **restheart** before proxying, an _Interceptor_ that resolves the request and overrides the `requiresResponseContent()` to return true must be implemented to make data available.

`Interceptor` defines the following method with a default implementation that returns false:

```java
public interface ResponseInterceptor extends Interceptor {
  /**
   *
   * @return true if the Interceptor requires to access the response content
   */
  default boolean requiresResponseContent() {
      return false;
  }
}
```

Please note that, in order to mitigate DoS attacks, the size of the response content available with `readContent()` is limited to 16 Mbytes.

### Configuration

Interceptors are configured programmatically with _Initializers_. See [Initializers](#initializers) section for more information.

## Initializers

An _Initializer_ allows executing custom logic at startup time.

Notably it allows to define _Interceptors_ and _Global Permission Predicates_.

The Initializer implementation class must extend the `org.restheart.security.plugins.Initializer` interface, implementing the following method:

```java
public interface Initializer {
  public void init();
}
```

It must also registered via the `@RegisterPlugin` annotation, example:

```java
@RegisterPlugin(
        name = "testInitializer",
        priority = 100,
        description = "The initializer used to test interceptors and global predicates",
        enabledByDefault = false)
public class TestInitializer implements Initializer {

}
```

If the initializer is not enabled by default (i.e.e`enabledByDefault=false`), it can be enabled via configuration file as follows:

```
plugins-args:
  testInitializer:
    enabled: true
```

An example Initializer is `org.restheart.security.plugins.initializers.TestInitializer`.

### Defining Interceptors

The `PluginsRegistry` class allows to define Interceptors.

```java
RequestInterceptor requestInterceptor = ...;
ResponseInterceptor responseIterceptor = ...;

PluginsRegistry.getInstance().getRequestInterceptors().add(requestInterceptor);

PluginsRegistry.getInstance().getResponseInterceptors().add(responseIterceptor);
```

### Defining Global Permission Predicates

The `GlobalSecuirtyPredicatesAuthorizer` class allows to define Global Predicates. Requests must resolve all of the predicates to be allowed.

> You can think about a Global Predicate a way to black list request matching a given condition.

The following example predicate denies `GET /foo/bar` requests:

```java
// add a global security predicate
GlobalSecuirtyPredicatesAuthorizer.getGlobalSecurityPredicates().add(new Predicate() {
    @Override
    public boolean resolve(HttpServerExchange exchange) {
        var request = Request.wrap(exchange);

        // return false to deny the request
        return !(request.isGet()
                        && "/secho/foo".equals(URLUtils.removeTrailingSlashes(
                                        exchange.getRequestPath())));
    }
});
```

<hr>