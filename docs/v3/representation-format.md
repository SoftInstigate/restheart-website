---
title: Representation Format
layout: docs
---

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

Each resource has its **properties** and **embedded** resources.
Dbs embed collections that embed documents.

RESTHeart has two different options for representing the resources: `plain JSON` and `HAL`. The default representation is controlled with `default-representation-format` configuration option.

``` yml
#### default representation format (PLAIN_JSON or HAL)
default-representation-format: PLAIN_JSON
```

The `rep` query parameter can also be used.

``` plain
GET /db/coll?rep=hal
GET /db/coll?rep=pj
```

## Plain JSON Representation

In the following response the collection /db/coll has the properties *_id*, *_etag* *prop* and two embedded documents and the special property *_returned*

``` bash
GET /db/coll
HTTP/1.1 200 OK
```
``` json
{
    "_embedded": [
        {
            "_etag": {
                "$oid": "5ac9f96063445900062144ac"
            },
            "_id": {
                "$oid": "5ac9f960913b07543c0085ec"
            },
            "a": 2
        },
        {
            "_etag": {
                "$oid": "5ac9f95f63445900062144ab"
            },
            "_id": {
                "$oid": "5ac9f95f913b07543c0085e7"
            },
            "a": 1
        }
    ],
    "_id": "coll",
    "prop": "foo",
    "_etag": {
        "$oid": "5aca45626344590007ecbda5"
    },
    "_returned": 2
}
```

When the request specifies the `np` query parameter (that stands for **N**o **P**roperties), the response body is the array of embedded resources and does not include the resource properties.

``` plain
GET /db/coll?np

[
    {
        "_etag": {
            "$oid": "5ac9f96063445900062144ac"
        },
        "_id": {
            "$oid": "5ac9f960913b07543c0085ec"
        },
        "a": 2
    },
    {
        "_etag": {
            "$oid": "5ac9f95f63445900062144ab"
        },
        "_id": {
            "$oid": "5ac9f95f913b07543c0085e7"
        },
        "a": 1
    }
]

```

## HAL Representation

* [Hypermedia Application Language](#hypermedia-application-language)
* [Strict mode representations of BSON](#strict-mode-representations-of-bson)
* [Hal mode](#hal-mode)
* [Examples](#examples)
* [Properties](#properties)
* [Embedded resources](#embedded-resources)
* [Links](#links)

Following the REST mantra, you *transfer* resource *states* back and
forth by the means of *representations*.

This section introduces you with the resource **representation** format
used by RESTHeart.

### Hypermedia Application Language

RESTHeart uses
the [HAL+json](http://stateless.co/hal_specification.html) hypermedia
format. HAL stands for *Hypermedia Application Language* and it is
simple, elegant and powerful.

HAL builds up on 2 simple concepts: **Resources** and **Links**

-   **Resources** have state (plain JSON), embedded resources and links
-   **Links** have target (href URI) and relations (aka rel)

![](/images/info-model.png){: width="800" height="600" class="img-responsive"}

## Strict mode representations of BSON

**RESTHeart** represents the state of MongoDB resources using
the [strict mode representations of
BSON](https://docs.mongodb.org/manual/reference/mongodb-extended-json/) that
conforms to the [JSON RFC](https://www.json.org/). 

MongoDB uses the [BSON](https://en.wikipedia.org/wiki/BSON) data format
which type system is a superset of JSON’s. To preserve type information,
MongoDB adds this extension to the JSON.

For instance, the following JSON document includes an ObjectId and a
Date. These types are supported by BSON and represented with JSON
according to the ‘strict mode’.

``` json
{
    "_id": {
        "$oid": "546b2dcdef863f5121fc91f3"
    },
    "date": {
        "$date": 1
    },
    "pi": 3.1415
}
```

**Note**: the strict mode is used on both request and response resource
representation and also on filter query parameters.

This filter request, won’t find the document
*/db/coll/546b2dcdef863f5121fc91f3* since the \_id field is an ObjectId
and not a String.

``` plain
GET /db/coll?filter={'_id':'546b2dcdef863f5121fc91f3'}
```

The correct request is: 

``` plain
GET /db/coll?filter={'_id':{'$oid':'546b2dcdef863f5121fc91f3'}}
```

### Hal mode

HAL mode is available starting version 1.1

The query parameter *hal* controls the verbosity of the representation.
Valid values are *c* (for compact) and *f* (for full); the default value
(if the param is omitted) is compact mode.

When hal=f is specified, the representation is more verbose and includes
special properties (such as *\_type* and *\_lastupdated\_on*), link
templates and curies (links to API documentation).

### Examples

We’ll get a collection resource and analyze it. As any other in
RESTHeart, a collection resource is represented with HAL; thus has its
own *properties*, *embedded resources* (in this case, documents) and
*link templates* (for pagination, sorting, etc).

``` plain
GET 127.0.0.1:8080/db/coll?count
```

**Response** 

``` bash
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 252
Content-Type: application/hal+json
Date: Tue, 08 Mar 2016 13:39:20 GMT
ETag: 56ded2b22d174c2a08cdee83
X-Powered-By: restheart.org

{
    "_embedded": {
        "rh:doc": [
            {
                "_etag": {
                    "$oid": "56ded2ee2d174c2a08cdee85"
                }, 
                "_id": {
                    "$oid": "56ded2eead66b2a1e741c054"
                }, 
                "name": "mongodb", 
                "rating": "hyper cool"
            }, 
            {
                "_etag": {
                    "$oid": "56ded2d42d174c2a08cdee84"
                }, 
                "_id": {
                    "$oid": "56ded2d4ad66b2a1e741c053"
                }, 
                "name": "restheart", 
                "rating": "super cool"
            }
        ]
    }, 
    "_etag": {
        "$oid": "56ded2b22d174c2a08cdee83"
    }, 
    "_id": "coll", 
    "_returned": 2, 
    "_size": 2, 
    "_total_pages": 1, 
    "desc": "this is my first collection created with restheart"
}
```

### Properties

In this case, the collection properties comprise the field *desc*; this
is user defined.

The other fields are reserved properties (i.e. are managed automatically
by RESTHeart for you); these always starts with \_:

{: .ts}
| Property       | Description                                                                                             |
|----------------|---------------------------------------------------------------------------------------------------------|
| `_type`        | the type of this resource. in this case ‘COLLECTION’ (only returned on hal full mode)                   |
| `_id`          | the name of the collection                                                                              |
| `_etag`        | entity tag, used for caching and to avoid ghost writes.                                                 |
| `_size`        | the number of the documents in the collection (only returned if the count query parameter is specified) |
| `_total_pages` | the number of the pages (only returned if the count query parameter is specified)                       |
| `_returned`    | the number of the documents embedded in this representation                                             |

``` json
{
    "_etag": {
        "$oid": "56ded2b22d174c2a08cdee83"
    }, 
    "_id": "coll", 
    "_returned": 2, 
    "_size": 2, 
    "_total_pages": 1, 
    "desc": "this is my first collection created with restheart"
}
```

## Embedded resources

Collection's embedded resources are the collection documents,
recursively represented as HAL documents.

The `_embedded property looks like:`

``` json
"_embedded": {
        "rh:doc": [
            {
                "_etag": {
                    "$oid": "56ded2ee2d174c2a08cdee85"
                }, 
                "_id": {
                    "$oid": "56ded2eead66b2a1e741c054"
                }, 
                "name": "mongodb", 
                "rating": "hyper cool"
            }, 
            {
                "_etag": {
                    "$oid": "56ded2d42d174c2a08cdee84"
                }, 
                "_id": {
                    "$oid": "56ded2d4ad66b2a1e741c053"
                }, 
                "name": "restheart", 
                "rating": "super cool"
            }
        ]
    }
```

### Links

\_links are only returned on HAL full mode. The only exception are with
[relationships](/docs/v3/relationships). If a collection defines a relationship,
the representation of the documents always include the links to related
data.
<div class="table-responsive">
<table class="ts">
<colgroup>
<col class="w-50" />
<col class="w-50" />
</colgroup>
<thead>
<tr class="header">
<th>Link</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>self</code></td>
<td>link to itself</td>
</tr>
<tr class="even">
<td><code>first</code></td>
<td>link to the first page</td>
</tr>
<tr class="odd">
<td><code>last</code></td>
<td>link to the last page</td>
</tr>
<tr class="even">
<td><code>rh:db</code></td>
<td>templated link for db</td>
</tr>
<tr class="odd">
<td><code>rh:coll</code></td>
<td>templated link for collection</td>
</tr>
<tr class="even">
<td><code>rh:document</code></td>
<td>templated link for document</td>
</tr>
<tr class="odd">
<td><code>rh:filter</code></td>
<td>templated link for filtering</td>
</tr>
<tr class="even">
<td><code>rh:sort</code></td>
<td>templated link for sorting</td>
</tr>
<tr class="odd">
<td><code>rh:indexes</code></td>
<td>link to the collection indexes resource</td>
</tr>
<tr class="even">
<td><code>rh:paging</code></td>
<td>templated link for paging</td>
</tr>
<tr class="odd">
<td><code>curies</code></td>
<td><p>(compacts URIes) bind links to documentation. For instance the rh:db rel is documented at <a href="#" class="uri">https://restheart.org/curies/2.0/db.html</a></p></td>
</tr>
</tbody>
</table>
</div>
The `_links` property looks like:

``` json
"_links": {
        "curies": [
            {
                "href": "https://restheart.org/curies/2.0/{rel}.html", 
                "name": "rh", 
                "templated": true
            }
        ], 
        "first": {
            "href": "/db/coll?pagesize=100&count&hal=f"
        }, 
        "last": {
            "href": "/db/coll?pagesize=100&count&hal=f"
        }, 
        "rh:coll": {
            "href": "/db/{collname}", 
            "templated": true
        }, 
        "rh:db": {
            "href": "/db"
        }, 
        "rh:document": {
            "href": "/db/coll/{docid}{?id_type}", 
            "templated": true
        }, 
        "rh:filter": {
            "href": "/db/coll{?filter}", 
            "templated": true
        }, 
        "rh:indexes": {
            "href": "/db/coll/_indexes"
        }, 
        "rh:paging": {
            "href": "/db/coll{?page}{&pagesize}", 
            "templated": true
        }, 
        "rh:sort": {
            "href": "/db/coll{?sort_by}", 
            "templated": true
        }, 
        "self": {
            "href": "/db/coll?count&hal=f"
        }
    }
```

</div>
