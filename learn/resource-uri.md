---
layout: docs
title: Resource URI
---

* [Introduction](#introduction)
* [Resources URIs](#resources-uris)
* [Document id](#document-id)
    * [Some examples](#some-examples)
* [mongo-mounts](#mongo-mounts)

## Introduction

This page explains the resource URI format, i.e. how the resources
are identified.

## Resources URIs

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
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
<td>/</td>
<td><code></code> is the database name.</td>
</tr>
<tr class="odd">
<td>Collection</td>
<td>//</td>
<td><code></code> is the collection name.</td>
</tr>
<tr class="even">
<td>Document</td>
<td>///[?id_type=TYPE]</td>
<td><p> is the <code>_id</code> of the document and the optional <code>TYPE</code> query parameter is its type (default is &quot;STRING_OID&quot;).</p></td>
</tr>
<tr class="odd">
<td>Bulk Documents</td>
<td>///*?filter=[filter expression]</td>
<td>The wildcard can be used for bulk updates; in this case the <code>filter</code> query parameter is mandatory, see <a href="Write_Requests">Write Requests</a>.</td>
</tr>
<tr class="even">
<td>Indexes</td>
<td>///_indexes</td>
<td><p> </p></td>
</tr>
<tr class="odd">
<td>Index</td>
<td>///_indexes/</td>
<td><p>is the _id of the index and must be a string (other types of index _id are not supported).</p></td>
</tr>
<tr class="even">
<td>File bucket</td>
<td>//&lt;collName&gt;/.files</td>
<td><p><code></code> is the file bucket name and it is a string (suffix .files is mandatory).</p></td>
</tr>
<tr class="odd">
<td>File</td>
<td>///.files/[?id_type=TYPE]</td>
<td><p><code></code> is the value of the _id the file and the optional <code>TYPE</code> query parameter is its type (default is &quot;STRING_OID&quot;).</p></td>
</tr>
<tr class="even">
<td>Schema Store</td>
<td>///_schemas</td>
<td> </td>
</tr>
<tr class="odd">
<td>Schema</td>
<td>///_schemas/</td>
<td> is the <code>_id</code> of the schema.</td>
</tr>
<tr class="even">
<td>Aggregation</td>
<td>///_aggrs/</td>
<td> is the <code>name</code> of the schema (specified in it declaration, see Aggregations).</td>
</tr>
</tbody>
</table>

## Document id

In MongoDB, the \_id can be of any type. For instance, it can be an
ObjectId, a String or even a JSON object, as in the following document:

``` plain
{ "_id": {"a":1,"b":2} }
```

RESTHeart needs to be able to assign a unique URI to each document. For
this reason, only a subset of \_id types are supported.

The following table shows the supported types:

| type     | id\_type                    |
|----------|-----------------------------|
| ObjectId | OID or STRING\_OID\*        |
| String   | STRING\*\* or STRING\_OID\* |
| Number   | NUMBER                      |
| Date     | DATE                        |
| MinKey   | MINKEY                      |
| MaxKey   | MAXKEY                      |
| Boolean  | BOOLEAN                     |
| null     | NULL                        |

**\*** The default value of the id\_type query parameter
is **STRING\_OID**. In this case, the value of the **&lt;docId&gt;** is
interpreted either as an ObjectId or a String. The former applies if the
value is a valid ObjectId.

**\*\*** **STRING** is useful if the \_id value would be a valid
ObjectId and it is actually a String.

### Some examples

|                                                       |                                                   |
|-------------------------------------------------------|---------------------------------------------------|
| **/db/coll/1**                                        | { "\_id": "1" }                                   |
| **/db/coll/1?id\_type=NUMBER**                        | { "\_id": 1 }                                     |
| **/db/coll/1?id\_type=DATE**                          | { "\_id": { "$date": 1} }                         |
| **/db/coll/54f77f0fc2e6ea386c0752a5**                 | { "\_id": { "$oid": "54f77f0fc2e6ea386c0752a5"} } |
| **/db/coll/54f77f0fc2e6ea386c0752a5?id\_type=STRING** | { "\_id": "54f77f0fc2e6ea386c0752a5" }            |

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
id "`doc"` of the collection `coll` of the database `db`.

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

URL encoding

If a resource URL contains one or more RFC 3986 reserved characters,
they must be [percent
encoded](https://en.wikipedia.org/wiki/Percent-encoding). However most
of the HTTP client will encode the URL for you, including all the
browsers. For instance, the URL of the database "`my database"` is
actually  `https://whatever.org/my%20database`.

**Special attention must be paid with + (plus sign)**. The + sign in the
query string is URL-decoded to a space! %2B in the query string is
URL-decoded to a + sign. So the request

`GET /db/coll/a+b` will actually find the document with id "a b". GET
/db/coll/a%2Bb finds the document with id "a+b"

Have a look at this issue
<https://github.com/SoftInstigate/restheart/issues/116>
