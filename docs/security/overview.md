---
title: Security Overview
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Handle users in MongoDB collection](#handle-users-in-mongodb-collection)
-   [Handle permissions in MongoDB collection](#handle-permissions-in-mongodb-collection)
-   [Understanding RESTHeart security](#understanding-restheart-security)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress.html %}

## Introduction

RESTHeart provides **Authentication** and **Authorization** services. It can handle different authentication and authorization schemes, including handling users and permissions stored in MongoDB collections.

The default configuration file enables `fileRealmAuthenticator` and `fileAclAuthorizer`. These use the files [/etc/users.yml](https://github.com/SoftInstigate/restheart/blob/master/core/etc/users.yml) and [/etc/acl.yml](https://github.com/SoftInstigate/restheart/blob/master/core/etc/users.yml) to handle users credentials and permissions respectively.

RESTHeart can also handle users and permissions stored on MongoDB collections. This provides more flexibility and control over security and it is the **suggested configuration for production**.

{: .bs-callout.bs-callout-info }
Watch [Authentication and Authorization in RESTHeart](https://www.youtube.com/watch?v=QVk0aboHayM&t=77s)

## Handle users in MongoDB collection

To enable user authentication from MongoDB collection set `mongoRealmAuthenticator` as the authenticator of the enabled authentication mechanisms where applicable:

```yml
auth-mechanisms:
  basicAuthMechanism:
    enabled: true
    authenticator: mongoRealmAuthenticator
  digestAuthMechanism:
    enabled: true
    realm: RESTHeart Realm
    domain: yourdomain.com
    authenticator: mongoRealmAuthenticator
```

For more information on collection based authentication check the following documentation pages:

- [mongoRealmAuthenticator](/docs/security/authentication/#mongo-realm-authenticator)
- [User Management](/docs/security/user-management/)

## Handle permissions in MongoDB collection

Permissions stored in the MongoDB collection `/acl` should be already taken into account because the default configuration  enables the `mongoAclAuthorizer`.

```yml
authorizers:
  mongoAclAuthorizer:
    acl-db: restheart
    acl-collection: acl
    # clients with root-role can execute any request
    root-role: admin
    cache-enabled: true
    cache-size: 1000
    cache-ttl: 5000
    cache-expire-policy: AFTER_WRITE
```


For more on collection based authorization check the documentation on [mongoAclAuthorizer](/docs/security/authorization/#mongo-acl-authorizer)


## Understanding RESTHeart security

RESTHeart is built around a **pluggable architecture**. It comes with a strong security implementation but you can extend it by implementing plugins.

In RESTHeart everything is a plugin including Authentication Mechanisms, Authenticators, Authorizers, Token Managers and Services.

<img class="img-fluid" src="/images/restheart-security-explained.png" alt="restheart-security explained">

Different **Authentication Mechanisms** manage different authentication schemes.
An example is _BasicAuthMechanism_ that handles the Basic Authentication scheme. It extracts the credentials from a request header and passes them to the an Authenticator for verification.

A different example is the _IdentityAuthMechanism_ that binds the request to a single identity specified by configuration. This Authentication Mechanism does not require an Authenticator to build the account.

RESTHeart allows defining several mechanism. As an in-bound request is received, the `authenticate()` method is called on each mechanism in turn until one of the following occurs:

-   A mechanism successfully authenticates the incoming request &#8594; the request proceeds to Authorization phase;
-   The list of mechanisms is exhausted &#8594; the request fails with code `401 Unauthorized`.

The **Authenticator** verifies the credentials extracted from the request by Authentication Mechanism. For instance, the _BasicAuthMechanism_ extracts the credentials from the request in the form of id and password. The Authenticator can check these credentials against a database or a LDAP server. Note that some Authentication Mechanisms don't actually rely on a Authenticator to build the Account.

The **Authorizer** is responsible of checking if the user can actually perform the request against an Access Control List. For instance the _RequestPredicatesAuthorizer_ checks if the request is allowed by looking at the role based permissions defined using the undertow predicate definition language.

The **Token Manager** is responsible of generating and validating an auth-token. When a client successfully authenticates, the Token Manager generates an auth-token that is returned in the `Auth-Token` response header. It can be used to authenticate further requests. This requires an Authentication Manager to handle it using the Token Manager for token validation.

A **Service** is a quick way of implementing Web Services to expose additional custom logic.

{: .bs-callout.bs-callout-info }
Watch [Understanding RESTHeart security](https://www.youtube.com/watch?v=QVk0aboHayM&t=123s)
