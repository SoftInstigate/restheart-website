---
title: Proxing requests
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [How to proxy requests](#how-to-proxy-requests)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

The `restheart.yml` configuration file allows defining proxied resources. This makes possible to put other microservices under the security domain of RESTHeart.

## How to proxy requests

As an example, we are going to see how to proxy `https://httpbin.org/anything` through RESTHeart.

{: .bs-callout .bs-callout-info }
`https://httpbin.org/anything` is a popular and simple online HTTP Request & Response Service that returns anything that is passed to request for testing purposes.

Add the following section to the configuration file `restheart.yml `and restart RESTHeart:

```yml
proxies:
   - location: /anything
     proxy-pass: https://httpbin.org/anything
     name: anything
```

As a result, requests to URL `http://<restheart-ip:port>/anything` are proxied to `https://httpbin.org/anything`as specified by the parameter `proxy-pass`.

{% include code-header.html type="Request" %}

```http
GET /anything HTTP/1.1
```

{% include code-header.html type="Response" %}

```http
HTTP/1.1 401 Unauthorized
```

With the default configuration RESTHeart uses the Basic Authentication with credentials and permission defined in `users.yml` and `acl.yml` configuration files respectively. Let's add a user and a permission for `/anything`

#### users.yml

```yml
users:
    - userid: user
      password: secret
      roles: [anything]
```

### acl.yml

```yml
permissions:
    # Users with role 'anything' can execute GET /anything
    - role: anything
      predicate: path-prefix[path=/anything] and method[GET]
```

{% include code-header.html type="Request" %}

```http
GET /anything?foo=bar HTTP/1.1
Authorization: Basic dXNlcjpzZWNyZXQ=
```

{% include code-header.html type="Response" %}

```http
HTTP/1.1 200 OK

{
    "args": {
        "foo": "bar"
    },
    "data": "",
    "files": {},
    "form": {},
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Host": "httpbin.org",
        "User-Agent": "HTTPie/1.0.3",
        "X-Amzn-Trace-Id": "Root=1-5ee2508c-35dd55551c2c0188bba66b8f",
        "X-Forwarded-Account-Id": "user",
        "X-Forwarded-Account-Roles": "anything",
        "X-Forwarded-Host": "localhost:8080",
        "X-Forwarded-Server": "localhost"
    },
    "json": null,
    "method": "GET",
    "origin": "127.0.0.1, 93.41.97.239",
    "url": "https://localhost:8080/anything?foo=bar"
}
```
We can note that RESTHeart:

-   has checked the credential specified in `users.yml` passed via Basic Authentication and proxied the request
-   has determined the account roles
-   has checked the permission specified in `acl.yml` for the account roles and determined that the request could be executed.
- the user id and roles are passed by RESTHeart to the proxied service via the `X-Forwarded-Account-Id` and `X-Forwarded-Account-Roles` request header.
-   the response headers include the header `Auth-Token`. Its value can be used in place of the actual password in the Basic Authentication until its expiration. This is useful in Web Applications, for storing in the browser the less sensitive auth token instead of full username and password.
