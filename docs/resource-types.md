---
layout: doc-page-md
title: Resource Types
permalink: /docs/resource-types.html
menu:
 id: 4
 subid: 2
---

## The root resource
{: .post}

__URI__ <code>/</code>

> The root resource is the entry point of the data API.

__Allowed Methods__

|Method|Description|
|-|-|
|GET|Returns the list of the databases|
{: .table .table-bordered}

## Database 
{: .post}

__URI__ <code>/&lt;dbname&gt;</code>

> The Database resource allows you to manage your databases. 

__Allowed Methods__

|Method|Description|
|-|-|
|GET|Returns the &lt;dbname&gt; database properties and the list of its collections|
|PUT|Creates or updates the database &lt;dbname&gt;|
|PATCH|Updates the database properties &lt;docidg&gt; (only passed data)|
|DELETE|Deletes the database &lt;dbname&gt;|
{: .table .table-bordered}

## Collection 
{: .post}

__URI__ <code>/&lt;dbname&gt;/&lt;collname&gt;</code>

> The Collection resource allows you to manage your MongoDB collections. 

__Allowed Methods__

|Method|Description|
|-|-|
|GET|Returns the &lt;collname&gt; collection properties and the list of its documents|
|PUT|Creates or updates the collection &lt;collname&gt;|
|PATCH|Updates the collection properties &lt;docidg&gt; (only passed data)|
|POST|Creates or updates a document in the collection &lt;collname&gt;|
|DELETE|Deletes the collection &lt;collname&gt;|
{: .table .table-bordered}

## Indexes
{: .post}

> The Indexes resource allows you to list the indexes of your collections. 

__URI__ <code>/&lt;dbname&gt;/&lt;collname&gt;/_indexes</code>

__Allowed Methods__

|Method|Description|
|-|-|
|GET|Returns the indexes of the collection &lt;collname&gt;|
{: .table .table-bordered}

## Index
{: .post} 

> The Index resource allows you to create the indexes of your collections. 

__URI__ <code>/&lt;dbname&gt;/&lt;collname&gt;/_indexes/&lt;indexid&gt;</code>

__Allowed Methods__

|Method|Description|
|-|-|
|PUT|Creates the index &lt;indexid&gt; in the collection &lt;collname&gt;|
|DELETE|Deletes the index &lt;indexid&gt; of the collection &lt;collname&gt;|
{: .table .table-bordered}

## Document
{: .post}

> The Document resource allows you to manage your documents.

__URI__ <code>/&lt;dbname&gt;/&lt;collname&gt;/&lt;docidg&lt;</code>

__Allowed Methods__

|Method|Description|
|-|-|
|GET|Return the document &lt;docidg&gt; |
|PUT|Creates or updates the document &lt;docidg&gt;|
|PATCH|Updates the document &lt;docidg&gt; (only passed data)|
|DELETE|Deletes the document &lt;docidg&gt;|
{: .table .table-bordered}

## File buckets
{: .post}

> The File bucket resource allows you to manage your files buckets, i.e. containers for binary files (GridFS).

__URI__ <code>/&lt;dbname&gt;/&lt;bucketname&gt;.files</code>

__Allowed Methods__

|Method|Description|
|-|-|
|GET|Returns the &lt;bucketname&gt; files bucket properties and the list of its files|
|PUT|Creates or updates the files bucket &lt;bucketname&gt;|
|POST|Creates or updates a file in the bucket &lt;bucketname&gt;|
|DELETE|Deletes the files bucket &lt;bucketname&gt;|
{: .table .table-bordered}

## File
{: .post}

> The File resource allows you to manage your files (GridFS).

__URI__ <code>/&lt;dbname&gt;/&lt;bucketname&gt;.files/&lt;fileid&gt;</code>

__Allowed Methods__

|Method|Description|
|-|-|
|GET|Returns the &lt;fileid&gt; file with link to download the binary data|
|PUT|Creates or updates the file &lt;fileid&gt; in the files bucket &lt;bucketname&gt;|
|DELETE|Deletes the file &lt;fileid&gt; in the files bucket &lt;bucketname&gt;|
{: .table .table-bordered}