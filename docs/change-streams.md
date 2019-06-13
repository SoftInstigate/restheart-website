---
layout: docs
title: Change Streams
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [The streams collection metadata](#thestreamscollection-metadata)
    * [Stream metadata object format](#stream-metadata-object-format)
    * [Escape stage properties informations](#escape-stage-properties-informations)
* [Examples](#examples)
* [Passing variables to change streams](#passing-variables-to-change-streams)
    * [Variables in stages or query](#variables-in-stages-or-query)
* [Security informations](#security-informations)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

<div class="d-block d-md-none alert alert-warning" role="alert">
    <div class="d-flex justify-content-center">
    This is a <strong class="ml-1 mr-1">PRO only</strong> feature.
    </div>
    <div class="d-flex justify-content-center mt-2">
        <span class="badge badge-pill badge-light p-1"><a href="https://restheart.org/buy" class="uri">Try RESTHeart PRO for free!</a></span>
    </div>
</div>

<div class="d-none d-md-block alert alert-warning" role="alert">
    This is a <strong>PRO only</strong> feature.
    <span class="badge badge-pill badge-light p-1"><a href="https://restheart.org/buy" class="uri">Try RESTHeart PRO for free!</a></span>
</div>

<div class="jumbotron">
    <h2><strong>Lightweigth and fast.</strong> Up to thousand hundred clients getting notified with high performance!</h2>
    <div>
    Check our tests results <a href="http://localhost:4000/docs/change-streams">here</a>!
    </div>
</div>

## Introduction
Modern web applications needs to react with promptness and efficency to data changes in many contexts.

RESTHeart PRO *Change Stream* feature comes in handy to achieve this goal.

> "Change streams allow applications to access real-time data changes. [...]  Because change streams use the aggregation framework, applications can also filter for specific changes." 

<img src="/images/changes-stream.png" width="80%" height="auto" class="image-center img-responsive" />

Exposing a [WebSocket Server](https://tools.ietf.org/html/rfc6455) resource, clients may be promptly notified about these changes only if necessary, avoiding network expensive common practices like polling.

*IMPORTANT: to use Change Streams is mandatory to enable MongoDB's [replica sets](https://docs.mongodb.com/manual/replication/).*

## The *streams* collection metadata

In RESTHeart, not only documents but also dbs and collections have
properties. Some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

The collection metadata property `streams` allows to declare change streams that client can watch for to be aware about changes to documents and bind them to given URI.

Change streams need to be defined as collection metadata. It is
not possible to define a stream via a query parameter and this is
by design: clients are not able to open up arbitrary change streams but only those defined (and tested) by the developers.

`streams` is an array of *stream* objects.

### Stream metadata object format

**stream object format**

``` json
{
    "uri": <uri>,
    "stages": [
        "<stage_1>",
        "<stage_2>",
        ...
    ]
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
<tr class="even">
<td><strong>uri</strong></td>
<td>specifies the URI when the stream is bound under the path <code>/&lt;db&gt;/&lt;collection&gt;/_streams</code></td>
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

Notes: 
* Only a subset of aggregation pipeline stages are allowed for this features. Check MongoDB's [documentation](https://docs.mongodb.com/manual/changeStreams/#modify-change-stream-output) for further informations.
* Stages takes as input [Change Events](https://docs.mongodb.com/manual/reference/change-events/) instead of the modified documents itselves. For example, the modified version of a document after a PATCH request is present at event.fullDocument property of the stages input event. (See [examples](#examples) below).

### Escape stage properties informations
MongoDB does not allow to store fields with names starting with $ or
containing *dots* (.), see [Restrictions on Field
Names](https://docs.mongodb.org/manual/reference/limits/#Restrictions-on-Field-Names)
on MongoDB's documentation.

In order to allow storing stages with dollar prefixed operators or using
the dot notation (to refer to properties of subdocuments), RESTHeart
*automatically* and *transparently* escapes the properties keys as
follows:

* the $ prefix is "underscore escaped", e.g. `$exists` is stored as
    `_$exists`
* if the dot notation has to be used in a key name, dots are replaced
    with **::** e.g. `SD.prop` is stored as `SD::prop`

In RESTHeart 1.x, these escapes are not managed automatically: the
developer had to explicitly use them; starting from version 2.0 this is
not needed anymore.


## Examples

The following requests upsert a collection defining two change streams:

* *test\_stream* bound at
    `/db/cs_test/_streams/test_stream`
* *test\_stream\_with\_stage\_params* bound at
    `/db/cs_test/_streams/test_stream_with_stage_params`

``` bash
PUT /db/cs_test { "streams" : [ 
      { "stages" : [],
        "uri" : "test_stream"
      },
      { "stages" : [ 
          { "_$match" : { 
              "fullDocument.name" : { "_$var" : "n" } 
              } 
          }
        ],
        "uri" : "test_stream_with_stage_params"
      }
    ] }
```

Note between the `_links` collection property the URIs of the
change streams.

``` bash
GET /db/cs_test

HTTP/1.1 200 OK
...
{
    "_links": {
        ...,
        "test_stream": {
            "href": "/db/cs_test/_streams/test_stream"
        },
        "test_stream_with_stage_params": {
            "href": "/db/cs_test/_streams/test_stream_with_stage_params"
        }
    },
    ....
}
```

## Passing variables to change streams

The query parameter `avars` allows to pass variables to the change stream.

For example, the previous example *test_stream_with_stage_params* use a variable named
"*n". *If the variable is not passed via the `avars` qparam, the request
fails.

``` bash
GET /test/cs_test/_streams/test_stream_with_stage_params

HTTP/1.1 400 Bad Request
...
{
    "_exceptions": [
        {
            "exception": "org.restheart.hal.metadata.QueryVariableNotBoundException", 
            "exception message": "variable n not bound", 
            ...
        }
    ]
}
```

Passing the variable n, the request succeeds:

``` bash
GET /test/cs_test/_streams/test_ap?avars={"n":1}

HTTP/1.1 101 Switching Protocols
...
```

### Variables in stages or query

Variables can be used in change streams query as follows:

``` js
{ "$var": "<var_name>" }
```

In case of change stream with stage parameter previous example, the variable was used
to restrinct notifications only to changes on documents with a property *name* matching the
variable *n:*

``` js
{
  ...
    { "_$match" : { "fullDocument.name" : { "_$var" : "n" } } }
  ...
}
```

### Security Informations
By default RESTHeart makes sure that the aggregation variables passed as query parameters hasn't got inside MongoDB operators. 

This behaviour is required to protect data from undesiderable malicious query injection. 

Even though is highly discouraged, is possible to disable this check by editing the following property into `restheart.yml` configuration file.

```properties
### Security

# Check if aggregation variables use operators. allowing operators in aggregation variables 
# is risky. requester can inject operators modifying the query

aggregation-check-operators: true

```
</div>