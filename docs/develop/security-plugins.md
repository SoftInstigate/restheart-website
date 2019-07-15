---
layout: docs
title: Develop Security Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Authentication Mechanisms](#authentication-mechanisms)
* [Authenticators](#authenticators)
* [Authorizers](#authorizers)
* [Token Managers](#token-managers)
* [Services](#services)
* [Initializers](#initializers)
* [Interceptors](#interceptors)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

This section provides detailed information on how to implement custom security plugins for the [RESTHeart Platform](https://restheart.org/get). If you are looking for the OSS Edition, please refer to its [GitHub repository](https://github.com/SoftInstigate/restheart-security/)

See [Understanding RESTHeart Security](/docs/security/overview#understanding-restheart-security) for an high level view of the RESTHeart security model.

## Authentication Mechanisms

The Authentication Mechanism class must implement the `org.restheart.security.plugins.AuthMechanism` interface. 

```java
public interface AuthMechanism implements AuthenticationMechanism {
  @Override
  public AuthenticationMechanismOutcome authenticate(
          final HttpServerExchange exchange,
          final SecurityContext securityContext);

  @Override
  public ChallengeResult sendChallenge(final HttpServerExchange exchange,
          final SecurityContext securityContext);

  public String getMechanismName();
```

### Configuration

The Authentication Mechanism must be declared in the yml configuration file. 
Of course the implementation class must be in the java classpath.

```yml
auth-mechanisms:
    - name: <name>
      class: <full-class-name>
      args:
        number: 10
        string: a string
```

### Constructor

The Authentication Mechanism implementation class must have the following constructor:

If the property `args` is specified in configuration:

```java
public MyAuthMechanism(final String name, final Map<String, Object> args) throws ConfigurationException {

  // use argValue() helper method to get the arguments specified in the configuration file
  Integer _number = argValue(args, "number");
  String _string = argValue(args, "string");
}
```

If the property `args` is not specified in configuration:

```java
public MyAuthMechanism(final String name) throws ConfigurationException {
}
```

### authenticate()

The method `authenticate()` must return:

- NOT_ATTEMPTED: the request cannot be authenticated because it doesn't fulfill the authentication mechanism requirements. An example is *BasicAutMechanism* when the request does not include the header `Authotization` or its value does not start by `Basic `
- NOT_AUTHENTICATED: the Authentication Mechanism handled the request but could not authenticate the client, for instance because of wrong credentials.
- AUTHENTICATED: the Authentication Mechanism successfully authenticated the request. In this case the fo

To mark the authentication as failed in `authenticate()`:

```java
securityContext.authenticationFailed("authentication failed", getMechanismName());
return AuthenticationMechanismOutcome.NOT_AUTHENTICATED;
```

To mark the authentication as successful in `authenticate()`:

```java
// build the account
final Account account;

securityContext.authenticationComplete(account, getMechanismName(), false);

return AuthenticationMechanismOutcome.AUTHENTICATED;
```

### sendChallenge()

`sendChallenge()` is executed when the authentication fails.

An example is *BasicAuthMechanism* that sends the `401 Not Authenticated` response with the following challenge header:

```
WWW-Authenticate: Basic realm="RESTHeart Realm"
```

### Build the Account

To build the account, the Authentication Mechanism can use a configurable Authenticator. This allows to extends the Authentication Mechanism with different Authenticator implementations. For instance the *BasicAuthMechanism* can use different Authenticator implementations that hold accounts information in a DB or in a LDAP server. 

Tip: Use the `PluginsRegistry` to get the instance of the Authenticator from its name.

```java
// get the name of the authenticator from the arguments
String authenticatorName = argValue(args, "authenticator");

Authenticator authenticator = PluginsRegistry
                                .getInstance()
                                .getAuthenticator(authenticatorName);

// get the client id and credential from the request
String id;
Credential credential;


Account account = authenticator.verify(id, credential);
```

## Authenticators

The Authenticator class must implement the `org.restheart.security.plugins.Authenticator` interface. 

```java
public interface Authenticator extends IdentityManager {
  @Override
  public Account verify(Account account);
  
  @Override
  public Account verify(String id, Credential credential);

  @Override
  public Account verify(Credential credential);
}
```

### Configuration

The Authenticator must be declared in the yml configuration file. 
Of course the implementation class must be in the java classpath.

```yml
authenticators:
    - name: <name>
      class: <full-class-name>
      args:
        number: 10
        string: a string
```

### Constructor

The Authenticator implementation class must have the following constructor:

If the property `args` is specified in configuration:

```java
public MyAuthenticator(final String name, final Map<String, Object> args) throws ConfigurationException {

  // use argValue() helper method to get the arguments specified in the configuration file
  Integer _number = argValue(args, "number");
  String _string = argValue(args, "string");
}
```

If the property `args` is not specified in configuration:

```java
public MyAuthenticator(final String name) throws ConfigurationException {
}
```

## Authorizers

The Authorizer implementation class must implement the `org.restheart.security.Authorizer` interface. 

```java
public interface Authorizer {
    /**
     *
     * @param exchange
     * @param context
     * @return true if request is allowed
     */
    boolean isAllowed(HttpServerExchange exchange);

    /**
     *
     * @param exchange
     * @return true if not authenticated user won't be allowed
     */
    boolean isAuthenticationRequired(final HttpServerExchange exchange);
}
```

### Configuration

The Authorizer must be declared in the yml configuration file. 
Of course the implementation class must be in the java classpath.

```yml
authorizers:
      name: <name>
      class: <full-class-name>
      args:
        number: 10
        string: a string
```

### Constructor

The Authorizer implementation class must have the following constructor:

If the property `args` is specified in configuration:

```java
public MyAuthorizer(final String name, final Map<String, Object> args) throws ConfigurationException {

  // use argValue() helper method to get the arguments specified in the configuration file
  Integer _number = argValue(args, "number");
  String _string = argValue(args, "string");
}
```

If the property `args` is not specified in configuration:

```java
public MyAuthorizer(final String name) throws ConfigurationException {
}
```

## Token Managers

The Token Manager implementation class must implement the `org.restheart.security.plugins.TokenManager` interface. 

Note that TokenManager extends Authenticator for token verification methods.

```java
public interface PluggablTokenManager extends Authenticator {
  static final HttpString AUTH_TOKEN_HEADER = HttpString.tryFromString("Auth-Token");
  static final HttpString AUTH_TOKEN_VALID_HEADER = HttpString.tryFromString("Auth-Token-Valid-Until");
  static final HttpString AUTH_TOKEN_LOCATION_HEADER = HttpString.tryFromString("Auth-Token-Location");

  /**
   * retrieves of generate a token valid for the account
   * @param account
   * @return the token for the account
   */
  public PasswordCredential get(Account account);

  /**
   * updates the account bound to a token
   * @param account
   */
  public void update(Account account);

  /**
   * invalidates the token bound to the account
   * @param account
   * @param token 
   */
  public void invalidate(Account account);

  /**
   * injects the token headers in the response
   * 
   * @param exchange
   * @param token 
   */
  public void injectTokenHeaders(HttpServerExchange exchange, PasswordCredential token);
}
```

### Configuration

The Token Manager must be declared in the yml configuration file. 
Of course the implementation class must be in the java classpath.

```yml
token-manager:
    name: <name>
    class: <full-class-name>
    args:
      number: 10
      string: a string
```

### Constructor

The Token Manager implementation class must have the following constructor:

If the property `args` is specified in configuration:

```java
public MyTM(final String name, final Map<String, Object> args) throws ConfigurationException {

  // use argValue() helper method to get the arguments specified in the configuration file
  Integer _number = argValue(args, "number");
  String _string = argValue(args, "string");
}
```

If the property `args` is not specified in configuration:

```java
public MyTM(final String name) throws ConfigurationException {
}
```

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

The *Service* must be declared in the yml configuration file. 
Of course the implementation class must be in the java classpath.

```yml
services:
    - name: <name>
      class: <full-class-name>
      uri: <the-service-uri>
      secured: <boolean>
      args:
        number: 10
        string: a string
```

The *uri* property allows to bind the service under the specified path. E.g., with `uri: /mysrv` the service responds at URL `https://domain.io/mysrv`


With `secured: true` the service request goes thought the  authentication and authorization phases. With `secured: false` the service is fully open. 

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

An *Initializer* allows executing custom logic at startup time. 

Notably it allows to define *Interceptors* and *Global Permission Predicates*.

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

### Configuration

The Initializer must be declared in the yml configuration file. 
Of course the implementation class must be in the java classpath.

```yml
initializer-class: org.restheart.security.plugins.initializers.ExampleInitializer
```

### Defining Interceptors

The `PluginsRegistry` class allows to define Interceptors.

```java
RequestInterceptor requestInterceptor = ...;
ResponseInterceptor responseIterceptor = ...;

PluginsRegistry.getRequestInterceptors().add(requestInterceptor);

PluginsRegistry.getResponseInterceptors().add(responseIterceptor);
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

Interceptors allows to snoop and modify request and responses.

A Request Interceptor applies before the request is proxied or handled by a *Service* thus allowing to modify the request. Its implementation class must implement the interface `org.restheart.security.plugins.RequestInterceptor` .

A Response Interceptor applies after the request has been proxied or handled by a *Service* thus allowing to modify the response. Its implementation class must implement the interface `org.restheart.security.plugins.ResponseInterceptor`.

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

### Accessing the Content in Request Interceptors

In some cases, you need to access the request content. For example you want to modify request content with a `RequestInterceptor` or to implement an `Authorizer` that checks the content to authorize the request.

 Accessing the content from the *HttpServerExchange* object using the exchange *InputStream* in proxied requests leads to an error because Undertow allows reading the content just once. 

 In order to simplify accessing the content, the `ByteArrayRequest.wrap(exchange).readContent()` and `JsonRequest.wrap(exchange).readContent()` helper methods are available. They are very efficient since they use the non blocking `RequestBufferingHandler` under to hood.
 However, since accessing the request content might lead to significant performance overhead, a *RequestInterceptor* that resolves the request and overrides the `requiresContent()` to return true must be implemented to make data available.

 `RequestInterceptor` defines the following method with a default implementation that returns false:

```java
public interfaceRequestInterceptor extends Interceptor {
  /**
   *
   * @return true if the Interceptor requires to access the request content
   */
  default boolean requiresContent() {
      return false;
  }
}
```

Please note that, in order to mitigate DoS attacks, the size of the Request content available with `readContent()` is limited to 16 Mbytes.

### Accessing the Content in Response Interceptors

In some cases, you need to access the response content. For example you want the modify the response from a proxied resource before sending it to the client.

 In order to simplify accessing the content, the `ByteArrayRequest.wrap(exchange).readContent()` and `JsonResponse.wrap(exchange).readContent()` helper methods are available. Since accessing the response content might lead to significant performance overhead because the full response must be read by **restheart-security**, a *ResponseInterceptor* that resolves the request and overrides the `requiresResponseContent()` to return true must be implemented to make data available.

 `ResponseInterceptor` defines the following method with a default implementation that returns false:

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

Interceptors are configured programmatically with *Initializers*. See [Initializers](#initializers) section for more information.