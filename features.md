---
layout: page-notitle
title: Did you know
permalink: /features
---

# What RESTHeart can do

<div class="alert alert-warning" role="alert">
    <h2 class="alert-heading">
            <svg class="float-left mr-3 my-auto d-block" width="30px" height="30px">
                    <use xlink:href="/images/sprite.svg#feather" />
                </svg>
        This page is being updated.
    </h2>
    <hr class="mt-2 mb-2">
    <p><strong>REST</strong>Heart v5 introduces many news features and improvements.</p>
    <p>As a consequence, this page will be updated soon.</p>
</div>

## Backgroud

Read more about the background of our product on <a href="https://medium.com/softinstigate-team/the-origins-of-our-product-9ed6978c9448">The origins of RESTHeart</a>

## Features
 
- Setup in minutes a microservice with support for __MongoDB__, __AWS DocumentDB__ and __Azure Cosmos DB__; available also as a [Docker image](https://hub.docker.com/r/softinstigate/restheart/)
- __Based on open standards__, like HTTP, JSON, REST, JSON and JSON Schema
- __Read JSON documents__ with GET requests, specifying MongoDB queries and projection options; deal with large result sets with pagination
- Create, modify and delete JSON documents with POST, PUT, PATCH and DELETE requests. Use __bulk requests__ to deal with multiple documents in one shot
- **Authentication** and **Authorization** provided by a dedicated [security microservice](https://restheart.org/docs/security/overview/#understanding-restheart-security) 
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