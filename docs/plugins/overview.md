---
title: Plugins
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [The proxy microservice pattern](#the-proxy-microservice-pattern)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress-v6.html %}

## Introduction

RESTHeart works *out-of-the-box* by merely installing and configuring it.

It comes with a complete MongoDB API and a security implementation that allows to authenticate users and authorize requests according to a role-based policy.

These functionalities are actually provided by the standard plugins that are distributed with RESTHeart. If you look at the `./plugins` directory you'll find them:

```
plugins
├── restheart-graphql.jar
├── restheart-mongodb.jar
├── restheart-polyglot.jar
└── restheart-security.jar
```

On the other side, real applications often need the API to be extended in some way.

Plugins allow to extend RESTHeart:

- **Services** extend the API adding web services.
- **Interceptors** snoop and modify requests and responses at different stages of the request lifecycle.
- **Initializers**  execute initialization logic at system startup time.

It is also possible developing security plugins to customize the security layer. Refer to [Develop Security Plugins](/docs/plugins/security-plugins) for more information.

In short, you can develop in java plugins and [deploy](/plugins/deploy) them copying the jar files to the `./plugins` directory.

{: .bs-callout .bs-callout-info}
Have a look at the GitHub repository [restheart-examples](https://github.com/SoftInstigate/restheart-examples/) for some examples.

## The proxy microservice pattern

If you are not familiar with java, there is a different approach that can help you extending the API using the [proxying](/docs/proxy) feature.

You can add a side microservice, for instance using NodeJs, that implements a Web Service. This microservice can execute requests to RESTHeart if it needs to read or write data to MongoDB.

You can then proxy it via RESTHeart so that it is protected under the same security domain of RESTHeart.

Add the following section to the `restheart.yml` configuration file to proxy call to the RESTHeart's URI `/anything` to the web resource `https://httpbin.org/anything`

```yml
proxies:
   - location: /anything
     proxy-pass: https://httpbin.org/anything
     name: anything
```