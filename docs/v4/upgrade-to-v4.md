---
layout: docs
title: Upgrade to RESTHeart v4
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Architecture](#architecture)
-   [New features](#new-features)
-   [Default configuration](#default-configuration)
    -   [core](#core)
    -   [security](#security)
-   [Representation Format](#representation-format)
    -   [RESTHeart v3](#restheart-v3)
    -   [RESTHeart Platform v4](#restheart-platform-v4)
-   [Plugins Development](#plugins-development)
    -   [Core Plugins](#core-plugins)
    -   [Security Plugins](#security-plugins)
-   [HAL browser removed](#hal-browser-removed)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

This page highlights the main differences between RESTHeart Platform v4 and RESTHeart v3 and provides guidelines for upgrading.

The RESTHeart team has worked hard to improve RESTHeart while keeping upgrading as simple as possible. The upgrade process has been tested successfully in complex installations.

{: .bs-callout.bs-callout-success }
The RESTHeart team supports you. Check our [Services](/services) for free and professional support options.

## Architecture

<div class="alert alert-info" role="alert">
    <h2 class="alert-heading">Micro-services architecture.</h2>
    <hr class="my-2">
    <p>RESTHeart Platform v4 has a new modular architecture:  it has been split in two micro-services versus the monolithic architecture of v3.</p>
</div>

<div class="row">
    <div class="col-lg-9 col-12 align-self-center">
        <p>
        <strong>The new architecture explained</strong>
       </p>
        <p>
        RESTHeart v3 has been growing over the last 5 years featuring a <strong>REST API for MongoDB</strong> and a strong <strong>security layer</strong>. The code got complex to update and maintain, so that RESTHeart Platform v4 is now split in modules clued together in a micro-service architecture.
        </p>
        <p>
        This resulted in two projects that <cite>do one thing and do it well</cite>. Each of them can also be reused alone in different architectures.
        </p>
        <p>
            The two micro-services are:
        </p>
        <ul>
            <li><strong>restheart-core</strong> handles the REST API;</li>
            <li><strong>restheart-security</strong> is responsible of enforcing the security policy acting as a reverse proxy for restheart-core.</li>
        </ul>
        <div class="alert alert-success">
            It is very easy to start the two micro-services. Either using docker-compose or just starting them with java from the command line. In the latter case it is as easy as starting the two processes without specifying any configuration file. The default configuration seamlessly connects the two and just makes them work.
        </div>
    </div>
    <div class="d-none d-lg-block col-lg-3 text-center align-self-center">
        <img class="w-75" src="/images/restheart-architecture.svg"/>
    </div>
</div>

## New features

RESTHeart Platform v4 introduces two main new features:

-   [Change Streams](/docs/change-streams) to handle real-time data streams via WebSocket connections.
-   [Transactions](/docs/transactions) to handle multi-document transactions.

<div class="alert alert-info" role="alert">
    <h2 class="alert-heading"><strong>RESTHeart Platform</strong> feature.</h2>
    <hr class="my-2">
    <p><strong>Change Streams</strong> and <strong>Transactions</strong> are available only on RESTHeart Platform.</p>
    <p class="small">Confused about editions? Check the <a class="alert-link" href="/editions">editions matrix</a>.</p>
    <a href="/get"><button class="btn trial-btn">Get Free Trial</button></a>
</div>

## Default configuration

{: .alert.alert-warning }
RESTHeart Platform 4 has some different default values.

{: .alert.alert-info }
The default configuration applies starting restheart-platform-core either without specifying a configuration file or specifying the parametric configuration file `restheart.yml` with the properties file `default.properties`

{: .alert.alert-info }
You can start RESTHeart Platform v4 with v3 backward compatible settings using the properties file `bwcv3.properties`

The following tables summarize the different default configuration values.

### core

{: .table.table-responsive }
||restheart v3|restheart-platform-core v4|
|-|-|-|
|listeners|ajp, http, https|ajp|
|mongo-mount|all dbs|only the db `restheart`|
|representation-format|SHAL (aka PLAIN_JSON)|STANDARD|
|cacheInvalidator URI|`/_logic/ci` |`/ci`|
|csvLoader URI|`/_logic/csv` |`/csv`|

### security

{: .table.table-responsive}
||restheart v3|restheart-platform-security v4|
|-|-|-|
|requestPredicatesAuthorizer configuration file|`etc/users.yml`|`etc/acl.yml`|
|rndTokenService URI|`/_logic/tokens/<tknid>`|`/tokens/<tknid>`|
|pingService URI|`/_logic/ping`|`/ping`|
|getRoles service URI|`/_logic/roles`|`/roles`|

## Representation Format

Following several community feedbacks, RESTHeart Platform v4 introduces a new default representation format that is more compact, easy to use and effective.

{: .alert.alert-info}
Read more at [Representation Format](/docs/representation-format)

Examples follows:

### RESTHeart v3

```
# read metadata and documents of collection restheart.coll -> GET /restheart/coll

{ "_embedded": [
    { <doc_1> },
    { <doc_2> },
    ...,
    { <doc_n> }
],
    "aggrs": [...]
    "checkers": [...],
    "transformers": [...],
    "streams": [...]
}

# count documents of collection restheart.coll -> GET /restheart/coll/?count&np

{ "_embedded": [], "_size": n }
```

### RESTHeart Platform v4

```
# read documents of collection restheart.coll -> GET /coll

[
    { <doc_1> },
    { <doc_2> },
    ...,
    { <doc_n> }
]

# read metadata of collection restheart.coll -> GET /coll/_meta

{
    "aggrs": [...]
    "checkers": [...],
    "transformers": [...],
    "streams": [...]
}

# count documents of collection restheart.coll -> GET /coll/_size

{ "_size": n }
```

## Plugins Development

{: .alert.alert-success}
The new Java API to extend RESTHeart has been improved in such a way that it is straightforward to adapt legacy implementations.

### Core Plugins

_Transformers_, _Hooks_, _Checkers_ and _Services_ (aka _Logic Handlers_) are implemented extending interfaces that are identical to the legacy ones, with the exceptions that they were moved to the more meaningful package `org.restheart.plugins`.

The configuration of custom plugins has been simplified. Rather that declaring the implementation classes in the configuration file, plugins are registered using the `@RegisterPlugin` annotation. Plugins can optionally have a options set in the configuration file. An example follows.

**Ping service implementation**

```java
@RegisterPlugin(name = "pingService",
        description = "Ping service")
public class PingService extends Service {

    private final String msg;

    /**
     *
     * @param confArgs arguments optionally specified in the configuration file
     */
    public PingService(Map<String, Object> confArgs) {
        super(confArgs);

        this.msg =  confArgs != null  && confArgs.containsKey("msg")
                ? (String) confArgs.get("msg")
                : "ping";
    }

    @Override
    public String defaultUri() {
        return "/ping";
    }

    /**
     *
     * @param exchange
     * @param context
     * @throws Exception
     */
    @Override
    public void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception {
        if (context.isOptions()) {
            handleOptions(exchange, context);
        } else if (context.isGet()) {
            context.setResponseContent(new BsonDocument("msg",
                    new BsonString(msg)));
            context.setResponseStatusCode(HttpStatus.SC_OK);
        } else {
            context.setResponseStatusCode(HttpStatus.SC_NOT_IMPLEMENTED);
        }

        next(exchange, context);
    }
}
```

**Ping service optional configuration**

```yml
pingService:
    #uri: "/hello"
    msg: Hello World!
```

### Security Plugins

Security can be extended much easier compared to v3 and more types of security plugins are available: _Authentication Mechanisms_, _Authenticators_, _Authorizers_, _Token Managers_, _Services_, _Initializers_ and _Interceptors_.

{: .jumbotron}

> it is so easy implementing the security layer with restheart-security and it is so complete that we expect it to be used by other projects
> _Andrea Di Cesare_

{: .alert.alert-info}
The main reason behind the RESTHeart Platform being split in two micro-services versus the monolithic architecture of RESTHeart 3 was simplifying and hardening the implementation of the security layer.

Refer to [Develop Security Plugins](/docs/develop/security-plugins/) for more information.

## HAL browser removed

The HAL browser has been removed, since the project is no longer maintained.

{: .bs-callout.bs-callout-info }
RESTHeart Platform v5 will include an Admin Web application that will replace it.

An online alternative that we suggest is <a href="http://restninja.io" target="_blank">http://restninja.io</a>
