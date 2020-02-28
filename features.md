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

## Background

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

<div class="row">
    <article class="mt-4 mt-lg-0 col-lg-4">
        <div class="card newsText text-justified h-100 w-100">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="newsText__icon">
                        <a href="{{ "/use-cases/rest-api" | prepend: site.baseurl }}"><svg>
                                <use xlink:href=" /images/sprite.svg#mongodb" /></svg></a>
                    </div>
                    <h2><a href="{{ "/use-cases/rest-api" | prepend: site.baseurl }}">Setup in minutes</a></h2>
                </h5>
                <div>RESTHeart unlocks <strong>all the features</strong> of MongoDb. 
                <div class="mt-1">
                    CRUD operations, Queries, GridFs, Aggregations and many more are
                    accessible via a simple <strong>REST API</strong>.</div>
                </div>
            </div>
            <div class="d-flex w-100 justify-content-end">
                <a class="btn btn-m" href="{{ "/use-cases/rest-api" | prepend: site.baseurl }}">Read More</a>
            </div>
        </div>
    </article>
    <article class="mt-4 mt-lg-0 col-lg-4">
        <div class="card newsText text-justified h-100 w-100">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="newsText__icon">
                        <a href="{{ "/use-cases/content-management" | prepend: site.baseurl }}"><svg>
                                <use xlink:href="/images/sprite.svg#feather" /></svg></a>
                    </div>
                    <h2><a href="{{ "/use-cases/content-management" | prepend: site.baseurl }}">Content
                            Management</a></h2>
                </h5>
                <div>
                    RESTHeart allows to effectively manage content, such as
                    <strong>images</strong>, <strong>comments</strong>, <strong>tags</strong>,
                    <strong>categories</strong>, <strong>geolocalized data</strong>, 
                    <strong>audios</strong> and <strong>videos</strong>, 
                    via a solid <strong>REST API</strong>.
                </div>
            </div>
            <div class="d-flex w-100 justify-content-end">
                <a class="btn btn-m" href="{{ "/use-cases/content-management" | prepend: site.baseurl }}">Read More</a>
            </div>
        </div>
        </article>
        <article class="mt-4 mt-lg-0 col-lg-4">
        <div class="card newsText text-justified h-100 w-100">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="newsText__icon">
                        <a href="{{ "/use-cases/integration" | prepend: site.baseurl }}">
                            <svg><use xlink:href="/images/sprite.svg#torch" /></svg>
                        </a>
                    </div>
                    <h2>
                        <a href="{{ "/use-cases/integration" | prepend: site.baseurl }}">Integration</a>
                    </h2>
                </h5>
                <div>RESTHeart is an effective solution for <strong>Integration</strong> needs.
                </div>
                <div class="mt-1">
                    You can easily and effectively involve MongoDB
                    in your <strong>Integration Processes</strong>
                    because your <strong>Middleware</strong> can interact 
                    with the <strong>RESTHeart API</strong> using simple <strong>HTTP Connectors</strong>.
                </div>
            </div>
            <div class="d-flex w-100 justify-content-end">
                <a class="btn btn-m" href="{{ "/use-cases/integration" | prepend: site.baseurl }}">Read More</a>
            </div>
        </div>
    </article>
</div>

<div class="row mt-4">
    <article class="mt-4 mt-lg-0 col-lg-4">
        <div class="card newsText text-justified h-100 w-100">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="newsText__icon">
                        <a href="{{ "/use-cases/rest-api" | prepend: site.baseurl }}"><svg>
                                <use xlink:href=" /images/sprite.svg#mongodb" /></svg></a>
                    </div>
                    <h2><a href="{{ "/use-cases/rest-api" | prepend: site.baseurl }}">Setup in minutes</a></h2>
                </h5>
                <div>RESTHeart unlocks <strong>all the features</strong> of MongoDb. 
                <div class="mt-1">
                    CRUD operations, Queries, GridFs, Aggregations and many more are
                    accessible via a simple <strong>REST API</strong>.</div>
                </div>
            </div>
            <div class="d-flex w-100 justify-content-end">
                <a class="btn btn-m" href="{{ "/use-cases/rest-api" | prepend: site.baseurl }}">Read More</a>
            </div>
        </div>
    </article>
    <article class="mt-4 mt-lg-0 col-lg-4">
        <div class="card newsText text-justified h-100 w-100">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="newsText__icon">
                        <a href="{{ "/use-cases/content-management" | prepend: site.baseurl }}"><svg>
                                <use xlink:href="/images/sprite.svg#feather" /></svg></a>
                    </div>
                    <h2><a href="{{ "/use-cases/content-management" | prepend: site.baseurl }}">Content
                            Management</a></h2>
                </h5>
                <div>
                    RESTHeart allows to effectively manage content, such as
                    <strong>images</strong>, <strong>comments</strong>, <strong>tags</strong>,
                    <strong>categories</strong>, <strong>geolocalized data</strong>, 
                    <strong>audios</strong> and <strong>videos</strong>, 
                    via a solid <strong>REST API</strong>.
                </div>
            </div>
            <div class="d-flex w-100 justify-content-end">
                <a class="btn btn-m" href="{{ "/use-cases/content-management" | prepend: site.baseurl }}">Read More</a>
            </div>
        </div>
        </article>
        <article class="mt-4 mt-lg-0 col-lg-4">
        <div class="card newsText text-justified h-100 w-100">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="newsText__icon">
                        <a href="{{ "/use-cases/integration" | prepend: site.baseurl }}">
                            <svg><use xlink:href="/images/sprite.svg#torch" /></svg>
                        </a>
                    </div>
                    <h2>
                        <a href="{{ "/use-cases/integration" | prepend: site.baseurl }}">Integration</a>
                    </h2>
                </h5>
                <div>RESTHeart is an effective solution for <strong>Integration</strong> needs.
                </div>
                <div class="mt-1">
                    You can easily and effectively involve MongoDB
                    in your <strong>Integration Processes</strong>
                    because your <strong>Middleware</strong> can interact 
                    with the <strong>RESTHeart API</strong> using simple <strong>HTTP Connectors</strong>.
                </div>
            </div>
            <div class="d-flex w-100 justify-content-end">
                <a class="btn btn-m" href="{{ "/use-cases/integration" | prepend: site.baseurl }}">Read More</a>
            </div>
        </div>
    </article>
</div>

<div class="row mt-4">
    <article class="mt-4 mt-lg-0 col-lg-4">
        <div class="card newsText text-justified h-100 w-100">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="newsText__icon">
                        <a href="{{ "/use-cases/rest-api" | prepend: site.baseurl }}"><svg>
                                <use xlink:href=" /images/sprite.svg#mongodb" /></svg></a>
                    </div>
                    <h2><a href="{{ "/use-cases/rest-api" | prepend: site.baseurl }}">Setup in minutes</a></h2>
                </h5>
                <div>RESTHeart unlocks <strong>all the features</strong> of MongoDb. 
                <div class="mt-1">
                    CRUD operations, Queries, GridFs, Aggregations and many more are
                    accessible via a simple <strong>REST API</strong>.</div>
                </div>
            </div>
            <div class="d-flex w-100 justify-content-end">
                <a class="btn btn-m" href="{{ "/use-cases/rest-api" | prepend: site.baseurl }}">Read More</a>
            </div>
        </div>
    </article>
    <article class="mt-4 mt-lg-0 col-lg-4">
        <div class="card newsText text-justified h-100 w-100">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="newsText__icon">
                        <a href="{{ "/use-cases/content-management" | prepend: site.baseurl }}"><svg>
                                <use xlink:href="/images/sprite.svg#feather" /></svg></a>
                    </div>
                    <h2><a href="{{ "/use-cases/content-management" | prepend: site.baseurl }}">Content
                            Management</a></h2>
                </h5>
                <div>
                    RESTHeart allows to effectively manage content, such as
                    <strong>images</strong>, <strong>comments</strong>, <strong>tags</strong>,
                    <strong>categories</strong>, <strong>geolocalized data</strong>, 
                    <strong>audios</strong> and <strong>videos</strong>, 
                    via a solid <strong>REST API</strong>.
                </div>
            </div>
            <div class="d-flex w-100 justify-content-end">
                <a class="btn btn-m" href="{{ "/use-cases/content-management" | prepend: site.baseurl }}">Read More</a>
            </div>
        </div>
        </article>
        <article class="mt-4 mt-lg-0 col-lg-4">
        <div class="card newsText text-justified h-100 w-100">
            <div class="card-body">
                <h5 class="card-title">
                    <div class="newsText__icon">
                        <a href="{{ "/use-cases/integration" | prepend: site.baseurl }}">
                            <svg><use xlink:href="/images/sprite.svg#torch" /></svg>
                        </a>
                    </div>
                    <h2>
                        <a href="{{ "/use-cases/integration" | prepend: site.baseurl }}">Integration</a>
                    </h2>
                </h5>
                <div>RESTHeart is an effective solution for <strong>Integration</strong> needs.
                </div>
                <div class="mt-1">
                    You can easily and effectively involve MongoDB
                    in your <strong>Integration Processes</strong>
                    because your <strong>Middleware</strong> can interact 
                    with the <strong>RESTHeart API</strong> using simple <strong>HTTP Connectors</strong>.
                </div>
            </div>
            <div class="d-flex w-100 justify-content-end">
                <a class="btn btn-m" href="{{ "/use-cases/integration" | prepend: site.baseurl }}">Read More</a>
            </div>
        </div>
    </article>
</div>
