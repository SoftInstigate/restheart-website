---
layout: docs
title: Quick Reference
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
- [Reading Documents](#reading-documents)
- [Writing Documents](#writing-documents)
- [Reading Files](#reading-files)
- [Writing Files](#writing-files)
- [Collections and File Buckets](#collections-and-file-buckets)
- [Important Query Parameters](#important-query-parameters)
- [Write requests facts](#write-requests-facts)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

{: .bs-callout.bs-callout-info }
This quick reference assumes the default configuration with the database `restheart` bound to `/` and the *STANDARD* representation format.

## Reading Documents

**Read multiple documents**

``` plain
> GET /coll?page=1&pagesize=5&filter={ query }

[ {doc#1 }, { doc#2 }, ... , { doc#5 } ]
```

**Read a single document**

``` plain
> GET /coll/docid

{ "_id": "docid", ... }
```

## Writing Documents

**Write a document with POST**

``` plain
> POST /coll { "_id": "docid", ... }
```

**Write multiple documents with POST**

``` plain
> POST /coll [ { doc#1 }, { doc#2 }, ... , { doc#n} ]
```

**Modify a document with PUT**

``` plain
> PUT /coll/docid { doc }
```

{: .bs-callout.bs-callout-info }
The whole document is replaced with the request body.

**Modify a document with PATCH**

``` plain
> PATCH /coll/docid { ... }
```

{: .bs-callout.bs-callout-info }
Only the parameters in the request body are updated.

**Update multiple documents**

``` plain
> PATCH /coll/*?filter={ query } { ... }
```

{: .bs-callout.bs-callout-info }
query parameter *filter* is mandatory

**Delete a document**

``` plain
> DELETE /coll/docid
```

**Delete multiple documents**

``` plain
> DELETE /coll/*?filter={ query }
```

{: .bs-callout.bs-callout-info }
query parameter *filter* is mandatory

## Reading Files

**Read multiple file properties**

``` plain
> GET /bucket.files?page=1&pagesize=5&filter={ query }

[ {file#1 }, { file#2 }, ... , { file#5 } ]
```

**Read a file properties**

``` plain
> GET /bucket.files/fileid

{ "_id": "fileid", "fileType": "application/pdf", ... }
```

**Read a file content**

``` plain
> GET /bucket.files/fileid/binary

(file content)
```

## Writing Files

**Create a file**

``` plain
> POST  /db/bucket.files properties={"a": 1} file=<binary>
```

{: .bs-callout.bs-callout-info}
This is a *multipart* request

**Delete a file**

```plain
> DELETE /bucket.files/fileid
```

## Collections and File Buckets

**List Collections and Files Buckets**

``` plain
> GET /

[ "coll1", "coll2", "bucket1.files", "bucket2.files", ... ]
```

**Read metadata of a Collection or Files Bucket**

``` plain
> GET /coll/_meta

{ "aggrs": [...], "checkers": [...], "transformers": [...], "streams": [...] }
```

**Create a Collection**

``` plain
> PUT /coll { metadata }
```

**Create a File Bucket**

``` plain
> PUT /bucket.files { metadata }
```

**Update the metadata of a Collection or a File Bucket**

``` plain
> PUT /bucket.files { metadata }
```

``` plain
> PATCH /bucket.files { metadata }
```

**Delete a collection or a File Bucket**

``` plain
> DELETE /coll If-Match:<ETag>
```

{: .bs-callout.bs-callout-info}
*If-Match* is a request header

**Create an index**

```plain
> PUT /coll/_indexes/idxid { "keys": { ... }, "ops": { ... } }
```

**Delete an index**

```plain
> DELETE /coll/_indexes/idxid
```

## Important Query Parameters

{: .table.table-responsive }
|qparam|description|example|
|-|-|
|`page` and `pagesize`|control pagination|`?page=1&pagesize=5`
|`filter`|apply a query|`?filter={"n":{"$gt":5}}`|
|`keys`|controls projection, i.e. the properties to return|`?keys={"a":1, "obj.prop":1}`
|`id_type`|specifies the type of the _id|`/coll/1`&rarr;`{"_id":"1"}` vs `/coll/1?id_type=number`&rarr;`{"_id":1}`|

## Write requests facts

- All write requests have *upsert* semantic: the document is updated if existing or created.

- `POST` request whose body does not include the `_id` property, creates a document with `_id` generated as a new ObjectId.

- `PATCH` modifies only properties in the request body; `PUT` and `POST` replace the whole existing document.

- All write operation can use the <a href="https://docs.mongodb.org/manual/core/document/#dot-notation" target="_blank">dot notation</a> and all mongodb <a href="https://docs.mongodb.org/manual/reference/operator/update/" target="_blank">update operators</a>