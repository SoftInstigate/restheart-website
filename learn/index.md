---
layout: docs
title: Documentation
---
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content">

{% include docs-head.html %}

## Introduction

RESTHeart is the [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API server for MongoDB, built on top of [Undertow](http://undertow.io) non-blocking HTTP server. It's developed and distributed as open source software under the [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).

Our goal in selecting the AGPL v3.0 as our open source license is to require that enhancements to RESTHeart be released to the community. Traditional GPL often does not achieve this anymore as a huge amount of software runs in the cloud. Besides, the AGPL v3.0 is the same license of MongoDB, so adopting it looks logical to us.

If use of our product under the AGPL v3 does not satisfy your organization’s legal department (some will not approve GPL in any form), [Commercial licenses](/license#commercial-license) and [professional services](/services) are available. Feel free to **[contact us](mailto:info@softinstigate.com?subject=RESTHeart commercial license inquiry)** for more details.

## What is it

> RESTHeart leverages MongoDB’s document-oriented nature, creating an automatic mapping between MongoDB’s internal storage of data and a graph of externally accessible HTTP resources, implementing a model of interaction compliant with an HATEOAS (Hypermedia as the Engine of Application State) representation, where the state of a client process is entirely driven by HTTP verbs like GET, POST, PUT, PATCH, DELETE, etc.

- Lightweight and fast server, ready to use without any coding;
- Built on standards, like HTTP, JSON, RESTful, HAL, JSON Schema;
- Pluggable Authentication and Authorization, with ready to use Identity Manager and role-based Access Manager;
- Data operations API, to create, read, update, delete and query documents;
- Support for “dot notation” and update operators on every write verb;
- Bulk operations, with POST, PATCH and DELETE of multiple documents with one single request;
- GridFS support, for large binary data;
- Aggregation Operations, for both map-reduce and aggregation pipelines (improved in 2.0);
- Data model operations API, to create dbs, collections and indexes via pure RESTful calls;
- Strict data validation with JSON Schema;
- WebHooks to call other web resources after request completes;
- Relationship can be defined so that documents automatically include the hyperlinks to referenced data;
- Transformation and Checks logic can be easily applied to requests;
- Serve Static Resources (such as HTML, CSS, images and JavaScript) and custom Application Logic;
- Supports optimized browser web caching and avoids ghost writes with standard ETag (improved in 2.0);
- Cross-origin resource sharing (CORS);
- Embedded HAL browser to easily navigate your data;
- Available also as a **[Docker image](https://hub.docker.com/r/softinstigate/restheart/)**;
- Ideal as the backend for **Angular**, **React**, **Vue** or any other JavaScript framework;
- Can be extended by adding Java classes to perform custom tasks.

Please click on any item on the **left menu** or jump to the **[tutorial](/learn/tutorial/)** for more.

<img src="/images/angular-react-vue.jpg" width="60%" height="auto" />

</div>
