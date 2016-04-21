---
layout: page-notopnav
title: db
permalink: /curies/2.0/db.html
---

## The DB resource

The DB resource represent a database. Request to DB URIs allow to manage the databases and get the list of their collections and file buckets.

The resource URI format is <code>/&lt;dbname&gt;</code>

### Allowed methods


{: .table }
**Method**|**Description**
------|-----------
GET   |Returns the <dbname> database properties and the <a href="paging.html">paginated</a> list of its collections and file buckets
PUT   |Creates or updates the database <dbname>
PATCH |Updates the database <dbname> (only passed data)
DELETE|Deletes the database <dbname>

### Useful query parameters

### Useful query parameters

{: .table }
**qparam**|**Description**|**applies to**
---------|--------
[page](paging.html)     | Data page to return (default 1)|GET
[pagesize](paging.html) | Data page size (default 100, maximum 1000; If equals to 0 only returns the db properties)|GET
np       | Don't return db properties, i.e. only embedded collections and file buckets|GET

## Examples:

### create the database <code>/test</code> with the property *descr*

{% highlight bash %}
$ http PUT 127.0.0.1:8080/test descr="my first db"
HTTP/1.1 201 Created
...
{% endhighlight %}

### update the database <code>/test</code> adding the property *creator*

{% highlight bash %}
$ http PATCH 127.0.0.1:8080/test creator="ujibang"
{% endhighlight %}

{: .bs-callout .bs-callout-info }

### get the database <code>/test</code> which includes its collections and file buckets as _embedded resources.

{% highlight bash %}
$ http GET 127.0.0.1:8080/test
HTTP/1.1 200 OK
...

{
    "_embedded": {
        "rh:bucket": [
            {
                "_id": "mybucket.files", 
                "descr": "my first bucket",
                "_etag": { "$oid": "5516731ec2e6e922cf58d6af" }
            }
        ], 
        "rh:coll": [
            {
                "_id": "mycollection", 
                "descr": "my first collection",
                "_etag": { "$oid": "55f15fc5c2e65448b566d18d" }
            }
        ]
    }, 
    "descr: "my first db",
    "creator": "ujibang",
    "_etag": { "$oid": "55e84b95c2e66d1e0a8e46b2" },
    "_returned": 2, 
    "_size": 2, 
    "_total_pages": 1, 
}

{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the _etag property. It enables web caching and can be used to avoid ghost writes.<br/>
By default it is mandatory to specify it via the If-Match header to delete a db.
See [ETag](https://softinstigate.atlassian.net/wiki/x/hICM) documentation section for more information.

## Documentation references

* [Root Resource](root.html)
* [Collection Resource](coll.html)
* [Bucket Resource](bucket.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/ToCM" target="_blank">URI Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/hICM" target="_blank">ETag</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.