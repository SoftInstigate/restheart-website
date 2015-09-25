---
layout: page-notopnav
title: index
permalink: /curies/1.0/cindex.html
---

## The Index resource

The Indexes resource allows you to list the indexes of your collections. 

The allowed methods are:

{: .table }
Method|Description
PUT	Creates the index in the collection
DELETE	Deletes the index of the collection

The resource URI format is <code>/&lt;dbname&gt;/&lt;collname&gt;/_indexes/&lt;indexid&gt;</code>

## Examples

### create an index



{% highlight bash %}
$ http PUT 127.0.0.1:8080/test/coll/_indexes/myindex keys:='{"prop":1}' ops:='{"unique": true, "sparse": true}'
HTTP/1.1 201 Created
...
{% endhighlight %}

Behind the scene, MongoDB will start indexing that field.

The **keys** property, defines the properties to index and the sort order.

The optional **ops** property, define the index options.

{: .bs-callout .bs-callout-info }
Refer to the MongoDB <a href="http://docs.mongodb.org/manual/indexes/" target="_blank">indexes documentation</a> for more information on indexes.

{: .bs-callout .bs-callout-info }
You can use the dot notation to index a nested property, e.g. {"keys":{"a.b":1}}

## Documentation references

* [Collection Resource](coll.html)
* [Indexes Resource](indexes.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/ToCM" target="_blank">URI Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/XACk" target="_blank">Query Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.