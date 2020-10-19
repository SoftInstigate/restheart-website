---
title: Roadmap
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [RESTHeart 5.2](#restheart-52)

* [RESTHeart 6.0](#restheart-60)

* [Released](#released)

  * [RESTHeart 5.1](#restheart-51)

  * [RESTHeart 5.0](#restheart-50)

  * [RESTHeart 4.1](#restheart-41)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{: .bs-callout.bs-callout-info}
**We listen to you!** For any feedback or request feel free to [open an issue](https://github.com/SoftInstigate/restheart/issues/new) on github.

## RESTHeart 5.2

## Support for request level replica set

`readConcern`, `writeConcern`, `readPreference` can be set globally with the mongo-uri.

RESTHeart 5.2 will add query parameters to specify those options at request level.

## LDAP Authenticator

The new authenticator will update the old Access Manager [ADIdentityManager](https://github.com/SoftInstigate/restheart/blob/3.11.x/src/main/java/org/restheart/security/impl/ADIdentityManager.java) available for restheart 3.x to include:

* caching (extending an abstract class that simplifies implementing cached authenticators)

* configurable LDAP query to retrieve users

* compatible with Active Directory

## RESTHeart 6.0

### GraphQL API

The [GraphQL](https://graphql.org) plugin will work side by side with the already existing REST endpoints to get a managed unified GraphQL API to build modern applications.

The new service `restheart-graphql` will be added to RESTHeart. This service exposes a read-only (no mutations) GraphQL API for inquiring MongoDB resources.

The special collection `/_gqlapps` holds the GraphQL App Definitions. A GraphQL Application Definition document defines:

* application name, description and uri (the API will be available at `/graphql/<uri>`)

* the GraphQL schema

* mappings (information that allows to map GraphQL types and fields to MongoDB queries).

As soon as the GraphQL App Definition document gets created or updated, the GraphQL API is automatically generated and available under the security domain of RESTHeart.

### RESTHeart Studio

The new service `restheart-studio` will added to RESTHeart. This is a web application:

* for developers: to manage dbs, collections (including configuring extensions such as *Transformers*, *Hooks*, *Checkers*, etc), users and ACL, and reading and writing documents and files.

* for users: to manage and publishing content through forms

![](/images/restheart-platform-admin-preview.png){:
width="800" height="auto" class="mx-auto d-block img-responsive"}

### Upgrade to undertow 4.0

**RESTHeart** will updated to use Undertow 4.0.

Undertow 4.0. will replace the underlying transport from XNIO to Netty.

From the undertow migration to Netty announcement on 12 April, 2019:

> undertow 3.0 final version should be released in the next few months, however in the short term the 3.x branch will not provide the same level of API compatibility that Undertow has traditionally provided. As the Netty implementation is new this will allow us to potentially fix any issues we find with our approach without being locked in to supporting an API that is not ideal.

> After a short 3.x cycle we are planning on releasing undertow 4.x that will provide API stability, in the same way that Undertow 1.x and 2.x have.

## Released

## RESTHeart 5.1

{: .alert.alert-success }
Released 28 May 2020

### Support for Transactions

Support for Transactions has been available since RESTHeart 4.0 as a commercial plugins. With v5.1, it is available in RESTHeart OSS.

{: .bs-callout.bs-callout-info }
With RESTHeart 5.x we moved to the open core business model. While an enterprise license is available for legal and support requirements, all the codebase is Open Source and available under the AGPL 3.0.

\### Support for Change Streams

Support for Change Stream has been available since RESTHeart 4.0 as a commercial plugins. With v5.1, it is available in RESTHeart OSS.

## RESTHeart 5.0

{: .alert.alert-success }
Released 6 May 2020

### Single process

RESTHeart 4.x was composed by two processes: restheart-core and restheart-security. Although this simplified the development of specialized micro-services, we received many feedbacks about it being more complex to manage.

RESTHeart 5 is back to a single process. Thanks to proxying feature it is still possible deploying RESTHeart with security and mongo-services as in 4.x line.

### Improved plugin development API

RESTHeart can be extended developing plugins.

Developing plugins involves implementing classes that extend interfaces and registering them.

RESTHeart 5 development API has been simplified and cleaned up.

The module `restheart-commons` is the only required dependency for developing plugins and it is distributed under the Apache License 2.0.

{: .bs-callout.bs-callout-info }
This will better clarify the legal implications of developing your custom extensions. Your extensions will only depend the more business friendly Apache License 2.0.

### Easier plugin deployment

RESTHeart 5 streamlines the deployment of plugins. Copying the plugins jar file to the `/plugins` directory allows RESTHeart to pick it up at startup time.

## RESTHeart 4.1

{: .alert.alert-success }
Released 7 October 2019

### rhAuthorizer

The permissions are stored in `restheart.acl` collection. This way permissions can be dynamically modified without requesting to server restart.

Permission documents have the following format:

    {
        "roles": [ "admin", "user" ],
        "condition": "path[/inventory] and (method[POST] or method[GET])",
        "priority": 1,
        "filters": {
            "read": {"$or": [ {"status": "PUBLISHED"}, { "author": { "$var": "username" } } ] },
            "write": {"author": {"$var": "username" }}
        }
    }

This permission document means:

Allow POST and GET requests on path `/inventory`for users having role `admin` or `user` applying the following filters:

* read requests: return documents having `status=PUBLISHED` or `author=<username of the requesting user>`

* write requests: only allow requests having `author=<username of the requesting user>`

{: .bs-callout.bs-callout-info}
The `filters` properties allow to apply a `filter` (automatically added to the specified filter query parameter) to read and write requests. **This allows to seamlessly partition data depending on user role**.

### JSON_MODE

Allows specifying the `jsonMode` query parameter the representation between `EXTENDED` (Standard extended JSON representation), `RELAXED` (Standard relaxed extended JSON representation) and `SHELL` (this output mode will attempt to produce output that corresponds to what the MongoDB shell actually produces when showing query results);

See RESTHeart Core [issue 350](https://github.com/SoftInstigate/restheart/issues/350)

### Support parametric conf file

Add support of mustache parameters in `resthart-platform-security.yml` just like RESTHeart supports it in `restheart-platform-core.yml`

See RESTHeart Security [feature request 1](https://github.com/SoftInstigate/restheart-security/issues/1)

</div>
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTIwNzMzNDEwN119
-->