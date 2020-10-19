---
title: Representation Format
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Standard Representation](#standard-representation)
    -   [Json Mode](#json-mode)
-   [BSON types](#bson-types)
-   [Get the names of existing collections](#get-the-names-of-existing-collections)
-   [HAL](#hal)
    -   [Example](#example)
    -   [Properties](#properties)
    -   [Documents as embedded resources](#documents-as-embedded-resources)
    -   [Links](#links)
    -   [Hal mode](#hal-mode)
-   [Simplified HAL](#simplified-hal)
</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

RESTHeart has three different options for representing the resources:`STANDARD`, `HAL` and `SHAL` (Simplified HAL).

The default representation is controlled by the configuration option `default-representation-format` .

```properties
default-representation-format: STANDARD
```

The `rep` query parameter can also be used for switching between representations.

```http
GET /inventory?rep=s HTTP/1.1
```

```http
GET /inventory?rep=hal HTTP/1.1
```

```http
GET /inventory?rep=shal HTTP/1.1
```

## Standard Representation

{: .bs-callout.bs-callout-warning }
Starting with RESTHeart v4 this is the default representation format.

In the following response the documents of the collection `inventory` are returned as an array of JSON documents.

{% include code-header.html
    type="Request"
%}

```http
GET /inventory HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 200 OK

...

[
  {
    "_id": {
      "$oid": "5d0b4dff2ec9ff0d92ddc2b7"
    },
    "_etag": {
      "$oid": "5d0b4dff2ec9ff0d92ddc2b2"
    },
    "item": "postcard",
    "qty": 45,
    "size": {
      "h": 10,
      "w": 15.25,
      "uom": "cm"
    },
    "status": "A"
  },

  ...

]
```

Execute the following query to retrieve the metadata of the collection _inventory_:

{% include code-header.html
    type="Request"
%}

```http
GET /inventory/_meta HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 200 OK

...

{
    "_etag": {
        "$oid": "5d1e13dbdde87c62e98a4595"
    },
    "_id": "_meta",
    "meta_field": "metadata_value"
    ...
}

```

### JSON Mode

{: .alert.alert-info}
JSON Mode is available from RESTHeart v4.1

JSON can only directly represent a subset of the types supported by BSON. To preserve type information, RESTHeart adds the following extensions to the JSON format.

The query parameter `jsonMode` allows to specify the JSON Mode

{: .table.table-responsive}
|jsonMode|Description|
|-|-|
|none|Standard RESTHeart representation|
|STRICT|JSON representation with type information for specific cases|
|EXTENDED|Extended JSON representation with full type information|
|RELAXED|Standard relaxed extended JSON representation|
|SHELL|This output mode will attempt to produce output that corresponds to what the MongoDB shell actually produces when showing query results|

#### Standard RESTHeart representation

```http
GET locahost:8080/coll/5d7a4b59cf6eeb5fb1686613 HTTP/1.1

{
    "_etag": {
        "$oid": "5d7a4f10af0e1b77a7731d05"
    },
    "_id": {
        "$oid": "5d7a4b59cf6eeb5fb1686613"
    },
    "a": 1,
    "b": 1.0,
    "big": 1568295769260,
    "timestamp": {
        "$date": 1568295769260
    }
}
```

#### Strict representation

```http
GET locahost:8080/coll/5d7a4b59cf6eeb5fb1686613?jsonMode=strict HTTP/1.1

HTTP/1.1 200 OK

{
    "_etag": {
        "$oid": "5d7a4f10af0e1b77a7731d05"
    },
    "_id": {
        "$oid": "5d7a4b59cf6eeb5fb1686613"
    },
    "a": 1,
    "b": 1.0,
    "big": {
        "$numberLong": "1568295769260"
    },
    "timestamp": {
        "$date": 1568295769260
    }
}
```

#### Extended representation

```http
GET locahost:8080/coll/5d7a4b59cf6eeb5fb1686613?jsonMode=extended HTTP/1.1

HTTP/1.1 200 OK

{
    "_etag": {
        "$oid": "5d7a4f10af0e1b77a7731d05"
    },
    "_id": {
        "$oid": "5d7a4b59cf6eeb5fb1686613"
    },
    "a": {
        "$numberInt": "1"
    },
    "b": {
        "$numberDouble": "1.0"
    },
    "big": {
        "$numberLong": "1568295769260"
    },
    "timestamp": {
        "$date": {
            "$numberLong": "1568295769260"
        }
    }
}
```

#### Relaxed representation

```http
GET locahost:8080/coll/5d7a4b59cf6eeb5fb1686613?jsonMode=relaxed HTTP/1.1

HTTP/1.1 200 OK

{
    "_etag": {
        "$oid": "5d7a6c61bd8a0d69516bbf55"
    },
    "_id": {
        "$oid": "5d7a4b59cf6eeb5fb1686613"
    },
    "a": 1,
    "b": 1.0,
    "big": 1568295769260,
    "timestamp": {
        "$date": "2019-09-12T13:42:49.26Z"
    }
}
```

#### Shell representation

{: .bs-callout.bs-callout-success }
SHELL JSON Mode is very useful since it **allows to use the response body directly in the mongoshell!**

```http
GET locahost:8080/coll/5d7a4b59cf6eeb5fb1686613?jsonMode=shell HTTP/1.1

HTTP/1.1 200 OK

Content-Type: application/javascript

{"_id":ObjectId("5d7a4b59cf6eeb5fb1686613"),"_etag":ObjectId("5d7a6d13bd8a0d69516bbf56"),"timestamp":ISODate("2019-09-12T13:42:49.260Z"),"a":1,"b":1.0,"big":NumberLong("1568295769260"),"verybig":NumberLong("5887391606")}
```

## BSON types

MongoDB uses the [BSON](https://en.wikipedia.org/wiki/BSON) data format
which type system is a superset of JSON’s. To preserve type information,
MongoDB adds this extension to the JSON.

For instance, the `_id` of the following JSON document is an ObjectId.

```json
  {
    "_id": {
      "$oid": "5d0b4e325beb2029a8d1bd5e"
    },
    "item": "paper"

    ...
  }
```

{: .bs-callout.bs-callout-info }
The strict mode is used on both request and response resource representation and also on the query parameter `filter`

The following `filter` won’t find the document since the `_id` is an ObjectId (and not a String).

{% include code-header.html
    type="Request"
%}

```http
GET /inventory?filter={'_id':'5d0b4e325beb2029a8d1bd5e'} HTTP/1.1
```

The correct request is:

{% include code-header.html
    type="Request"
%}

```http
GET /inventory?filter={'_id':{'$oid':'5d0b4e325beb2029a8d1bd5e'}} HTTP/1.1
```

## Get the names of existing collections

To get the names of the collections of the database `restheart` (the default configuration binds `/` to this database).

{% include code-header.html
    type="Request"
%}

```http
GET / HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 200 OK

...

[
  "inventory",
  "chat",
  "files.bucket"
]
```

<div class="bs-callout bs-callout-info">
<p>
The <code>root-mongo-resource</code> property is set in <code>default.properties</code>
</p>

<pre class="black-code"><code># The MongoDB resource to bind to the root URI / 
# The format is /db[/coll[/docid]] or '*' to expose all dbs
root-mongo-resource = /restheart</code></pre>

With <code>root-mongo-resource = '\*'</code>, the request <code>GET /</code> returns the names of existing <i>databases</i>.

</div>

## HAL

[HAL](http://stateless.co/hal_specification.html) up on 2 simple concepts: **Resources** and **Links**

-   **Resources** have state (plain JSON), embedded resources and links
-   **Links** have target (href URI) and relations (aka rel)

![](/images/info-model.png){: width="800" height="600" class="img-responsive"}

## Example

We’ll get the `inventory` collection resource and analyze it.
A collection represented with `HAL` has its own _properties_, *embedded resources* (in this case, documents) and _link templates_ (for pagination, sorting, etc).

{% include code-header.html
    type="Request"
%}

```http
GET /inventory?rep=hal HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 200 OK

Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 384
Content-Type: application/hal+json
Date: Mon, 08 Jul 2019 12:56:14 GMT
ETag: 5d233840dd860b259a3bad45
X-Powered-By: restheart.org

{
   "_id":"inventory",
   "_etag":{
      "$oid":"5d233840dd860b259a3bad45"
   },
   "metadata_field": "metadata_value",
   "_returned": 6,
   "_embedded":{
      "rh:doc":[
         {
            "_id":{
               "$oid":"5d233aeb93dc53162739e172"
            },
            "_etag":{
               "$oid":"5d233aeb93dc53162739e16d"
            },
            "item":"postcard",
            "qty":45,
            "size":{
               "h":10,
               "w":15.25,
               "uom":"cm"
            },
            "status":"A"
         },
        ...
      ]
   }
}
```

### Properties

In this case, the collection properties comprise the field *metadata_field*; this
is user defined.

The other fields are reserved properties (i.e. are managed automatically
by RESTHeart for you); these always starts with \_:

{: .table.table-responsive}
| Property | Description |
|----------------|---------------------------------------------------------------------------------------------------------|
| `_type` | the type of this resource. in this case ‘COLLECTION’ (only returned on hal full mode) |
| `_id` | the name of the collection |
| `_etag` | entity tag, used for caching and to avoid ghost writes. |
| `_returned` | the number of the documents embedded in this representation |

## Documents as embedded resources

Collection's embedded resources are the collection documents,
recursively represented as HAL documents.

The `_embedded` property looks like:

```json
{
    "_embedded": {
        "rh:doc": [
            {
                "_id": {
                    "$oid": "5d233aeb93dc53162739e172"
                },
                "_etag": {
                    "$oid": "5d233aeb93dc53162739e16d"
                },
                "item": "postcard",
                "qty": 45,
                "size": {
                    "h": 10,
                    "w": 15.25,
                    "uom": "cm"
                },
                "status": "A"
            },
            {
                "_id": {
                    "$oid": "5d233aeb93dc53162739e171"
                },
                "_etag": {
                    "$oid": "5d233aeb93dc53162739e16d"
                },
                "item": "planner",
                "qty": 75,
                "size": {
                    "h": 22.85,
                    "w": 30,
                    "uom": "cm"
                },
                "status": "D"
            }
        ]
    }
}
```

### Links

<div class="anchor-offset" id="dot-notation">
</div>

<div class="bs-callout bs-callout-info mt-3" role="alert">
    <p>
    <code>_links</code> are only returned on <strong>hal full mode</strong>. The only exception are with
    <a href="{{ "../mgmt/relationships" | prepend: site.baseurl }}">relationships</a>. If a collection defines a relationship,
    the representation of the documents always include the links to related
    data.
    </p>
</div>

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

```json
{ "_links": {
  "self": {
    "href": "/inventory?hal=f"
  },
  "first": {
    "href": "/inventory?pagesize=100&hal=f"
  },
  "next": {
    "href": "/inventory?page=2&pagesize=100&hal=f"
  },
  "rh:coll": {
    "href": "//{collname}",
    "templated": true
  },
  "rh:document": {
    "href": "/inventory/{docid}{?id_type}",
    "templated": true
  },
  "rh:indexes": {
    "href": "/inventory/_indexes"
  },
  "rh:filter": {
    "href": "/inventory{?filter}",
    "templated": true
  },
  "rh:sort": {
    "href": "/inventory{?sort_by}",
    "templated": true
  },
  "rh:paging": {
    "href": "/inventory{?page}{&pagesize}",
    "templated": true
  }
}
```

<div class="anchor-offset" id="hal-mode">
</div>

### HAL Mode

The query parameter `hal` controls the verbosity of HAL representation.
Valid values are `hal=c` (for compact) and `hal=f` (for full); the default value
(if the param is omitted) is compact mode.

When `hal=f` is specified, the representation is more verbose and includes special properties (such as links).

## Simplified HAL

{: .bs-callout.bs-callout-info }
Up to RESTHeart 3.x SHAL was also called `PLAIN_JSON`

In the following response the collection /inventory has the properties `_id`, `_etag`, `metadata_field` and two embedded documents and the special property `_returned`

{% include code-header.html
    type="Request"
%}

```http
GET /inventory?rep=shal HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 200 OK

...

{
  "_embedded": [
    {
      "_id": {
        "$oid": "5d0b4dff2ec9ff0d92ddc2b7"
      },
      "_etag": {
        "$oid": "5d0b4dff2ec9ff0d92ddc2b2"
      },
      "item": "postcard",
      "qty": 45,
      "size": {
        "h": 10,
        "w": 15.25,
        "uom": "cm"
      },
      "status": "A"
    }
  ],
  "_id": "inventory",
  "_etag": {
    "$oid": "5d1e13dbdde87c62e98a4595"
  },
  "metadata_field": "metadata_value",
  "_returned": 6
}
```

</div>
