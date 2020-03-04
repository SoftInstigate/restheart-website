---
layout: docs
title: Binary Files
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
- [The "properties" part](#the-properties-part)
- [Create a file bucket](#create-a-file-bucket)
- [Uploading files with POST](#uploading-files-with-post)
  - [GET the file's metadata](#get-the-files-metadata)
  - [GET the file's binary data](#get-the-files-binary-data)
- [Uploading files with PUT](#uploading-files-with-put)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

RESTHeart is a very good fit for **headless CMS** use cases, as it allows to effectively manage and aggregate content and its metadata, such as images, audios and videos, delivering them via a REST API.

{: .alert.alert-info }
RESTHeart offers complete binary files management. It's possible to **create**, **read** and **delete** even huge files. RESTHeart makes use of MongoDB's **GridFS**, a specification for storing and retrieving files that exceed the BSON-document size limit of 16 MB.

You can read more about GridFS [here](https://docs.mongodb.org/manual/core/gridfs/).

{: .bs-callout.bs-callout-warning }
__Note__: RESTHeart's HTTP clients must adhere to the **multipart/form-data** specification. However the specification allows a form to upload multiple files at the same time, but RESTHeart prohibits that: while it's possible to POST / PUT several different non-binary parts for each file, it's mandatory to upload one single binary file per each POST / PUT request. This limitation is necessary to univocally relate all the optional parts to the unique file.


{: .bs-callout.bs-callout-success }
In the examples in this section we assume RESTHeart is running on `localhost`, port `8080`.

{: .bs-callout .bs-callout-warning }
To upload a binary file **the request body must be encoded as `multipart/form-data`.**


## The "properties" part


To add optional form data parts to the request it is necessary to embed the data into the `properties` field name. The content of this field is automatically parsed as JSON data, so it must be valid JSON.

In the following example, we set the "author" and the "filename":

{% include code-header.html 
    type="Request" 
%}

{: .black-code }
``` bash
http -v --form PUT localhost:8080/mybucket.files/example  @/path/to/my/binary/example.jpg properties='{"author":"SoftInstigate", "filename":"example"}'
```

{: .black-code }
```http
PUT /mybucket.files/example HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 66606
Content-Type: multipart/form-data; boundary=11c729f02b6a4373be26ef4cc475f340
Host: localhost:8080
User-Agent: HTTPie/0.9.8
```

{% include code-header.html 
    type="Response" 
%}

{: .black-code }
``` http
HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Connection: keep-alive
Content-Length: 0
Content-Type: application/json
Date: Wed, 04 Mar 2020 16:45:52 GMT
X-Powered-By: restheart.org
```

The JSON will be merged into in the metadata section:

{% include code-header.html 
    type="Request" 
%}

{: .black-code }
``` http
GET /mybucket.files/example HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:8080
User-Agent: HTTPie/0.9.8
```

{% include code-header.html 
    type="Response" 
%}

{: .black-code }
``` http
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

### Create a File Bucket

File buckets are special collections whose aim is to store binary data and the associated metadata. Start by creating a new one for uploading binaries.

{: .bs-callout .bs-callout-warning }
To be recognized as a file bucket the collection's name must end with ***.files postfix**  (i.e. mybucket.files is a valid file bucket name)

Create the default `restheart` database, if none exists yet:

{% include code-header.html 
    type="Request" 
%}

{: .black-code }
``` http
PUT / HTTP/1.1
```

{% include code-header.html 
    type="Response" 
%}

{: .black-code }
``` http
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

{: .black-code }
``` http
PUT /mybucket.files HTTP/1.1
```

{% include code-header.html 
    type="Response" 
%}

{: .black-code }
``` http
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

## Uploading files with POST

The following request done using HTTPie will POST a binary image `example.jpg` with `{"author":"SoftInstigate"}` metadata associated into the previously created `/mybucket.files`.

{: .black-code }
```bash
http -v --form POST localhost:8080/mybucket.files  @/path/to/my/binary/example.jpg properties='{"author":"SoftInstigate"}'

```

{% include code-header.html 
    type="Request" 
%}

{: .black-code }
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

{% include code-header.html 
    type="Response" 
%}

{: .black-code }
``` http
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

{: .black-code }
``` http
Location: http://localhost:8080/mybucket.files/5e5fcdd8ddfa017301e00331
```

{: .alert.alert-info }
Note that the location contains the object ID automatically generated by
MongoDB (see the string `5e5fcdd8ddfa017301e00331` at the end of the
above Location URL). This is a unique identifier and it's convenient in many
situation, but it's not always desirable. In many case it would be
better to explicitly name the resource with something more readable and
meaningful. To set the resource name it is necessary to upload the file
by using the PUT verb instead of POST. We'll show this later.


#### GET the file's metadata

If you GET the `Location`, RESTHeart actually returns the file's metadata:

We have from the previous example:

{: .black-code }
``` http
GET http://localhost:8080/mybucket.files/5d1ef3d50951267987cf8ab4 HTTP/1.1
```

{% include code-header.html 
    type="Request" 
%}

{: .black-code }
``` http
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

{: .black-code }
``` http
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

#### GET the file's binary data

The actual binary content is available by appending the `binary` postfix, like this:

{: .black-code }
```
http://localhost:8080/mybucket.files/5e5fcdd8ddfa017301e00331/binary
```

{: .bs-callout.bs-callout-warning }
Once a file has been created it becomes **immutable**: only its metadata can be updated. Practically, to update an existing file it's necessary to delete and re-create it.

## Uploading files with PUT

In the previous examples, the `mybucket.files` owner by default assigned to new files a resource name coming from MongoDB. If we want to set a meaningful URL then we need to send a PUT, like this:

The following PUT request done using HTTPie will upload the same data as the POST example with the difference that a meaningful name for the asset is explicitly indicated.

{: .black-code }
```bash
http -v --form PUT localhost:8080/mybucket.files/example  @/path/to/my/binary/example.jpg properties='{"author":"SoftInstigate"}'

```

{% include code-header.html 
    type="Request" 
%}

{: .black-code }
``` http
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

{: .black-code }
``` http
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


{: .bs-callout.bs-callout-success }
Note that any `Location` header is returned into response because it will be located at the path indicated at request time.

If we GET the resulting resource, here is the full HTTP response:

{% include code-header.html 
    type="Request" 
%}

{: .black-code }
``` http
GET /mybucket.files/example HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:8080
User-Agent: HTTPie/0.9.8
```

{% include code-header.html 
    type="Response" 
%}

{: .black-code }
``` http
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 243
Content-Type: application/json
Date: Wed, 04 Mar 2020 16:26:10 GMT
ETag: 5e5fd695ddfa017301e00333
X-Powered-By: restheart.org

{
    "_id": "example",
    "_links": {
        "rh:data": {
            "href": "/mybucket.files/example/binary"
        }
    },
    "chunkSize": 261120,
    "filename": "file",
    "length": 66273,
    "md5": "6399742c9e8a662fd2e999d8d31653c0",
    "metadata": {
        "_etag": {
            "$oid": "5e5fd695ddfa017301e00333"
        },
        "author": "SoftInstigate",
        "contentType": "image/jpeg"
    },
    "uploadDate": {
        "$date": 1583339157941
    }
}


```

Note that in this case the resource has a much nicer URL:

```plain
http://localhost:8080/mybucket.files/example.png
```

Which is easier to read and link than the automatically generated name.

<!-- ### GET a binary file

As shown above, when we GET the representation for the newly created file the response contains only its metadata.

Appending \``/binary`\` at the end of the above URL makes returns the actual binary content stored into GridFS. Open 

[http://localhost:8080/mybucket.files/dataflow.png/binary](http://localhost:8080/mybucket.files/dataflow.png/binary)

If we paste this URL to a browser's address bar then the image is displayed. This allows RESTHeart to serve as a very basic but powerful digital asset management system.

![](/images/dataflow.png){:
width="640" height="auto" class="image-center img-responsive"} -->

</div>
