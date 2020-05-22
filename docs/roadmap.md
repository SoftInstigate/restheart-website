---
layout: docs
title: Roadmap
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [RESTHeart 4.2](#restheart-platform-42)
-   [RESTHeart 5.0](#restheart-platform-50)
-   [Released](#released)
    -   [RESTHeart 4.1](#restheart-platform-41)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{: .bs-callout.bs-callout-info}
**We listen to you!** For any feedback or request feel free to [open an issue](https://github.com/SoftInstigate/restheart/issues/new) on github.

## RESTHeart 4.2

### Unified extensions API

Both **restheart-platform-core** and **restheart-platform-security** can be extended developing plugins.

Developing plugins involves implementing classes that extend interfaces and registering them.

RESTHeart 4.2 will unify the extension API so that both core and security plugins will follow the same approach.

The new repository `restheart-platform-plugins` containing the plugin API will be released and distributed under the Apache License 2.0.

{: .bs-callout.bs-callout-info }
This will better clarify the legal implications of developing your custom extensions. Your extensions will only depend the more business friendly Apache License 2.0.

## LDAP Authenticator

LDAP Authenticator for **restheart-platform-security**

The new authenticator will update the old Access Manager [ADIdentityManager](https://github.com/SoftInstigate/restheart/blob/3.11.x/src/main/java/org/restheart/security/impl/ADIdentityManager.java) available for restheart 3.x to include:

-   caching (extending an abstract class that simplifies implementing cached authenticators)
-   configurable LDAP query to retrieve users
-   compatible with Active Directory

## RESTHeart 5.0

### RESTHeart Studio

The new service `restheart-platform-studio` will added to RESTHeart. This is a web application:

-   for developers: to manage dbs, collections (including configuring extensions such as _Transformers_, _Hooks_, _Checkers_, etc), users and ACL, and reading and writing documents and files.
-   for users: to manage and publishing content through forms

![](/images/restheart-platform-admin-preview.png){:
width="800" height="auto" class="mx-auto d-block img-responsive"}

### Upgrade to undertow 4.0

Both **restheart-platform-core** and **restheart-platform-security** will updated to use Undertow 4.0.

Undertow 4.0. will replace the underlying transport from XNIO to Netty.

From the undertow migration to Netty announcement on 12 April, 2019:

> undertow 3.0 final version should be released in the next few months, however in the short term the 3.x branch will not provide the same level of API compatibility that Undertow has traditionally provided. As the Netty implementation is new this will allow us to potentially fix any issues we find with our approach without being locked in to supporting an API that is not ideal.

> After a short 3.x cycle we are planning on releasing undertow 4.x that will provide API stability, in the same way that Undertow 1.x and 2.x have.

## Released

## RESTHeart 4.1

{: .alert.alert-success }
Released 7 October 2019

### rhAuthorizer

The permissions are stored in `restheart.acl` collection. This way permissions can be dynamically modified without requesting to server restart.

Permission documents have the following format:

```
{
    "roles": [ "admin", "user" ],
    "condition": "path[/inventory] and (method[POST] or method[GET])",
    "priority": 1,
    "filters": {
        "read": {"$or": [ {"status": "PUBLISHED"}, { "author": { "$var": "username" } } ] },
        "write": {"author": {"$var": "username" }}
    }
}
```

This permission document means:

Allow POST and GET requests on path `/inventory`for users having role `admin` or `user` applying the following filters:

-   read requests: return documents having `status=PUBLISHED` or `author=<username of the requesting user>`
-   write requests: only allow requests having `author=<username of the requesting user>`

{: .bs-callout.bs-callout-info}
The `filters` properties allow to apply a `filter` (automatically added to the specified filter query parameter) to read and write requests. **This allows to seamlessly partition data depending on user role**.

### JSON_MODE

Allows specifying the `jsonMode` query parameter the representation between `EXTENDED` (Standard extended JSON representation), `RELAXED` (Standard relaxed extended JSON representation) and `SHELL` (this output mode will attempt to produce output that corresponds to what the MongoDB shell actually produces when showing query results);

See RESTHeart Core [issue 350](https://github.com/SoftInstigate/restheart/issues/350)

### Support parametric conf file

Add support of mustache parameters in `resthart-platform-security.yml` just like RESTHeart supports it in `restheart-platform-core.yml`

See RESTHeart Security [feature request 1](https://github.com/SoftInstigate/restheart-security/issues/1)

</div>
