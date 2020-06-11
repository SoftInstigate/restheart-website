---
layout: docs
title: Proxing requests
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

The `restheart.yml` configuration file allows defining listeners and proxied resources in the first place.

As an example, we are going to securely expose the resources of a `https://httpbin.org/anything`.

The following options set a HTTPS listener bound to the public ip of `domain.io`.

```yml
https-listener: true
https-host: domain.io
https-port: 443
```

```yml
proxies:
   - location: /anything
     proxy-pass: https://httpbin.org/anything
     name: anything
```

As a result, the URL `https://domain.io/anything` is proxied to the resources specified by the `proxy-pass` URL. All requests from the external network pass through RESTHeart that enforces authentication and authorization.

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
      predicate: path-prefix[path=/anything]  and method[GET]
```

{% include code-header.html type="Request" %}

```http
GET /anything HTTP/1.1
Authorization: Basic dXNlcjpzZWNyZXQ=
```

{% include code-header.html type="Response" %}

```http
HTTP/1.1 200 OK

....
```
We can note that RESTHeart:

-   has checked the credential specified in `users.yml` passed via Basic Authentication and proxied the request
-   has determined the account roles.
-   has checked the permission specified in `acl.yml` for the account roles and determined that the request could be executed.
-   the response headers include the header `Auth-Token`. Its value can be used in place of the actual password in the Basic Authentication until its expiration. This is useful in Web Applications, for storing in the browser the less sensitive auth token instead of full username and password.
