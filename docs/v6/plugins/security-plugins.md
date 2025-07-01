---
title: Develop Security Plugins
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Authentication Mechanisms](#authentication-mechanisms)
* [Authenticators](#authenticators)
* [Authorizers](#authorizers)
* [Token Managers](#token-managers)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content pt-0">

{% include docs-head.html %}

{% include doc-in-progress-v6.html %}

## Introduction

This section provides detailed information on how to implement custom security plugins.

## Authentication Mechanisms

An **Authentication Mechanism** authenticates incoming requests.

 RESTHeart provides different implementations: [Basic Authentication](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/plugins/mechanisms/BasicAuthMechanism.java), [Digest Authentication](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/plugins/mechanisms/DigestAuthMechanism.java), [JSON Web Token Authentication](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/plugins/mechanisms/JwtAuthenticationMechanism.java), [Token Authentication](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/plugins/mechanisms/TokenBasicAuthMechanism.java)

These are all different methods for the client to pass some sort of credentials to the server. For example, `BasicAuthMechanism` extracts the credentials from the `Authorization` request header following the Basic Authentication specs [RFC 7617](https://tools.ietf.org/html/rfc7617).

Once the Authentication Mechanism has retrieved the credentials from the request, it can delegate the actual verification to an `Authenticator` that checks them against a credentials db that can be as simple as a configuration file or a database or an LDAP server.

See [Security Overview](/docs/security/overview) for an high level view of the RESTHeart security model.

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

-   *NOT_ATTEMPTED*: the request cannot be authenticated because it doesn't fulfill the authentication mechanism requirements. An example is in `BasicAuthMechanism` when the request does not include the header `Authotization` or its value does not start with `Basic`
-   *NOT_AUTHENTICATED*: the Authentication Mechanism handled the request but could not authenticate the client, for instance because of wrong credentials.
-   *AUTHENTICATED*: the Authentication Mechanism successfully authenticated the request.

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

The mechanism should not set the response code, instead that should be indicated in the `AuthenticationMechanism.ChallengeResult` and the most appropriate overall response code will be selected.

This is due the fact that several mechanisms can be enabled and, as an in-bound request is received, the authenticate method is called on each mechanism in turn until one of the following occurs: a mechanism successfully authenticates the incoming request or the list of mechanisms is exhausted.

`sendChallenge()` can also be used to set a response header.

An example is `BasicAuthMechanism` that, in case of failure, indicates  the response code `401 Not Authenticated` and sets the following challenge header:

```
WWW-Authenticate: Basic realm="RESTHeart Realm"
```

This is the code:

```java
@Override
public ChallengeResult sendChallenge(HttpServerExchange exchange, SecurityContext securityContext) {
        exchange.getResponseHeaders().add(WWW_AUTHENTICATE, challenge);
        return new ChallengeResult(true, UNAUTHORIZED);
}
```

### Build the Account

To build the account, the Authentication Mechanism can use a configurable `Authenticator`. This allows to extends the Authentication Mechanism with different `Authenticator` implementations. For instance the _BasicAuthMechanism_ can use Authenticator implementations that hold accounts information on a DB or on a LDAP server.

Tip: Use the `@InjectConfiguration` and `@InjectPluginsRegistry` to retrieve the instance of the `Authenticator` from its name.

```java
private Authenticator authenticator;

@InjectConfiguration
@InjectPluginsRegistry
public void init(final Map<String, Object> args, PluginsRegistry pluginsRegistry) throws ConfigurationException {
    // the authenticator specified in auth mechanism configuration
    this.authenticator = pluginsRegistry.getAuthenticator(argValue(args, "authenticator")).getInstance();
}

@Override
public AuthenticationMechanismOutcome authenticate(final HttpServerExchange exchange,
        final SecurityContext securityContext) {
        var account = this.authenticator.verify(id, credential);
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

Authenticators verify credentials passed by the client and build the `Account`.

RESTHeart provides two implementations of `Authenticator`: [FileRealmAuthenticator](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/plugins/authenticators/FileRealmAuthenticator.java) and [MongoRealmAuthenticator](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/plugins/authenticators/MongoRealmAuthenticator.java) that handle credentials in a configuration file and on a MongoDb collection respectively.

The Authenticator class must implement the `org.restheart.plugins.security.Authenticator` interface.

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

### Registering

The Authenticator class must be annotated with `@RegisterPlugin`:

```java
@RegisterPlugin(name="myAuthenticator",
        description = "my custom authenticator")
public class MyAuthenticator implements Authenticator {

}
```

### Configuration

The Authenticator can receive parameters from the configuration file using the `@InjectConfiguration` annotation:

```java
@InjectConfiguration
    public void init(Map<String, Object> args) throws ConfigurationException {
        // get configuration arguments
        int number  = argValue(args, "number");
        String string = argValue(args, "string");
}
```

The parameters are defined in the configuration file under the `authenticators` section using the name of the authenticator as defined by the `@RegisterPlugins` annotation:

```yml
authenticators:
    myAuthenticator:
        number: 10
        string: a string
```

## Authorizers

Authorizers check if the authenticated client can execute the request according to the security policy.

RESTHeart provides two implementations of `Authorizer`: [FileAclAuthorizer](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/plugins/authorizers/FileAclAuthorizer.java) and [MongoAclAuthorizer](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/plugins/authorizers/MongoAclAuthorizer.java) that handle the ACL in a configuration file and on a MongoDb collection respectively.

The Authorizer implementation class must implement the `org.restheart.plugins.security.Authorizer` interface.

```java
public interface Authorizer extends ConfigurablePlugin {

    /**
     *
     * @param request
     * @return true if request is allowed
     */
    boolean isAllowed(final Request request);

    /**
     *
     * @param request
     * @return true if not authenticated user won't be allowed
     */
    boolean isAuthenticationRequired(final Request request);
}
```

### Registering

The Authorizer class must be annotated with `@RegisterPlugin`:

```java
@RegisterPlugin(name="myAuthorizer",
        description = "my custom authorizer")
public class MyAuthorizer implements Authorizer {

}
```

### Configuration

The Authorizer can receive parameters from the configuration file using the `@InjectConfiguration` annotation:

```java
@InjectConfiguration
    public void init(Map<String, Object> args) throws ConfigurationException {
        // get configuration arguments
        int number  = argValue(args, "number");
        String string = argValue(args, "string");
}
```

The parameters are defined in the configuration file under the `authorizers` section using the name of the authorizer as defined by the `@RegisterPlugins` annotation:

```yml
authorizers:
    myAuthorizer:
        number: 10
        string: a string
```

## Token Managers

A `Token Manager` generates and verify authentication tokens. When a request gets authenticated in any configured way, for instance via Basic Authentication, the response contains the `Auth-Token` header. The value of this token is generated by the Token Manager. Further requests can use this auth token in place of the actual credentials.

{: .bs-callout .bs-callout-info}
The Token Manager works in conjunction with the Authentication Mechanism `tokenBasicAuthMechanism`. This is the mechanism that handles the token and delegates its verification to the configured token manager.

RESTHeart provides one implementation of `TokenManager`: [RndTokenManager](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/plugins/tokens/RndTokenManager.java) that generates random tokens.

The Token Manager implementation class must implement the `org.restheart.plugins.security.TokenManager` interface.

Note that `TokenManager` extends `Authenticator` for token verification methods.

```java
public interface TokenManager extends Authenticator, ConfigurablePlugin {
    public static final HttpString AUTH_TOKEN_HEADER = HttpString.tryFromString("Auth-Token");
    public static final HttpString AUTH_TOKEN_VALID_HEADER = HttpString.tryFromString("Auth-Token-Valid-Until");
    public static final HttpString AUTH_TOKEN_LOCATION_HEADER = HttpString.tryFromString("Auth-Token-Location");
    public static final HttpString ACCESS_CONTROL_EXPOSE_HEADERS = HttpString.tryFromString("Access-Control-Expose-Headers");
    /**
     * retrieves of generate a token valid for the account
     *
     * @param account
     * @return the token for the account
     */
    public PasswordCredential get(final Account account);

    /**
     * invalidates the token bound to the account
     *
     * @param account
     */
    public void invalidate(final Account account);

    /**
     * updates the account bound to a token
     *
     * @param account
     */
    public void update(final Account account);

    /**
     * injects the token headers in the response
     *
     * @param exchange
     * @param token
     */
    public void injectTokenHeaders(final HttpServerExchange exchange, final PasswordCredential token);
}
```

### Registering

The Token Manager class must be annotated with `@RegisterPlugin`:

```java
@RegisterPlugin(name="myTokenManager",
        description = "my custom token manager")
public class MyTokenManager implements TokenManager {

}
```

{: .bs-callout .bs-callout-warning}
Only one token manager can be used. If more than one token-manager are defined and enabled, only the first one will be used.

### Configuration

The Token Manager can receive parameters from the configuration file using the `@InjectConfiguration` annotation:

```java
@InjectConfiguration
    public void init(Map<String, Object> args) throws ConfigurationException {
        // get configuration arguments
        int number  = argValue(args, "number");
        String string = argValue(args, "string");
}
```

The parameters are defined in the configuration file under the `token-manager` section using the name of the token manager as defined by the `@RegisterPlugins` annotation:

```yml
token-manager:
    myTokenManager:
        number: 10
        string: a string
```
