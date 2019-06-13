---
layout: docs
title: Read JSON Documents
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
    - [Example](#example)
    - [Default sorting](#default-sorting)
- [Filtering](#filtering)
    - [Examples](#filtering-examples)
- [Counting](#counting)
- [Paging](#paging)
- [Sorting](#sorting)
    - [Sort simple format](#sort-simple-format)
    - [Sort JSON expression format](#sort-json-expression-format)
    - [Examples](#sorting-examples)
- [Projection](#projection)
    - [Examples](#projection-examples)
- [Hint](#hint)
    - [Examples](#hint-examples)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

This page provides examples of query operations using the `GET` method.

You will learn how to get documents from a collection, optionally specifying a query, sort criteria, fields projections options and deal with pagination.  

You will also learn hot to get a single document knowing its _id.

{% include running-examples.md %}

## Select All Documents in a Collection

To GET all documents in the collection, , run the following:

```
GET /inventory?page=1&pagesize=2
```

Note the *page* and *pagesize* query parameters.

### Default sorting

The default sorting of the documents is by the *_id* descending.

In the usual case, where the type of the ids of the documents is
ObjectId, this makes the documents sorted by creation time by default
(ObjectId have a timestamp in the most significant bits).

RESTHeart returns data in pages (default being 100) and it is stateless.
This means that two requests use different db cursors. A default sorting
makes sure that requests on different pages returns documents in a well
defined order.

#### Disable default sorting

Default sorting could impact performances for some use cases.

To disable default sorting just add the `sort={}` query parameter 

See the [sorting](#Sorting) section to know how to
specify different sorting criteria.

### Example

To retrieve the first 100 documents of a collection:

**Request**

``` plain
GET /test/coll?pagesize=100&np
```

**Response (headers omitted)**

```
HTTP/1.1 200 OK
...

{
    "_embedded": [
        { <DOC1> }, { <DOC2> }, { <DOC3> }, ..., { <DOC100> }
    ], 
    "_returned": 100
}
```

Excluding collection properties

The query parameter **`np`** (No Properties) excludes the collection
properties from the response.

## Filtering

The **`filter`** query parameter allows to specify conditions on the
documents to be returned.

The `filter` qparam value is any [mongodb
query](https://docs.mongodb.org/manual/tutorial/query-documents/).

Note that system properties (properties starting with \_ that are
managed automatically by RESTHeart) are not affected by this option.

### Filtering Examples

#### Return documents whose `title` starts with "Star Trek"

``` plain
GET /test/coll?filter={'title':{'$regex':'(?i)^STAR TREK.*'}}
```

This query uses the
mongodb [$regex](https://docs.mongodb.org/manual/reference/operator/query/regex/) operator
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
mode](https://restheart.org/docs/representation-format/)
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
    "_embedded": [
        { <DOC30> }, { <DOC31> }, ... { <DOC39> }
    ],
    "_returned": 10,
    "_size": 343
    "_total_pages": 35
}
```

## Sorting

Sorting is controlled by the `sort` query parameter.

Note that documents cannot be sorted by system properties (properties
starting with \_ that are managed automatically by RESTHeart).

### Sort simple format

The `sort` simplified format is :

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

### Sorting Examples

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

Note that system properties (properties starting with \_ that are
managed automatically by RESTHeart) are not affected by this option.

### Projection Examples

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

## Hint

Hint allows overriding MongoDB’s default index selection and query optimization process. See [cursor hint](https://docs.mongodb.com/manual/reference/method/cursor.hint/#cursor.hint) on MongoDB documentation.

This is done via the `hint` query parameter.

Specify the index by the index specification document, either using a json document or the compact string representation; specifying the index by name is not supported.

Use `$natural` to force the query to perform a forwards collection scan.

### Hint Examples

#### Use the index on age field

The following example returns all documents in the collection named **coll** using the index on the **age** field.

``` bash
GET /test/coll?hint={'age':1}
```

#### Use the compound index on age and timestamp fields using the compact string format

The following example returns the documents in the collection named **coll** using the compound index on the **age** and reverse **timestamp** fields.

``` bash
GET /test/coll?hint=age&hint=-timestamp
```

#### Perform a forwards collection scan

The following example returns the documents in the collection named **coll** using aforwards collection scan.

``` bash
GET /test/coll?hint={'$natural':1}
```

#### Perform a reverse collection scan

The following example returns the documents in the collection named **coll** using a reverse collection scan.

``` bash
GET /test/coll?hint={'$natural':-1}
```

</div>