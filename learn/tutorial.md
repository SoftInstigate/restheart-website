---
layout: docs
title: Tutorial
---

* [Start MongoDB and RESTHeart](#start-mongodb-and-restheart)
* [Create a Database](#create-a-database)
* [Create a Collection](#create-a-collection)
* [Create two Documents](#create-two-documents)
* [Get all Documents from the Collection](#get-all-documents-from-the-collection)
* [GET Document by URL (by id)](#get-document-by-url-by-id)
* [Query documents by name property (using Collection filter)](#query-documents-by-name-property-using-collection-filter)

## Introduction

In this tutorial we’ll use RESTHeart to create a db, a collection and a couple of documents in MongoDB.

Before going further you might want to check:

* [Setup](/learn/setup)
* [Resource URI](/learn/resource-uri)
* [Resource Representation Format](/learn/representation-format)

We’ll use [httpie](http://httpie.org/), a brilliant command line HTTP client (you can also use curl of course!).

_If you just want to play with RESTHeart without installing it, you can use our [online test instance](http://restheart.org/try). This instance is constrained to document-related operations on the collection */db/coll*, you can't create databases or collections there._

## Start MongoDB and RESTHeart

Review to the [setup](/learn/setup/#run-restheart-with-docker) section on how to quickly run RESTHeart with Docker Compose.

## Create a Database

### Request

    http PUT 127.0.0.1:8080/db desc='this is my first db created with restheart'

### Response

    HTTP/1.1 201 Created
    Access-Control-Allow-Credentials: true
    Access-Control-Allow-Origin: *
    Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
    Connection: keep-alive
    Content-Length: 0
    Date: Sun, 08 Apr 2018 21:01:12 GMT
    ETag: 56ded28e2d174c2a08cdee81
    X-Powered-By: restheart.org

## Create a Collection

### Request

    http PUT 127.0.0.1:8080/db/coll desc='my first collection created with restheart'

### Response

    HTTP/1.1 201 Created
    Access-Control-Allow-Credentials: true
    Access-Control-Allow-Origin: *
    Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
    Connection: keep-alive
    Content-Length: 0
    Date: Sun, 08 Apr 5aca8368634459000711d92a 21:02:44 GMT
    ETag: 56ded2b22d174c2a08cdee83
    X-Powered-By: restheart.org

## Create two Documents

### Request

    http POST 127.0.0.1:8080/db/coll name='RESTHeart' rating='cool'

### Response

    HTTP/1.1 201 Created
    Access-Control-Allow-Credentials: true
    Access-Control-Allow-Origin: *
    Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
    Connection: keep-alive
    Content-Length: 0
    Date: Sun, 08 Apr 2018 21:03:04 GMT
    ETag: 5aca83c9634459000711d92e
    Location: http://127.0.0.1:8080/db/coll/5aca83c968a635bcd711d794
    X-Powered-By: restheart.org

### Request

    http POST 127.0.0.1:8080/db/coll name='MongoDB' rating='super cool'

### Response

    HTTP/1.1 201 Created
    Access-Control-Allow-Credentials: true
    Access-Control-Allow-Origin: *
    Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
    Connection: keep-alive
    Content-Length: 0
    Date: Sun, 08 Apr 2018 21:03:24 GMT
    ETag: 5aca83d8634459000711d92f
    Location: http://127.0.0.1:8080/db/coll/5aca83d868a635bcd711d79b
    X-Powered-By: restheart.org


## Get all Documents from the Collection

### Request

``` bash
$ http GET 127.0.0.1:8080/db/coll
```

### Response

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 227
Content-Type: application/json
Date: Sun, 08 Apr 2018 21:04:44 GMT
ETag: 5aca8368634459000711d92a
X-Powered-By: restheart.org

{
    "_embedded": [
        {
            "_etag": {
                "$oid": "5aca83d8634459000711d92f"
            },
            "_id": {
                "$oid": "5aca83d868a635bcd711d79b"
            },
            "name": "MongoDB",
            "rating": "super cool"
        },
        {
            "_etag": {
                "$oid": "5aca83c9634459000711d92e"
            },
            "_id": {
                "$oid": "5aca83c968a635bcd711d794"
            },
            "name": "RESTHeart",
            "rating": "cool"
        }
    ],
    "_etag": {
        "$oid": "5aca8368634459000711d92a"
    },
    "_id": "coll",
    "_returned": 2,
    "desc": "my first collection created with restheart"
}
```

The interesting part is the \_embedded array:

``` javascript
{
    "_embedded": [
        {
            "_etag": {
                "$oid": "5aca83d8634459000711d92f"
            },
            "_id": {
                "$oid": "5aca83d868a635bcd711d79b"
            },
            "name": "MongoDB",
            "rating": "super cool"
        },
        {
            "_etag": {
                "$oid": "5aca83c9634459000711d92e"
            },
            "_id": {
                "$oid": "5aca83c968a635bcd711d794"
            },
            "name": "RESTHeart",
            "rating": "cool"
        }
    ]
}
```

## GET Document by URL (by id)

### Request

    http GET 127.0.0.1:8080/db/coll/5aca83c968a635bcd711d794

### Response

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 123
Content-Type: application/json
Date: Sun, 08 Apr 2018 21:05:44 GMT
ETag: 5aca83c968a635bcd711d794
X-Powered-By: restheart.org

{
    "_etag": {
        "$oid": "5aca83c968a635bcd711d794"
    },
    "_id": {
        "$oid": "5aca83c9634459000711d92e"
    },
    "name": "RESTHeart",
    "rating": "cool"
}
```

## Query documents by name property (using Collection filter)

### Request

    http GET 127.0.0.1:8080/db/coll?filter="{'name':'MongoDB'}"

### Response

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 204
Content-Type: application/json
Date: Sun, 08 Apr 2018 21:05:59 GMT
ETag: 5aca8368634459000711d92a
X-Powered-By: restheart.org

{
    "_embedded": {
        "_embedded": [
            {
                "_etag": {
                    "$oid": "5aca83d8634459000711d92f"
                },
                "_id": {
                    "$oid": "5aca83d868a635bcd711d79b"
                },
                "name": "MongoDB",
                "rating": "super cool"
            }
        ]
    },
    "_etag": {
        "$oid": "5aca8368634459000711d92a"
    },
    "_id": "coll",
    "_returned": 1,
    "desc": "my first collection created with restheart"
}
```