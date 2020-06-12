---
layout: docs
title: Develop Core Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Services](#services)
* [Initializers](#initializers)
* [Interceptors](#interceptors)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}

## Introduction

For examples refer to [RESTHeart Examples](https://github.com/softInstigate/restheart-examples) repo

## Services

The Service implementation class must extend the `org.restheart.security.plugins.Service` abstract class, implementing the following method

```java
public abstract class Service extends PipedHttpHandler implements ConfigurablePlugin {
  /**
   *
   * @param exchange
   * @throws Exception
   */
  public abstract void handleRequest(HttpServerExchange exchange) throws Exception;
  }
}
```

An example service implementation follows. It sends the usual `Hello World` message, however if the request specifies `?name=Bob` it responds with `Hello Bob`.

```java
public void handleRequest(HttpServerExchange exchange) throws Exception {
  var msg = new StringBuffer("Hello ");

  var _name = exchange.getQueryParameters().get("name");

  if (_name == null || _name.isEmpty()) {
      msg.append("World");
  } else {
      msg.append(_name.getFirst());
  }

  var response = ByteArrayResponse.wrap(exchange);

  response.setStatusCode(HttpStatus.SC_OK);
  response.setContentType("text/plain");
  response.writeContent(msg.getBytes());
}
```

### Configuration

The _Service_ must be declared in the yml configuration file.
Of course the implementation class must be in the java classpath.

```yml
services:
    <name>:
        uri: <the-service-uri>
        secured: <boolean>
        number: 10
        string: a string
```

The _uri_ property allows to bind the service under the specified path. E.g., with `uri: /mysrv` the service responds at URL `https://domain.io/mysrv`

With `secured: true` the service request goes thought the authentication and authorization phases. With `secured: false` the service is fully open.

### Constructor

The Service abstract class implements the following constructor:

```java
public MyService(PipedHttpHandler next,
          String name,
          String uri,
          Boolean secured,
          Map<String, Object> args);
```

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