---
title: Upgrade to RESTHeart v6
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [GraphQL API](#graphql-api)
- [GraalVM](#graalvm)
- [Write Mode in MongoDB REST API](#write-mode-in-mongodb-rest-api)
- [Security](#security)
- [Variables in aggregation and permission](#variables-in-aggregation-and-permission)
- [Dynamic Change Streams](#dynamic-change-streams)
- [Java 16](#java-16)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

<div class="alert alert-warning" role="alert">
    <h2 class="alert-heading">
            <svg class="float-left mr-3 my-auto d-block" width="30px" height="30px">
                    <use xlink:href="/images/sprite.svg#feather" />
                </svg>
        This page is being updated.
    </h2>
    <hr class="mt-2 mb-2">
    <p><strong>REST</strong>Heart v6 introduces many news features, improvements and changes.</p>
    <p>We are updating the documentation.....</p>
</div>

## GraphQL API

RESTHeart 6 provides a GraphQL API for MongoDB that works side by side with the good old REST API to get a comprehensive Data API to build modern applications.

For more information see [GraphQL](/docs/graphql/) documentation page that contains the following [example](/docs/graphql/#a-complete-example) (this will make happy those who love GraphQL like us):

{% include code-header.html
    type="Request"
%}

```http
POST /graphql/mflix HTTP/1.1

{
    MoviesByTomatoesRateRange(min: 3.8, max: 4.5, limit: 3, skip: 20, sort: -1){
        title
        comments{
            text
            user{
                name
            }
        }
        tomatoesRate
    }
}
```

{% include code-header.html
    type="Response"
%}

```json
{
  "data": {
    "MoviesByTomatoesRateRange": [
      {
        "title": "The Wages of Fear",
        "comments": [
          {
            "text": "Commodi accusamus totam eaque sunt. Nihil reiciendis commodi molestiae esse ipsam corporis reprehenderit. Non nam similique vel dolor magni quia quis.",
            "user": {
              "name": "Doreah"
            }
          }
        ],
        "tomatoesRate": 4.4
      },
      {
        "title": "Chicago Deadline",
        "comments": [
          {
            "text": "Nihil itaque a architecto. Illo veritatis totam at quibusdam. Doloremque hic totam consequuntur omnis molestiae commodi iste. Quis alias commodi nemo eveniet.",
            "user": {
              "name": "Patricia Good"
            }
          }
        ],
        "tomatoesRate": 4.4
      },
      {
        "title": "The Passion of Joan of Arc",
        "comments": [],
        "tomatoesRate": 4.4
      }
    ]
  }
}
```

## GraalVM

### Polyglot JavaScript Services and Interceptors on GraalVM

Services and Interceptors can be developed in JavaScript and TypeScript when running RESTHeart with GraalVM or using `restheart-native`

Here is an example

```javascript
export const options = {
    name: "helloWorldService",
    description: "just another Hello World",
    uri: "/hello"
}

export function handle(request, response) {
    response.setContent(`{ "msg": `Hello ${rc.name || 'World'}` } `);
    response.setContentTypeAsJson();
}
```

{: .bs-callout.bs-callout-info }
See [example JS plugins](https://github.com/SoftInstigate/restheart/tree/master/polyglot/src/test/resources)

Just copy the `test-js-plugins` directory into the `plugins` directory to have the JS plugins automatically deployed.

JS plugins can be added or updated without requiring to restart the server, ie v6 supports JS plugins hot deployment.

### Native Image

RESTHeart can be built as native image. See [GraalVM](/docs/graalvm/) documentation page.

The Docker image of restheart-native is available:

```bash
$ docker pull softinstigate:restheart:6.0.0-native
```

## Write Mode in MongoDB REST API

{: .bs-callout.bs-callout-warning }
Breaking change

Until v5, all write requests have always *upsert* write mode. 

V6 changes this and now by default:

- `POST` verb has insert write mode
- `PUT` and `PATCH` verbs have update write mode

The new query parameter `?wm=insert|update|upsert` has been introduced to allow specifying the **w**rite **m**ode.

However the use of the qparam `?wm` is forbidden by default; to allow it, the following permission must be defined:

For the `FileAclAuthorizer`:

```yml
permissions:
    - role: canUseWMQParam
      predicate: path-prefix('/collection')
      priority: 0
      mongo:
        allowWriteMode: true # default false
```

And in a similar way for the `MongoAclAuthorizer`:

```json
{
    "role": "canUseWMQParam",
    "predicate": "path-prefix('/collection')",
    "priority":  0,
    "mongo": {
        "allowWriteMode": true
    }
}
```

## Security

{: .bs-callout.bs-callout-warning }
Breaking change

RESTHeart 6 ships with Extended and Simplified Security.

First of all, the new *write mode* simplifies the definition of permission, since a `POST` is an insert while `PUT` and `PATCH` are updates by default. This makes easier defining permission to allow creating documents or just updating.

### VETOER Authorizers

In RESTHeart, multiple authorizers can be enabled.

In RESTHeart v6 the new attribute `authorizerType` of `@RegisterPlugin` is defined: an authorizer can be of type `ALLOWER` (default) or `VETOER`.

```java
@RegisterPlugin(
        name = "globalPredicatesVetoer",
        description = "vetoes requests according to global predicates",
        enabledByDefault = true,
        authorizerType = TYPE.VETOER) // <----- optional, default ALLOWER
public class GlobalPredicatesVetoer implements Authorizer {
    // omitted
}
```

As an in-bound request is received and authenticated the isAllowed() method is
called on each authorizers. A secured request is allowed when no `VETOER` denies
it and at least one `ALLOWER` allows it.

### secure attribute of @RegisterPlugin

The `Service` plugin can be configured to require authentication and authorization.

Prior to v6, in order to secure a `Service`, the configuration option `secure: true`  must be specified in `restheart.yml`

```yml
plugins-args:
  my-plugin:
    secure: true
```

This forced the `Service` to have a configuration section.

In RESTHeart v6 a `Service` can be secured via the following attribute of the `@RegisterPlugin` annotation.

```java
@RegisterPlugin(name = "myService",
    description = ".....",
    secure = true) // <----- optional, default false
public class MyService implements JsonService {
        // code omitted
}
```

In JavaScript:

```javascript
export const options = {
    name: "myService",
    description: "......",
    uri: '/myService',
    secured: true, // <----- optional, default false
}

export function handle(request, response) {
```

### *fileAclAuthorizer* supports same options than *mongoAclAuthorizer*

Until v5, `mongoAclAuthorizer` offers more options to define permissions than the `fileAclAuthorizer`. In v6 the two authorizers are functionally equivalent with the only difference that `mongoAclAuthorizer` handles ACL permissions in JSON in a MongoDB collection while `fileAclAuthorizer` handles them is a YML file. Here is a example of the same permission defined for the two authorizers:

**fileAclAuthorizer**

```yml
# allow role 'user' GET document from /{userid}
    # a read filter apply, so only document with status=public or author=userid are returned <- readFilter
    # must use 'page' qparam <- qparams-contain(page)
    # cannot use 'filter' and 'sort' qparams <- qparams-blacklist(filter, sort)
    # the property 'log' is removed from the response <- projectResponse
    - roles: [ user ]
      predicate: >
        method(GET)
        and path-template('/{userid}')
        and equals(@user.userid, ${userid})
        and qparams-contain(page)
        and qparams-blacklist(filter, sort)

      priority: 100
      mongo:
        readFilter: >
          { "$or": [
            {"status": "public"},
            {"author": "@user.userid" }
            ]}
        projectResponse: >
          { "log": 0 }
```

**mongoAclAuthorizer**

```json
{
    "_id": "userCanGetOwnCollection",
    "description": [
        "**** DESCRIPTION PROPERTY IS NOT REQUIRED, HERE ONLY FOR DOCUMENTATION PURPOSES",
        "allow role 'user' GET document from /{userid}",
        "a read filter apply, so only document with status=public or author=userid are returned <- readFilter",
        "must use 'page' qparam <- qparams-contain(page)",
        "cannot use 'filter' and 'sort' qparams <- qparams-blacklist(filter, sort)",
        "the property 'log' is removed from the response <- projectResponse"
    ],
    "roles": ["user"],
    "predicate": "method(GET) and path-template('/{userid}') and equals(@user.userid, ${userid}) and qparams-contain(page) and qparams-blacklist(filter, sort)",
    "priority": 100,
    "mongo": {
      "readFilter": {
        "_$or": [{ "status": "public" }, { "author": "@user.userid" }]
      },
      "projectResponse": { "log": 0 }
    }
```

### New ACL Permission predicates

The ACL permissions use the undertow predicate language that allows to define the condition a request must met to be authorized.

RESTHeart 6 extends this language introducing the following 8 new predicates to extend and simplify the ACL permission definition:

- `qparams-contain`
- `qparams-blacklist`
- `qparams-blacklist`
- `qparams-size`
- `bson-request-contains`
- `bson-request-whitelist`
- `bson-request-blacklist`

Consider the following example:

```yml
    # allow role 'user' GET document from /{userid}
    # a read filter apply, so only document with status=public or author=userid are returned <- readFilter
    # must use 'page' qparam <- qparams-contain(page)
    # cannot use 'filter' and 'sort' qparams <- qparams-blacklist(filter, sort)
    - roles: [ user ]
      predicate: >
        method(GET)
        and path-template('/{userid}')
        and equals(@user.userid, ${userid})
        and qparams-contain(page)
        and qparams-blacklist(filter, sort)
```

More examples can be found [here](https://github.com/SoftInstigate/restheart/blob/master/core/etc/acl.yml)

### MongoPermissions

For requests handled by the `MongoService` (i.e. the service that implements the REST API for MongoDB) the permission can specify the `MongoPermission` object.

```yml
mongo:
    allowManagementRequests: false # default false
    allowBulkPatch: false          # default false
    allowBulkDelete: false         # default false
    allowWriteMode: false          # default false
    readFilter: >
          {"$or": [ {"status": "public"}, {"author": "@user.userid"} ] }
    writeFilter: >
          {"author": "@user.userid"}
    mergeRequest: >
          {"author": "@user.userid"}
```

- `allowManagementRequests` DB Management Requests are forbidden by default (create/delete/update dbs, collection, file buckets schema stores and schemas, list/create/delete indexes, read db and collection metadata). To allow these requests, `allowManagementRequests` must be set to `true`
- `allowBulkPatch` bulk PATCH requests are forbidden by default, to allow these requests, `allowBulkPatch` must be set to `true`
- `allowBulkDelete` bulk DELETE requests are forbidden by default, to allow these requests, `allowBulkDelete` must be set to `true`
- `allowWriteMode` requests cannot use the query parameter `?wm=insert|update|upsert` by default. To allow it, `allowWriteMode` must be set to `true`

Note that, in order to allow those requests, not only the corresponding flag must be set to `true` but the permission `predicate` must resolve to `true`.

Consider the following examples.

The next one won't allow the role `user` to execute a bulk PATCH even if the `allowBulkPatch` is `true` since the `predicate` requires the request verb to be `GET`

```yml
- roles: [ user ]
  predicate: path-prefix('coll') and method(GET)
  mongo:
    allowBulkPatch: true
```

The next request allows to PATCH the collection `coll` and all documents in it, but won't allow to execute a bulk PATCH (i.e. the request `PATCH /coll/*?filter={ "status": "draft" }` since   the `allowBulkPatch` is `false`

```yml
- roles: [ user ]
  predicate: path-prefix('coll') and method(PATCH)
  mongo:
    allowBulkPatch: false
```

### *mongo.readFilter* and *mongo.writeFilter*

{: .bs-callout.bs-callout-warning }
Breaking change

`readFilter` and `writeFilter` are available in RESTHeart v5 as well.
Are optional filters that are added to read and write requests respectively when authorized by this ACL document.

Starting from v6, these must be under the `mongo` object because are applicable only to requests handled by the `MongoService`

### *mongo.mergeRequest*

`mergeRequest` allows to merge the specified properties to the request content. In this way server-side evaluated properties can be enforced.

In the following example

```yml
- roles: [ user ]
  predicate: path-prefix('coll') and method(PATCH)
  mongo:
    mergeRequest: >
        {"author": "@user.userid"}
```

The property `author` is forced to be the userid of the authenticated client.

`@user` is a special variable that allow accessing the user properties. The following variables are available:

- `@user` the user object (excluding the password), e.g. `@user.userid` (for users defined in acl.yml by `FileRealmAuthenticator`) or `@user._id` (for users defined in MongoDB by `MongoRealmAuthenticator`)
- `@request` the properties of the request, e.g. `@request.remoteIp`
- `@mongoPermissions` the `MongoPermissions` object, e.g. `@mongoPermissions.writeFilter`
- `@now` the current date time
- `@filter` the value of the `filter` query parameter

### *mongo.projectResponse*

`projectResponse` allows to project the response content, i.e. to remove properties.

Can be used with positive or negative logic.

The following hides the properties `secret` and `a.nested.secret` (you can use the dot notation!). All other properties are returned.

```yml
- roles: [ user ]
  predicate: path-prefix('coll') and method(PATCH)
  mongo:
    projectResponse: >
        {"secret": 0, "a.nested.secret": 0 }
```

The following only return the property `public` (you can use the dot notation!). All other properties are hidden.

```yml
- roles: [ user ]
  predicate: path-prefix('coll') and method(PATCH)
  mongo:
    projectResponse: >
        {"public": 1 }
```

### OriginVetoer

OriginVetoer protects from CSRF attacks by forbidding requests whose Origin header is not whitelisted.

It can configured as follows in the *Authorizers* section of `restheart.yml`:

```yml
authorizers:
  originVetoer:
      enabled: false
      whitelist:
        - https://restheart.org
        - http://localhost
```

### filterOperatorsBlacklist

A global blacklist for MongoDb operators in filter query parameter.

```yml
plugins-args:
  filterOperatorsBlacklist:
    blacklist: [ "$where" ]
    enabled: true
```

## Variables in aggregation and permission

The same variables that can be used in permissions, can be used in aggregation definition plus the variables `@page`, `@pagesize`, `@skip` and `@limit` that are computed from the paging query parameters `?page=1&pagesize=4`.

This is a valid aggregation definition where a filter is applied from the `readFilter` property of the ACL permission that eventually allowed the request.

```json
{
    "uri": "meetingsDate",
    "type": "pipeline",
    "stages": [
        {
            "$match": {
                "$var": "@mongoPermissions.readFilter"
            }
        },
        {
            "$sort": {
                "_id": -1
            }
        }
    ]
}
```

## Dynamic Change Streams

Change streams definition can be updated without requiring to restart RESTHeart.

When a change stream definition is updated, all clients connected via WebSocket are automatically disconnected from the old change stream.

## Java 16

{: .bs-callout.bs-callout-warning }
Breaking change

RESTHeart 6 requires Java 16+ or GraalVM 21.1 (JDK 16).

</div>