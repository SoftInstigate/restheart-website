---
title: Authorization
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Mongo ACL Authorizer](#mongo-acl-authorizer)
    - [Format of permissions](#format-of-permissions)
    - [Predicates](#predicates)
    - [MongoPermissions](#mongopermissions)
        - [readFilter and writeFilter](#readfilter-and-writefilter)
        - [mergeRequest](#mergerequest)
        - [projectResponse](#projectresponse)
-   [File ACL Authorizer](#file-acl-authorizer)
-   [OriginVetoer](#originvetoer)
-   [filterOperatorsBlacklist](#filteroperatorsblacklist)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content pt-0">

{% include docs-head.html %}

## Introduction

See [Understanding RESTHeart Security](/docs/security/overview#understanding-restheart-security) for an high level view of the RESTHeart security model.

RESTHeart is built around a **pluggable architecture**. It comes with a strong security implementation but you can easily extend it by implementing plugins. This section documents the authorizers available out-of-the-box.

RESTHeart by default offers two implementations authorizers:

1. Mongo ACL Authorizer
1. File ACL Authorizer

Both authorizers provide a simple, declarative and a rich, ACL-based model for authorization.

It's even possible to develop **custom authorizers**. Please refer to [Develop Security Plugins](/docs/plugins/security-plugins) for more information.

## Mongo ACL Authorizer

_mongoAclAuthorizer_ authorizes requests according to the _Access Control List_ defined in a **MongoDB collection**.

The configuration allows:

-   defining the collection to use to store ACL documents (`acl-db` and `acl-collection`).
-   enabling the root role (`root-role`): users with root role, can execute any requests, regardless of the permissions set in the ACL. Set it to null (`root-role: null`) to disable it.
-   controlling the ACL caching.

```yml
authorizers:
    mongoAclAuthorizer:
        acl-db: restheart
        acl-collection: acl
        # clients with root-role can execute any request
        root-role: admin
        cache-enabled: true
        cache-size: 1000
        cache-ttl: 5000
        cache-expire-policy: AFTER_WRITE
```

### Format of permissions

The properties of the permission document are:

{: .table }
|property|type|description|
|-|-|
|**predicate**|string|If the [undertow predicate](https://undertow.io/undertow-docs/undertow-docs-2.1.0/index.html#textual-representation-of-predicates) resolves the request then the request is authorized. Many examples of predicates can be found in the file [acl.yml](https://github.com/SoftInstigate/restheart/blob/6.6.1/core/etc/acl.yml)|
|**roles**|JSON array of strings|The roles that are applied the ACL document. The special role `$unauthenticated` applies to requests that are not authenticated.|
|**priority**|number|A request might fulfill several predicates; an ACL document with higher priority has higher evaluation precedence.|
|**mongo**|`null` or JSON `MongoPermissions` object|For requests handled by the `MongoService` (i.e. the service that implements the REST API for MongoDB) the permission can specify the [MongoPermissions](#mongopermissions) object|

An example permission document follows (for more examples check [acl.json](https://github.com/SoftInstigate/restheart/blob/6.6.1/core/etc/acl.json)):


```json
{
  "_id": "userCanGetOwnCollection",
  "roles": ["user"],
  "predicate": "method(GET) and path-template('/{userid}') and equals(@user._id, ${userid}) and qparams-contain(page) and qparams-blacklist(filter, sort)",
  "priority": 100,
  "mongo": {
    "readFilter": { "_$or": [{ "status": "public" }, { "author": "@user._id" }] },
    "projectResponse": { "log": 0 }
  }
}
```

The permission allows the request if:

- the authenticated user has `user` role
- the request method is `GET`
- the request path is `/{userid}`, where the `{userid}` is the id of the authenticated user
- the request specifies the query parameter `page`, due to predicate `qparams-contain(page)`
- the request does not specify the query parameters `filter` and `sort`, due to predicate `qparams-blacklist(filter, sort)`

If the request is authorized by this permission then:

- the property `log` is removed from the response, due to `projectResponse`
- a `readFilter` applies, so only document with `status=public` or `author=<userid>` are returned

### Predicates

The ACL permissions use the [undertow predicate language](https://undertow.io/undertow-docs/undertow-docs-2.1.0/index.html#textual-representation-of-predicates) to define the condition a request must met to be authorized.

A simple example of predicate is `(method(GET) or method(POST)) and path('/coll')` that authorizes `GET` or `POST` requests when the URI is `/coll`

RESTHeart 6 extends this language introducing the following new predicates that extend and simplify the ACL permission definition:

{: .table }
|predicate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|description|example&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
|-|-|-|
|`qparams-contain`          |`true` if the request query string contains the specified parameter              |`qparams-contain(page,pagesize)`|
|`qparams-blacklist`        |`true` if the request query string does not contain the blacklisted parameters   |`qparams-contain(filter,sort)`|
|`qparams-whitelist`        |`true` if the request query string contains only whitelisted parameters          |`qparams-whitelist(page,pagesize)`|
|`qparams-size`             |`true` if the request query string the specified number of parameters            |`qparams-size(3)`|
|`bson-request-contains`    |`true` if the request content is BSON and contains the specified properties      |`bson-request-contains(foo,bar.sub)`|
|`bson-request-whitelist`   |`true` if the request content is BSON and only contains whitelisted properties   |`bson-request-whitelist(foo,bar.sub)`|
|`bson-request-blacklist`   |`true` if the request content is BSON and doesn't contain blacklisted properties |`bson-request-blacklist(foo,bar.sub)`|
|`in`                       | checks if `value` is contained in `array`                                       | `path-template('/{tenant}') and in(value=${tenant}, array=@user.tenants)`

### MongoPermissions

For requests handled by the `MongoService` (i.e. the service that implements the REST API for MongoDB) the permission can specify the `MongoPermissions` object.

```json
{
  "mongo": {
    "allowManagementRequests": false,
    "allowBulkPatch": false,
    "allowBulkDelete": false,
    "allowWriteMode": false,
    "readFilter": {"$or": [ {"status": "public"}, {"author": "@user._id"} ] },
    "writeFilter": {"author": "@user._id"},
    "mergeRequest": {"author": "@user._id"}
  }
}
```

{: .table }
|mongo permission&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|description|
|-|-|
|`allowManagementRequests`|DB Management Requests are forbidden by default (create/delete/update dbs, collection, file buckets schema stores and schemas, list/create/delete indexes, read db and collection metadata). To allow these requests, `allowManagementRequests` must be set to `true`|
|`allowBulkPatch`|bulk PATCH requests are forbidden by default, to allow these requests, `allowBulkPatch` must be set to `true`|
|`allowBulkDelete`|bulk DELETE requests are forbidden by default, to allow these requests, `allowBulkDelete` must be set to `true`|
|`allowWriteMode`|requests cannot use the query parameter `?wm=insert|update|upsert` by default. To allow it, `allowWriteMode` must be set to `true`|

Note that, in order to allow those requests, not only the corresponding flag must be set to `true` but the permission `predicate` must resolve to `true`.

Consider the following examples.

The next one won't allow the role `user` to execute a bulk PATCH even if the `allowBulkPatch` is `true` since the `predicate` requires the request verb to be `GET`

```json
{
  "roles": [ "user" ],
  "predicate": "path-prefix('coll') and method(GET)"
  "mongo": {
    "allowBulkPatch": true
  }
}
```

The next request allows to PATCH the collection `coll` and all documents in it, but won't allow to execute a bulk PATCH (i.e. the request `PATCH /coll/*?filter={ "status": "draft" }` since   the `allowBulkPatch` is `false`

```json
{
  "roles": [ "user" ],
  "predicate": "path-prefix('coll') and method(PATCH)",
  "mongo": {
    "allowBulkPatch": false
  }
}
```

#### readFilter and writeFilter

{: .bs-callout.bs-callout-info }
`readFilter` and `writeFilter` allows to partition data by roles.

These are optional filters that are added to read and write requests respectively when authorized by an ACL permission that defines them.

{: .bs-callout.bs-callout-warning }
Breaking change. `readFilter` and `writeFilter` are available in RESTHeart v5 as well. Starting from v6, these must be under the `mongo` object because they are applicable only to requests handled by the `MongoService`

The `readFilter` applies to GET requests to limits the returned document to the ones that match the specified condition.

The `writeFilter` applies to write request to allow updating only the documents that match the specified condition.

{: .bs-callout.bs-callout-warning }
`writeFilter` only limits updates and cannot avoid creating documents that don't match the filter. The properties used in the filter should be set using `mongo.mergeRequest`.

#### mergeRequest

`mergeRequest` allows to merge the specified properties to the request content. In this way, server-side evaluated properties can be enforced.

In the following example:

```json
{
  "roles": [ "user" ],
  "predicate": "path-prefix('coll') and method(PATCH)",
  "mongo": {
    "mergeRequest": {"author": "@user._id"}
  }
}
```

the property `author` is evaluated to be the `userid` of the authenticated client.

`@user` is a special variable that allows accessing the properties of the user object. The following variables are available:

{: .table }
|variable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|description
|-|-|
|`@user`|the user object (excluding the password), e.g. `@user.userid` (for users defined in acl.yml by `FileRealmAuthenticator`) or `@user._id` (for users defined in MongoDB by `MongoRealmAuthenticator`)|
|`@request`|the properties of the request, e.g. `@request.remoteIp`|
|`@mongoPermissions`|the `MongoPermissions` object, e.g. `@mongoPermissions.writeFilter`|
|`@now`|the current date time|
|`@filter`|the value of the `filter` query parameter|

#### projectResponse

`projectResponse` allows to project the response content, i.e. to remove properties.

It can be used with positive or negative logic.

The following hides the properties `secret` and `a.nested.secret` (you can use the dot notation!). All other properties are returned.

```json
{
  "roles": [ "user" ]
  "predicate": "path-prefix('coll') and method(PATCH)",
  "mongo": {
    "projectResponse": {"secret": 0, "a.nested.secret": 0 }
  }
}
```

The following only returns the property `public` (you can use the dot notation!). All other properties are hidden.

```json
{
  "roles": [ "user" ]
  "predicate": "path-prefix('coll') and method(PATCH)",
  "mongo": {
    "projectResponse": {"public": 1 }
  }
}
```

## File ACL Authorizer

_fileRealmAuthorizer_ allows defining roles permissions in a YAML configuration file.

```yml
authorizers:
    fileAclAuthorizer:
        conf-file: acl.yml
```

The permission's options are fully equivalent to the ones handled by the _mongoAclAuthorizer_, only the yml format is used in place of Json.

An example follows (for more examples check [acl.yml](https://github.com/SoftInstigate/restheart/blob/6.6.1/core/etc/acl.yml)):

```yml
  roles: [ "user" ]
  predicate: >
        method(GET) and path-template('/{userid}') and equals(@user._id, ${userid}) and qparams-contain(page) and qparams-blacklist(filter, sort)
  priority: 100
  mongo:
    readFilter: >
        { "_$or": [{ "status": "public" }, { "author": "@user._id" }] }
    projectResponse: >
        { "log": 0 }
```

{: .bs-callout.bs-callout-info }
Watch [Authorization via file and MongoDB](https://www.youtube.com/watch?v=QVk0aboHayM&t=1553s)

## OriginVetoer

`OriginVetoer` authorizer protects from CSRF attacks by forbidding requests whose Origin header is not whitelisted.

It can configured as follows in the *Authorizers* section of `restheart.yml`:

```yml
authorizers:
  originVetoer:
      enabled: true # <---- default is false
      whitelist:
        - https://restheart.org
        - http://localhost
```

## filterOperatorsBlacklist

A global blacklist for MongoDb query operators in the `filter` query parameter.

```yml
plugins-args:
  filterOperatorsBlacklist:
    blacklist: [ "$where" ]
    enabled: true
```

With this configuration, the request `GET /coll?filter={"$where": "...."}` is forbidden.
