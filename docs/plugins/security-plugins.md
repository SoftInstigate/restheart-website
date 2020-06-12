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

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress.html %}

## Introduction

This section provides detailed information on how to implement custom security plugins.

See [Security Overview](/docs/security/overview) for an high level view of the RESTHeart security model.

## Authentication Mechanisms

The Authentication Mechanism class must implement the `org.restheart.plugins.security.AuthMechanism` interface.

```java
public interface AuthMechanism extends
        AuthenticationMechanism,
        ConfigurablePlugin {
    @Override
    public AuthenticationMechanismOutcome authenticate(
            final HttpServerExchange exchange,
            final SecurityContext securityContext);

    @Override
    public ChallengeResult sendChallenge(final HttpServerExchange exchange,
            final SecurityContext securityContext);

    default String getMechanismName() {
        return PluginUtils.name(this);
    }
}
```

### Registering

The Authentication Mechanism implementation class must be annotated with `@RegisterPlugin`:

```java
@RegisterPlugin(name="myAuthMechanism",
        description = "my custom auth mechanism")
public class MyAuthMechanism implements AuthMechanism {

}
```

### Configuration

The Authentication Mechanism can receive parameters from the configuration file using the `@InjectConfiguration` annotation:

```java
@InjectConfiguration
    public void init(Map<String, Object> args) throws ConfigurationException {
        // get configuration arguments
        int number  = argValue(args, "number");
        String string = argValue(args, "string");
}
```

The parameters are defined in the configuration file under the `auth-mechanisms` section using the name of the mechanism as defined by the `@RegisterPlugins` annotation:

```yml
auth-mechanisms:
    myAuthMechanism:
        number: 10
        string: a string
```

### authenticate()

The method `authenticate()` must return:

-   NOT_ATTEMPTED: the request cannot be authenticated because it doesn't fulfill the authentication mechanism requirements. An example is _BasicAutMechanism_ when the request does not include the header `Authotization` or its value does not start by `Basic`
-   NOT_AUTHENTICATED: the Authentication Mechanism handled the request but could not authenticate the client, for instance because of wrong credentials.
-   AUTHENTICATED: the Authentication Mechanism successfully authenticated the request. In this case the fo

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

An example is _BasicAuthMechanism_ that sends the `401 Not Authenticated` response with the following challenge header:

```
WWW-Authenticate: Basic realm="RESTHeart Realm"
```

### Build the Account

To build the account, the Authentication Mechanism can use a configurable Authenticator. This allows to extends the Authentication Mechanism with different Authenticator implementations. For instance the _BasicAuthMechanism_ can use different Authenticator implementations that hold accounts information in a DB or in a LDAP server.

Tip: Use the `@InjectConfiguration` and `@InjectPluginsRegistry` to retrieve the instance of the Authenticator from its name.

```java
private IdentityManager identityManager;

    @InjectConfiguration
    @InjectPluginsRegistry
    public void init(final Map<String, Object> args, PluginsRegistry pluginsRegistry) throws ConfigurationException {

        // the authenticator specified in auth mechanism configuration
        this.identityManager = pluginsRegistry.getAuthenticator(argValue(args, "authenticator")).getInstance();
    }

    @Override
    public AuthenticationMechanismOutcome authenticate(final HttpServerExchange exchange,
            final SecurityContext securityContext) {
            Account account = this.identityManager.verify(id, credential);
            if (account != null) {
              securityContext.authenticationComplete(sa, "IdentityAuthenticationManager", true);
              return AuthenticationMechanism.AuthenticationMechanismOutcome.AUTHENTICATED;
            } else {
              securityContext.authenticationFailed("authentication failed", getMechanismName());
              return AuthenticationMechanismOutcome.NOT_AUTHENTICATED;
            }
    }
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
    <name>:
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
    <name>:
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
    <name>:
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
