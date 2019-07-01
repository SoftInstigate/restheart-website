---
layout: docs
title: Documentation
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
- [Features](#features)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

> RESTHeart connects to MongoDB and securely exposes a clean REST API to read and write data via HTTP requests. 

{: .bs-callout.bs-callout-info }
You don't need to write a single line of backend code for **Mobile Apps** and  **Angular**, **React**, **Vue** or other Single Page Application frameworks.

<img src="/images/restheart-what-is-it.svg" width="70%" height="auto" class="mx-auto d-block img-responsive" />

RESTHeart is dual licensed under the open source [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) and the business friendly [RESTHeart Commercial License](/editions).

RESTHeart is written in Java and is build on top of the [Undertow](http://undertow.io) high performance, non-blocking HTTP server. 

We created RESTHeart because:

 1. All modern applications require a common set of basic REST APIs;
 2. Many recurrent non-functional requirements, like authentication and authorization, HTTP protocol support, etc... can be solved once for all;
 3. We were tired of configuring and maintaining complicated application servers.

The founding ideas around RESTHeart are:

  1. The key architectural trends in software development are microservices architecture and NoSQL databases 
  2. Developers primarily need a backend to easily store and retrieve content, as these days Single Page Applications and Mobile Apps are moving the business logic to the client side;
  3. Modern Apps want consuming a REST API and use JSON as the message format (goodbye XML and RPC);
  4. MongoDB is the leading NoSQL database for Web and Mobile apps; it's lightweight, fast, schema-less and uses JSON.
  5. Having an out-of-the-box backend, we can better focus on what matter the most: the User Experience;
  6. Docker is emerging as the de facto standard to package and distribute applications.

## Features
 
- Setup in minutes the **lightweight** and **fast** microservice with support for **MongoDB** and **AWS DocumentDB**; available also as a [Docker image](https://hub.docker.com/r/softinstigate/restheart/)
- **Built on standards**, like HTTP, JSON, REST, JSON and JSON Schema
- **Read JSON documents** with GET requests, specifying MongoDB queries and projection options; deal with large result sets with pagination
- **Create, modify and delete JSON documents** with POST, PUT, PATCH and DELETE requests. Use **bulk requests** to deal with multiple documents in one shot
- Out-of-the-box User **Authentication** and **Authorization**
- Store and serve binary data with **GridFS** support
- Define and execute **Aggregations**, supporting both map-reduce and aggregation pipelines
- Execute requests in multi-document **ACID transactions**
- Access real-time data changes via Websocket **Change Streams**
- Create dbs, collections and indexes with **Data Model API**
- Validate requests with **JSON Schema**
- Extend RESTHeart via **Plugins**: **transform**, **check** requests and responses, keep data secure with **authenticators** and **authorizers**, executes **WebHooks** after a request completes, implement **Web Services** in minutes, serve **Static Resources** (such as HTML, CSS, images and JavaScript)
- Define **Relationships** so that documents automatically include hyperlinks to referenced data
- Forget about HTTP details with automatic support of **Cross-origin resource sharing**, **Web Caching** and **HTTP ETag** to avoid ghost writes
- Navigate data with the embedded **browser web app**

<img src="/images/angular-react-vue.jpg" width="40%" class="mx-auto d-block img-responsive" />

</div>
