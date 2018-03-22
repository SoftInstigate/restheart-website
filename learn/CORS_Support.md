---
layout: docs
title: CORS Support
---

* [Introduction](#introduction)
* [CORS Support](#cors-support)
* [Example](#example)

## Introduction

CORS stands for [Cross-origin resource
sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
and it is a mechanism to allow resources on a web page to be requested
from another domain outside the domain from which the resource
originated.

Imagine the case of a web site, where the static resources (html, css
and javascript) are served by **domain1.com**. On the other end,
RESTHeart is running on a different server in **domain2.com**.

Without CORS support, the javascript logic could not actually request
data to RESTHeart, forcing to have both static resources and RESTHeart
running in the same domain.

What happens behind the scene, for AJAX and HTTP request methods that
can modify data, the CORS specification mandates that browsers
"preflight" the request, soliciting supported methods from the server
with an HTTP OPTIONS request header, and then, upon "approval" from the
server, sending the actual request with the actual HTTP request method. 

## CORS Support

**RESTHeart always returns CORS headers to allow requests originated
from different domains.**

A more fine grained configuration of CORS is in the backlog. See  RH-37
- Getting issue details... STATUS

## Example

The following example, highlights the CORS headers returned by
RESTHeart, in the case of a collection resource.

**Request**

``` plain
OPTIONS /test/coll
```

**Response**

``` bash
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Accept, Accept-Encoding, Authorization, Content-Length, Content-Type, Host, If-Match, Origin, X-Requested-With, User-Agent, No-Auth-Challenge
Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location
...
```
