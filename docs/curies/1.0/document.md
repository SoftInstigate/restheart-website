---
layout: page-notopnav
title: document
permalink: /curies/1.0/document.html
---

## The Document resource

The Document resource represents a document in a collection.
Requests to Document URI allow to create, delete, update files and get their properties.

Allowed methods are:

{: .table }
Method|Description
GET	|Return the document
PUT	|Creates or updates the document
PATCH	|Updates the document (only passed data)
DELETE	|Deletes the document

The resource URI format is <code>/&lt;dbname&gt;/&lt;collname&gt;/&lt;docid&gt;</code>

## Examples

### create a document

{% highlight bash %}
http PUT 127.0.0.01:8080/test/coll/mydoc number:=1 string="whatever" array:='[1,2,3]' object:='{"a":1,"b":2}'
HTTP/1.1 201 CREATED
ETag: 560570e5c2e6b6654c501db7
...
{% endhighlight %}

{: .bs-callout .bs-callout-info }
A document can also be created via a POST to the collection URI. POSTing the collection has the
advantage that the  _id will be automatically generated (of type ObjectId) and returned in the Location response header.

### get the document properties

{% highlight bash %}
http GET 127.0.0.01:8080/test/coll/mydoc
HTTP/1.1 200 OK
ETag: 560570e5c2e6b6654c501db7
...

{
    "_id": "mydoc", 
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
    "string": "whatever",
    ...
}
{% endhighlight %}

### web caching

Browsers use the ETAG response header for web caching. 
Further requests to the resource including the If-None-Match header, gets **304 Not Modified** as response.
This effectively save bandwidth.

{% highlight bash %}
http GET 127.0.0.01:8080/test/coll/mydoc If-None-Match:560570e5c2e6b6654c501db7
HTTP/1.1 304 Not Modified
...
{% endhighlight %}

### modify a file

{% highlight bash %}
http PATCH 127.0.0.01:8080/test/coll/mydoc If-Match:560570e5c2e6b6654c501db7 array.2:=5 object.a:=2
HTTP/1.1 200 OK
...
ETag: 5605736dc2e6b6654c501db9
{% endhighlight %}

This example shows two important of the PATCH operation:

* It is allowed to use the dot notation in PATCH request to access nested properties.
* Arrays can be manipulated directly. In the example we updated the third element of the array.

{: .bs-callout .bs-callout-info }
Note the If-Match request header. This needs to be added to modify an existing resource. 
See [ETag](https://softinstigate.atlassian.net/wiki/x/hICM) documentation section for more information.

{: .bs-callout .bs-callout-info }
Note that the ETag has been updated and the new value passed back is ETag response header.

### delete a file

{% highlight bash %}
http DELETE 127.0.0.01:8080/test/coll/mydoc If-Match:5605736dc2e6b6654c501db9
HTTP/1.1 204 No Content
...
{% endhighlight %}

## Documentation references

* [Collection Resource](coll.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/UICM" target="_blank">Representation Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/XACk" target="_blank">Query Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.