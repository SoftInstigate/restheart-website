---
layout: page-notopnav
title: indexes
permalink: /curies/2.0/indexes.html
---

## The Indexes resource

The Indexes resource allows you to list the indexes of your collections. 

The only allowed method is GET:

{: .table }
**Method**|**Description**
GET|Returns the indexes of the collection <collname>

The resource URI format is <code>/&lt;dbname&gt;/&lt;collname&gt;/_indexes</code>

## Examples

### get the list of the collection indexes

{% highlight bash %}
$ http GET 127.0.0.1:8080/test/coll/_indexes
HTTP/1.1 200 OK
...
{
    "_embedded": {
        "rh:index": [
            {
                "_type": "INDEX", 
                "key": {
                    "_etag": 1
                },
                ...
            }, 
            {
                "_id": "_id_", 
                }, 
                "key": {
                    "_id": 1
                },
                ...
            }, 
            {
                "_id": "_id_etag_idx", 
                "key": {
                    "_etag": 1, 
                    "_id": 1
                },
                ...
            }
        ]
    }, 
    ...
    "_returned": 3, 
    "_size": 3, 
    "_type": "COLLECTION_INDEXES"
}
{% endhighlight %}

Three default indexes exist in the collection:

* {"_id": 1}
* {"_etag": 1}_
* {"_id": 1, "_etag": 1}

{: .bs-callout .bs-callout-info }
Refer to the MongoDB <a href="http://docs.mongodb.org/manual/indexes/" target="_blank">indexes documentation</a> for more information.

{: .bs-callout .bs-callout-info }
Indexes can be created and deleted via the [Index resource](cindex.html).

## Documentation references

* [Collection Resource](coll.html)
* [Index Resource](cindex.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/ToCM" target="_blank">URI Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/XACk" target="_blank">Query Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.