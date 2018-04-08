---
layout: docs
title: Collection Indexes
---

* [Introduction](#introduction)
* [List the collection indexes](#list-the-collection-indexes)
* [Create an index](#create-an-index)
* [<strong>Delete an index</strong>](#delete-an-index)
* [<strong>Notes</strong>](#notes)
    * [**Invalid options **](#invalid-options)

## Introduction

Use the `/db/coll/_indexes` resource to manage the indexes of the
collection.

## List the collection indexes

To list the collection indexes use the following request:

``` bash
 GET /db/coll/_indexes
```

**Example**

``` bash
GET 127.0.0.1:8080/db/coll/_indexes 

HTTP/1.1 200 OK
...

{
    "_embedded": {
        "rh:index": [
            {
                "_id": "_id_", 
                "key": {
                    "_id": 1
                }, 
                "ns": "db.coll", 
                "v": 1
            }, 
            {
                "_id": "text", 
                "default_language": "english", 
                "key": {
                    "_fts": "text", 
                    "_ftsx": 1
                }, 
                "language_override": "language", 
                "ns": "db.coll", 
                "textIndexVersion": 3, 
                "v": 1, 
                "weights": {
                    "title": 1
                }
            }
        ]
    }, 
    "_returned": 2, 
    "_size": 2,
    ...
}
```

## Create an index

To create an index use the following request:

``` bash
PUT /db/coll/_indexes/<index_id> { "keys":  <keys>, "ops": <options> }
```

See also

Indexes in MongoDB documentation
<https://docs.mongodb.com/manual/indexes/>

**Example - create an unique, sparse index on property *name***

``` bash
PUT /db/coll/_indexes/index1 {"keys": {"name":1}, "ops": {"unique": true, "sparse": true }}
HTTP/1.1 201 Created
...
```

****Example - create a text index on property *title*****

``` bash
PUT /db/coll/_indexes/text {"keys": {"title": "text }}
HTTP/1.1 201 Created
...
```

## **Delete an index**

To delete an index use the following request:

``` bash
DELETE /db/coll/_indexes/<index_id>
```

## **Notes**

### **Invalid options **

When creating an index the index options must be valid.

An example of invalid options is specifying the attribute *unique* on a
property that is not actually unique; in this case the response will
be 406:

``` bash
HTTP/1.1 406 Not Acceptable
 
{
    "_embedded": {
        "rh:exception": [
            {
                "exception": "com.mongodb.DuplicateKeyException", 
                "exception message": "Write failed with error code 11000 and error message 'E11000 duplicate key error index: test.coll.$name2 dup key: ...."
            }
        ]
    },
    "http status code": 406, 
    "http status description": "Not Acceptable", 
    "message": "error creating the index",
    ...
}
```

**Indexes cannot be updated**

**To update an index, it must be deleted and recreated:**

``` bash
DELETE /db/coll/_indexes/index
HTTP/1.1 204 No Content

PUT /db/coll/_indexes/index { ... }
HTTP/1.1 201 Created
```

Trying to update an existing index returns 406 Not Acceptable:

``` bash
HTTP/1.1 406 Not Acceptable
 
{
    "_embedded": {
        "rh:exception": [
            {
                "exception": "com.mongodb.MongoCommandException", 
                "exception message": "Command failed with error 86: 'Trying to create an index with same name name with different key spec { name: -1 } vs existing spec { name: 1 }' on server 127.0.0.1:27017. The full response is { 'ok' : 0.0, 'errmsg' : 'Trying to create an index with same name name with different key spec { name: -1 } vs existing spec { name: 1 }', 'code' : 86 }"
            }
        ]
    }, 
    "http status code": 406, 
    "http status description": "Not Acceptable", 
    "message": "error creating the index",
    ...
}
```
