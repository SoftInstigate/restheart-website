---
title: Upgrade to RESTHeart v6
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [GraalVM](#graalvm)
- [GraphQL](#graphql)
- [Security](#security)
- [Variables in aggregation and permission](#variables-in-aggregation-and-permission)
- [Dynamic Change Streams](#dynamic-change-streams)
- [Java 16](#java-16)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress-v6.html %}

## GraalVM

### Polyglot JavaScript Services and Interceptors on GraalVM

Services and Interceptors can be developed in JavaScript when running RESTHeart with GraalVM or using `restheart-native`

Here is an example

```javascript
export const options = {
    name: "helloWorldService",
    description: "just another Hello World",
    uri: "/hello",
    secured: false, // optional, default false
    matchPolicy: "EXACT" // optional, default PREFIX
}

export function handle(request, response) {
    LOGGER.debug('request {}', request.getContent());
    const rc = JSON.parse(request.getContent() || '{}');

    let body = {
        msg: `Hello ${rc.name || 'World'}`
    }

    response.setContent(JSON.stringify(body));
    response.setContentTypeAsJson();
}
```

{: .bs-callout.bs-callout-info }
See [example JS plugins](https://github.com/SoftInstigate/restheart/tree/master/polyglot/src/test/resources)

Just copy the `test-js-plugins` directory into the `plugins` directory to have the JS plugins automatically deployed.

JS plugins can be added or updated without requiring to restart the server, ie v6 supports JS plugins hot deployment.

### Native Image

RESTHeart can be built as native image. See [GraalVM](/docs/graalvm/) documentation page.

Docker image are available for `restheart-native`

```bash
$ docker pull softinstigate:restheart:6.0.0-native
```

## GraphQL

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

## Security

{: .bs-callout.bs-callout-warning }
Breaking change

RESTHeart 6 ships with Extended and Simplified Security.

First of all, the new write mode simplifies the definition of permission, since a `POST` is always an insert while `PUT` and `PATCH` are updates. This makes easier defining permission to allow creating documents or just updating.

The ACL permissions use the undertow predicate language that allows to define the condition a request must met to be authorized. RESTHeart 6 extends this language introducing 8 new predicates.

Some examples can be found [here](https://github.com/SoftInstigate/restheart/blob/master/core/etc/acl.yml)

### secure attribute of @RegisterPlugin

TODO

### new predicates

The following predicates have been introduced:

- `qparams-contain`
- `qparams-blacklist`
- `qparams-blacklist`
- `qparams-size`
- `bson-request-contains`
- `bson-request-whitelist`
- `bson-request-blacklist`

### MongoPermissions

For requests handled by the `MongoService` (i.e. the service that implements the REST API for MongoDB) the permission can specify the `MongoPermission` object.

```yml
mongo:
        allowManagementRequests: true # default false
        allowBulkPatch: true          # default false
        allowBulkDelete: true         # default false
        allowWriteMode: true          # default false
        readFilter: {},
        writeFilter: {}
```

### `mongo.mergeRequest`

TODO

### `mongo.projectResponse`


## Write Mode in MongoDB REST API

{: .bs-callout.bs-callout-warning }
Breaking change

Until v5, all write requests have upsert write mode; v6 changes this and now by default:

- `POST` verb has insert write mode
- `PUT` and `PATCH` verbs have update write mode

The new query parameter `?wm=insert|update|upsert` has been introduced to allow specifying the **w**rite **m**ode

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

## Variables in aggregation and permission

TODO

## Dynamic Change Streams

Change streams definition can be updated without requiring to restart RESTHeart.

## Java 16

{: .bs-callout.bs-callout-warning }
Breaking change

RESTHeart 6 requires Java 16+ or GraalVM 21.1 (JDK 16).

</div>