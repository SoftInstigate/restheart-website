---
layout: docs
title: Documentation
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
- [What is it](#what-is-it)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

RESTHeart is the [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API server for MongoDB. It embeds the [Undertow](http://undertow.io) high performance, non-blocking HTTP server. It's entirely written in Java 8 and distributed as open source software under the [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).

We started the project for these main reasons:

 1. We were tired of configuring and maintaining complicated application servers (coming from a Java Enterprise background);
 2. Modern applications quite often needs a similar set of basic REST APIs to start with;
 3. There is a set of recurrent non-functional requirements, like CRUD, pagination, security, authentication authorization, etc... which probably could be solved once for all (at least in a vast majority of cases).

The founding ideas around RESTHeart are:

  1. Developers foremostly need to easily store and retrieve contents, uniformly and consistently, as these days Single Page Applications (the ones built with Angular, React or Vue) and Mobile Apps (either native or hybrid) are moving most of the business logic from the server to the client side;
  2. Modern Apps always consume a REST API and use plain JSON as the only message format (goodbye XML and RPC);
  3. MongoDB is, at present, the leading database for Web and Mobile apps, because it's lightweight, schemaless, fast and you can directly store JSON into it.
  4. If, say, 80% of the backend's functionalities are given, then we can better focus on what's matter more, which is the User eXperience;
  5. Docker is becoming the favorite way to package and distribute applications.
  
  <img src="/images/what.png" width="80%" height="auto" class="image-center img-responsive" />

## What is it

In summary:

> RESTHeart leverages MongoDB’s document-oriented nature, creating an automatic mapping between MongoDB’s internal storage of data and a graph of externally accessible HTTP resources, implementing a model of interaction compliant with an HATEOAS (Hypermedia as the Engine of Application State) representation, where the state of a client process is entirely driven by HTTP verbs like GET, POST, PUT, PATCH, DELETE, etc.

- Lightweight and fast server, ready to use without any coding;
- Built on standards, like HTTP, JSON, REST, HAL, JSON and JSON Schema;
- Pluggable Authentication and Authorization, with ready to use Identity Manager and role-based Access Manager;
- Data operations API, to Create, Read, Update, Delete documents;
- Support for “dot notation” and update operators on every write verb;
- Bulk operations, with POST, PATCH and DELETE of multiple documents with one single request;
- GridFS support, for storing and serving large binary data;
- Aggregation Operations, for both map-reduce and aggregation pipelines;
- Data model operations API, to create dbs, collections and indexes via pure RESTful calls;
- Optional data validation with JSON Schema;
- WebHooks to call other Web resources after a request completes;
- Relationship can be defined so that documents automatically include hyperlinks to referenced data;
- Transformation and check logic can be easily applied to requests;
- Serve Static Resources (such as HTML, CSS, images and JavaScript) and custom Application Logic;
- Supports optimized browser Web caching and avoids ghost writes with standard ETag;
- Cross-origin resource sharing (CORS);
- Embedded HAL browser to easily navigate your data;
- Available also as a [Docker image](https://hub.docker.com/r/softinstigate/restheart/);
- Ideal as the backend for **Angular**, **React**, **Vue** or any other JavaScript framework;
- Can be extended by adding Java classes to perform custom tasks.

<img src="/images/angular-react-vue.jpg" width="60%" height="auto" />

</div>
