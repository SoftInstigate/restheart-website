---
layout: page-notopnav
title: coll
permalink: /curies/1.2/coll.html
---

## The Collection resource

The Collection resource represents a collection.
Requests to Collection URI allow to manage the collections, create documents and get the list of existing documents.

Allowed methods are:

{: .table }
**Method**|**Description**
GET	|Returns the collection properties and the list of its documents
PUT	|Creates or updates the collection
PATCH	|Updates the collection properties
POST	|Creates or updates a document in the collection
DELETE	|Deletes the collection

The resource URI format is <code>/&lt;dbname&gt;/&lt;collname&gt;</code>

{: .bs-callout .bs-callout-info }
The following options influence the files returned as embedded resources to a GET collection request: [pagination](paging.html), [sorting](sort.html), [filtering](filter.html) and [projecting](keys.html).

## Examples:

### create the collection <code>/test/coll</code> with the property *descr*

{% highlight bash %}
$ http PUT 127.0.0.1:8080/test/coll descr="my first collection"
HTTP/1.1 201 Created
...
ETag: 5516731ec2e6e922cf58d6af
{% endhighlight %}

### update the collection <code>/test</coll</code> adding the property *creator*

{% highlight bash %}
$ http PUT 127.0.0.1:8080/test/coll creator="ujibang" If-Match:5516731ec2e6e922cf58d6af
HTTP/1.1 201 CREATED
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the If-Match request header. This needs to be added to modify an existing resource. 
See [ETag](https://softinstigate.atlassian.net/wiki/x/hICM) documentation section for more information.

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
    "_collection-props-cached": false, 
    "_created_on": "2015-09-03T13:32:18Z", 
    "_links": {
        "rh:indexes": {
            "href": "/test/coll/_indexes"
        }
        "rh:db": {
            "href": "/test"
        },
        ...
    },
    "_embedded": {
        "rh:doc": [
            {
                ...
                "array": [
                    1, 
                    2, 
                    3
                ], 
                "number": 1, 
                "object": {
                    "a": 1, 
                    "b": 2
                }, 
                "string": "whatever"
            }
        ]
    }, 
    ...
    "_returned": 1, 
    "descr": "a collection for testing"
}
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note between the _links, the URI of its parent resource, in this case the database /test and of the collection [indexes](indexes.html).

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