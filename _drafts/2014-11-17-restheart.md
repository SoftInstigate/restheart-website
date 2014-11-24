---
layout: post
title:  "RESTHeart walkthrough"
author: Andrea Di Cesare
date:   2014-11-17 20:07
permalink: /restheart/walkthrough
categories:
  - tutorials
tags:
 - restheart
---

In this walktrhout we'll use RESTHeart to create a db, a collection and a couple of documents in mondodb.<!-- more -->

RESTHeart represents resources as HAL+json documents. Before going furhter you might want to check:

* the [_RESTHeart - the anatomy of a document_](/restheart/the-anatomy-of-a-document) post
* the [HAL specification](http://stateless.co/hal_specification.html)

We'll use [httpie](httpie.org), a brilliant command line HTTP client. You don't have it? Install it or use curl. You don't have curl? Then my condolences, you must be running MS Windows.

## get restheart
{: .post}

- [downlaod](https://github.com/SoftInstigate/RESTHeart/releases) the latest release of RESTHeart from github 
- unzip the package

> note: you'll need mongodb and java 1.8


## start mongodb and restheart
{: .post}

{% highlight bash %}
$ mongod --fork --syslog
$ java -jar restheart.jar
{% endhighlight %}
	12:22:57.051 [main] INFO  c.s.restheart.Bootstrapper - starting RESTHeart ********************************************
	12:22:57.054 [main] INFO  c.s.restheart.Bootstrapper - RESTHeart version 0.9.2
	12:22:57.104 [main] INFO  c.s.restheart.Bootstrapper - initializing mongodb connection pool to 127.0.0.1:27017 
	12:22:57.106 [main] INFO  c.s.restheart.Bootstrapper - mongodb connection pool initialized
	12:22:57.402 [main] WARN  c.s.restheart.Bootstrapper - ***** no identity manager specified. authentication disabled.
	12:22:57.403 [main] WARN  c.s.restheart.Bootstrapper - ***** no access manager specified. users can do anything.
	12:22:57.551 [main] INFO  c.s.restheart.Bootstrapper - https listener bound at 0.0.0.0:4443
	12:22:57.551 [main] INFO  c.s.restheart.Bootstrapper - http listener bound at 0.0.0.0:8080
	12:22:57.553 [main] INFO  c.s.restheart.Bootstrapper - local cache enabled
	12:22:57.569 [main] INFO  c.s.restheart.Bootstrapper - url / bound to mongodb resource *
	12:22:57.635 [main] INFO  c.s.restheart.Bootstrapper - embedded static resources onlinedoc extracted in /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart-2243768268884948475
	12:22:57.694 [main] INFO  c.s.restheart.Bootstrapper - embedded static resources browser extracted in /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart-6218787096590384193
	12:22:57.694 [main] INFO  c.s.restheart.Bootstrapper - url /browser bound to static resources browser. access manager: false
	12:22:57.846 [main] INFO  c.s.restheart.Bootstrapper - logging to /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart.log with level INFO
	12:22:57.847 [main] INFO  c.s.restheart.Bootstrapper - logging to console with level INFO
	12:22:57.847 [main] INFO  c.s.restheart.Bootstrapper - RESTHeart started ********************************************

## create the db
{: .post}

{% highlight bash %}
$ http PUT 127.0.0.1:8080/myfirstdb desc='this is my first db created with restheart'
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 0
Date: Tue, 18 Nov 2014 11:27:21 GMT
{% endhighlight %}

## create the collection
{: .post}

{% highlight bash %}
$ http PUT 127.0.0.1:8080/myfirstdb/myfirstcoll desc='this is my first collection created with restheart'
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 0
Date: Tue, 18 Nov 2014 11:28:27 GMT
{% endhighlight %}

## create few documents
{: .post}

{% highlight bash %}
$ http POST 127.0.0.1:8080/myfirstdb/myfirstcoll name='restheart' rating='super cool'
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 0
Date: Tue, 18 Nov 2014 11:29:48 GMT
Location: http://127.0.0.1:8080/myfirstdb/myfirstcoll/546b2dacef863f5121fc91f1

$ http POST 127.0.0.1:8080/myfirstdb/myfirstcoll name='mongodb' rating='hyper cool'
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 0
Date: Tue, 18 Nov 2014 11:30:21 GMT
Location: http://127.0.0.1:8080/myfirstdb/myfirstcoll/546b2dcdef863f5121fc91f3
{% endhighlight %}

## get all documents of the collection
{: .post}

{% highlight bash %}
$ http GET 127.0.0.1:8080/myfirstdb/myfirstcoll
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 525
Content-Type: application/hal+json
Date: Tue, 18 Nov 2014 11:32:45 GMT
{% endhighlight %}
{% highlight json %}
{ "_type" : "COLLECTION" , "_id" : "myfirstcoll" , "desc" : "this is my first collection created with restheart" , "_created_on" : "2014-11-18T11:28:27Z" , "_etag" : "546b2d5bef863f5121fc91ef" , "_lastupdated_on" : "2014-11-18T11:28:27Z" , "_collection-props-cached" : false , "_returned" : 2 , "_embedded" : { "rh:doc" : [ { "_type" : "DOCUMENT" , "_id" : "546b2dacef863f5121fc91f1" , "name" : "restheart" , "rating" : "super cool" , "_etag" : "546b2dacef863f5121fc91f0" , "_created_on" : "2014-11-18T11:29:48Z" , "_lastupdated_on" : "2014-11-18T11:29:48Z" , "_links" : { "self" : { "href" : "/myfirstdb/myfirstcoll/546b2dacef863f5121fc91f1"} , "rh:coll" : { "href" : "/myfirstdb"} , "curies" : [ { "href" : "/_doc/?ln=http://www.restheart.org/docs/v0.9/%23api/doc/{rel}" , "templated" : true , "name" : "rh"}]}} , { "_type" : "DOCUMENT" , "_id" : "546b2dcdef863f5121fc91f3" , "name" : "mongodb" , "rating" : "hyper cool" , "_etag" : "546b2dcdef863f5121fc91f2" , "_created_on" : "2014-11-18T11:30:21Z" , "_lastupdated_on" : "2014-11-18T11:30:21Z" , "_links" : { "self" : { "href" : "/myfirstdb/myfirstcoll/546b2dcdef863f5121fc91f3"} , "rh:coll" : { "href" : "/myfirstdb"} , "curies" : [ { "href" : "/_doc/?ln=http://www.restheart.org/docs/v0.9/%23api/doc/{rel}" , "templated" : true , "name" : "rh"}]}}]} , "_links" : { "self" : { "href" : "/myfirstdb/myfirstcoll"} , "rh:db" : { "href" : "/myfirstdb"} , "rh:filter" : { "href" : "/myfirstdb/myfirstcoll/{?filter}" , "templated" : true} , "rh:sort" : { "href" : "/myfirstdb/myfirstcoll/{?sort_by}" , "templated" : true} , "rh:paging" : { "href" : "/myfirstdb/myfirstcoll/{?page}{&pagesize}" , "templated" : true} , "rh:countandpaging" : { "href" : "/myfirstdb/myfirstcoll/{?page}{&pagesize}&count" , "templated" : true} , "rh:_indexes" : { "href" : "/myfirstdb/myfirstcoll/_indexes"} , "curies" : [ { "href" : "/_doc/?ln=http://www.restheart.org/docs/v0.9/%23api/coll/{rel}" , "templated" : true , "name" : "rh"}]}}
{% endhighlight %}

> the interesting part of the returned HAL+json object is the _embedded object

{% highlight json %}

	"_embedded": {
        "rh:doc": [
            {
            	"_type": "DOCUMENT", 
                "name": "restheart", 
                "rating": "super cool",
                "_created_on": "2014-11-18T11:29:48Z", 
                "_etag": "546b2dacef863f5121fc91f0", 
                "_id": "546b2dacef863f5121fc91f1", 
                "_lastupdated_on": "2014-11-18T11:29:48Z", 
                "_links": {...}  
            }, 
            {
            	"_type": "DOCUMENT", 
                "name": "mongodb", 
                "rating": "hyper cool"
                "_created_on": "2014-11-18T11:30:21Z", 
                "_etag": "546b2dcdef863f5121fc91f2", 
                "_id": "546b2dcdef863f5121fc91f3", 
                "_lastupdated_on": "2014-11-18T11:30:21Z", 
                "_links": {...}
            }
        ]
    }
{% endhighlight %}

## document by URL (by id)
{: .post}

{% highlight bash %}
$ http GET 127.0.0.1:8080/myfirstdb/myfirstcoll/546b2dacef863f5121fc91f1
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 276
Content-Type: application/hal+json
Date: Tue, 18 Nov 2014 11:34:59 GMT
ETag: 546b2dacef863f5121fc91f0
{% endhighlight %}
{% highlight json %}
{
    "_created_on": "2014-11-18T11:29:48Z", 
    "_etag": "546b2dacef863f5121fc91f0", 
    "_id": "546b2dacef863f5121fc91f1", 
    "_lastupdated_on": "2014-11-18T11:29:48Z", 
    "_links": {
        "curies": [
            {
                "href": "/_doc/?ln=http://www.restheart.org/docs/v0.9/%23api/doc/{rel}", 
                "name": "rh", 
                "templated": true
            }
        ], 
        "rh:coll": {
            "href": "/myfirstdb/myfirstcoll"
        }, 
        "self": {
            "href": "/myfirstdb/myfirstcoll/546b2dacef863f5121fc91f1"
        }
    }, 
    "_type": "DOCUMENT", 
    "name": "restheart", 
    "rating": "super cool"
}
{% endhighlight %}

## document by name (using collection filter)
{: .post}

{% highlight bash %}
$ http GET 127.0.0.1:8080/myfirstdb/myfirstcoll?filter="{'name':'restheart'}"
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 520
Content-Type: application/hal+json
Date: Tue, 18 Nov 2014 11:41:32 GMT
{% endhighlight %}
{% highlight json %}
{
    "_collection-props-cached": false, 
    "_created_on": "2014-11-18T11:28:27Z", 
    "_embedded": {
        "rh:doc": [
            {
                "_created_on": "2014-11-18T11:29:48Z", 
                "_etag": "546b2dacef863f5121fc91f0", 
                "_id": "546b2dacef863f5121fc91f1", 
                "_lastupdated_on": "2014-11-18T11:29:48Z", 
                "_links": {
                    "curies": [
                        {
                            "href": "/_doc/?ln=http://www.restheart.org/docs/v0.9/%23api/doc/{rel}", 
                            "name": "rh", 
                            "templated": true
                        }
                    ], 
                    "rh:coll": {
                        "href": "/myfirstdb"
                    }, 
                    "self": {
                        "href": "/myfirstdb/myfirstcoll/546b2dacef863f5121fc91f1"
                    }
                }, 
                "_type": "DOCUMENT", 
                "name": "restheart", 
                "rating": "super cool"
            }
        ]
    }, 
    "_etag": "546b2d5bef863f5121fc91ef", 
    "_id": "myfirstcoll", 
    "_lastupdated_on": "2014-11-18T11:28:27Z", 
    "_links": {
        "curies": [
            {
                "href": "/_doc/?ln=http://www.restheart.org/docs/v0.9/%23api/coll/{rel}", 
                "name": "rh", 
                "templated": true
            }
        ], 
        "first": {
            "href": "/myfirstdb/myfirstcoll?pagesize=100&filter=%7B'name':'restheart'%7D"
        }, 
        "next": {
            "href": "/myfirstdb/myfirstcoll?page=2&pagesize=100&filter=%7B'name':'restheart'%7D"
        }, 
        "rh:_indexes": {
            "href": "/myfirstdb/myfirstcoll/_indexes"
        }, 
        "rh:countandpaging": {
            "href": "/myfirstdb/myfirstcoll/{?page}{&pagesize}&count", 
            "templated": true
        }, 
        "rh:db": {
            "href": "/myfirstdb"
        }, 
        "rh:filter": {
            "href": "/myfirstdb/myfirstcoll/{?filter}", 
            "templated": true
        }, 
        "rh:paging": {
            "href": "/myfirstdb/myfirstcoll/{?page}{&pagesize}", 
            "templated": true
        }, 
        "rh:sort": {
            "href": "/myfirstdb/myfirstcoll/{?sort_by}", 
            "templated": true
        }, 
        "self": {
            "href": "/myfirstdb/myfirstcoll?filter=%7B'name':'restheart'%7D"
        }
    }, 
    "_returned": 1, 
    "_type": "COLLECTION", 
    "desc": "this is my first collection created with restheart"
}
{% endhighlight %}



