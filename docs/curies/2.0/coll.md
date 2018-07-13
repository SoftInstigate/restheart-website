---
layout: page-notopnav
title: coll
permalink: /curies/2.0/coll.html
---

## The Collection resource

The Collection resource represents a collection.
Requests to Collection URI allow to manage the collections, create documents and get the list of existing documents.

The resource URI format is <code>/&lt;dbname&gt;/&lt;collname&gt;</code>

### Allowed methods

{: .table }
**Method**|**Description**
GET	|Returns the collection properties and the list of its documents
PUT	|Creates or updates the collection
PATCH	|Updates the collection properties
POST	|Creates or updates one document (passing an object) or several documents (passing an array of objects) in the collection
DELETE	|Deletes the collection

### Useful query parameters

{: .table }
**qparam**|**Description**|**applies to**
---------|--------
[page](paging.html)     | Data page to return (default 1)|GET
[pagesize](paging.html) | Data page size (default 100, maximum 1000; If equals to 0 only returns the db properties)|GET
np       | Don't return collection properties, i.e. only embedded documents|GET
[filter](filter.html)   | Filter query|GET
[keys](keys.html)     | Documents keys to return (projection)|GET
[sort](sort.html)     | Sort to apply to returned documents|GET
[shardkey](shardkey.html)  | In case of shared server, the shard keys|Any verb

## Examples:

### create the collection <code>/test/coll</code> with the property *descr*

{% highlight bash %}
$ http PUT 127.0.0.1:8080/test/coll descr="my first collection"
HTTP/1.1 201 Created
...
{% endhighlight %}

### update the collection <code>/test</coll</code> adding the property *creator*

{% highlight bash %}
$ http PUT 127.0.0.1:8080/test/coll creator="ujibang"
HTTP/1.1 201 CREATED
...
{% endhighlight %}

### create a document in the collection <code>/test/coll</code>.

{% highlight bash %}
http POST 127.0.0.01:8080/test/coll number:=1 string="whatever" array:='[1,2,3]' object:='{"a":1,"b":2}'
HTTP/1.1 201 CREATED
...
Location: http://127.0.0.01:8080/test/coll/56053e09c2e6b6654c501db0
{% endhighlight %}

{: .bs-callout .bs-callout-info }
A document can also be created via a PUT to a document URI. POSTing the collection has the
advantage that the  _id will be automatically generated (of type ObjectId) and returned in the Location response header.

{: .bs-callout .bs-callout-info }
Note the Location response header. This is the URL of the created document.

### get the collection <code>/test/coll</code> which includes its documents as _embedded resources.

{% highlight bash %}
$ http GET 127.0.0.1:8080/test/coll
HTTP/1.1 200 OK
...

{
    "_embedded": {
        "rh:doc": [
            {
                "_id": { "$oid": "55f15fc5c2e65448b566d18d" }
                "array": [ 1, 2, 3 ], 
                "number": 1, 
                "object": { "a": 1, "b": 2 }, 
                "string": "whatever",
                "_etag": { "$oid": "5516731ec2e6e922cf58d6af" }
            }
        ]
    }, 
    ...
    "_returned": 1, 
    "descr": "a collection for testing",
    "_etag": { "$oid": "55e84b95c2e66d1e0a8e46b2" },
}
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the _etag property. It enables web caching and can be used to avoid ghost writes.<br/>
By default it is mandatory to specify it via the If-Match header to delete a collection.
See [ETag](https://softinstigate.atlassian.net/wiki/x/hICM) documentation section for more information.

## Documentation references

* [DB Resource](db.html)
* [Document Resource](document.html)
* [Indexes Resource](indexes.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/ToCM" target="_blank">URI Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/hICM" target="_blank">ETag</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/XACk" target="_blank">Query Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.