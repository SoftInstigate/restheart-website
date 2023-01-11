---
title: ETag
layout: docs
menu: mongodb
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [ETag for write requests](#etag-for-write-requests)
-   [ETag for web caching](#etag-for-web-caching)
-   [ETag policy](#etag-policy)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

The **ETag** or **entity tag** is part of HTTP; it is used for:

-   **[Web cache](https://en.wikipedia.org/wiki/Web_cache) validation**,
    and which allows a client to make conditional requests. This allows
    caches to be more efficient, and saves bandwidth, as a web server
    does not need to send a full response if the content has not
    changed.
-   For **[optimistic concurrency
    control](https://en.wikipedia.org/wiki/Optimistic_concurrency_control)** as
    a way to help prevent ghost writes, i.e. simultaneous updates of a
    resource from overwriting each other.

RESTHeart automatically manages ETags, creating and updating them.

For example, let's create a database, a collection and a document. You
can note that any response includes the header ETag (other response
headers are omitted for simplicity) and this is valid for any type of
resource, included file resources.

```bash
PUT /test {"descr": "a db for testing" }

HTTP/1.1 201 Created
ETag: 55e84b95c2e66d1e0a8e46b2
(other headers omitted)
```

```bash
PUT /test/coll { "descr": "a collection for testing" }

HTTP/1.1 201 Created
ETag: 55e84be2c2e66d1e0a8e46b3
(other headers omitted)
```

```bash
PUT /test/coll/doc { "descr": "a document for testing" }

HTTP/1.1 201 Created
ETag: 55e84c0ac2e66d1e0a8e46b4
(other headers omitted)
```

```bash
GET /test/coll/doc HTTP/1.1

HTTP/1.1 200 OK
ETag: 55e84c0ac2e66d1e0a8e46b4
(other headers omitted)

{ "descr": "a document for testing" }
```

## ETag for write requests

The checking policy is configurable and the default
policy only requires the ETag for `DELETE /db` and `DELETE /db/collection`
requests.

Previous versions always require the ETag to be specified for any write
request.

Let's try to update the document at URI `/test/coll/doc` forcing the ETag
check with the `checkEtag` query parameter.

```http
PUT /test/coll/doc?checkEtag HTTP/1.1

{ "descry": "a document for testing but modified" }

HTTP/1.1 409 Conflict
...
ETag: 55e84c0ac2e66d1e0a8e46b4
```

RESTHeart send back the error message `409 Conflict`, showing that the
document has not been updated.

Note that the _ETag_ header is present in the response.

Let's try to pass now a wrong ETag via the _If-Match_ request header

```http
PUT 127.0.0.1:8080/test/coll/doccheckEtag HTTP/1.1
If-Match:wrong_etag
{ "desc":"a document for testing but modified"}

HTTP/1.1 412 Precondition Failed
...
ETag: 55e84c0ac2e66d1e0a8e46b4
```

RESTHeart send back the error message `412 Precondition Failed`, showing
that the document has not been updated.

Again the correct ETag header is present in the response.

Let's try to pass now the correct ETag via the `If-Match` request header

```bash
PUT /test/coll/doc?checkEtag HTTP/1.1
If-Match:55e84c0ac2e66d1e0a8e46b4

{"descr": "a document for testing but modified"}

HTTP/1.1 200 OK
ETag: 55e84f5ac2e66d1e0a8e46b8
(other headers omitted)
```

Yes, updated! And the response includes the new ETag value.

## ETag for web caching

The responses of GET requests on document and file resources always
include the ETag header.

The ETag is used by browsers for caching: after the first data
retrieval, the browser will send further requests with _If-None-Match_
request header. In case the resource state has not been modified
(leading to a change in the ETag value), the response will be just *304
Not Modified*, without passing back the data and thus saving bandwidth.
This is especially useful for file resources.

```bash
GET /test/coll/doc HTTP/1.1
HTTP/1.1 200 OK
ETag: 55e84c0ac2e66d1e0a8e46b4
(other headers omitted)

{"descr": "a document for testing but modified"}
```

```bash
GET /test/coll/doc HTTP/1.1
If-None-Match:55e84c0ac2e66d1e0a8e46b4

HTTP/1.1 304 Not Modified
```

## ETag policy

RESTHeart has a default configurable ETag checking policy.

The following configuration file snippet defines the default ETag check
policy:

-   The policy applies for databases, collections (also applies to file
    buckets) and documents.
-   valid values are REQUIRED, REQUIRED_FOR_DELETE, OPTIONAL

It defines when the ETag check is mandatory.

```yml
etag-check-policy:
    db: REQUIRED_FOR_DELETE
    coll: REQUIRED_FOR_DELETE
    doc: OPTIONAL
```

The ETag checking policy can also be modified at request level with the
`checkETag` query parameter and at db or collection level using the
`etagPolicy` and `etagDocPolicy` metadata.

For instance specifying the following collection metadata, the ETag will
be checked for all write requests on the collection resources and its
documents.

```json
{
  "etagPolicy": "REQUIRED",
  "etagDocPolicy": "REQUIRED"
}
```

</div>
