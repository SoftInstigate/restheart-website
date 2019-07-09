---
layout: docs
title: Representation Format
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
- [Standard Representation](#standard-representation)
- [BSON types](#bson-types)
- [Get the names of existing collections](#get-the-names-of-existing-collections)
- [HAL](#hal)
    - [Example](#example)
    - [Properties](#properties)
    - [Documents as embedded resources](#documents-as-embedded-resources)
    - [Links](#links)
    - [Hal mode](#hal-mode)
- [Simplified HAL](#simplified-hal)
</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

RESTHeart has three different options for representing the resources:`STANDARD`, `HAL` and `SHAL` (Simplified HAL). 

The default representation is controlled by the configuration option `default-representation-format` .

``` yml
default-representation-format: STANDARD
```

The `rep` query parameter can also be used for switching between representations.

``` bash
> GET /inventory?rep=s
> GET /inventory?rep=hal
> GET /inventory?rep=shal
```

## Standard Representation

{: .bs-callout.bs-callout-warning }
Starting with RESTHeart v4 this is the default representation format.

In the following response the documents of the collection `inventory` are returned as an array of JSON documents.

``` bash
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

 Execute the following query to retrieve the metadata of the collection *inventory*:

``` bash
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

## BSON types

MongoDB uses the [BSON](https://en.wikipedia.org/wiki/BSON) data format
which type system is a superset of JSON’s. To preserve type information,
MongoDB adds this extension to the JSON.

For instance, the `_id` of the following JSON document is an ObjectId.

``` plain
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

``` bash
> GET /inventory?filter={'_id':'5d0b4e325beb2029a8d1bd5e'}
```

The correct request is: 

``` bash
> GET /inventory?filter={'_id':{'$oid':'5d0b4e325beb2029a8d1bd5e'}}
```

## Get the names of existing collections

To get the names of the collections of the database `restheart` (the default configuration binds `/` to this database).

``` bash
> GET /

<
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

<pre><code># The MongoDb resource to bind to the root URI / 
# The format is /db[/coll[/docid]] or '*' to expose all dbs
root-mongo-resource = /restheart</code></pre>

With <code>root-mongo-resource = '*'</code>, the request <code>GET /</code> returns the names of existing <i>databases</i>.
</div>

## HAL

[HAL](http://stateless.co/hal_specification.html) up on 2 simple concepts: **Resources** and **Links**

-   **Resources** have state (plain JSON), embedded resources and links
-   **Links** have target (href URI) and relations (aka rel)

![](/images/info-model.png){: width="800" height="600" class="img-responsive"}

## Example

We’ll get the `inventory` collection resource and analyze it. 
A collection represented with `HAL` has its own *properties*, *embedded resources* (in this case, documents) and *link templates* (for pagination, sorting, etc).

``` bash
> GET /inventory?rep=hal

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

{: .table.table-responsive}
| Property       | Description                                                                                             |
|----------------|---------------------------------------------------------------------------------------------------------|
| `_type`        | the type of this resource. in this case ‘COLLECTION’ (only returned on hal full mode)                   |
| `_id`          | the name of the collection                                                                              |
| `_etag`        | entity tag, used for caching and to avoid ghost writes.                                                 |
| `_returned`    | the number of the documents embedded in this representation                                             |

## Documents as embedded resources

Collection's embedded resources are the collection documents,
recursively represented as HAL documents.

The `_embedded` property looks like:

``` json
{ "_embedded": 
  { "rh:doc": [{
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
  ]}
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

``` bash
> GET /inventory?rep=shal

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