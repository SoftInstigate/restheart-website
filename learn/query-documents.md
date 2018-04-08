---
layout: docs
title: Queries
---

* [Introduction](#introduction)
    * [Example](#example)
    * [Default sorting](#default-sorting)
* [Filtering](#filtering)
    * [Examples](#examples)
    * [Return documents whose title starts with "Star Trek"](#return-documents-whosetitlestarts-with-star-trek)
    * [Return documents whose title starts with "Star Trek" and <code>publishing_date </code>is later than 4/9/2015, 8AM](#return-documents-whosetitlestarts-with-star-trek-andpublishing_dateis-later-than-492015-8am)
* [Counting](#counting)
* [Paging](#paging)
* [Sorting](#sorting)
    * [Sort simple format](#sort-simple-format)
    * [Sort JSON expression format](#sort-json-expression-format)
    * [Examples](#examples-1)
    * [Sort by the <em>date</em> ascending](#sort-by-thedate-ascending)
    * [Sort by the <em>date</em> descending](#sort-by-thedatedescending)
    * [Sort by the <em>date</em> descending and title ascending ](#sort-by-thedatedescending-and-title-ascending)
    * [Sort by search score](#sort-by-search-score)
* [Projection](#projection)
    * [Examples](#examples-2)
    * [Only return the property title](#only-return-the-property-title)
    * [Return all but the property <em>title</em>](#return-all-but-the-propertytitle)
    * [Only return the properties <em>title</em> and <em>summary</em>](#only-return-the-propertiestitle-and-summary)

## Introduction

In RESTHeart, `GET` collection resource requests
(`GET /db/coll`) retrieve documents from the collection as embedded
resources.

RESTHeart represents resources with the [HAL
format](Representation_Format) where resources have state, links and
**embedded resources**. Refer to [Representation
Format](Representation_Format) for more information about HAL.

This section also applies to File Bucket and Schema Store resources,
that embed File and JSON schema resources respectively.

### Example

To retrieve the first 100 documents of a collection:

**Request**

``` plain
GET /test/coll?pagesize=100&np
```

**Response (headers omitted)**

``` bash
HTTP/1.1 200 OK
...

{
    "_embedded": {
        "rh:doc": [
            { <DOC1> }, { <DOC2> }, { <DOC3> }, ..., { <DOC100> }
        ]
    }, 
    "_returned": 100
}
```

Excluding collection properties

The query parameter **`np`** (No Properties) excludes the collection
properties from the response.

### Default sorting

The default sorting of the documents is by the **`_id` descending**.

In the usual case, where the type of the ids of the documents is
ObjectId, this makes the documents sorted by creation time by default
(ObjectId have a timestamp in the most significant bits).

RESTHeart returns data in pages (default being 100) and it is stateless.
This means that two requests use different db cursors. A default sorting
makes sure that requests on different pages returns documents in a well
defined order.

Disable default sorting

Default sorting could impact performances for some use cases.

To disable default sorting just add the `sort={}` query parameter 

See the [sorting](#QueryDocuments-sorting) section to know how to
specify different sorting criteria.

## Filtering

The **`filter`** query parameter allows to specify conditions on the
documents to be returned.

The `filter` qparam value is any [mongodb
query](https://docs.mongodb.org/manual/tutorial/query-documents/).

Note that system properties (properties starting with \_ that are
managed automatically by RESTHeart) are not affected by this option.

### Examples

#### Return documents whose `title` starts with "Star Trek"

``` plain
GET /test/coll?filter={'title':{'$regex':'(?i)^STAR TREK.*'}}
```

This query uses the
mongodb [$regex](http://docs.mongodb.org/manual/reference/operator/query/regex/) operator
where the *i* option performs a case-insensitive match for documents
with title value that starts with the string "STAR TREK".

#### Return documents whose `title` starts with "Star Trek" and `publishing_date `is later than 4/9/2015, 8AM

``` bash
GET /test/coll?filter={'$and':[{'title':{'$regex':'(?i)^STAR TREK.*'},{'publishing_date':{'$gte':{'$date':'2015-09-04T08:00:00Z'}}}]}
 
or
 
GET /test/coll?filter={'title':{'$regex':'(?i)^STAR TREK.*'}&filter={'publishing_date':{'$gte':{'$date':'2015-09-04T08:00:00Z'}}}
```

multifilter qparams

Note the second form of the last example. If multiple filter query
parameters are specified, they are logically composed with the AND
operator.

This can be very useful in conjunction with path based security
permission.

For instance the following permission can be used with the simple file
based Access Manager to restrict users to GET a collection only
specifying a filter on the author property to be equal to their
username:

  

    regex[pattern="/test/coll/\?.*filter={'author':'(.*?)'}.*", value="%R", full-match=true] and equals[%u, "${1}"]

## Counting

Specifying the *count* query parameter (e.g. `?count=true` ), RESTHeart
returns:

-   the total number of documents in the collection with the
    `_size`* *parameter
-   the total number of available pages with
    the `_total_pages` parameter. It also add the `last` link, i.e. the
    link to the last page, to the \_links; The pagination links (first,
    last, next, previous) are only returned on hal full mode (hal=f
    query parameter); see HAL mode for more information.

  

Impact on performances

**`count`** involves querying the collection twice: once for counting
and once of actually retrieving the data; this has performance
implications!

## Paging

Embedded documents are always paginated, i.e. only a subset of the
collection's document is returned on each request.

The number of documents to return is controlled via the `pagesize` query
parameter. Its default value is 100, maximum allowable size is 1000.

The pages to return is specified with the `page` query parameter. The
pagination links (first, last, next, previous) are **only returned on
hal full mode** (`hal=f` query parameter); see [HAL
mode](https://softinstigate.atlassian.net/wiki/x/UICM#RepresentationFormat-Halmode)
for more information.

For instance, to return documents from 20 to 29 (page 3):

**Request**

``` plain
GET /test/coll?count&page=3&pagesize=10&hal=f&np
```

**Response (headers omitted)**

``` bash
HTTP/1.1 200 OK
...
{
    "_embedded": {
        "rh:doc": [
            { <DOC30> }, { <DOC31> }, ... { <DOC39> }
        ]
    }
    "_returned": 10,
    "_size": 343
    "_total_pages": 35
}
```

## Sorting

Sorting is controlled by the `sort `query parameter.

Note that documents cannot be sorted by system properties (properties
starting with \_ that are managed automatically by RESTHeart).

### Sort simple format

The `sort `simplified format is :

``` plain
sort=[ |-]<fieldname>
```

multiple sort properties

Specify multiple sort options using multiple `sort` query parameters

``` plain
GET /db/coll?sort=name&sort=-age
```

### Sort JSON expression format

`sort` can also be a MongoDB [sort
expression](https://docs.mongodb.com/manual/reference/method/cursor.sort/#cursor.sort).

JSON expression format is available starting from version 2.0.1. See
improvement [RH-190](https://softinstigate.atlassian.net/browse/RH-190)

``` plain
sort={"field": 1}
```

### Examples

### Sort by the *date* ascending

``` bash
GET /test/coll?sort=date

GET /test/coll?sort={"date":1}
```

#### Sort by the *date* descending

``` bash
GET /test/coll?sort=-date

GET /test/coll?sort={"date":-1}
```

#### Sort by the *date* descending and title ascending 

``` bash
GET /test/coll?sort=-date&sort=title

GET /test/coll?sort={"date":-1, "title":1}
```

#### Sort by search score

This is only possible with json expression format

``` bash
// create a text index
PUT /test/coll/_indexes/text {"keys": {"title": "text }}
 
// sort by {"$meta": "textScore"}
GET /test/coll?filter={"$text":{"$search":"a search string"}}&keys={"title":1,"score":{"$meta":"textScore"}}&sort={"score":{"$meta":"textScore"}}
```

## Projection

Projection limits the fields to return for all matching documents,
specifying the inclusion or the exclusion of fields.

This is done via the `keys` query parameter. 

projecting multiple keys

*S*pecify multiple keys using multiple *keys* query parameters

Note that system properties (properties starting with \_ that are
managed automatically by RESTHeart) are not affected by this option.

### Examples

#### Only return the property title

``` bash
GET /test/coll?keys={'title':1}
```

#### Return all but the property *title*

``` bash
GET /test/coll?keys={'title':0}
```

#### Only return the properties *title* and *summary*

``` bash
GET /test/coll?keys={'title':1}&keys={'summary':1}
```

It's possible to use the "dot notation" to specify fields within an
object, for example, let's say that both **title** and **summary** are
part of an **header** object:

``` bash
GET /test/coll?keys={'header.title':1}&keys={'header.summary':1}
```
