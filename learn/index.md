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

> RESTHeart connects to MongoDB and securely exposes a clean REST API to read and write data via HTTP requests. You don't need to write a single line of backend code for **Mobile Apps** and  **Angular**, **React**, **Vue** or other Single Page Application frameworks.

RESTHeart is dual licensed under the open source [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) and the business friendly [RESTHeart Commercial License](/license).

RESTHeart is written in Java and is build on top of the [Undertow](http://undertow.io) high performance, non-blocking HTTP server. 

We created RESTHeat because:

 1. We were tired of configuring and maintaining complicated application servers;
 2. All modern applications require a similar set of basic REST APIs to start with;
 3. There is a set of recurrent non-functional requirements, like authentication authorization, HTTP protocol support, etc... that can be solved once for all.

The founding ideas around RESTHeart are:

  1. Developers foremostly need to easily store and retrieve contents, uniformly and consistently, as these days Single Page Applications (built with Angular, React, Vue, etc) and Mobile Apps are moving most of the business logic from the server to the client side;
  2. Modern Apps wants consuming a REST API and use plain JSON as the message format (goodbye XML and RPC);
  3. MongoDB is the leading NoSQL database for Web and Mobile apps, because it's lightweight, schemaless, fast and you can directly store JSON into it.
  4. With 80% of the backend's functionalities given out-of-the-box, you can better focus on what's matter more: the User eXperience;
  5. Docker is the best way to package and distribute applications.
  
  <img src="/images/what.png" width="80%" height="auto" class="image-center img-responsive" />

## Features

- **Lightweight** and **fast** microservice architecture; simple setup with support for **MongoDB** and **AWS DocumentDB**; available also as a [Docker image](https://hub.docker.com/r/softinstigate/restheart/)
- **Built on standards**, like HTTP, JSON, REST, JSON and JSON Schema
- **Read JSON documents** with GET requests, optionally specifying MongoDB queries and projection options; deal with large result sets with pagination
- **Create, modify and delete JSON documents** with POST, PUT, PATCH and DELETE requests. Supports **bulk requests** to deal with multiple documents with one request
- Out-of-the-box User **Authentication** and **Authorization**
- Store and serve binary data with **GridFS** support
- Define and execute **Aggregations**, supporting both map-reduce and aggregation pipelines
- Execute requests in multi-document **ACID transactions**
- Access real-time data changes via Websocket **Change Streams**
- Create dbs, collections and indexes with **Data Model API**
- Validate requests with **JSON Schema**
- Extend RESTHeart via **Plugins**: **transform**, **check** requests and responses, executes **WebHooks** after a request completes, implement **Web Services** in minutes, serve **Static Resources** (such as HTML, CSS, images and JavaScript)
- Define **Relationships** so that documents automatically include hyperlinks to referenced data
- Supports **Cross-origin resource sharing** (CORS), **Web caching** and avoids **ghost writes** with HTTP ETag
- Embeds a **browser web app** to navigate your data

<img src="/images/angular-react-vue.jpg" width="60%" height="auto" />

</div>
