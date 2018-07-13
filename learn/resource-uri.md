---
layout: docs
title: Resource URI
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Resources URIs](#resources-uris)
* [Document id](#document-id)
    * [Some examples](#some-examples)
* [mongo-mounts](#mongo-mounts)
* [URL encoding](#url-encoding)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 


## Introduction

This page explains the resource URI format, i.e. how the resources
are identified.

## Resources URIs
<div class="table-responsive">
<table class="ts">
<colgroup>
<col class="w-20" />
<col class="w-40" />
<col class="w-40" />
</colgroup>
<thead>
<tr class="header">
<th>resource</th>
<th>URI</th>
<th>notes</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>Root</p></td>
<td>/</td>
<td>The <strong>root resource</strong> is the API entry point.</td>
</tr>
<tr class="even">
<td>Database</td>
<td>/&lt;db&gt;</td>
<td><code>&lt;db&gt;</code> is the database name.</td>
</tr>
<tr class="odd">
<td>Collection</td>
<td>/&lt;db&gt;/&lt;coll&gt;</td>
<td><code>&lt;coll&gt;</code> is the collection name.</td>
</tr>
<tr class="even">
<td>Document</td>
<td>/&lt;db&gt;/&lt;coll&gt;/&lt;doc_id&gt;[?id_type=TYPE]</td>
<td><p><code>&lt;doc_id&gt;</code> is the <code>_id</code> of the document and the optional <code>id_type</code> query parameter is its type (default is &quot;STRING_OID&quot;).</p></td>
</tr>
<tr class="odd">
<td>Bulk Documents</td>
<td>/&lt;db&gt;/&lt;coll&gt;/*?filter=[filter expression]</td>
<td>The wildcard can be used for bulk updates; in this case the <code>filter</code> query parameter is mandatory, see  <a href="/learn/write-requests">Write Requests</a>.</td>
</tr>
<tr class="even">
<td>Indexes</td>
<td>/&lt;db&gt;/&lt;coll&gt;/_indexes</td>
<td><p> </p></td>
</tr>
<tr class="odd">
<td>Index</td>
<td>/&lt;db&gt;/&lt;coll&gt;/_indexes/&lt;idx_id&gt;</td>
<td><p><code>idx_id</code> is the _id of the index and must be a string (other types of index _id are not supported).</p></td>
</tr>
<tr class="even">
<td>File bucket</td>
<td>/&lt;db&gt;/&lt;bucket&gt;/.files</td>
<td><p><code>&lt;bucket&gt;</code> is the file bucket name and it is a string (suffix .files is mandatory).</p></td>
</tr>
<tr class="odd">
<td>File</td>
<td>/&lt;db&gt;/&lt;bucket&gt;.files/&lt;file_id&gt;[?id_type=TYPE]</td>
<td><p><code>&lt;file_id&gt;</code> is the value of the _id the file and the optional <code>id_type</code> query parameter is its type (default is &quot;STRING_OID&quot;).</p></td>
</tr>
<tr class="even">
<td>Schema Store</td>
<td>/&lt;db&gt;/&lt;coll&gt;/_schemas</td>
<td> </td>
</tr>
<tr class="odd">
<td>Schema</td>
<td>/&lt;db&gt;/&lt;coll&gt;/_schemas/&lt;schema_id&gt;</td>
<td><code>&lt;schema_id&gt;</code> is the <code>_id</code> of the schema.</td>
</tr>
<tr class="even">
<td>Aggregation</td>
<td>/&lt;db&gt;/&lt;coll&gt;/_aggrs/&lt;aggr_name&gt;</td>
<td><code>&lt;aggr_name&gt;</code> is the <code>name</code> of the aggregation (specified in it declaration, see <a href="/learn/aggregations">Aggregations</a>).</td>
</tr>
</tbody>
</table>
</div>
## Document id

In MongoDB, the \_id can be of any type. For instance, it can be an
ObjectId, a String or even a JSON object, as in the following document:

``` plain
{ "_id": {"a":1,"b":2} }
```

RESTHeart needs to be able to assign a unique URI to each document. For
this reason, only a subset of \_id types are supported.

The following table shows the supported types:

<div class="table-responsive">
<table class="ts">
  <thead>
    <tr>
      <th>type</th>
      <th>id_type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ObjectId</td>
      <td>OID or STRING_OID*</td>
    </tr>
    <tr>
      <td>String</td>
      <td>STRING** or STRING_OID*</td>
    </tr>
    <tr>
      <td>Number</td>
      <td>NUMBER</td>
    </tr>
    <tr>
      <td>Date</td>
      <td>DATE</td>
    </tr>
    <tr>
      <td>MinKey</td>
      <td>MINKEY</td>
    </tr>
    <tr>
      <td>MaxKey</td>
      <td>MAXKEY</td>
    </tr>
    <tr>
      <td>Boolean</td>
      <td>BOOLEAN</td>
    </tr>
    <tr>
      <td>null</td>
      <td>NULL</td>
    </tr>
  </tbody>
</table>
</div>



**\*** The default value of the id\_type query parameter
is **STRING\_OID**. In this case, the value of the **&lt;doc_id&gt;** is
interpreted either as an ObjectId or a String. The former applies if the
value is a valid ObjectId.

**\*\*** **STRING** is useful if the \_id value would be a valid
ObjectId and it is actually a String.


### Some examples

<div class="table-responsive">
<table class="ts">
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>/db/coll/1</strong></td>
      <td>{&nbsp;”_id”:&nbsp;”1”&nbsp;}</td>
    </tr>
    <tr>
      <td><strong>/db/coll/1?id_type=NUMBER</strong></td>
      <td>{&nbsp;”_id”:&nbsp;1&nbsp;}</td>
    </tr>
    <tr>
      <td><strong>/db/coll/1?id_type=DATE</strong></td>
      <td>{&nbsp;”_id”:&nbsp;{&nbsp;”$date”:&nbsp;1}&nbsp;}</td>
    </tr>
    <tr>
      <td><strong>/db/coll/54f77f0fc2e6ea386c0752a5</strong></td>
      <td>{&nbsp;”_id”:&nbsp;{&nbsp;”$oid”:&nbsp;”54f77f0fc2e6ea386c0752a5”}&nbsp;}</td>
    </tr>
    <tr>
      <td><strong>/db/coll/54f77f0fc2e6ea386c0752a5?id_type=STRING</strong></td>
      <td>{&nbsp;”_id”:&nbsp;”54f77f0fc2e6ea386c0752a5”&nbsp;}</td>
    </tr>
  </tbody>
</table>
</div>

## mongo-mounts

The `mongo-mounts` configuration options allows to bind MongoDB
resources to URIs. The default configuration binds all MongoDB resource
below the root URI:

``` plain
mongo-mounts:
    - what: "*"
      where: /
```

In this case the URI /db/coll/doc identifies the document with
id `doc` of the collection `coll` of the database `db`.

Different mongo-mounts settings result in different resource URIs.
Examples:

``` plain
mongo-mounts:
    - what: "*"
      where: /api
```

In this case the URI of the document is /api/db/coll/doc

``` plain
mongo-mounts:
    - what: "/db/coll"
      where: /
```

In this case the URI of the document is /doc

## URL encoding

If a resource URL contains one or more RFC 3986 reserved characters,
they must be [percent
encoded](https://en.wikipedia.org/wiki/Percent-encoding). However most
of the HTTP client will encode the URL for you, including all the
browsers. For instance, the URL of the database `my database` is
actually  `https://whatever.org/my%20database`.

**Special attention must be paid with + (plus sign)**. The + sign in the
query string is URL-decoded to a space! %2B in the query string is
URL-decoded to a + sign. So the request

`GET /db/coll/a+b` will actually find the document with id "a b". GET
/db/coll/a%2Bb finds the document with id "a+b"

Have a look at this issue
<https://github.com/SoftInstigate/restheart/issues/116>

</div>