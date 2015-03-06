---
layout: doc-page-md
title:  "Resource Representation Format"
permalink: /docs/resource-representation-format.html
menu:
 id: 4
 subid: 1
---

Following the REST mantra, you _transfer_ resource _states_ back and forth by the means of _representations_.
This section introduces you the resource **representation** format used by RESTHeart.

## Hypermedia Application Language
{: .post}

RESTHeart uses the [HAL+json](http://stateless.co/hal_specification.html) hypermedia format. HAL stands for _Hypermedia Application Language_ and it is simple, elegant and powerful.
{: .bs-callout.bs-callout-info}

__HAL__ builds up on 2 simple concepts: _Resources_ and _Links_

> Resources have state (plain JSON), embedded resources and links

> Links have target (href URI) and relations (aka _rel_)

![](http://stateless.co/info-model.png)

## Strict mode representations of BSON

__RESTHeart__ represents the state of MongoDb resources using the [strict mode representations of BSON](http://docs.mongodb.org/manual/reference/mongodb-extended-json/) that conforms to the [JSON RFC](http://www.json.org/). 
{: .bs-callout.bs-callout-info}

> MongoDB uses the [BSON](https://en.wikipedia.org/wiki/BSON) data format which type system is a superset of JSON's. To preserve type information, MongoDB adds this extension to the JSON.

For instance, the following JSON document includes an ObjectId and a Date. This types are supported by BSON and represented according to the strict mode representation.

{% highlight json %}

{
 "_id": { "$oid": "546b2dcdef863f5121fc91f3" },
 "date": { "$date": 1 },
 "pi": 3.1415
}

{% endhighlight %}

__Note__: the strinct mode is used on both request and response resource representation and also on filter query parameters.
{: .bs-callout.bs-callout-warning}

This filter request, won't find any document since the _id field is an ObjectId and not a String.
{% highlight bash %}
GET /myfirstdb/myfirstcoll?filter={'_id':'546b2dcdef863f5121fc91f3'}
{% endhighlight %}
The correct request is: 
{% highlight bash %}
GET /myfirstdb/myfirstcoll?filter={'_id':{'$oid':'546b2dcdef863f5121fc91f3'}}
{% endhighlight %}

## The code baby!
{: .post}

We'll get a collection resource and analyze it. As any other in RESTHeart, a collection resource is represented with HAL; thus has its own properties, documents as embedded resources and links (for pagination, sorting, etc).

{% highlight bash %}
$ http --pretty=none GET 127.0.0.1:8080/myfirstdb/myfirstcoll?count
HTTP/1.1 200 OK
Content-Encoding: gzip
Connection: keep-alive
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Location
Content-Type: application/hal+json
Content-Length: 710
Date: Thu, 05 Mar 2015 23:23:27 GMT
{% endhighlight %}
{% highlight json %}
{ "_embedded" : { "rh:doc" : [ { "_embedded" : { } , "_links" : { "self" : { "href" : "/myfirstdb/myfirstcoll/546b2dcdef863f5121fc91f3"} , "rh:coll" : { "href" : "/myfirstdb"} , "curies" : [ { "href" : "http://www.restheart.org/docs/v0.10/#api-doc-{rel}" , "name" : "rh"}]} , "_type" : "DOCUMENT" , "_id" : { "$oid" : "546b2dcdef863f5121fc91f3"} , "name" : "mongodb" , "rating" : "hyper cool" , "_etag" : { "$oid" : "546b2dcdef863f5121fc91f2"} , "_created_on" : "2014-11-18T11:30:21Z" , "_lastupdated_on" : "2014-11-18T11:30:21Z"} , { "_embedded" : { } , "_links" : { "self" : { "href" : "/myfirstdb/myfirstcoll/546b2dacef863f5121fc91f1"} , "rh:coll" : { "href" : "/myfirstdb"} , "curies" : [ { "href" : "http://www.restheart.org/docs/v0.10/#api-doc-{rel}" , "name" : "rh"}]} , "_type" : "DOCUMENT" , "_id" : { "$oid" : "546b2dacef863f5121fc91f1"} , "name" : "restheart" , "rating" : "super cool" , "_etag" : { "$oid" : "546b2dacef863f5121fc91f0"} , "_created_on" : "2014-11-18T11:29:48Z" , "_lastupdated_on" : "2014-11-18T11:29:48Z"} , { "_embedded" : { } , "_links" : { "self" : { "href" : "#"} , "rh:coll" : { "href" : "/myfirstdb"} , "curies" : [ { "href" : "http://www.restheart.org/docs/v0.10/#api-doc-{rel}" , "name" : "rh"}]} , "_type" : "DOCUMENT" , "_id" : { "_id" : "_properties.myfirstcoll"} , "_created_on" : "2015-01-28T21:55:40Z" , "_etag" : { "$oid" : "54c95adcc2e63bd1bdacbebe"} , "_lastupdated_on" : "2015-01-28T21:55:40Z"}] , "rh:warnings" : [ { "_embedded" : { } , "_links" : { "self" : { "href" : "#warnings"}} , "message" : "filtered out reserved resource /myfirstdb/myfirstcoll/_properties"} , { "_embedded" : { } , "_links" : { "self" : { "href" : "#warnings"}} , "message" : "this resource does not have an URI since the _id is of type BasicDBObject"}]} , "_links" : { "self" : { "href" : "/myfirstdb/myfirstcoll?count"} , "first" : { "href" : "/myfirstdb/myfirstcoll?pagesize=100&count"} , "last" : { "href" : "/myfirstdb/myfirstcoll&pagesize=100&count"} , "rh:db" : { "href" : "/myfirstdb"} , "rh:filter" : { "href" : "/myfirstdb/myfirstcoll/{?filter}" , "templated" : true} , "rh:sort" : { "href" : "/myfirstdb/myfirstcoll/{?sort_by}" , "templated" : true} , "rh:paging" : { "href" : "/myfirstdb/myfirstcoll/{?page}{&pagesize}" , "templated" : true} , "rh:countandpaging" : { "href" : "/myfirstdb/myfirstcoll/{?page}{&pagesize}&count" , "templated" : true} , "rh:indexes" : { "href" : "/myfirstdb/myfirstcoll/_indexes"} , "curies" : [ { "href" : "http://www.restheart.org/docs/v0.10/#api-coll-{rel}" , "templated" : true , "name" : "rh"}]} , "_type" : "COLLECTION" , "_id" : "myfirstcoll" , "_created_on" : "2015-01-28T22:42:19Z" , "_etag" : { "$oid" : "54c965cbc2e64568e235b70f"} , "_lastupdated_on" : "2015-01-28T22:42:19Z" , "_collection-props-cached" : false , "_size" : 4 , "_total_pages" : 1 , "_returned" : 4}

{% endhighlight %}

## The properties
{: .post}

In this case, the collection properties comprise the field _desc_; this is user defined.

The other fields are reserved properties (i.e. are managed automatically by RESTHeart for you); these always starts with _:

| Property                     | Description                                                                                                                                                                                                                           |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **_type**                    | the type of this resource. in this case 'COLLECTION'                                                                                                                                                                                                                                     |
| **_id**                      | the name of the collection                                                                                                                                                                                                            |
| **_etag**                    | entity tag, used for caching and to avoid ghost writes.                                                                                                                                                                               |
| **_created_on**              | collection creation date stamp in ISO 6801 format. This is not actually stored but derived from _id if it is an ObjectId                                                                                                                                                                                     |
| **_lastupdated_on**          | collection last update date stamp in ISO 6801 format. This is not actually stored but derived from etag that is an ObjectId                                                                                                                                                                                                            |
| **_size**                    | the number of the documents in the collection (note this is only returned if the count query parameter is specified)                                                                                                                  |
| **_returned**                | the number of the documents embedded in this representation                                                                                                                                                                           |
| **_collection-props-cached** | a flag that gets true when the returned collection properties come from the local cache. refer to the [local cache documentation](http://127.0.0.1:4000/docs/configuration.html#conf-performance) for more information |
{: .table .table-bordered}

{% highlight json %}
{
    "_type": "COLLECTION",
  	"_id": "myfirstcoll",
  	"desc": "this is my first collection created with restheart",
  	"_created_on": "2014-11-18T11:28:27Z",
  	"_etag": {"$oid": "546b2d5bef863f5121fc91ef" },
  	"_lastupdated_on": "2014-11-18T11:28:27Z",
  	"_collection-props-cached": false,
  	"_size": 2,
  	"_returned": 2,
    "_embedded": {...},
    "_links": {...}
}
{% endhighlight %}

## The embedded resources
{: .post}

> the collection embedded resources are the collection documents, recursively represented as HAL documents.

{% highlight json %}

	"_embedded": {
        "rh:doc": [
            {
            	"_type": "DOCUMENT", 
                "name": "restheart", 
                "rating": "super cool",
                "_created_on": "2014-11-18T11:29:48Z", 
                "_etag": { "$oid": "546b2dacef863f5121fc91f0" }, 
                "_id": { "$oid": "546b2dacef863f5121fc91f1" }, 
                "_lastupdated_on": "2014-11-18T11:29:48Z", 
                "_links": {...}  
            }, 
            {
            	"_type": "DOCUMENT", 
                "name": "mongodb", 
                "rating": "hyper cool"
                "_created_on": "2014-11-18T11:30:21Z", 
                "_etag": { "$oid": "546b2dcdef863f5121fc91f2" }, 
                "_id": { "$oid": "546b2dcdef863f5121fc91f3" }, 
                "_lastupdated_on": "2014-11-18T11:30:21Z", 
                "_links": {...}
            }
        ]
    }
{% endhighlight %}

## The links
{: .post}

| Link                  | Description                                                                               |
|-----------------------|-------------------------------------------------------------------------------------------|
| **self**              | link to itself                                                                            |
| **first**             | link to the first page                                                                    |
| **last**              | link to the last page                                                                     |
| **rh:filter**         | templated link for filtering                                                              |
| **rh:sort**           | templated link for sorting                                                                |
| **rh:indexes**        | link to the collection indexes resource                                                   |
| **rh:paging**         | templated link for paging                                                                 |
| **rh:countandpaging** | - templated link for counting (return the number of documents in the collection) and paging|
| **curies**            | (compacts URIes) bind links to documentation. For instance the rh:db rel is documented at [http://www.restheart.org/docs/v0.10/#api-coll-db](http://www.restheart.org/docs/v0.10/#api-coll-db).|
{: .table .table-bordered}

{% highlight json %}
"_links": {
    "curies": [
        {
            "href": "http://www.restheart.org/docs/v0.10/#api-coll-db", 
            "name": "rh", 
            "templated": true
        }
    ], 
    "first": {
        "href": "/myfirstdb/myfirstcoll?pagesize=100&count"
    }, 
    "last": {
        "href": "/myfirstdb/myfirstcoll&pagesize=100&count"
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
        "href": "/myfirstdb/myfirstcoll?count"
    }
{% endhighlight %}