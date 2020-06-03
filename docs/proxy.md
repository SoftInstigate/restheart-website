---
layout: docs
title: Proxing requests
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}

## Introduction

RESTHeart allows proxying requests. 

An example configuration follows:

```yml
### Proxied resources

 # location (required) The location URI to bound to the HTTP proxied server.
 # proxy-pass (required) The URL of the HTTP proxied server. It can be an array of URLs for load balancing.
 # name (optional) The name of the proxy. It is required to identify 'restheart'.
 # rewrite-host-header (optional, default true) should the HOST header be rewritten to use the target host of the call.
 # connections-per-thread (optional, default 10) Controls the number of connections to create per thread.
 # soft-max-connections-per-thread (optional, default 5) Controls the number of connections to create per thread.
 # max-queue-size (optional, default 0) Controls the number of connections to create per thread.
 # connections-ttl (optional, default -1) Connections Time to Live in seconds.
 # problem-server-retry (optional, default 10) Time in seconds between retries for problem server.
proxies:
  - location: /anything
    proxy-pass: https://httpbin.org/anything
```