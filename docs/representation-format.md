---
layout: docs
title: Representation Format
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
- [Standard Representation](#standard-representation)
    - [GET request on Database](#get-on-db)
- [SHAL Representation](#simplified-hal-json-representation)
- [HAL Representation](#hal-representation)
    - [Hypermedia Application Language](#hypermedia-application-language)
    - [Strict mode representations of BSON](#strict-mode-representations-of-bson)
    - [Hal mode](#hal-mode)
    - [Examples](#examples)
    - [Properties](#properties)
    - [Embedded resources](#embedded-resources)
    - [Links](#links)
</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}



## Introduction

RESTHeart has three different options for representing the resources:`STANDARD`, `HAL` and `Simplified-HAL`. The default representation is controlled with `default-representation-format` configuration option.

``` yml
## PLAIN_JSON or HAL are aliases for SHAL
## S is an alias for STANDARD
default-representation-format: STANDARD
```

The `rep` query parameter can also be used for switching between representations.

``` plain
GET /inventory?rep=hal
GET /inventory?rep=shal
```

## Standard Representation

{: .bs-callout.bs-callout-warning }
RESTHeart adopts this representation format by default

In the following response the collection's documents are returned as an array of JSON objects.

``` plain
> GET /inventory

<
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

For retrieving metadata associated to the collection perform the following query:

``` plain
> GET /inventory/_meta

<
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

<div class="anchor-offset" id="get-on-db">
</div>

<div class="bs-callout bs-callout-info mt-3" role="alert">
    <h4>GET request on a Database</h4>
    <hr class="my-2">
    <p>
        Performing a GET request to the root path <code>/</code> results in a response with an array of strings containing a list of ids associated to the stored collections into the DB.
    </p>
    <pre><code class="language-plain">&gt; GET /

&lt;
HTTP/1.1 200 OK
...

[
  "inventory",
  "chat",
  "service_1",
  ...
]

</code></pre>
<p class="alert alert-info">
    If RESTHeart is not mounted to the <code>restheart</code> db (done by default), the query above will return an array of string with an id list of all databases on the server.
</p>

</div>

## Simplified HAL JSON Representation

In the following response the collection /inventory has the properties `_id`, `_etag`, `metadata_field` and two embedded documents and the special property `_returned`

``` plain
> GET /inventory

<
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
    },
    ...
  ],
  "_id": "inventory",
  "_etag": {
    "$oid": "5d1e13dbdde87c62e98a4595"
  },
  "metadata_field": "metadata_value",
  "_returned": 6
}
```

## HAL Representation

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

<div class="anchor-offset" id="hal-mode">
</div>

<div class="bs-callout bs-callout-info" role="alert">
    <h4>Hal Mode</h4>
    <hr class="my-2">
    <p>
    The query parameter <i>hal</i> controls the verbosity of HAL representation.
    Valid values are <code>hal=c</code> (for compact) and <code>hal=f</code> (for full); the default value
    (if the param is omitted) is compact mode.
    </p>
    <p>
    When <code>hal=f</code> is specified, the representation is more verbose and includes
    special properties (such as links).
    </p>
</div>

## Strict mode representations of BSON

**RESTHeart** represents the state of MongoDb resources using
the [strict mode representations of
BSON](https://docs.mongodb.org/manual/reference/mongodb-extended-json/) that
conforms to the [JSON RFC](https://www.json.org/). 

MongoDB uses the [BSON](https://en.wikipedia.org/wiki/BSON) data format
which type system is a superset of JSON’s. To preserve type information,
MongoDB adds this extension to the JSON.

For instance, the following JSON document includes an ObjectId. 
These types are supported by BSON and represented with JSON according to the ‘strict mode’.

``` plain
  {
    "_id": {
      "$oid": "5d0b4e325beb2029a8d1bd5e"
    },
    "item": "paper"

    ...
  }
```

<div class="bs-callout bs-callout-info mt-3" role="alert">
    <p>
    <strong>The strict mode is used on both request and response resource
    representation and also on filter query parameters.</strong>
    </p>
    <p>
    This filter request, won’t find the document
    <code>/inventory/5d0b4e325beb2029a8d1bd5e</code> since the <code>_id</code> field is an ObjectId
    and not a String.
    </p>
    <pre><code class="language-plain">&gt; GET /inventory?filter={'_id':'5d0b4e325beb2029a8d1bd5e'}
</code></pre>
    <p>
    The correct request is: 
    </p>
    <pre><code class="language-plain">&gt; GET /inventory?filter={'_id':{'$oid':'5d0b4e325beb2029a8d1bd5e'}}
</code></pre>
</div>

### Examples

We’ll get the `inventory` collection resource and analyze it. 
As any other in RESTHeart, a collection resource is represented with HAL; thus has its
own *properties*, *embedded resources* (in this case, documents) and
*link templates* (for pagination, sorting, etc).

``` plain
> GET /inventory

<
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

{: .ts}
| Property       | Description                                                                                             |
|----------------|---------------------------------------------------------------------------------------------------------|
| `_type`        | the type of this resource. in this case ‘COLLECTION’ (only returned on hal full mode)                   |
| `_id`          | the name of the collection                                                                              |
| `_etag`        | entity tag, used for caching and to avoid ghost writes.                                                 |
| `_returned`    | the number of the documents embedded in this representation                                             |


## Embedded resources

Collection's embedded resources are the collection documents,
recursively represented as HAL documents.

The `_embedded` property looks like:

``` json
"_embedded": {
        "rh:doc": [
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
         {
            "_id":{
               "$oid":"5d233aeb93dc53162739e171"
            },
            "_etag":{
               "$oid":"5d233aeb93dc53162739e16d"
            },
            "item":"planner",
            "qty":75,
            "size":{
               "h":22.85,
               "w":30,
               "uom":"cm"
            },
            "status":"D"
         },
         ...
        ]
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
<td><p>(compacts URIes) bind links to documentation. For instance the rh:db rel is documented at <a href="https://restheart.org/curies/2.0/db.html" class="uri">https://restheart.org/curies/2.0/db.html</a></p></td>
</tr>
</tbody>
</table>
</div>
The `_links` property looks like:

``` json
"_links":   {  
        "self":{  
            "href":"/inventory?hal=f"
        },
        "first":{  
            "href":"/inventory?pagesize=100&hal=f"
        },
        "next":{  
            "href":"/inventory?page=2&pagesize=100&hal=f"
        },
        "rh:coll":{  
            "href":"//{collname}",
            "templated":true
        },
        "rh:document":{  
            "href":"/inventory/{docid}{?id_type}",
            "templated":true
        },
        "rh:indexes":{  
            "href":"/inventory/_indexes"
        },
        "rh:filter":{  
            "href":"/inventory{?filter}",
            "templated":true
        },
        "rh:sort":{  
            "href":"/inventory{?sort_by}",
            "templated":true
        },
        "rh:paging":{  
            "href":"/inventory{?page}{&pagesize}",
            "templated":true
        }
   }
```

</div>
