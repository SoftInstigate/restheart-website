---
layout: docs
title: Tutorial
---

* [Start MongoDB and RESTHeart](#start-mongodb-and-restheart)
* [Create a Database ](#create-a-database)
* [Create a Collection](#create-a-collection)
* [Create two Documents](#create-two-documents)
* [Get all Documents from the Collection](#get-all-documents-from-the-collection)
* [GET Document by URL (by id)](#get-document-by-url-by-id)
* [Query documents by name property (using Collection filter) ](#query-documents-by-name-property-using-collection-filter)

In this tutorial we’ll use RESTHeart to create a db, a collection and a
couple of documents in MongoDB.

Before going further you might want to check:

-   [Setup](/learn/setup)
-   [Resource URI](/learn/resource-uri)
-   [Resource Representation Format](/learn/representation-format)

We’ll use [httpie](http://httpie.org/), a brilliant command line HTTP
client (you can also use curl of course!).

If you just want to play with RESTHeart without installing it, you can
use our [online test instance](http://restheart.org/try). This
instance is constrained to document-related operations on the collection
*/db/coll*, you can't create databases or collections there.

## Start MongoDB and RESTHeart

``` plain
$ mongod --fork --syslog
$ java -jar restheart.jar
22:59:05.134 [main] INFO  org.restheart.Bootstrapper - ANSI colored console: true
22:59:05.156 [main] INFO  org.restheart.Bootstrapper - Starting RESTHeart instance default
22:59:05.156 [main] INFO  org.restheart.Bootstrapper - version 3.2.2
22:59:05.163 [main] INFO  org.restheart.Bootstrapper - Logging to file /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gp/T/restheart.log with level INFO
22:59:05.163 [main] INFO  org.restheart.Bootstrapper - Logging to console with level INFO
22:59:05.582 [main] INFO  org.restheart.Bootstrapper - MongoDB connection pool initialized
22:59:05.582 [main] INFO  org.restheart.Bootstrapper - MongoDB version 3.6
22:59:05.582 [main] WARN  org.restheart.Bootstrapper - ***** No Identity Manager specified. Authentication disabled.
22:59:05.582 [main] WARN  org.restheart.Bootstrapper - ***** No access manager specified. users can do anything.
22:59:05.583 [main] INFO  org.restheart.Bootstrapper - Authentication Mechanism io.undertow.security.impl.BasicAuthenticationMechanism enabled
22:59:05.583 [main] INFO  org.restheart.Bootstrapper - Token based authentication enabled with token TTL 15 minutes
22:59:05.592 [main] INFO  org.restheart.Bootstrapper - HTTPS listener bound at 0.0.0.0:4443
22:59:05.592 [main] INFO  org.restheart.Bootstrapper - HTTP listener bound at 0.0.0.0:8080
22:59:05.593 [main] INFO  org.restheart.Bootstrapper - Local cache for db and collection properties enabled with TTL 1000 msecs
22:59:05.593 [main] INFO  org.restheart.Bootstrapper - Local cache for schema stores not enabled
22:59:05.803 [main] INFO  org.restheart.Bootstrapper - URL / bound to MongoDB resource *
22:59:05.900 [main] INFO  org.restheart.Bootstrapper - Embedded static resources browser extracted in /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gp/T/restheart-8544339744923828070
22:59:05.912 [main] INFO  org.restheart.Bootstrapper - URL /browser bound to static resources /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gp/T/restheart-8544339744923828070. Access Manager: false
22:59:06.216 [main] INFO  org.restheart.Bootstrapper - Pid file /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gp/T/restheart-0.pid
22:59:06.216 [main] INFO  org.restheart.Bootstrapper - RESTHeart started
```

## Create a Database 

**request**

``` plain
$ http PUT 127.0.0.1:8080/db desc='this is my first db created with restheart'
```

**response**

``` bash
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Length: 0
Date: Sun, 08 Apr 2018 21:01:12 GMT
ETag: 56ded28e2d174c2a08cdee81
X-Powered-By: restheart.org
```

## Create a Collection

**request**

``` bash
$ http PUT 127.0.0.1:8080/db/coll desc='my first collection created with restheart'
```

**response**

``` bash
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Length: 0
Date: Sun, 08 Apr 5aca8368634459000711d92a 21:02:44 GMT
ETag: 56ded2b22d174c2a08cdee83
X-Powered-By: restheart.org
```

## Create two Documents

**request**

``` bash
$ http POST 127.0.0.1:8080/db/coll name='RESTHeart' rating='cool'
```

**response**

``` bash
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
```

 

**request**

``` bash
$ http POST 127.0.0.1:8080/db/coll name='MongoDB' rating='super cool'
```

**response**

``` bash
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
```

## Get all Documents from the Collection

**request**

``` bash
$ http GET 127.0.0.1:8080/db/coll
```

**response**

``` bash
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

``` json
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

**request**

``` bash
$ http GET 127.0.0.1:8080/db/coll/5aca83c968a635bcd711d794
```

**response**

``` bash
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

**request**

``` bash
$ http GET 127.0.0.1:8080/db/coll?filter="{'name':'MongoDB'}"
```

**response**

``` bash
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

 

 
