---
layout: page
title: paging
permalink: /curies/1.0/paging.html
---

## Introduction

RESTHeart represents resources using the HAL format where children resources are returned as embedded resources.

* Root embeds Dbs
* Dbs embed Collections and File buckets
* Collections embed Documents
* File buckets embed Files

Example, a GET on /rest/coll collection URI, returns its documents in the **_embedded.rh:doc** array.

{% highlight js %}

$ http GET 127.0.0.1:8080/test/coll
HTTP/1.1 200 OK
...
 
{
    "_embedded": {
        "rh:doc": [
            { <DOC1> }, { <DOC2> }, { <DOC3> }, ..., { <DOC100> }
        ]
    },
    "_returned": 100,
    ...
}

{% endhighlight %}

## Pagination

The embedded resources are paginated, i.e. only a subset of the children resources is returned on each request.

* The number of embedded resources to return is controlled via the **pagesize** query parameter. Its default value is 100, maximum size is 1000.
* The page to return is specified with the **page** query parameter.
* Some links are generated:
    * **first**: links to the first page
    * **last**: links to the last page (only if the *count* query parameter has been specified)
    * **next**: links to the next page
    * **previous**: links to the previuos page
{: } 

{: .bs-callout .bs-callout-info }
Dbs and Collections are sorted alphabetically.<br>
Documents and Files are sorted by default by _id descending. If _id are ObjectId, this makes sure that last created document or file is the first returned. See [sort](sort.html) for more inforation.

{: .bs-callout .bs-callout-info }
For Root and DBs, **_total_pages**: and **_size** are always returned.<br>
For collections, the are returned only if the *count* query parameter is specified.
Note that in this case, two queries are actually needed slowing down the request.


For instance, to return the documents from 20 to 29 (page 3) of the collection /test/coll:

{% highlight js %}
$ http GET "127.0.0.1:8080/test/coll?count&page=3&pagesize=10"
HTTP/1.1 200 OK
...
{
    "_embedded": {
        "rh:doc": [
            { <DOC30> }, { <DOC31> }, ... { <DOC39> }
        ]
    },
    "_links": {
        "curies": [ ... ],
        "first": {
            "href": "/test/huge?pagesize=10&count"
        },
        "last": {
            "href": "/test/huge?page=73&pagesize=10&count"
        },
        "next": {
            "href": "/test/huge?page=4&pagesize=10&count"
        },
        "previous": {
            "href": "/test/huge?page=2&pagesize=10&count"
        },
        ...
    },
    "_returned": 10,
    "_size": 343,
    "_total_pages": 35
}
{% endhighlight %}

## Documentation references

* [Root Resource](root.html)
* [DB Resource](db.html)
* [Collection Resource](coll.html)
* [Bucket Resource](bucket.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/UICM" target="_blank">Representation Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/XACk" target="_blank">Query Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.