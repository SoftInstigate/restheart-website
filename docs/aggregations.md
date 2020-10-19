---
title: Aggregations
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [The aggrs collection metadata](#theaggrscollection-metadata)
    -   [aggregation pipeline](#aggregation-pipeline)
    -   [Map-Reduce](#map-reduce)
-   [Examples](#examples)
-   [Materialized Views](#materialized-views)
-   [Passing variables to aggregations](#passing-variables-to-aggregations)
    -   [Variables in stages or query](#variables-in-stages-or-query)
    -   [Variables in map reduce functions](#variables-in-map-reduce-functions)
    -   [Handling paging in aggregations](#handling-paging-in-aggregations)
-   [Security information](#security-informations)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

{: .bs-callout.bs-callout-info}
"Aggregations operations process data records and return computed results. Aggregation operations group values from multiple documents together, and can perform a variety of operations on the grouped data to return a single result."

RESTHeart manages aggregation operations: both *aggregation pipelines*
and _map reduce functions_ are supported.

In both cases only _inline_ output type is supported, i.e. no result is directly
written to the DB server unless the [Materialized Views](#materialized-views) is used.

## The *aggrs* collection metadata

In RESTHeart, not only documents but also dbs and collections have
properties. Some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

Use the collection metadata `aggrs` to define aggregations. `aggrs` is an array of _pipeline_ or *mapReduce *objects:

```http
GET /coll/_meta HTTP/1.1


{
    "aggrs": [
        { <aggregation_1> },
        { <aggregation_2> },
        ...,
        { <aggregation_n> }
    ]
}
```

### Aggregation pipeline

```json
{
    "type":"pipeline",
    "uri": "<uri>",
    "stages": [
        "<stage_1>",
        "<stage_2>",
        "..."
    ],
    "allowDiskUse": true
}
```

<div class="table-responsive">
<table class="ts">
<thead>
<tr class="header">
<th>Property</th>
<th>Description</th>
<th class="text-center">Mandatory</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>type</strong></td>
<td>for aggregation pipeline operations is &quot;pipeline&quot;</td>
<td sclass="text-center">yes</td>
</tr>
<tr class="even">
<td><strong>uri</strong></td>
<td>specifies the URI when the operation is bound under the path <code>/&lt;db&gt;/&lt;collection&gt;/_aggrs</code></td>
<td class="text-center">yes</td>
</tr>
<tr class="odd">
<td><strong>stages</strong></td>
<td><p>the MongoDB aggregation pipeline stages.</p>
<p>For more information refer to <a href="https://docs.mongodb.org/manual/core/aggregation-pipeline/" class="uri">https://docs.mongodb.org/manual/core/aggregation-pipeline/</a></p></td>
<td class="text-center">yes</td>
</tr>
</tbody>
</table>
</div>

To store stages with operators and using the dot notation, RESTHeart
_automatically_ escapes the properties keys because of MongoDB's [Restrictions on Field
Names](https://docs.mongodb.org/manual/reference/limits/#Restrictions-on-Field-Names):

-   the \$ prefix is "underscore escaped", e.g. `$exists` is stored as
    `_$exists`
-   dots are escaped as **::** e.g. `SD.prop` is stored as `SD::prop`

### Map-Reduce

```json
{
    "type": "mapReduce",
    "uri": "<uri>",
    "map": "<map_function>",
    "reduce": "<reduce_function>",
    "query": "<query>"
}
```

<div class="table-responsive">
<table class="ts">
<thead>
<tr class="header">
<th>Property</th>
<th>Description</th>
<th class="text-center">Mandatory</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>type</strong></td>
<td>for aggregation pipeline operations is &quot;mapReduce&quot;</td>
<td class="text-center">yes</td>
</tr>
<tr class="even">
<td><strong>uri</strong></td>
<td>specifies the URI when the operation is bound under /&lt;db&gt;/&lt;collection&gt;/_aggrs path.</td>
<td class="text-center">yes</td>
</tr>
<tr class="odd">
<td><strong>map</strong></td>
<td><p>the map function</p>
<p>For more information refer to <a href="https://docs.mongodb.org/manual/core/map-reduce/" class="uri">https://docs.mongodb.org/manual/core/map-reduce/</a></p></td>
<td class="text-center">yes</td>
</tr>
<tr class="even">
<td>reduce</td>
<td>the reduce function</td>
<td class="text-center">yes</td>
</tr>
<tr class="odd">
<td>query</td>
<td>the filter query</td>
<td class="text-center">no</td>
</tr>
</tbody>
</table>
</div>

## Examples

The following requests upsert a collection defining two aggregation
operations:

-   aggregation operation _test_ap_ bound at
    `/coll/_aggrs/example-pipeline`
-   map reduce operation _test_mr_ bound at
    `/coll/_aggrs/example-mapreduce`

```
PUT /coll HTTP/1.1

{ "aggrs" : [ 
      { "stages" : [ { "$match" : { "name" : { "$var" : "n" } } },
            { "$group" : { "_id" : "$name",
                  "avg_age" : { "$avg" : "$age" }
                } }
          ],
        "type" : "pipeline",
        "uri" : "example-pipeline"
      },
      { "map" : "function() { emit(this.name, this.age) }",
        "query" : { "name" : { "$var" : "n" } },
        "reduce" : "function(key, values) { return Array.avg(values) }",
        "type" : "mapReduce",
        "uri" : "example-mapreduce"
      }
    ] }
```

## Materialized Views

The `$merge` stage for the pipelines delivers the ability to create collections based on an aggregation and update those created collections efficiently, i.e. it just updates the generated results collection rather than rebuild it completely (like it would with the `$out` stage).

It's as simple as adding `$merge` as the last stage of the pipeline.

The following example defines the aggregation `/coll/_aggrs/age-by-gender` that computes average ages grouping data by gender. `$merge` is used as the last stage of the pipeline to write computed data to the `avgAgeByGender` collection.

{: .bs-callout.bs-callout-warning }
Materialized Views are available from MongoDB 4.2.

```
PUT /coll HTTP/1.1

{ "aggrs" : [
    { "stages" : [
        { "$group" : { "_id" : "$gender",  "avg_age" : { "$avg" : "$age" } } },
        { "$merge": { "into": "avgAgeByGender" } }
        ],
            "type" : "pipeline",
            "uri" : "age-by-gender"
        }
    ]
}
```

Executing the aggregation request returns no data, but thanks to the `$merge` stage, the new collection `avgAgeByGender` gets created.

```
GET /coll/_aggrs/avg-by-city HTTP/1.1

HTTP/1.1 200 OK
[]
```

```
GET /avgAgeByGender HTTP/1.1

HTTP/1.1 200 OK
[
    { "_id": "male", "avg_age": 34.5 }
    { "_id": "female", "avg_age": 35.6 }
]
```

## Passing variables to aggregations

The query parameter `avars` allows passing variables to the aggregations.

{: .bs-callout.bs-callout-info}
The value of a variable can be any valid JSON.
The following query parameter passes two variables, a number and an object: `?avars={ "number": 1, "object": {"a": {"json": "object" }} }`

For example, the previous example aggregations both use a variable named
"n". \*If the variable is not passed via the `avars` qparam, the request
fails.

```bash
GET /coll/_aggrs/example-pipeline HTTP/1.1

HTTP/1.1 400 Bad Request
...
{
    "http status code": 400,
    "http status description": "Bad Request",
    "message": "error executing aggreation pipeline: variable n not bound"
}
```

Passing the variable n, the request succeeds:

```
GET /coll/_aggrs/example-pipeline?avars={"n":1} HTTP/1.1

HTTP/1.1 200 OK
...
```

### Variables in stages or query

Variables can be used in aggregation pipeline stages and map reduce
query as follows:

```js
{ "$var": "<var_name>" }
```

In case of map reduce operation previous example, the variable was used
to filter the documents to have the _name_ property matching the
variable _n:_

```js
{
  "query": { "name": { "$var": "n" } },
  ...
}
```

### Variables in map reduce functions

Variables are passed also to *map* and *reduce* javascript functions
where the variable `$vars` can be used. For instance:

```http
PATCH /coll HTTP/1.1

{ "aggrs" : [
     {  "map" : "function() { var minage = JSON.parse($vars).minage; if (this.age > minage ) { emit(this.name, this.age); }; }",
        "reduce" : "function(key, values) { return Array.avg(values) } }",
        "type" : "mapReduce",
        "uri" : "example-mapreduce"
      }
] }

HTTP/1.1 200 Ok
...
```

Note the _map_ function; `JSON.parse($vars)` allows to access the
variables passed with the query parameter `avars`

```js
function() {
 var minage = JSON.parse($vars).minage;// <-- here we get minage from avars qparam
 if (this.age > minage ) { emit(this.name, this.age); }
};
```

## Handling paging in aggregations

Starting from RESTHeart v4.1.8 paging must be handled explicitly by the aggregation (until this version paging was handled automatically). This allows more flexibility and better performances.

Starting from RESTHeart v4.2.0 the following aggregation variables can be used to allow handling paging in the aggregation via default `page` and `pagesize` query parameters:

-   `@page` the value of the `page` query parameter
-   `@pagesize` the value of the `pagesize` query parameter
-   `@skip` to be used in `$skip` stage, equals to `(page-1)*pagesize`
-   `@limit` to be used in `$limit` stage, equals to the value of the `pagesize` query parameter

For example, the following defines the aggregation `/aggrs/paging` that uses the `@skip` and `@limit` variables. As a result, the request `GET /coll/_aggrs/paging?page=3&pagesize=25` skips 50 documents, returning the following 25 documents.

```json
{
    "aggrs": [
        {
            "uri": "paging",
            "type": "pipeline",
            "stages": [
                {
                    "$skip": {
                        "$var": "@skip"
                    }
                },
                {
                    "$limit": {
                        "$var": "@limit"
                    }
                }
            ]
        }
    ]
}
```

### Security Informations

By default RESTHeart makes sure that the aggregation variables passed as query parameters don't include MongoDB operators.

This behavior is required to protect data from undesirable malicious query injection.

Even though is highly discouraged, is possible to disable this check by editing the following property in the `restheart.yml` configuration file.

```yml
### Security

# Check if aggregation variables use operators. allowing operators in aggregation variables
# is risky. requester can inject operators modifying the query

aggregation-check-operators: true
```

</div>
