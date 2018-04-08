---
layout: docs
title: Binary Data (GridFS)
---

Contents:

* [Introduction](#introduction)
* [Specifications](#specifications)
* [Using curl](#using-curl)
    * [POST a binary file with curl](#post-a-binary-file-with-curl)
    * [Uploading files with PUT](#uploading-files-with-put)
    * [The "properties" part](#the-properties-part)
    * [GET a binary file with curl](#get-a-binary-file-with-curl)
* [Using httpie](#using-httpie)
* [Attachments:](#attachments)

## Introduction

RESTHeart offers complete binary content management in a fully RESTful
style. It's possibile to insert, read and delete huge binary files by
leveraging the underlying **GridFS** store from MongoDB.

Once a file has been created in a bucket, only its json properties can
updated. The binary content is immutable.

What's GridFS?

GridFS is a specification for storing and retrieving files that exceed
the BSON-document size limit of 16MB.

Instead of storing a file in a single document, GridFS divides a file
into parts, or chunks, and stores each of those chunks as a separate
document. By default GridFS limits chunk size to 255k. GridFS uses two
collections to store files. One collection stores the file chunks, and
the other stores file metadata.

When you query a GridFS store for a file, the driver or client will
reassemble the chunks as needed. You can perform range queries on files
stored through GridFS. You also can access information from arbitrary
sections of files, which allows you to “skip” into the middle of a video
or audio file.

GridFS is useful not only for storing files that exceed 16MB but also
for storing any files for which you want access without having to load
the entire file into memory.

[Read more](http://docs.mongodb.org/manual/core/gridfs/).

## Specifications

RESTHeart is committed to adhere to Internet standards. To successfully
upload files, RESTHeart's clients must strictly follow the Internet
Media Type multipart/form-data as defined in [RFC
7578](http://tools.ietf.org/html/rfc7578).

[HAL doesn't specify
forms](https://tools.ietf.org/html/draft-kelly-json-hal-07#appendix-B.5)
but the **multipart/form-data** specification allow a form to upload
multiple files at the same time. RESTHeart prohibits this: while it's
possibile to POST / PUT several different non-binary parts for each
file, it's mandatory to upload one single binary file per each POST /
PUT request. This limitation is necessary so that is possible to
univocally relate all the optional parts to a single file.

## Using curl

Let's use curl to upload a PNG image named "picture.png".

What's curl?

curl is an open source command line tool and library for transferring
data with URL syntax. It's installed by default on all Linux
distributions, Mac OSX and most Unix systems. A Windows version is also
available.

[Read more](http://curl.haxx.se).

In this example we assume RESTHeart running on localhost (127.0.0.1),
port 8080, but of course your setup can be different.

### POST a binary file with curl

1) Create a database, if none exists yet:

``` plain
$ curl -u user:password -X PUT -H "Content-Type: application/json" 127.0.0.1:8080/testdb
```

 

2) Create the collection for hosting files. It must end with `.files` to
mark this as a special collection for files:

``` plain
curl -v -u user:password -X PUT -H "Content-Type: application/json" 127.0.0.1:8080/testdb/mybucket.files
```

 

3) POST the file. Set the **file** parameter to the actual binary file,
using the =@ curl syntax. The **filename** must be explicitly set
(`"file=@picture.png;filename=picture.png"`):

``` plain
curl -v -u user:password -X POST -F "file=@picture.png;filename=picture.png" 127.0.0.1:8080/testdb/mybucket.files
```

You'll see an HTTP response header like below, returning a 201 Created:

``` bash
* Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 8080 (#0)
* Server auth using Basic with user 'a'
> POST /testdb/mybucket.files HTTP/1.1
> Authorization: Basic YTph
> User-Agent: curl/7.37.1
> Host: 127.0.0.1:8080
> Accept: */*
> Content-Length: 29324
> Expect: 100-continue
> Content-Type: multipart/form-data; boundary=------------------------895c08ced0e0f00b
> 
< HTTP/1.1 100 Continue
< Content-Length: 0
< HTTP/1.1 201 Created
< Auth-Token-Location: /_authtokens/a
< Location: http://127.0.0.1:8080/testdb/mybucket.files/552e1e89e4b019b2fa790f3f
< Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location
< Date: Wed, 15 Apr 2015 08:17:13 GMT
< Auth-Token: e3a68770-3096-4032-ab86-cf31d3f887da
< Connection: keep-alive
< Access-Control-Allow-Origin: *
< Auth-Token-Valid-Until: 2015-04-15T08:32:13.774Z
< Access-Control-Allow-Credentials: true
< Content-Length: 0
< 
* Connection #0 to host 127.0.0.1 left intact
```

  
The following line in the response header gives the file's location:

``` text
Location: http://127.0.0.1:8080/testdb/mybucket.files/552e1e89e4b019b2fa790f3f
```

Note that the location contains the object ID automatically generated by
MongoDB (see the string "552e1e89e4b019b2fa790f3f" at the end of the
above URL). This is a unique identifier and it's convenient in many
situation, but it's not always desirable. In many case it would be
better to explicitly name the resource with something more readable and
meaningful. To set the resource name it is necessary to upload the file
by using the PUT verb instead of POST.

### Uploading files with PUT

By W3C specifications the POST semantic delegates to the owning resource
the decision on how to handle the creation or the owned resource. In the
previous examples, the `mybucket.files` owner by default assigned to new
files a resource name coming from MongoDB. If we want to decide for a
meaningful name then we just need to send a PUT, like this:

``` plain
curl -v -u user:password -X PUT -F "file=@picture.png;filename=picture.png" 127.0.0.1:8080/testdb/mybucket.files/picture.png
```

 

If we GET the resulting resource, here is the full HTTP response:

  Expand source

``` bash
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location
Auth-Token: aaac99c8-acf7-4311-91ee-4d4a554f1d00
Auth-Token-Location: /_authtokens/a
Auth-Token-Valid-Until: 2015-10-13T16:59:10.673Z
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 396
Content-Type: application/hal+json
Date: Tue, 13 Oct 2015 16:44:10 GMT
ETag: 561d320f300467fb2103584e
{
    "_etag": {
        "$oid": "561d320f300467fb2103584e"
    }, 
    "_id": "mypicture.png", 
    "_lastupdated_on": "2015-10-13T16:32:15Z", 
    "_links": {
        "curies": [
            {
                "href": "http://restheart.org/curies/1.0/{rel}.html", 
                "name": "rh", 
                "templated": true
            }
        ], 
        "rh:bucket": {
            "href": "/testdb/mybucket.files"
        }, 
        "rh:data": {
            "href": "/testdb/mybucket.files/mypicture.png/binary"
        }, 
        "rh:file": {
            "href": "/testdb/mybucket.files/{fileid}?id_type={type}", 
            "templated": true
        }, 
        "self": {
            "href": "/testdb/mybucket.files/mypicture.png"
        }
    }, 
    "_type": "FILE", 
    "aliases": null, 
    "chunkSize": 261120, 
    "contentType": "image/png", 
    "filename": "picture.png", 
    "length": 2798161, 
    "md5": "ad3aeb5907a1a0069fcf87e3c273fb54", 
    "uploadDate": {
        "$date": 1444753935079
    }
}
```

Note that in this case the resource shows a much nicer representation: 

``` plain
127.0.0.1:8080/testdb/mybucket.files/picture.png
```

Which is easier to read and link than the automatically generated name
(but requires a little more work on your side).

 

If you want to better understand the theoretical difference between POST
and PUT verbs in terms of  the Hypertext Transfer Protocol – HTTP/1.1,
this blog post might be useful: [RESTful API memo: PUT and POST
differences](http://maurizioturatti.com/blog/2012/11/13/restful-api-memo-put-and-post/).

### The "properties" part

It's possibile to add an optional form data part to the request by using
the **properties** field name. The content of this field is
automatically parsed as JSON data, so **it must be valid JSON**:

``` plain
$ curl -v -u user:password -X POST -F 'properties={"name":"Maurizio", "surname":"Turatti"}' -F "file=@picture.png;filename=picture.png" 127.0.0.1:8080/testdb/mybucket.files
```

 

The JSON will be merged into the file document (look at the end of the
code block):

  Expand source

``` bash
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location
Auth-Token: 45b78cbb-8eb2-45da-8195-c37ba803f8fc
Auth-Token-Location: /_authtokens/a
Auth-Token-Valid-Until: 2015-10-12T01:43:14.668Z
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 423
Content-Type: application/hal+json
Date: Mon, 12 Oct 2015 01:28:14 GMT
ETag: 561b0ca3321e0befef09343e
{
    "_created_on": "2015-10-12T01:28:03Z", 
    "_embedded": {}, 
    "_etag": {
        "$oid": "561b0ca3321e0befef09343e"
    }, 
    "_id": {
        "$oid": "561b0ca3321e0befef09343c"
    }, 
    "_lastupdated_on": "2015-10-12T01:28:03Z", 
    "_links": {
        "curies": [
            {
                "href": "http://restheart.org/curies/1.0/{rel}.html", 
                "name": "rh", 
                "templated": true
            }
        ], 
        "rh:bucket": {
            "href": "/testdb/mybucket.files"
        }, 
        "rh:data": {
            "href": "/testdb/mybucket.files/561b0ca3321e0befef09343c/binary"
        }, 
        "rh:file": {
            "href": "/testdb/mybucket.files/{fileid}?id_type={type}", 
            "templated": true
        }, 
        "self": {
            "href": "/testdb/mybucket.files/561b0ca3321e0befef09343c"
        }
    }, 
    "_type": "FILE", 
    "aliases": null, 
    "chunkSize": 261120, 
    "contentType": "image/png", 
    "filename": "maurizio.png", 
    "length": 28994, 
    "md5": "6540feba51851416b7b737bed584a80a", 
    "name": "Maurizio", 
    "surname": "Turatti", 
    "uploadDate": {
        "$date": 1444613283563
    }
}
```

If the "properties" part contains a "filename" key then this overrides
the filename coming from the file part.

For example, if the filename was defined by

`"file=@picture.png; filename=picture.png"`

then passing the following part

`'properties={"filename":"different_filename.png"}'`

will override the name "picture.png" with "different\_filename.png".

This way it would be possibile to specify a different filename on the
fly but it could also be a source of side effects, so handle it with
care.

### GET a binary file with curl

GET the HAL representation (metadata only) for the newly created file:

``` plain
$ curl -u user:password http://127.0.0.1:8080/testdb/mybucket.files/552e1e89e4b019b2fa790f3f
```

 

Appending \``/binary`\` at the end of the above URL makes possible to
GET the binary content stored into GridFS:

``` plain
$ curl -u user:password http://127.0.0.1:8080/testdb/mybucket.files/552e1e89e4b019b2fa790f3f/binary
```

If we paste this URL to a browser's address bar then the image is
displayed. This allows RESTHeart to serve as a very basic but powerful
digital asset management system.

![](attachments/11567174/13107220.png?width=800){width="800"}

As explained, the underlying storage mechanism is MongoDB's GridFS,
which is an extremely powerful abstraction over a filesystem, without
any file size limits.

When should I use GridFS?

For documents in a MongoDB collection, you should always use GridFS for
storing files larger than 16 MB.

In some situations, storing large files may be more efficient in a
MongoDB database than on a system-level filesystem.

-   If your filesystem limits the number of files in a directory, you
    can use GridFS to store as many files as needed.
-   When you want to keep your files and metadata automatically synced
    and deployed across a number of systems and facilities. When using
    geographically distributed replica sets MongoDB can distribute files
    and their metadata automatically to a number of mongod instances and
    facilities.
-   When you want to access information from portions of large files
    without having to load whole files into memory, you can use GridFS
    to recall sections of files without reading the entire file into
    memory.

[Read
More](http://docs.mongodb.org/manual/faq/developers/#faq-developers-when-to-use-gridfs).

## Using httpie

While curl does its job, instead we
love [httpie](https://github.com/jakubroztocil/httpie). This little
Python program allows to indent and colorize the output of HTTP
responses, making it more readable than curl.

Let's say we already have a db called "`testdb`", exactly as with curl,
first create the `.files` collection, if it doesn't exist yet:

``` plain
$ http -a user:password -j PUT 127.0.0.1:8080/testdb/mybucket.files
```

 

Then POST a file named "picture.png":

``` plain
http -a user:password -f POST 127.0.0.1:8080/testdb/mybucket.files file@picture.png;filename=picture.png
```

 

For example, to upload a file named "mypicture.png" with PUT:

``` plain
http -a user:password -f PUT 127.0.0.1:8080/testdb/mybucket.files/mypicture.png file@"~/Desktop/mypicture.png" properties='{"author":"Maurizio Turati"}'
```

## Attachments:

![](images/icons/bullet_blue.gif){width="8" height="8"} [Schermata
2015-10-13 alle 19.26.10.png](attachments/11567174/13107220.png)
(image/png)  
