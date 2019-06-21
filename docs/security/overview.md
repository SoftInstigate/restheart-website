---
layout: docs
title: Security Overview
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction ](#introduction)
* [Features](#features)
* [Use Cases](#use-cases)
* [How it works](#how-it-works)
* [Configuration](#configuration)
* [Tutorial](#tutorial)
* [Understanding restheart-security](#understanding-restheart-security)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

**restheart-security** is the security service for RESTHeart. 

It acts as a reverse proxy for HTTP resources, providing __Authentication__ and __Authorization__ services. 

**restheart-security** enables developers to configure security policies in standardized micro-gateway instances that are external to API and micro-services implementations, avoiding coding security functions and a centralized gateway where scalability is a key concern.

**restheart-security** can also be used as a micro-gateway for **Identity and Access Management**  in any HTTP-based micro-services architecture. 

> Think about restheart-security as the "brick" that you put in front of your API and micro-services to protect them. 

**restheart-security** is built around a __pluggable architecture__. It comes with a strong security implementation but you can easily extend it by implementing plugins. 

> Building a plugin is as easy as implementing a simple interface and edit a configuration file. Plugins also allow to quickly implement and deploy secure Web Services.

## Features

- Identity and Access Management at __HTTP protocol level__.
- Placement within __Docker containers__, on the network layer and embeddable in Java applications.
- Can be extended via easy-to-implement plugins.
- Allows to quickly implement secured Web Services.
- __Basic__, __Digest__ and __Token Authentication__. Other authentication methods can be added with plugins.
- __Roles__ based Authorization with a powerful permission definition language. Other authorization methods can be added with plugins.
- Solid multi-threading, non-blocking architecture.
- High performance.
- Small memory footprint.
- Straightforward configuration.

## Use cases

### **restheart-security** on the network layer

The following diagram shows a single instance of **restheart-security** placed on the network layer, in front of the resources to be protected. It acts as a centralized __security policy enforcer__.

![restheart-security on the network layer](/images/restheart-security-on-network-layer.png "restheart-security on the network layer")

### **restheart-security** within containers

The following diagram shows **restheart-security** used as a sidecar proxy within each container pod. Each micro-service is protected by an instance of **restheart-security** with its own dedicated security policy.

![restheart-security within containers](/images/restheart-security-within-containers.png "restheart-security within containers")

### **restheart-security** embedded

The following diagram shows **restheart-security** used to implement a simple micro-service using service extensions.

![restheart-security embedded](/images/restheart-security-embedded.png "restheart-security embedded")

## How it works

The `restheart-security.yml` configuration file allows defining listeners and proxied resources in the first place.

As an example, we are going to securely expose the resources of a RESTHeart server and Web Server running on a private network.

The following options set a HTTPS listener bound to the public ip of `domain.io`.

```yml
https-listener: true
https-host: domain.io
https-port: 443
```

The two hosts in private network `10.0.1.0/24` are:
- the RESTHeart server running on host `10.0.1.1` that exposes the collection `/db/coll`
- the web server running on host `10.0.1.2` bound to URI `/web`

We proxy them as follows:

```yml
proxies:
    - location: /api
      proxy-pass: https://10.0.0.1/db/coll
    - location: /
      proxy-pass: https://10.0.0.2/web
```

As a result, the URLs `https://domain.io` and `https://domain.io/api` are proxied to the resources specified by the `proxy-pass` URLs. All requests from the external network pass through **restheart-security** that enforces authentication and authorization.

```http
GET https://domain.io/index.html
HTTP/1.1 401 Unauthorized

GET https://domain.io/api
HTTP/1.1 401 Unauthorized
```

With the default configuration **restheart-security** uses the Basic Authentication with credentials and permission defined in `users.yml` and `acl.yml` configuration files respectively:

#### users.yml

```yml
users:
    - userid: user
      password: secret
      roles: [web,api]
```

### acl.yml

```
permissions:
    # Users with role 'web' can GET web resources 
    - role: web
      predicate: path-prefix[path=/] and not path-prefix[path=/api] and method[GET]

    # Users with role 'api' can GET and POST /api resources 
    - role: api
      predicate: path-prefix[path=/api] and (method[GET] or method[POST])
```

```http
GET https://domain.io/index.html Authorization:"Basic dXNlcjpzZWNyZXQ="
HTTP/1.1 200 OK
...

GET https://domain.io/api Authorization:"Basic dXNlcjpzZWNyZXQ="
HTTP/1.1 200 OK
...
```

## Setup

You need __Java 11__ and must download the latest release from [releases page](https://github.com/SoftInstigate/restheart-security/releases).

```
$ tar -xzf restheart-security-XX.tar.gz
$ cd restheart-security
$ java -jar restheart-security.jar etc/restheart-security.yml
```

### Building from source

You need Git, Java 11 and Maven.

```
$ git clone git@github.com:SoftInstigate/restheart-security.git
$ cd restheart-security
$ mvn package
$ java -jar target/restheart-security.jar etc/restheart-security.yml
```

### With Docker

{:.alert.alert-warning}
work in progress

## Configuration

**restheart-security** is configured via the yml configuration file. See the [default configuration file](https://github.com/SoftInstigate/restheart-security/blob/master/etc/restheart-security.yml) for inline help.

## Tutorial

To follow this tutorial you need [httpie](https://httpie.org), a modern command line HTTP client made in Python which is easy to use and produces a colorized and indented output.

Run **restheart-security** with the [default configuration file](etc/restheart-security.yml). It is bound to port `8080` and proxies two example resources:

- https://restheart.org web site at URI `/restheart`
- the service `/echo` implemented by **restheart-security** itself and bound to URI `/secho`. It just echoes back the request (URL, query parameters, body and headers).

Below the mentioned configuration's fragment:

```yaml
proxies:
    - location: /secho
      proxy-pass: 
        - http://127.0.0.1:8080/echo
        - http://localhost:8080/echo
      connections-per-thread: 20
    - location: /restheart
      proxy-pass: https://restheart.org
```

Let's fist invoke the `/echo` service directly. This is defined in the [configuration file](etc/restheart-security.yml) as follows:

```yaml
services:
    - implementation-class: org.restheart.security.plugins.services.EchoService
      uri: /echo
      secured: false
```

Note that `/echo` is not secured and can be invoked without restrictions.

```bash
$ http -f 127.0.0.1:8080/echo?qparam=value header:value a=1 b=2
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 341
Content-Type: application/json
Date: Mon, 18 Feb 2019 17:25:19 GMT
X-Powered-By: restheart.org

{
    "URL": "http://127.0.0.1:8080/echo",
    "content": "a=1&b=2",
    "headers": {
        "Accept": [
            "*/*"
        ],
        "Accept-Encoding": [
            "gzip, deflate"
        ],
        "Connection": [
            "keep-alive"
        ],
        "Content-Length": [
            "7"
        ],
        "Content-Type": [
            "application/x-www-form-urlencoded; charset=utf-8"
        ],
        "Host": [
            "127.0.0.1:8080"
        ],
        "User-Agent": [
            "HTTPie/1.0.2"
        ],
        "header": [
            "value"
        ]
    },
    "method": "POST",
    "note": "showing up to 20 bytes of the request content",
    "prop2": "property added by example response interceptor",
    "qparams": {
        "pagesize": [
            "0"
        ],
        "qparam": [
            "value"
        ]
    }
}
```

Let's try now to invoke `/secho` (please note the leading 's') without passing authentication credentials. This will fail with `401 Unauthorized` HTTP response.

```bash
$ http -f 127.0.0.1:8080/secho?qparam=value header:value a=1 b=2
HTTP/1.1 401 Unauthorized
Connection: keep-alive
Content-Length: 0
Date: Mon, 18 Feb 2019 17:26:04 GMT
WWW-Authenticate: Basic realm="RESTHeart Realm"
WWW-Authenticate: Digest realm="RESTHeart Realm",domain="localhost",nonce="Z+fsw9eFwPgNMTU1MDUxMDc2NDA2NmFWzLOw/aaHdtjyi0jm5uE=",opaque="00000000000000000000000000000000",algorithm=MD5,qop="auth"
```

Let's try now to pass credentials via basic authentication. The user `admin` is defined in the `users.yml` file.

```bash
$ http -a admin:changeit -f 127.0.0.1:8080/secho?qparam=value header:value a=1 b=2
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Auth-Token: 5iojkf21pdul7layo3qultyes7qyt8obdm1u67hkmnw6l39ckm
Auth-Token-Location: /tokens/admin
Auth-Token-Valid-Until: 2019-02-18T17:41:25.142209Z
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 427
Content-Type: application/json
Date: Mon, 18 Feb 2019 17:26:25 GMT
X-Powered-By: restheart.org

{
    "URL": "http://localhost:8080/echo",
    "content": "a=1&b=2",
    "headers": {
        "Accept": [
            "*/*"
        ],
        "Accept-Encoding": [
            "gzip, deflate"
        ],
        "Connection": [
            "keep-alive"
        ],
        "Content-Length": [
            "7"
        ],
        "Content-Type": [
            "application/x-www-form-urlencoded; charset=utf-8"
        ],
        "Host": [
            "localhost:8080"
        ],
        "User-Agent": [
            "HTTPie/1.0.2"
        ],
        "X-Forwarded-Account-Id": [
            "admin"
        ],
        "X-Forwarded-Account-Roles": [
            "user,admin"
        ],
        "X-Forwarded-For": [
            "127.0.0.1"
        ],
        "X-Forwarded-Host": [
            "127.0.0.1:8080"
        ],
        "X-Forwarded-Port": [
            "8080"
        ],
        "X-Forwarded-Proto": [
            "http"
        ],
        "X-Forwarded-Server": [
            "127.0.0.1"
        ],
        "header": [
            "value"
        ]
    },
    "method": "POST",
    "note": "showing up to 20 bytes of the request content",
    "prop2": "property added by example response interceptor",
    "qparams": {
        "pagesize": [
            "0"
        ],
        "qparam": [
            "value"
        ]
    }
}
  ```

We can note that **restheart-security**:

- has checked the credential specified in `users.yml` passed via Basic Authentication and proxied the request
- has determined the account roles. The proxied request includes the headers `X-Forwarded-Account-Id` and `X-Forwarded-Account-Roles`.
- has checked the permission specified in `acl.yml` for the account roles and determined that the request could be executed.
- the response headers include the header `Auth-Token`. Its value can be used in place of the actual password in the Basic Authentication until its expiration. This is useful in Web Applications, for storing in the browser the less sensitive auth token instead of full username and password.

## Understanding **restheart-security**

In **restheart-security** everything is a plugin including Authentication Mechanisms, Authenticators, Authorizers, Token Managers and Services.

![restheart-security explained](/images/restheart-security-explained.png "restheart-security explained")

Different **Authentication Mechanism** manage different authentication schemes. 
An example is *BasicAuthMechanism* that handles the Basic Authentication scheme. It extracts the credentials from a request header and passes them to the an Authenticator for verification.

A different example is the *IdentityAuthMechanism* that binds the request to a single identity specified by configuration. This Authentication Mechanism does not require an Authenticator to build the account.

 **restheart-security** allows defining several mechanism. As an in-bound request is received, the `authenticate()` method is called on each mechanism in turn until one of the following occurs: 
 - A mechanism successfully authenticates the incoming request &#8594; the request proceeds to Authorization phase;
 - The list of mechanisms is exhausted &#8594; the request fails with code `401 Unauthorized`.

The **Authenticator** verifies the credentials extracted from the request by Authentication Mechanism. For instance, the *BasicAuthMechanism* extracts the credentials from the request in the form of id and password. The Authenticator can check these credentials against a database or a LDAP server. Note that some Authentication Mechanisms don't actually rely on a Authenticator to build the Account.

The **Authorizer** is responsible of checking if the user can actually perform the request against an Access Control List. For instance the *RequestPredicatesAuthorizer* checks if the request is allowed by looking at the role based permissions defined using the undertow predicate definition language.

The **Token Manager** is responsible of generating and validating an auth-token. When a client successfully authenticates, the Token Manager generates an auth-token that is returned in the `Auth-Token` response header. It can be used to authenticate further requests. This requires an Authentication Manager to handle it using the Token Manager for token validation.

A **Service** is a quick way of implementing Web Services to expose additional custom logic.