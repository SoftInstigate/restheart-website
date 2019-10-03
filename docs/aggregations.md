---
layout: docs
title: Aggregations
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [The aggrs collection metadata](#theaggrscollection-metadata)
    * [aggregation pipeline](#aggregation-pipeline)
    * [Map-Reduce](#map-reduce)
* [Examples](#examples)
* [Passing variables to aggregations](#passing-variables-to-aggregations)
    * [Variables in stages or query](#variables-in-stages-or-query)
    * [Variables in map reduce functions](#variables-in-map-reduce-functions)
* [Security information](#security-informations)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

{: .bs-callout.bs-callout-info}
"Aggregations operations process data records and return computed results. Aggregation operations group values from multiple documents together, and can perform a variety of operations on the grouped data to return a single result."

RESTHeart manages aggregation operations: both *aggregation pipelines*
and *map reduce functions* are supported.

In both cases only *inline* output type is supported, i.e. no result is
written to the DB server.    

## The *aggrs* collection metadata

In RESTHeart, not only documents but also dbs and collections have
properties. Some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

Use the collection metadata `aggrs` to define aggregations. `aggrs` is an array of *pipeline* or *mapReduce *objects:

{: .black-code}
``` json
GET /coll/_meta HTTP 1.1


{
    "aggrs": [
        { <aggregation_1> },
        { <aggregation_2> },
        ...,
        { <aggregation_n> }
    ]

}
```

### aggregation pipeline

{: .black-code}
``` json
{
    "type":"pipeline",
    "uri": <uri>,
    "stages": [
        "<stage_1>",
        "<stage_2>",
        ...
    ],
    "allowDiskUse": boolean
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

To  store stages with operators and using the dot notation, RESTHeart
*automatically* escapes the properties keys because of MongoDB's [Restrictions on Field
Names](https://docs.mongodb.org/manual/reference/limits/#Restrictions-on-Field-Names):

* the $ prefix is "underscore escaped", e.g. `$exists` is stored as
    `_$exists`
* dots are escaped as **::** e.g. `SD.prop` is stored as `SD::prop`

### Map-Reduce

{: .black-code}
``` json
{
    "type":"mapReduce",
    "uri":"<uri>",
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

The following requests upsert a collection  defining two aggregation
operations:

* aggregation operation *test\_ap* bound at
    `/coll/_aggrs/example-pipeline`
* map reduce operation *test\_mr* bound at
    `/coll/_aggrs/example-mapreduce`

{: .black-code}
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

## Passing variables to aggregations

The query parameter `avars` allows passing variables to the aggregations.

{: .bs-callout.bs-callout-info}
The value of a variable can be any valid JSON. 
The following query parameter passes two variables, a number and an object: `?vars={ "number": 1, "object": {"a": {"json": "object" }} }`

For example, the previous example aggregations both use a variable named
"n". *If the variable is not passed via the `avars` qparam, the request
fails.

{: .black-code}
``` bash
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

{: .black-code}
```
GET /coll/_aggrs/example-pipeline?avars={"n":1} HTTP/1.1

HTTP/1.1 200 OK
...
```

### Variables in stages or query

Variables can be used in aggregation pipeline stages and map reduce
query as follows:

{: .black-code}
``` js
{ "$var": "<var_name>" }
```

In case of map reduce operation previous example, the variable was used
to filter the documents to have the *name* property matching the
variable *n:*

{: .black-code}
``` js
{
  "query": { "name": { "$var": "n" } },
  ...
}
```

### Variables in map reduce functions

Variables are passed also to *map* and *reduce* javascript functions
where the variable `$vars` can be used. For instance:

{: .black-code}
```
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

Note the *map* function; `JSON.parse($vars)` allows to access the
variables passed with the query parameter `avars`

{: .black-code}
``` js
function() { 
 var minage = JSON.parse($vars).minage; // <-- here we get minage from avars qparam
 if (this.age > minage ) { emit(this.name, this.age); }
};
```

### Security Informations

By default RESTHeart makes sure that the aggregation variables passed as query parameters don't include MongoDB operators. 

This behavior is required to protect data from undesirable malicious query injection.

Even though is highly discouraged, is possible to disable this check by editing the following property in the `restheart-platform-core.yml` configuration file.

{: .black-code}
``` yml
### Security

# Check if aggregation variables use operators. allowing operators in aggregation variables 
# is risky. requester can inject operators modifying the query

aggregation-check-operators: true
```
</div>


