---
layout: docs
title: Write Requests
---

* [Introduction](#introduction)
* [Write verbs](#write-verbs)
* [Dot notation](#dot-notation)
    * [Array](#array)
    * [Embedded Documents](#embedded-documents)
* [Update operators](#update-operators)
* [Bulk Write Requests](#bulk-write-requests)
    * [POST an array of documents](#post-an-array-of-documents)
    * [PATCH multiple documents using the wildcard document id](#patch-multiple-documents-using-the-wildcard-document-id)
    * [DELETE multiple documents using the wildcard document id](#delete-multiple-documents-using-the-wildcard-document-id)

## Introduction

This document shows how RESTHeart can use the PUT, POST, PATCH and
DELETE verbs to create, modify and delete resources within a MongoDB
database, using only the HTTP protocol.

With the exception of the root resource (`/`) which is read-only, all
resources have a state represented in JSON format (see [Representation
Format](Representation_Format) for more information). Example

The following request:

``` plain
PUT /db/coll {"description": "my first collection", "$currentDate": { "created_on": true }}
```

creates the collection *coll* in the database *db* setting its state as
follows (the property *\_etag *is automatically added by RESTHeart,
see [ETag](ETag) for more information):

``` json
{
  "_id": "coll",
  "description": "my first collection"
  "created_on": { "$date": 1460708338344 },
  "_etag": { "$oid": "5710a3f12d174c97589e6127" }
}
```

This section focuses on the document resource. However the same concepts
apply to any resource type, such as databases and collections.

## Write verbs

The following table summarizes the semantic of the write verbs:

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>verb</th>
<th>semantic</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>PUT</td>
<td><p>Upserts the resource identified by the request URL:</p>
<ul>
<li>if the resource does not already exist, the PUT request creates it setting its state as specified in the request JSON body;</li>
<li>if the resource, the PUT request sets the resource state as specified in the request JSON body.</li>
</ul></td>
</tr>
<tr class="even">
<td>POST</td>
<td><p>Upserts a resource under the resource identified by the request URL:</p>
<ul>
<li>if the resource does not already exist, the POST request creates it setting its state as specified in the request JSON body;</li>
<li>if the resource exists, the POST sets the resource properties as specified in the request JSON body.</li>
</ul>
<p>The resource to upsert is identified by the <em>_id</em> property of the request JSON body. If the request body does not include it, the <em>_id</em> it is auto generated as a new ObjectId and the URL of the new document is returned in the response via the <em>Location</em> header.</p></td>
</tr>
<tr class="odd">
<td>PATCH</td>
<td><p>Modifies the state of the resource identified by the request URL applying only the properties specified in the request JSON body.</p>
<p>PUT and POST verbs replace the whole state while PATCH only modifies properties passed with the request JSON body.</p></td>
</tr>
<tr class="even">
<td>DELETE</td>
<td>Deletes the resource identified by the request URL.</td>
</tr>
</tbody>
</table>

upsert

The term *upsert* means either to create a resource, if it does not
already exist or to update it, if it does. It comes from joining the
terms **up**date and in**sert.**

## Dot notation

RESTHeart uses the dot notation to access the elements of an array and
to access the fields of an embedded document.

The dot notation can be used in PUT, PATCH and POST verbs.

### Array

To specify or access an element of an array by the zero-based index
position, concatenate the array name with the dot (.) and zero-based
index position, and enclose in quotes:

``` plain
"<array>.<index>"
```

**Example**

``` plain
{ "_id": "docid", "array": [ 1, 2, 3, 4, 5 ], ... } 
 
PATCH /db/coll/docid {"array.1": 100 }
 
{ "_id": "docid", "array": [ 1, 100, 3, 4, 5 ], ... } 
```

### Embedded Documents

To specify or access a field of an embedded document with dot notation,
concatenate the embedded document name with the dot (.) and the field
name, and enclose in quotes:

``` plain
"<embedded document>.<field>"
```

**Example**

``` plain
{ "_id": "docid", "name": { "first": "Alan", "last": "Turing" }, ... } 
 
PATCH /db/coll/docid { "name.last": "Ford" }
 
{ "_id": "docid", "name": { "first": "Alan", "last": "Ford" }, ... } 
```

## Update operators

RESTHeart allows to use all MongoDB update operators.

Refer to MongoDB [Update
Operators](https://docs.mongodb.org/manual/reference/operator/update/) documentation
for more information.

Update operators can be used in PUT, PATCH and POST verbs.

**Examples**

Consider the following document

``` json
{
    "_id": "docid",
    "timestamp": { "$date": 1460708338344 },
    "array": [ {"id":1, "value": 2} ],
    "count": 10,
    "message": "hello world"
  ...
}
```

The following request will:

-   add the *pi* property (if no operator is specified the
    [$set](https://docs.mongodb.org/manual/reference/operator/update/set/)
    field operator is applied)
-   increment the properties *count* using the
    [$inc](https://docs.mongodb.org/manual/reference/operator/update/inc/#up._S_inc) field
    operator
-   add a new item to the *array *using the
    [$push](https://docs.mongodb.org/manual/reference/operator/update/push/)
    array operator
-   remove the property *message *using the
    [$unset](https://docs.mongodb.org/manual/reference/operator/update/unset/)
    field operator
-   update the *timestamp* with the current date using the
    [$currentDate](https://docs.mongodb.org/manual/reference/operator/update/currentDate/)
    operator

  

``` bash
PATCH /db/coll/docid { 
    "pi": 3.14,
    "$inc": { "count": 1 }, 
    "$push": { "array": { ("id": 2, "value": 0 } } }, 
    "$unset": {"message": null}, 
    "$currentDate": {"timestamp": true} 
}
```

After the request completes, the resource state is updated to:

``` json
{
    "_id": "doccia",
    "pi": 3.14,
    "timestamp": { "$date": 1460714673219 },
    "array": [ {"id":1, "value": 3}, {"id": 2, "value": 0 } ],
    "count": 11
  ...
}
```

## Bulk Write Requests

Bulk write requests create, update or delete multiple documents with a
single request.

### POST an array of documents

In order to upsert multiple documents pass an array of documents as
request body.

POST documents containing existing *\_id*s to update them.

The bulk POST has the same behavior of PATCH: only the properties in the
request data will be updated.

The response contains the URIs of the created documents.

All the upserted documents have the same *\_etag* property value as
reported in the *ETag* response header: to retrive the upserted
documents with a single request GET the collection filtering on
the *\_etag* property.

**Example**

**request**

``` plain
POST /db/coll [ { "seq": 1 }, { "seq": 2 }, { "seq": 3 }, { "seq": 4 } ]
```

**response**

``` json
{
  "_embedded": {
    "rh:result": [
      {
        "_links": {
          "rh:newdoc": [
            {
              "href": "/xxx/yyy/5716560a2d174cac010daf17"
            },
            {
              "href": "/xxx/yyy/5716560a2d174cac010daf18"
            },
            {
              "href": "/xxx/yyy/5716560a2d174cac010daf19"
            },
            {
              "href": "/xxx/yyy/5716560a2d174cac010daf1a"
            }
          ]
        },
        "inserted": 4,
        "deleted": 0,
        "modified": 0,
        "matched": 0
      }
    ]
  }
}
```

### PATCH multiple documents using the wildcard document id

In order to modify the properties of multiple documents use the PATCH
verb as follows:

**PATCH bulk request**

``` plain
PATCH /db/coll/*?filter={<filter_query>}
```

The *filter* query parameter is mandatory and specifies a [mongodb
query](https://docs.mongodb.org/manual/tutorial/query-documents/).

The response contains the number of updated documents.

All the updated documents have the same *\_etag* property value as
reported in the *ETag* response header: to retrive the updated documents
with a single request GET the collection filtering on
the *\_etag* property.

wildcard document id

Note the ***\**** document id in the URI:` PATCH /db/coll/*` is a bulk
document update, where `PATCH /db/coll` modifies the properties of the
collection.

**  
**

**Example - Add the property *num* to all documents missing it.**

**request**

``` plain
PATCH /db/coll/*?filter={"num": {"$exists": false } } { "num": 1 } 
```

**response**

``` json
{
  "_embedded": {
    "rh:result": [
      {
        "inserted": 0,
        "deleted": 0,
        "modified": 9,
        "matched": 9
      }
    ]
  }
}
```

### DELETE multiple documents using the wildcard document id

In order to delete multiple documents use the PATCH verb as follows:

**PATCH bulk request**

``` plain
DELETE /db/coll/*?filter={<filter_query>}
```

The *filter* query parameter is mandatory and specifies a [mongodb
query](https://docs.mongodb.org/manual/tutorial/query-documents/).

The response contains the number of deleted documents.

wildcard document id

Note the ***\**** document id in the URI`: DELETE /db/coll/*` is a bulk
document delete, where DELETE /db/coll deletes the collection (for
safety, it requires the ETag request header to be specified).

  

**Example - Delete all documents with whose *creation\_date *is before
1/1/2016.**

**request**

``` plain
DELETE /db/coll/*?filter={"creation_date": {"$lt": {"$date": 1451606400000 } } }
```

**response**

``` json
{
  "_embedded": {
    "rh:result": [
      {
        "inserted": 0,
        "deleted": 23,
        "modified": 0,
        "matched": 0
      }
    ]
  }
}
```
