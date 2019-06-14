---
layout: docs
title: Authentication
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Authentication Mechanisms](#authentication-mechanisms)
    * [JWT Authentication](#jwt-authentication)
    * [Basic Authentication](#basic-authentication)
        * [Avoid browsers to open the login popup window](#avoid-browsers-to-open-the-login-popup-window)
    * [Digest Authentication](#digest-authentication)
    * [Token Authentication](#token-authentication)
    * [Identity Authentication](#identity-authentication)
* [Authenticators](#authenticators)
    * [RESTHeart Authenticator](#restheart-authenticator)
    * [Simple File Authenticator](#simple-file-authenticator)
* [Token Managers](#token-managers)
    * [Random Token Manager](#random-token-manager)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

See [Understanding RESTHeart Security](/docs/security/overview#understanding-restheart-security) for an high level view of the RESTHeart security model.

**restheart-security** is built around a __pluggable architecture__. It comes with a strong security implementation but you can easily extend it by implementing plugins.  This section documents the authentication plugins available out-of-the-box. You can also develop your own authentication plugins. Refer to [Develop Security Plugins](/docs/develop/security-plugins) section for more information.

## Authentication Mechanisms

### JWT Authentication

<div class="alert alert-info" role="alert">
    <h2 class="alert-heading"><strong>RESTHeart Platform</strong> feature.</h2>
    <hr class="my-2">
    <p>JWT Authentication is available only on RESTHeart Platform.</p>
    <p class="small">Confused about versions? Check the <a class="alert-link" href="/versions">versions matrix</a>.</p>
    <p><span class="badge badge-pill badge-light p-1"><a href="/get" class="uri">Get a free Trial License to evaluate it!</a></span></p>
</div>

JWT Authentication manages the authentication following the <a href="https://jwt.io" target="_blank">JSON Web Token standard</a>.

The token is verified against the configured `issuer` and `audience` and according to the specified `algorithm`.

Supported alghoritms are the HMAC256, HMAC384, HMAC512, RSA256, RSA384, RSA512.

For HMAC the `key` configuration option specifies the secret, for RSA the public key.

```yml
- name: jwtAuthenticationMechanism
     class: com.restheart.security.plugins.mechanisms.JwtAuthenticationMechanism
     args: 
         algorithm: HS256
         key: secret
         base64Encoded: false
         usernameClaim: sub
         rolesClaim: roles
#          fixedRoles:
#            - admin
         issuer: myIssuer
         audience: myAudience
```

It is also possible to programmatically add extra verification steps via an [Initializer](/docs/develop/security-plugins#develop-an-initializer). An example follows:

```java
@RegisterPlugin(
        name = "extraJwtVerificator", 
        priority = 100, 
        description = "Demonstrate how to add an extra verifictation step "
                + "to the jwtAuthenticationMechanism",
        enabledByDefault = false)
public class ExtraJwtVerificator implements Initializer {

    @Override
    public void init() {
        JwtAuthenticationMechanism am;
        try {
            am = (JwtAuthenticationMechanism) PluginsRegistry
                    .getInstance()
                    .getAuthenticationMechanism("jwtAuthenticationMechanism");
        } catch (ConfigurationException | ClassCastException ex) {
            throw new IllegalStateException("cannot get jwtAuthenticationMechanism", ex);
        }

        am.setExtraJwtVerifier(token -> {
            Claim extraClaim = token.getClaim("extra");

            if (extraClaim == null || extraClaim.isNull()) {
                throw new JWTVerificationException("missing extra claim");
            }

            var extra = extraClaim.asMap();

            if (!extra.containsKey("a")) {
                throw new JWTVerificationException("extra claim does not have "
                        + "'a' property");
            }

            if (!extra.containsKey("b")) {
                throw new JWTVerificationException("extra claim does not have "
                        + "'b' property");
            }
        });
    }

}
```

### Basic Authentication

**BasicAuthMechanism** manages the Basic Authentication method, where the client credentials are sent via the `Authorization` request header using the format `Authorization: Basic base64(id:pwd)`. The configuration allows specifying the Authenticator that will be used to verify the credentials.

```yml
auth-mechanisms:
    - name: basicAuthMechanism
      class: org.restheart.security.plugins.mechanisms.BasicAuthMechanism
      args:
        realm: RESTHeart Realm
        authenticator: simpleFileAuthenticator
```

### Avoid browsers to open the login popup window

The Basic and Digest Authentication protocols requires responding with a challenge when the request cannot be authenticated as follows:

```
WWW-Authenticate: Basic realm="RESTHeart Realm"
WWW-Authenticate: Digest realm="RESTHeart Realm",domain="localhost",nonce="Toez71bBUPoNMTU0NDAwNDMzNjEwMXBY+Jp7YX/GVMcxAd61FpY=",opaque="00000000000000000000000000000000",algorithm=MD5,qop="auth"
```

In browsers this leads to the login popup windows. In our web applications we might want to redirect to a fancy login page when the 401 Unauthorized response code. 

To avoid the popup window just add to the request the `noauthchallenge` query parameter or the header `No-Auth-Challenge`. This will skip the challenge response.

### Digest Authentication

**DigestAuthMechanism** manages the Digest Authentication method. The configuration allows specifying the Authenticator that will be used to verify the credentials.

```yml
auth-mechanisms:
    - name: digestAuthMechanism
      class: org.restheart.security.plugins.mechanisms.DigestAuthMechanism
      args: 
        realm: RESTHeart Realm
        domain: localhost
        authenticator: simpleFileAuthenticator
```

### Token Authentication

**TokenBasicAuthMechanism** manages the Basic Authentication method with the actual password replaced by the auth token generated by **restheart-security**, i.e. the client credentials are sent via the `Authorization` request header using the format `Authorization: Basic base64(id:auth-token)`. It requires a Token Manager to be configured (eg. RndTokenManager).

```yml
auth-mechanisms:
    - name: tokenBasicAuthMechanism
      class: org.restheart.security.plugins.mechanisms.TokenBasicAuthMechanism
      args: 
        realm: RESTHeart Realm
```

### Identity Authentication

**IdentityAuthMechanism** just authenticates any request building an [BaseAccount](https://github.com/SoftInstigate/restheart-security/blob/master/src/main/java/io/restheart-security/plugins/authentication/impl/BaseAccount.java) with the *username* and *roles* specified in the configuration. Useful for testing purposes. Note that enabling this causes the *DigestAuthMechanism* to fail, you cannot use both.

```yml
auth-mechanisms:
    - name: identityAuthMechanism
      class: org.restheart.security.plugins.mechanisms.IdentityAuthMechanism
      args:
        username: admin
        roles:
            - admin
            - user
```

**IdentityAuthMechanism** 

```yml
    - name: identityAuthMechanism
      class: org.restheart.security.plugins.mechanisms.IdentityAuthMechanism
      args:
        username: admin
        roles:
            - admin
            - user
```

## Authenticators

### RESTHeart Authenticator

<div class="alert alert-info" role="alert">
    <h2 class="alert-heading"><strong>RESTHeart Platform</strong> feature.</h2>
    <hr class="my-2">
    <p>RESTHeart Authenticator is available only on RESTHeart Platform.</p>
    <p class="small">Confused about versions? Check the <a class="alert-link" href="/versions">versions matrix</a>.</p>
    <p><span class="badge badge-pill badge-light p-1"><a href="/get" class="uri">Get a free Trial License to evaluate it!</a></span></p>
</div>

*RESTHeart Authenticator* authenticates users defined in a MongoDB collection, seamlessly connecting restheart-security with restheart-core.

> RESTHeart Authenticator is strong and battle tested and suggested for production use.

The configuration allows:

- defining the collection to use (`users-collection-uri`), the properties of the user document to use as user id, password  and roles (`prop-id`, `prop-password` and `json-path-roles`).
- enabling hashed password using the strong bcrypt hashing algorithm (`bcrypt-hashed-password` and `bcrypt-complexity`); note that the password is automatically hashed on write requests and that the password property is automatically removed from responses.
- allows initializing the users collection and the admin user if not existing. See `create-user` option.

``` yml
authenticators:
    - name: rhAuthenticator
      class: com.restheart.security.plugins.authenticators.RHAuthenticator
      args:
        users-collection-uri: /users
        prop-id: _id
        prop-password: password
        json-path-roles: $.roles
        bcrypt-hashed-password: true
        bcrypt-complexity: 12
        create-user: true
        create-user-document: '{"_id": "admin", "password": "$2a$12$lZiMMNJ6pkyg4uq/I1cF5uxzUbU25aXHtg7W7sD2ED7DG1wzUoo6u", "roles": ["admin"]}'
        # create-user-document.password must be hashed when bcrypt-hashed-password=true
        # default password is 'secret'
        # see https://bcrypt-generator.com but replace initial '$2y' with '$2a'
        cache-enabled: true
        cache-size: 1000
        cache-ttl: 60000
        cache-expire-policy: AFTER_WRITE
```


### Simple File Authenticator

**simpleFileAuthenticator** allows defining users credentials and roles in a simple yml configuration file. 

``` yml
authenticators:
    - name: simpleFileAuthenticator
      class: org.restheart.security.plugins.authenticators.SimpleFileAuthenticator
      args:
        conf-file: ../etc/users.yml
```

See [users.yml](https://github.com/SoftInstigate/restheart-security/blob/master/etc/users.yml) for an example users definition.

## Token Managers

### Random Token Manager

**RndTokenManager** generates an auth token using a random number generator. It has one argument, `ttl`, which is the tokens Time To Live in minutes.

```yml
token-manager:
    name: rndTokenManager
    class: org.restheart.security.plugins.tokens.RndTokenManager
    args:
      ttl: 15
```