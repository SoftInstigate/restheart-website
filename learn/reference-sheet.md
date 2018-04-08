---
layout: docs
title: Reference sheet
---

* [Root resource](#root-resource)
* [Database](#database)
* [Collection](#collection)
* [Indexes](#indexes)
* [Index](#index)
* [Document](#document)
* [File buckets](#file-buckets)
* [File](#file)
* [Schema store](#schema-store)
* [Schema](#schema)

## Root resource

**URI** `/`

The root resource is the entry point of the data API.

**Allowed Methods**

| Method | Description                       |
|--------|-----------------------------------|
| GET    | Returns the list of the databases |

## Database

**URI** `/<dbname>`

Manage Databases. 

**Allowed Methods**

| Method | Description                                                                                     |
|--------|-------------------------------------------------------------------------------------------------|
| GET    | Returns the &lt;dbname&gt; database properties and the list of its collections and file buckets |
| PUT    | Creates or updates the database &lt;dbname&gt;                                                  |
| PATCH  | Updates the database &lt;dbname&gt; (only passed data)                                          |
| DELETE | Deletes the database &lt;dbname&gt;                                                             |

## Collection

**URI** `/<dbname>/<collname>`

Manage MongoDB Collections. 

**Allowed Methods**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Method</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>GET</td>
<td>Returns the &lt;collname&gt; collection properties and the list of its documents</td>
</tr>
<tr class="even">
<td>PUT</td>
<td>Creates or updates the collection &lt;collname&gt;</td>
</tr>
<tr class="odd">
<td>PATCH</td>
<td>Updates the collection &lt;collname&gt; (only passed data)</td>
</tr>
<tr class="even">
<td>POST</td>
<td><p>Creates or updates a document in the collection &lt;collname&gt; if data is a document.</p>
<p>Bulk creates or updates several document in the collection if data is an array of documents.</p></td>
</tr>
<tr class="odd">
<td>DELETE</td>
<td>Deletes the collection &lt;collname&gt;</td>
</tr>
</tbody>
</table>

## Indexes

The Indexes resource allows you to list the indexes of your
collections. 

**URI** `/<dbname>/<collname>/_indexes`

**Allowed Methods**

| Method | Description                                            |
|--------|--------------------------------------------------------|
| GET    | Returns the indexes of the collection &lt;collname&gt; |

## Index

The Index resource allows you to create the indexes of your
collections. 

**URI** `/<dbname>/<collname>/_indexes/<indexid>`

**Allowed Methods**

| Method | Description                                                          |
|--------|----------------------------------------------------------------------|
| PUT    | Creates the index &lt;indexid&gt; in the collection &lt;collname&gt; |
| DELETE | Deletes the index &lt;indexid&gt; of the collection &lt;collname&gt; |

## Document

The Document resource allows you to manage your documents.

**URI** `/<dbname>/<collname>/<docid>`

**Allowed Methods**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Method</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>GET</td>
<td>Return the document &lt;docid&gt;</td>
</tr>
<tr class="even">
<td>PUT</td>
<td>Creates or updates the document &lt;docid&gt;</td>
</tr>
<tr class="odd">
<td>PATCH</td>
<td><p>Updates the document &lt;docid&gt; (only passed data)</p>
<p>Bulk update documents if &lt;docid&gt; is the wildcard character * (requires the <em>filter</em> query parameter)</p></td>
</tr>
<tr class="even">
<td>DELETE</td>
<td><p>Deletes the document &lt;docid&gt;</p>
<p>Bulk deletes documents if is the wildcard character * (requires the filter query parameter)</p></td>
</tr>
</tbody>
</table>

## File buckets

The File bucket resource allows you to manage your files buckets, i.e.
containers for binary files (GridFS).

**URI** `/<dbname>/<bucketname>.files`

**Allowed Methods**

| Method | Description                                                                      |
|--------|----------------------------------------------------------------------------------|
| GET    | Returns the &lt;bucketname&gt; files bucket properties and the list of its files |
| PUT    | Creates or updates the files bucket &lt;bucketname&gt;                           |
| POST   | Creates a file in the bucket &lt;bucketname&gt;                                  |
| DELETE | Deletes the files bucket &lt;bucketname&gt;                                      |

## File

The File resource allows you to manage your files (GridFS).

File binaries are immutable: they cannot be modified. However since
version 3.2 the json properties of a file can be modified.

**URI** `/<dbname>/<bucketname>.files/<fileid>`

**Allowed Methods**

<table>
<thead>
<tr class="header">
<th>Method</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>GET</td>
<td>Returns the &lt;fileid&gt; file with link to download the binary data</td>
</tr>
<tr class="even">
<td>PUT</td>
<td>(multipart request, i.e.
<p><code>Content-Type:multipart/form-data)</code></p>
Creates the file &lt;fileid&gt; in the files bucket &lt;bucketname&gt;</td>
</tr>
<tr class="odd">
<td>PUT</td>
<td>(with <code>Content-Type=application/json</code>) updates all the json properties of an existing file.</td>
</tr>
<tr class="even">
<td>DELETE</td>
<td>Deletes the file &lt;fileid&gt; in the files bucket &lt;bucketname&gt;</td>
</tr>
<tr class="odd">
<td>PATCH</td>
<td>(with <code>Content-Type=application/json</code>)  Update the properties of an existing file that are part of the request body.</td>
</tr>
</tbody>
</table>

## Schema store

The schema store resource allows you to manage json schemas used in
document validation. There can be a single schema store for each db.

**URI** `/<dbname>/_schemas`

**Allowed Methods**

| Method | Description                                                               |
|--------|---------------------------------------------------------------------------|
| GET    | Returns the schema store properties and the paginated list of its schemas |
| PUT    | Upsert the schema store                                                   |
| POST   | Creates a schema in the schema store                                      |
| DELETE | Deletes the schema store                                                  |

## Schema

The schema resource allows you to manage the json schemas used for
validation.

The validation of the documents of a collection based on JSON schemas is
enforced with the collection checker *jsonSchema*

Example

``` plain
PATCH /db/coll { "checkers": [ { "name": "jsonSchema", "args": { "schemaId": "<schema_id>" } } ] }
```

More information in [Request Checkers](Request_Checkers) section.

**URI** `/<dbname>/_schemas/<schemaid>`

**Allowed Methods**

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Method</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>GET</td>
<td>Return the schema &lt;schemaid&gt;</td>
</tr>
<tr class="even">
<td>PUT</td>
<td>Creates or updates the schema &lt;schemaid&gt;. It must be a valid JSON schema according to <a href="http://json-schema.org/latest/json-schema-core.html">JSON Schema Core Draft v4</a> specification.</td>
</tr>
<tr class="odd">
<td>PATCH</td>
<td><p>Updates the schema &lt;schemaid&gt; (only passed data)</p></td>
</tr>
<tr class="even">
<td>DELETE</td>
<td><p>Deletes the schema &lt;schemaid&gt;</p></td>
</tr>
</tbody>
</table>
