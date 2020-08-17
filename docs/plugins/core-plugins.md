---
layout: docs
title: Develop Core Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
    * [Dependency](#Dependency) 
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

## Introduction

Plugins allow to extend RESTHeart:

- **Services** extend the API adding web services.
- **Interceptors** snoop and modify requests and responses at different stages of the request lifecycle.
- **Initializers**  execute initialization logic at system startup time.

It is also possible developing security plugins to customize the security layer. Refer to [Develop Security Plugins](/docs/plugins/security-plugins) for more information.

For code examples of Plugins please refer to [RESTHeart Examples](https://github.com/softInstigate/restheart-examples) repository on GitHub.

### Dependency

The only required dependency to develop a plugin is `restheart-commons`.

With maven:

```xml
<dependency>
    <groupId>org.restheart</groupId>
    <artifactId>restheart-commons</artifactId>
    <version>VERSION</version>
</dependency>
```

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
public class MyPlugin implements JsonService {
...
}
```

The following table described the arguments of the annotation:

| param  | plugin  | description  | mandatory  | default value  | 
|---|---|---|---|---|
| name  | all  | the name of the plugin  | yes  | *none* |
| description | all  | description of the plugin | yes  |  *none* |
|  enabledByDefault | all  | true to enable the plugin otherwise it can be enabled by setting the configuration argument `enabled: true`  | no  | true |
|  defaultURI | service  |  the default URI of the Service  | no  | /&lt;srv-name&gt; |
|  dontIntercept |  service | `true` to avoid interceptors to be executed on requests handled by the service  | no  | {} |
|  interceptPoint |  interceptor |  the intercept point: REQUEST_BEFORE_AUTH, REQUEST_AFTER_AUTH, RESPONSE, RESPONSE_ASYNC | no  | REQUEST_AFTER_AUTH |
|  initPoint |  initializer | specify when the initializer is executed: BEFORE_STARTUP, AFTER_STARTUP |  no | AFTER_STARTUP |
|  requiresContent | proxy interceptor | Only used by Interceptors of proxied resources (the content is always available to Interceptor of Services) Set it to true to make available the content of the request (if interceptPoint is REQUEST_BEFORE_AUTH or REQUEST_AFTER_AUTH) or of the response (if interceptPoint is RESPONSE or RESPONSE_ASYNC) | no  | false |
|  priority | interceptor, initializer | the execution priority (less is higher priority  | no  | 10 |

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

```java
private MongoClient mclient;

@InjectMongoClient
public void init(MongoClient mclient) {
    this.mclient = mclient;
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

Depending on the content type, the Service class implements one of the specialized `org.restheart.plugins.Service` interfaces. The following implementation are provided by `restheart-commons`:

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

    private static final BsonDocument COMMAND = new BsonDocument("serverStatus", new BsonInt32(1));

    @InjectMongoClient
    public void init(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    @Override
    public void handle(BsonRequest request, BsonResponse response) throws Exception {
        if (request.isGet()) {
            var serverStatus = mongoClient.getDatabase("admin").runCommand(COMMAND, BsonDocument.class);
            
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

### Crate Service with custom generic type

To implement a Service that handles different types of Request and Response, it must implement the base `Service` interface. 

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

In the constructor a call to `super(exchange)` attaches the object to the `HttpServerExchange`. The object is retrieved using the inherited `of()` method that gets the instance attachment from the `HttpServerExchange`. This is fundamental for two reasons: first the same request and response objects must be shared by the all handlers of the processing chain. Second, this avoid the need to parse the content several times for performance reasons.

## Interceptors

 Interceptors allow to snoop and modify requests and responses at different
 stages of the request lifecycle as defined by the interceptPoint parameter of
 the annotation `@RegisterPlugin`.
 
 An interceptor can intercept either proxied requests or requests handled by
 Services.
 
 An interceptor can intercept requests handled by a Service when its request
 and response types are equal to the ones declared by the Service.
 
 An interceptor can intercept a proxied request, when its request and response
 types extends BufferedRequest and BufferedResponse.

The following implementation are provided by `restheart-commons`:

- `ByteArrayInterceptor` intercepts requests handled by services implementing `ByteArrayService`
- `JsonService` intercepts requests handled by services implementing `JsonService`
- `BsonService` intercepts requests handled by services implementing `BsonService`
- `MongoService` intercepts requests handled by the MongoService

The last one is particularly useful as it allows intercepting requests to the MongoDb API.

```java
@RegisterPlugin(name = "secretFilter", 
    interceptPoint = InterceptPoint.RESPONSE,
    description = "removes the property 'secret' from GET /coll")
public class ReadOnlyPropFilter implements MongoInterceptor {
    @Override
    public void handle(MongoRequest request, MongoResponse response) throws Exception {
        if (response.getContent().isDocument()) {
            response.getContent().asDocument().remove("secret");
        } else if (request.getContent().isArray()) {
            response.getContent().asArray().stream()
                    .map(doc -> doc.asDocument())
                    .forEach(doc -> doc.remove("secret"));
        }
    }

    @Override
    public boolean resolve(MongoRequest request, MongoResponse response) {
        return request.isGet()
                && response.getContent() != null
                && "coll".equalsIgnoreCase(request.getCollectionName();
    }
}

```

The `handle()` method is invoked only if the `resolve()` method returns true.

## Initializers

An _Initializer_ allows executing custom logic at startup time.

The Initializer implementation class must extend the `org.restheart.plugins.Initializer` interface: 

```java
public interface Initializer extends ConfigurablePlugin {
    public void init();
}
```

With the following code the Initializer hangs restheart startup until the user confirms.

```java
@RegisterPlugin(
        name = "confirmStartupInitializer",
        description = "hangs restheart startup until the user hits <enter>"
        priority = 100,
        initPoint = InitPoint.BEFORE_STARTUP)
public class confirmStartupInitializer implements Initializer {
    public void init() {
        System.out.println("Hit <enter> to start RESTHeart");
        System.console().readLine();
    }
}
```

<hr>