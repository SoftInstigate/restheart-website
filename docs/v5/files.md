---
title: Binary Files
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Create a file bucket](#create-a-file-bucket)
-   [Uploading into file buckets with POST](#uploading-into-file-buckets-with-post)
    -   [Uploading with PUT](#uploading-with-put)
-   [GET the file's metadata](#get-the-files-metadata)
-   [GET the file's binary data](#get-the-files-binary-data)
-   [The "properties" part](#the-properties-part)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

RESTHeart is a very good fit for **headless CMS** use cases, as it allows to effectively manage and aggregate content and its metadata, such as images, audios and videos, delivering them via a REST API.

{: .alert.alert-info }
RESTHeart offers complete binary files management. It's possible to **create**, **read** and **delete** even huge files. RESTHeart makes use of MongoDB's **GridFS**, a specification for storing and retrieving files that exceed the BSON-document size limit of 16 MB.

You can read more about GridFS [here](https://docs.mongodb.org/manual/core/gridfs/).

{: .bs-callout.bs-callout-warning }
**Note**: RESTHeart's HTTP clients must adhere to the **multipart/form-data** specification. However the specification allows a form to upload multiple files at the same time, but RESTHeart prohibits that: while it's possible to POST / PUT several different non-binary parts for each file, it's mandatory to upload one single binary file per each POST / PUT request. This limitation is necessary to univocally relate all the optional parts to the unique file.

{: .bs-callout.bs-callout-success }
In the examples in this section we assume RESTHeart is running on `localhost`, port `8080`.

## Create a File Bucket

File buckets are special collections whose aim is to store binary data and the associated metadata. Start by creating a new one for uploading binaries.

{: .bs-callout .bs-callout-warning }
To be recognized as a file bucket the collection's name must end with **\*.files postfix** (i.e. mybucket.files is a valid file bucket name)

Create the default `restheart` database, if none exists yet:

{% include code-header.html
    type="Request"
%}

```http
PUT / HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Auth-Token: 1o6j8dt1f5y6jlu05t0blw2q4g280cgdv8253ilqhyoskoi5de
Auth-Token-Location: /tokens/admin
Auth-Token-Valid-Until: 2019-07-04T09:24:37.171231Z
Connection: keep-alive
Content-Length: 0
Content-Type: application/json
Date: Thu, 04 Jul 2019 09:09:37 GMT
ETag: 5d1dc2510951267987cf8ab1
X-Powered-By: restheart.org
```

Create the collection for hosting files.

{% include code-header.html
    type="Request"
%}

```http
PUT /mybucket.files HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Auth-Token: 1o6j8dt1f5y6jlu05t0blw2q4g280cgdv8253ilqhyoskoi5de
Auth-Token-Location: /tokens/admin
Auth-Token-Valid-Until: 2019-07-04T09:26:41.654633Z
Connection: keep-alive
Content-Length: 0
Content-Type: application/json
Date: Thu, 04 Jul 2019 09:11:41 GMT
ETag: 5d1dc2cd0951267987cf8ab2
X-Powered-By: restheart.org
```

## Uploading into file buckets with POST

{: .bs-callout .bs-callout-warning }
To upload a binary file **the request body must be encoded as `multipart/form-data`.**

A multipart/form-data encoded request is splitted and submitted into different sections. These are trivially called _request parts_.
Each part is delimited by a random digits string boundary.

By setting `Content-Type:multipart/form-data`, the following example request done using HTTPie will POST a binary image `example.jpg` with `{"author":"SoftInstigate"}` metadata associated into the previously created `/mybucket.files`

```bash
http -v --form POST localhost:8080/mybucket.files  @/path/to/my/binary/example.jpg properties='{"author":"SoftInstigate"}'
```

will produce the following results:

{% include code-header.html
    type="Request"
%}

```http
POST /mybucket.files HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 66574
Content-Type: multipart/form-data; boundary=a54420e707704ef69099ae603c9acf4c
Host: localhost:8080
User-Agent: HTTPie/0.9.8
```

```
### Multipart flow example --- this will be done usually hidden and handled under-the-hood by your http client

--------------------------a54420e707704ef69099ae603c9acf4c
Content-Disposition: form-data; name="properties"
{"author":"SoftInstigate"}
--------------------------a54420e707704ef69099ae603c9acf4c
Content-Disposition: form-data; name="binary"; filename="example.jpg"
Content-Type: image/jpg

>>> contents of the file
--------------------------a54420e707704ef69099ae603c9acf4c--
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Connection: keep-alive
Content-Length: 0
Content-Type: application/json
Date: Wed, 04 Mar 2020 15:48:40 GMT
Location: http://localhost:8080/mybucket.files/5e5fcdd8ddfa017301e00331
X-Powered-By: restheart.org
```

The `Location` HTTP header returns the file's location:

```
Location: http://localhost:8080/mybucket.files/5e5fcdd8ddfa017301e00331
```

#### Uploading with PUT

In order to explicit a human-readable name or to update an already exisiting asset you can use a PUT `multipart/form-data` encoded request.

{: .bs-callout.bs-callout-info }
Note that the location contains the object ID automatically generated by
MongoDB (see the string `5e5fcdd8ddfa017301e00331` at the end of the
above Location URL). This is a unique identifier and it's convenient in many
situation, but it's not always desirable. In many case it would be
better to explicitly name the resource with something more readable and
meaningful.

{% include code-header.html
    type="Request"
%}

```http
PUT /mybucket.files/example HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 66574
Content-Type: multipart/form-data; boundary=12c5bba0f1014fca997aa0aeb9cd5094
Host: localhost:8080
User-Agent: HTTPie/0.9.8
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Connection: keep-alive
Content-Length: 0
Content-Type: application/json
Date: Wed, 04 Mar 2020 16:25:57 GMT
X-Powered-By: restheart.org
```

In this case the resource has a much nicer URL:

```plain
http://localhost:8080/mybucket.files/example
```

Which is easier to read and link than the automatically generated name.

## GET the file's metadata

If you GET the `Location`, RESTHeart actually returns the file's metadata:

We have from the previous example:

```http
GET http://localhost:8080/mybucket.files/5d1ef3d50951267987cf8ab4 HTTP/1.1
```

{% include code-header.html
    type="Request"
%}

```http
GET /mybucket.files/5e5fcdd8ddfa017301e00331 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:8080
User-Agent: HTTPie/0.9.8
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 244
Content-Type: application/json
Date: Wed, 04 Mar 2020 16:10:12 GMT
ETag: 5e5fcdd8ddfa017301e00330
X-Powered-By: restheart.org

{
    "_id": {
        "$oid": "5e5fcdd8ddfa017301e00331"
    },
    "_links": {
        "rh:data": {
            "href": "/mybucket.files/5e5fcdd8ddfa017301e00331/binary"
        }
    },
    "chunkSize": 261120,
    "filename": "file",
    "length": 66273,
    "md5": "6399742c9e8a662fd2e999d8d31653c0",
    "metadata": {
        "_etag": {
            "$oid": "5e5fcdd8ddfa017301e00330"
        },
        "author": "SoftInstigate",
        "contentType": "image/jpeg"
    },
    "uploadDate": {
        "$date": 1583336920114
    }
}
```

{: .bs-callout.bs-callout-info }
Uploaded files metadata can be filtered and treated as regular collection documents. <br><br> For example, `http://localhost:8080/mybucket.files?filter={"metadata.author": "SoftInstigate"}` returns all the file metadata that satisfy the query.

## GET the file's binary data

The actual binary content is available by appending the `binary` postfix, like this:

```
http://localhost:8080/mybucket.files/5e5fcdd8ddfa017301e00331/binary
```

## The "properties" part

As we did in previus example, is possible to associate metadata to a file upload.

To add optional form data parts to the request it is necessary to embed the data into the `properties` field name. The content of this field is automatically parsed as JSON data, so it must be valid JSON.

In the following example, we set the "author" and the "filename":

```bash
http -v --form PUT localhost:8080/mybucket.files/example  @/path/to/my/binary/example.jpg properties='{"author":"SoftInstigate", "filename":"example"}'
```

We then retrieve the metadata associated. The JSON will be merged into in the metadata section:

{% include code-header.html
    type="Request"
%}

```http
GET /mybucket.files/example HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```http
HTTP/1.1 200 OK

{
    "_id": "example",
    "_links": {
        "rh:data": {
            "href": "/mybucket.files/example/binary"
        }
    },
    "chunkSize": 261120,
    "filename": "example",
    "length": 66273,
    "md5": "6399742c9e8a662fd2e999d8d31653c0",
    "metadata": {
        "_etag": {
            "$oid": "5e5fd9fcddfa017301e00335"
        },
        "author": "SoftInstigate",
        "contentType": "image/jpeg",
        "filename": "example"
    },
    "uploadDate": {
        "$date": 1583340028302
    }
}
```

<!-- ### GET a binary file

As shown above, when we GET the representation for the newly created file the response contains only its metadata.

Appending \``/binary`\` at the end of the above URL makes returns the actual binary content stored into GridFS. Open

[http://localhost:8080/mybucket.files/dataflow.png/binary](http://localhost:8080/mybucket.files/dataflow.png/binary)

If we paste this URL to a browser's address bar then the image is displayed. This allows RESTHeart to serve as a very basic but powerful digital asset management system.

![](/images/dataflow.png){:
width="640" height="auto" class="image-center img-responsive"} -->

</div>
