---
layout: docs
title: Aggregations
---

* [Introduction](#introduction)
* [The aggrs collection metadata](#theaggrscollection-metadata)
    * [aggragation pipeline metadata object format](#aggragation-pipeline-metadata-object-format)
    * [mapReduce metadata object format](#mapreduce-metadata-object-format)
* [Examples](#examples)
* [Passing variables to aggregation operations](#passing-variables-to-aggregation-operations)
    * [Variables in stages or query](#variables-in-stages-or-query)
    * [Variables in map or reduce functions](#variables-in-map-or-reduce-functions)

## Introduction

RESTHeart manages aggregation operations: both *aggregation pipelines*
and *map reduce functions *are supported.

> "Aggregations operations process data records and return computed
> results. Aggregation operations group values from multiple documents
> together, and can perform a variety of operations on the grouped data
> to return a single result."

In both cases only *inline* output type is supported, i.e. no result is
written to the DB server.    

## The *aggrs* collection metadata

In RESTHeart, not only documents but also dbs and collections have
properties. Some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

The collection metadata property `aggrs` allows to declare aggregation
operations and bind them to given URI.

Aggregation operations need to be defined as collection metadata. It is
not possible to execute an aggregation via a query parameter and this is
by design: clients are not able to execute arbitrary aggregation
operations but only those defined (and tested) by the developers.

`aggrs` is an array of *pipeline* or *mapReduce *objects.

### aggragation pipeline metadata object format

**pipeline object format**

``` json
{
    "type":"pipeline",
    "uri": <uri>,
    "stages": [
        "<stage_1>",
        "<stage_2>",
        ...
    ]
}
```

<table>
<thead>
<tr class="header">
<th>Property</th>
<th>Description</th>
<th style="text-align: center;">Mandatory</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>type</strong></td>
<td>for aggregation pipeline operations is &quot;pipeline&quot;</td>
<td style="text-align: center;">yes</td>
</tr>
<tr class="even">
<td><strong>uri</strong></td>
<td>specifies the URI when the operation is bound under the path <code>/&lt;db&gt;/&lt;collection&gt;/_aggrs</code></td>
<td style="text-align: center;">yes</td>
</tr>
<tr class="odd">
<td><strong>stages</strong></td>
<td><p>the MongoDB aggregation pipeline stages.</p>
<p>For more information refer to <a href="https://docs.mongodb.org/manual/core/aggregation-pipeline/" class="uri">https://docs.mongodb.org/manual/core/aggregation-pipeline/</a></p></td>
<td style="text-align: center;">yes</td>
</tr>
</tbody>
</table>

MongoDB does not allow to store fields with names starting with $ or
containing *dots* (.), see [Restrictions on Field
Names](https://docs.mongodb.org/manual/reference/limits/#Restrictions-on-Field-Names)
on MongoDB documentation.

In order to allow storing stages with dollar prefixed operators or using
the dot notation (to refer to properties of subdocuments), RESTHeart
*automatically* and *transparently* escapes the properties keys as
follows:

-   the $ prefix is "underscore escaped", e.g. `$exists` is stored as
    `_$exists`
-   if the dot notation has to be used in a key name, dots are replaced
    with **::** e.g. `SD.prop` is stored as `SD::prop`

In RESTHeart 1.x, these escapes are not managed automatically: the
developer had to explicitly use them; starting from version 2.0 this is
not needed anymore.

### mapReduce metadata object format

**mapReduce object format**

``` json
{
    "type":"mapReduce",
    "uri":"<uri>",
    "map": "<map_function>",
    "reduce": "<reduce_function>",
    "query": "<query>"
}
```

<table>
<thead>
<tr class="header">
<th>Property</th>
<th>Description</th>
<th style="text-align: center;">Mandatory</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>type</strong></td>
<td>for aggregation pipeline operations is &quot;mapReduce&quot;</td>
<td style="text-align: center;">yes</td>
</tr>
<tr class="even">
<td><strong>uri</strong></td>
<td>specifies the URI when the operation is bound under /&lt;db&gt;/&lt;collection&gt;/_aggrs path.</td>
<td style="text-align: center;">yes</td>
</tr>
<tr class="odd">
<td><strong>map</strong></td>
<td><p>the map function</p>
<p>For more information refer to <a href="https://docs.mongodb.org/manual/core/map-reduce/" class="uri">https://docs.mongodb.org/manual/core/map-reduce/</a></p></td>
<td style="text-align: center;">yes</td>
</tr>
<tr class="even">
<td>reduce</td>
<td>the reduce function</td>
<td style="text-align: center;">yes</td>
</tr>
<tr class="odd">
<td>query</td>
<td>the filter query</td>
<td style="text-align: center;">no</td>
</tr>
</tbody>
</table>

## Examples

The following requests upsert a collection  defining two aggregation
operations:

-   aggregation operation *test\_ap* bound at
    `/db/ao_test/_aggrs/test_ap`
-   map reduce operation *test\_mr* bound at
    `/db/ao_test/_aggrs/test_mr`

<!-- -->

     

``` bash
PUT /db/ao_test { "aggrs" : [ 
      { "stages" : [ { "_$match" : { "name" : { "_$var" : "n" } } },
            { "_$group" : { "_id" : "$name",
                  "avg_age" : { "_$avg" : "$age" }
                } }
          ],
        "type" : "pipeline",
        "uri" : "test_ap"
      },
      { "map" : "function() { emit(this.name, this.age) }",
        "query" : { "name" : { "$var" : "n" } },
        "reduce" : "function(key, values) { return Array.avg(values) }",
        "type" : "mapReduce",
        "uri" : "test_mr"
      }
    ] }
```

Note between the `_links` collection property the URIs of the
aggregation operations.

``` bash
GET /db/ao_test
 
HTTP/1.1 200 OK
...
{
    "_links": {
        ...,
        "test_ap": {
            "href": "/db/ao_test/_aggrs/test_ap"
        }, 
        "test_mr": {
            "href": "/db/ao_test/_aggrs/test_mr"
        }
    },
    ....
}
```

## Passing variables to aggregation operations

The query parameter `avars` allows to pass variables to the aggregation
operations.

For example, the previous example aggregations both use a variable named
"*n". *If the variable is not passed via the `avars` qparam, the request
fails.

``` bash
GET /test/ao_test/_aggrs/test_ap

HTTP/1.1 400 Bad Request
...
{
    "_embedded": {
        "rh:exception": [
            {
                "exception": "org.restheart.hal.metadata.QueryVariableNotBoundException", 
                "exception message": "variable n not bound", 
                ...
            }]}
}
```

Passing the variable n, the request succeeds: 

``` bash
GET /test/ao_test/_aggrs/test_ap?avars={"n":1}

HTTP/1.1 200 OK
...
```

### Variables in stages or query

Variables can be used in aggregation pipeline stages and map reduce
query as follows:

``` js
{ "$var": "<var_name>" }
```

In case of map reduce operation previous example, the variable was used
to filter the documents to have the *name* property matching the
variable *n:*

``` js
{
  "query": { "name": { "$var": "n" } },
  ...
}
```

### Variables in map or reduce functions

Variables are passed also to *map* and *reduce* javascript functions
where the variable `$vars` can be used. For instance:

``` bash
PUT /db/ao_test { "aggrs" : [ 
     {  "map" : "function() { var minage = JSON.parse($vars).minage; if (this.age > minage ) { emit(this.name, this.age); }; }",
        "reduce" : "function(key, values) { return Array.avg(values) } }",
        "type" : "mapReduce",
        "uri" : "test_mr"
      } 
] }
 
HTTP/1.1 201 Created
...
```

Note the *map* function;  `JSON.parse($vars) `allows to access the
variables passed with the query parameter `avars`

``` js
function() { 
 var minage = JSON.parse($vars).minage; // <-- here we get minage from avars qparam
 if (this.age > minage ) { emit(this.name, this.age); } 
}; 
```
