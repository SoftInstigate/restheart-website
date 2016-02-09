---
layout: page-notopnav
title: db
permalink: /curies/1.2/db.html
---

## The DB resource

The DB resource represent a database. Request to DB URIs allow to manage the databases and get the list of their collections and file buckets.

Allowed methods are:


{: .table }
**Method**|**Description**
------|-----------
GET   |Returns the <dbname> database properties and the <a href="paging.html">paginated</a> list of its collections and file buckets
PUT   |Creates or updates the database <dbname>
PATCH |Updates the database <dbname> (only passed data)
DELETE|Deletes the database <dbname>

The resource URI format is <code>/&lt;dbname&gt;</code>

## Examples:

### create the database <code>/test</code> with the property *descr*

{% highlight bash %}
$ http PUT 127.0.0.1:8080/test descr="my first db"
HTTP/1.1 201 Created
...
ETag: 55e84b95c2e66d1e0a8e46b2
{% endhighlight %}

### update the database <code>/test</code> adding the property *creator*

{% highlight bash %}
$ http PUT 127.0.0.1:8080/test creator="ujibang" If-Match:55e84b95c2e66d1e0a8e46b2
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the If-Match request header. This needs to be added to modify an existing resource. 
See [ETag](https://softinstigate.atlassian.net/wiki/x/hICM) documentation section for more information.

### get the database <code>/test</code> which includes its collections and file buckets as _embedded resources.

{% highlight bash %}
$ http GET 127.0.0.1:8080/test
HTTP/1.1 200 OK
...

{
    "_created_on": "2015-03-28T09:22:48Z", 
    "_db-props-cached": false,
    "_links": {
        "rh:root": {
            "href": "/"
        }, 
        ...
    }, 
    "_embedded": {
        "rh:bucket": [
            {
                "_collection-props-cached": false, 
                "_created_on": "2015-03-28T09:23:42Z", 
                "_embedded": {}, 
                "_etag": {
                    "$oid": "5516731ec2e6e922cf58d6af"
                }, 
                "_id": "mybucket.files", 
                "_lastupdated_on": "2015-03-28T09:23:42Z", 
                "_links": {
                    "self": {
                        "href": "/test/mybucket.files"
                    }
                }, 
                "_type": "FILES_BUCKET", 
                "descr": "my first bucket"
            }
        ], 
        "rh:coll": [
            {
                "_collection-props-cached": false, 
                "_created_on": "2015-09-10T10:47:33Z", 
                "_embedded": {}, 
                "_etag": {
                    "$oid": "55f15fc5c2e65448b566d18d"
                }, 
                "_id": "mycollection", 
                "_lastupdated_on": "2015-09-10T10:47:33Z", 
                "_links": {
                    "self": {
                        "href": "/test/mycollection"
                    }
                }, 
                "_type": "COLLECTION", 
                "descr": "my first collection"
            }
        ]
    }, 
    ...
    "_returned": 2, 
    "_size": 2, 
    "_total_pages": 1, 
    "_type": "DB", 
    "descr": "my first db"
}
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note between the _links, the link to its parent resource, in this case the root.

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