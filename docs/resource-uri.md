---
layout: doc-page-md
title: Resource URI
permalink: /docs/resource-uri.html
menu:
 id: 4
 subid: 5
---

This section introduces the resource URI, i.e. how resources are indentified in the API.

## The URI of the root resource
{: .post}

The __root resource__ (the API entry point) is identified by the URI is <code>/</code>.

## The URI of the database resource
{: .post}

The __database resource__ is identified by the URI <code>/&lt;dbName&gt;</code>, 

where __/&lt;dbName&gt;__ is the database name and it is a string.
{: .bs-callout.bs-callout-info}

## The URI of the collection resource
{: .post}

The __collection resource__ is identified by the URI <code>/&lt;dbName&gt;/&lt;collName&gt;</code>

Where __&lt;collName&gt;__ is the collection name and it a string.
{: .bs-callout.bs-callout-info}

## The URI of the document resource
{: .post}

The __document resource__ is identified by the URI <code>/&lt;dbName&gt;/&lt;collName&gt;/&lt;docId&gt;[?id_type=TYPE]</code>.

Where __&lt;docId&gt;__ is the value of the _id property of the document and __id_type__ is the type of the id.
{: .bs-callout.bs-callout-info}

In MongoDB the _id property can be of any type. For instance it can also be a json object, as in the following document:

{% highlight json %}

 { "_id": {"a":1,"b":2} }

{% endhighlight %}

However, RESTHeart needs to be able to assign a unique URI to each document. For this reason, only a subset of _id types are supported.

The following table shows the supported types

|type               |id_type       |
|-------------------|--------------|
|ObjectId           | OID or STRING_OID*   |
|String             | STRING** or STRING_OID*|
|Number             | NUMBER       |
|Date               | DATE         |
|MinKey             | MINKEY       |
|MaxKey             | MAXKEY       |
{: .table .table-bordered}

__*__ The default is __STRING_OID__ (you don't have to specify it). It means that the __&lt;docId&gt;__ is interpreted as an ObjectId if its value is a valid ObjectId or a String.
{: .bs-callout.bs-callout-info}

__**__ __STRING__ is useful if the _id value would be a valid ObjectId but it is actually a String.
{: .bs-callout.bs-callout-info}

### Some examples:

__/db/coll/1__

{% highlight json %}

 { "_id": "1" }

{% endhighlight %}

__/db/coll/1?id_type=NUMBER__

{% highlight json %}

 { "_id": 1 }

{% endhighlight %}

__/db/coll/1?id_type=DATE__

{% highlight json %}

 { "_id": { "$date": 1} }

{% endhighlight %}

__/db/coll/54f77f0fc2e6ea386c0752a5__

{% highlight json %}

 { "_id": { "$oid": "54f77f0fc2e6ea386c0752a5"} }

{% endhighlight %}

__/db/coll/54f77f0fc2e6ea386c0752a5?id_type=STRING__

{% highlight json %}

 { "_id": "54f77f0fc2e6ea386c0752a5" }

{% endhighlight %}

{: .bs-callout.bs-callout-info}

## The URI of the indexes resource
{: .post}

The __indexes resource__ is identified by the URI <code>/&lt;dbName&gt;/&lt;collName&gt;/_indexes</code>.

## The URI of the index resource
{: .post}

The __index resource__ is identified by the URI <code>/&lt;dbName&gt;/&lt;collName&gt;/_indexes/&lt;indexId&gt;</code>.

Where __&lt;indexId&gt;__ is the value of the _id property of the index and must be a string (other types of index _id are not supported).
{: .bs-callout.bs-callout-info}

## The URI of the file bucket resource
{: .post}

The __file bucket resource__ is identified by the URI <code>/&lt;dbName&gt;/&lt;collName&gt;/&lt;bucketName&gt;.files</code>

Where __/&lt;bucketName&gt;__ is the file bucket name and it is a string.
{: .bs-callout.bs-callout-info}

## The URI of the file resource
{: .post}

The __file resource__ is identified by the URI <code>/&lt;dbName&gt;/&lt;collName&gt;/&lt;bucketName&gt;.files/&lt;fileId&gt;</code>

Where __/&lt;fileId&gt;__ is the value of the _id property of the file; the same rules for document _id apply.
{: .bs-callout.bs-callout-info}

## Notes
{: .post}

In section [Piping in resources](./piping-resources.html) we introduced the concept of <code>mongo-mounts</code> that allows to bind MongoDB resources to URIs. 
The default configuration just pipes in any MongoDB resource. In this case the URI <code>/db/coll/doc</code> identifies the document with id <code>doc</code> of the collection <code>coll</code> of the database <code>db</code>.
However diffent mongo-mounts settings can result in the same MongoDB resource being bound to different URIs.
{: .bs-callout.bs-callout-info}

If a resource URI contains one or more RFC 3986 reserved characters, they must be [percent encoded](https://en.wikipedia.org/wiki/Percent-encoding). However most of the HTTP client will encode the URL for you, including all the browsers. For instance, the URI of the database <code>my database</code> is <code>/my%20database</code>.
{: .bs-callout.bs-callout-info}
