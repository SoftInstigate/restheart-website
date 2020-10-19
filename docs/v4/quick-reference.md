---
title: Quick Reference
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Reading Documents](#reading-documents)
-   [Writing Documents](#writing-documents)
-   [Reading Files](#reading-files)
-   [Writing Files](#writing-files)
-   [Collections and File Buckets](#collections-and-file-buckets)
-   [Important Query Parameters](#important-query-parameters)
-   [Write requests facts](#write-requests-facts)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

{: .bs-callout.bs-callout-info }
This quick reference assumes the default configuration with the database `restheart` bound to `/` and the _STANDARD_ representation format.

## Reading Documents

**Read multiple documents**

{% include code-header.html
    type="Request"
%}

```http
GET /coll?page=1&pagesize=5&filter={query} HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```
[ {doc#1 }, { doc#2 }, ... , { doc#5 } ]
```

**Read a single document**

{% include code-header.html
    type="Request"
%}

```http
GET /coll/docid HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```
{ "_id": "docid", ... }
```

## Writing Documents

**Write a document with POST**

{% include code-header.html
    type="Request"
%}

```http
POST /coll HTTP/1.1

{ "_id": "docid", ... }
```

**Write multiple documents with POST**

{% include code-header.html
    type="Request"
%}

```http
POST /coll HTTP/1.1

[ { doc#1 }, { doc#2 }, ... , { doc#n} ]
```

**Modify a document with PUT**

{% include code-header.html
    type="Request"
%}

```http
PUT /coll/docid HTTP/1.1

{ doc }
```

{: .bs-callout.bs-callout-info }
The whole document is replaced with the request body.

**Modify a document with PATCH**

{% include code-header.html
    type="Request"
%}

```http
PATCH /coll/docid HTTP/1.1

{ ... }
```

{: .bs-callout.bs-callout-info }
Only the parameters in the request body are updated.

**Update multiple documents**

{% include code-header.html
    type="Request"
%}

```http
PATCH /coll/*?filter={query} HTTP/1.1

{ ... }
```

{: .bs-callout.bs-callout-info }
query parameter _filter_ is mandatory

**Delete a document**

{% include code-header.html
    type="Request"
%}

```http
DELETE /coll/docid HTTP/1.1
```

**Delete multiple documents**

{% include code-header.html
    type="Request"
%}

```http
DELETE /coll/*?filter={query} HTTP/1.1
```

{: .bs-callout.bs-callout-info }
query parameter _filter_ is mandatory

## Reading Files

**Read multiple file properties**

{% include code-header.html
    type="Request"
%}

```http
GET /bucket.files?page=1&pagesize=5&filter={query} HTTP/1.1

[ {file#1 }, { file#2 }, ... , { file#5 } ]
```

**Read a file properties**

{% include code-header.html
    type="Request"
%}

```http
GET /bucket.files/fileid HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```
{ "_id": "fileid", "fileType": "application/pdf", ... }
```

**Read a file content**

{% include code-header.html
    type="Request"
%}

```http
GET /bucket.files/fileid/binary HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```
(file content)
```

## Writing Files

**Create a file**

{% include code-header.html
    type="Request"
%}

```http
POST  /db/bucket.files properties={"a": 1} file=<binary> HTTP/1.1
```

{: .bs-callout.bs-callout-info}
This is a _multipart_ request

**Delete a file**

{% include code-header.html
    type="Request"
%}

```http
DELETE /bucket.files/fileid HTTP/1.1
```

## Collections and File Buckets

**List Collections and Files Buckets**

{% include code-header.html
    type="Request"
%}

```http
GET / HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```
[ "coll1", "coll2", "bucket1.files", "bucket2.files", ... ]
```

**Read metadata of a Collection or Files Bucket**

{% include code-header.html
    type="Request"
%}

```http
GET /coll/_meta HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```
{ "aggrs": [...], "checkers": [...], "transformers": [...], "streams": [...] }
```

**Create a Collection**

{% include code-header.html
    type="Request"
%}

```http
PUT /coll HTTP/1.1

{ metadata }
```

**Create a File Bucket**

{% include code-header.html
    type="Request"
%}

```http
PUT /bucket.files HTTP/1.1

{ metadata }
```

**Update the metadata of a Collection or a File Bucket**

{% include code-header.html
    type="Request"
%}

```http
PUT /bucket.files HTTP/1.1

{ metadata }
```

{% include code-header.html
    type="Request"
%}

```http
PATCH /bucket.files HTTP/1.1

{ metadata }
```

**Delete a collection or a File Bucket**

{% include code-header.html
    type="Request"
%}

```http
DELETE /coll HTTP/1.1
If-Match: <ETag>
```

{: .bs-callout.bs-callout-info}
_If-Match_ is a request header

**Create an index**

{% include code-header.html
    type="Request"
%}

```http
PUT /coll/_indexes/idxid HTTP/1.1

{ "keys": { ... }, "ops": { ... } }
```

**Delete an index**

{% include code-header.html
    type="Request"
%}

```http
DELETE /coll/_indexes/idxid HTTP/1.1
```

## Important Query Parameters

{: .table.table-responsive }
|qparam|description|example|
|-|-|
|`page` and `pagesize`|control pagination|`?page=1&pagesize=5`|
|`sort`|control sorting|`?sort={"n":-1}`|
|`filter`|apply a query|`?filter={"n":{"$gt":5}}`|
|`keys`|controls projection, i.e. the properties to return|`?keys={"a":1, "obj.prop":1}`
|`id_type`|specifies the type of the \_id|`/coll/1`&rarr;`{"_id":"1"}` vs `/coll/1?id_type=number`&rarr;`{"_id":1}`|

## Write requests facts

-   All write requests have _upsert_ semantic: the document is updated if existing or created.

-   `POST` request whose body does not include the `_id` property, creates a document with `_id` generated as a new ObjectId.

-   `PATCH` modifies only properties in the request body; `PUT` and `POST` replace the whole existing document.

-   All write operation can use the <a href="https://docs.mongodb.org/manual/core/document/#dot-notation" target="_blank">dot notation</a> and all mongodb <a href="https://docs.mongodb.org/manual/reference/operator/update/" target="_blank">update operators</a>
