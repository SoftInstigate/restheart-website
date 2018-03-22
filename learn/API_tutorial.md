---
layout: docs
title: API tutorial
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

RESTHeart represents resources as HAL+JSON documents. Before going
further you might want to check:

-   [Installation and Setup](Installation_and_Setup)
-   [Resource Representation Format](Representation_Format)
-   the [HAL specification](http://stateless.co/hal_specification.html)

We’ll use [httpie](http://httpie.org/), a brilliant command line HTTP
client (you can also use curl of course!).

If you just want to play with RESTHeart without installing it, you can
use our [online test instance](http://restheart.org/try.html). This
instance is constrained to document-related operations on the collection
*/db/coll*, you can't create databases or collections there.

## Start MongoDB and RESTHeart

``` plain
$ mongod --fork --syslog
$ java -jar restheart.jar
14:21:54.854 [main] INFO  org.restheart.Bootstrapper - Starting RESTHeart
14:21:54.857 [main] INFO  org.restheart.Bootstrapper - version 2.0.0
14:21:54.862 [main] INFO  org.restheart.Bootstrapper - Logging to file /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart.log with level INFO
14:21:54.862 [main] INFO  org.restheart.Bootstrapper - Logging to console with level INFO
14:21:55.080 [main] INFO  org.restheart.Bootstrapper - MongoDB connection pool initialized
14:21:55.080 [main] INFO  org.restheart.Bootstrapper - MongoDB version 3.2.0
14:21:55.080 [main] WARN  org.restheart.Bootstrapper - ***** No Identity Manager specified. Authentication disabled.
14:21:55.080 [main] WARN  org.restheart.Bootstrapper - ***** No access manager specified. users can do anything.
14:21:55.081 [main] INFO  org.restheart.Bootstrapper - Token based authentication enabled with token TTL 15 minutes
14:21:55.302 [main] INFO  org.restheart.Bootstrapper - HTTPS listener bound at 0.0.0.0:4443
14:21:55.303 [main] INFO  org.restheart.Bootstrapper - HTTP listener bound at 0.0.0.0:8080
14:21:55.304 [main] INFO  org.restheart.Bootstrapper - Local cache for db and collection properties enabled with TTL 1000 msecs
14:21:55.304 [main] INFO  org.restheart.Bootstrapper - Local cache for schema stores not enabled
14:21:55.428 [main] INFO  org.restheart.Bootstrapper - URL / bound to MongoDB resource *
14:21:55.560 [main] INFO  org.restheart.Bootstrapper - Embedded static resources browser extracted in /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart-1979968565115069356
14:21:55.577 [main] INFO  org.restheart.Bootstrapper - URL /browser bound to static resources browser. Access Manager: false
14:21:55.783 [main] INFO  org.restheart.Bootstrapper - Pid file /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart-0.pid
14:21:55.783 [main] INFO  org.restheart.Bootstrapper - RESTHeart started
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
Date: Tue, 08 Mar 2016 13:24:31 GMT
ETag: 56ded28e2d174c2a08cdee81
X-Powered-By: restheart.org
```

## Create a Collection

**request**

``` bash
$ http PUT 127.0.0.1:8080/db/coll desc='this is my first collection created with restheart'
```

**response**

``` bash
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Length: 0
Date: Tue, 08 Mar 2016 13:25:06 GMT
ETag: 56ded2b22d174c2a08cdee83
X-Powered-By: restheart.org
```

## Create two Documents

**request**

``` bash
$ http POST 127.0.0.1:8080/db/coll name='restheart' rating='super cool'
```

**response**

``` bash
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Length: 0
Date: Tue, 08 Mar 2016 13:25:40 GMT
ETag: 56ded2d42d174c2a08cdee84
Location: http://127.0.0.1:8080/db/coll/56ded2d4ad66b2a1e741c053
X-Powered-By: restheart.org 
```

 

**request**

``` bash
$ http POST 127.0.0.1:8080/db/coll name='mongodb' rating='hyper cool'
```

**response**

``` bash
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Length: 0
Date: Tue, 08 Mar 2016 13:26:06 GMT
ETag: 56ded2ee2d174c2a08cdee85
Location: http://127.0.0.1:8080/db/coll/56ded2eead66b2a1e741c054
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
Content-Length: 235
Content-Type: application/hal+json
Date: Tue, 08 Mar 2016 13:26:29 GMT
ETag: 56ded2b22d174c2a08cdee83
X-Powered-By: restheart.org

{
    "_embedded": {
        "rh:doc": [
            {
                "_etag": {
                    "$oid": "56ded2ee2d174c2a08cdee85"
                }, 
                "_id": {
                    "$oid": "56ded2eead66b2a1e741c054"
                }, 
                "name": "mongodb", 
                "rating": "hyper cool"
            }, 
            {
                "_etag": {
                    "$oid": "56ded2d42d174c2a08cdee84"
                }, 
                "_id": {
                    "$oid": "56ded2d4ad66b2a1e741c053"
                }, 
                "name": "restheart", 
                "rating": "super cool"
            }
        ]
    }, 
    "_etag": {
        "$oid": "56ded2b22d174c2a08cdee83"
    }, 
    "_id": "coll", 
    "_returned": 2, 
    "desc": "this is my first collection created with restheart"
}
```

The interesting part of the returned HAL+JSON object is the \_embedded
object:

``` json
{
    "rh:doc": [
        {
            "_etag": {
                "$oid": "56ded2ee2d174c2a08cdee85"
            }, 
            "_id": {
                "$oid": "56ded2eead66b2a1e741c054"
            }, 
            "name": "mongodb", 
            "rating": "hyper cool"
        }, 
        {
            "_etag": {
                "$oid": "56ded2d42d174c2a08cdee84"
            }, 
            "_id": {
                "$oid": "56ded2d4ad66b2a1e741c053"
            }, 
            "name": "restheart", 
            "rating": "super cool"
        }
    ]
}
```

## GET Document by URL (by id)

**request**

``` bash
$ http GET 127.0.0.1:8080/db/coll/56ded2eead66b2a1e741c054
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
Content-Type: application/hal+json
Date: Tue, 08 Mar 2016 13:27:34 GMT
X-Powered-By: restheart.org

{
    "_etag": {
        "$oid": "56ded2ee2d174c2a08cdee85"
    }, 
    "_id": {
        "$oid": "56ded2eead66b2a1e741c054"
    }, 
    "name": "mongodb", 
    "rating": "hyper cool"
}
```

## Query documents by name property (using Collection filter) 

**request**

``` bash
$ http GET 127.0.0.1:8080/db/coll?filter="{'name':'restheart'}"
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
Content-Type: application/hal+json
Date: Tue, 08 Mar 2016 13:28:18 GMT
ETag: 56ded2b22d174c2a08cdee83
X-Powered-By: restheart.org

{
    "_embedded": {
        "rh:doc": [
            {
                "_etag": {
                    "$oid": "56ded2d42d174c2a08cdee84"
                }, 
                "_id": {
                    "$oid": "56ded2d4ad66b2a1e741c053"
                }, 
                "name": "restheart", 
                "rating": "super cool"
            }
        ]
    }, 
    "_etag": {
        "$oid": "56ded2b22d174c2a08cdee83"
    }, 
    "_id": "coll", 
    "_returned": 1, 
    "desc": "this is my first collection created with restheart"
}
```

 

 
