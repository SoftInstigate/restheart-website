---
layout: page-notopnav
title: file
permalink: /curies/1.0/file.html
---

## The File resource

The File resource represents a file in a bucket.
Requests to File URI allow to create, delete files and get their properties and binary data.

Allowed methods are:

{: .table }
**Method**|**Description**
GET	|Returns the file document (that includes the link to download the binary data)
PUT	|Creates the file in the bucket
DELETE	|Deletes the file

The resource URI format is <code>/&lt;dbname&gt;/&lt;bucketname&gt;.files/&lt;fileid&gt;[?doc_type=TYPE]</code>

The query parameter <code>doc_type</code> is optional; its default value is **STRING_OID**: by default RESTHeart treats the <code>docid</code> as an ObjectId, if the value is a valid ObjectId, or a String.

The following table shows the supported types:

{: .table }
**Type** |**id_type**
ObjectId	|OID or STRING_OID
String  |STRING* or STRING_OID
Number	|NUMBER
Date	|DATE
MinKey	|MINKEY
MaxKey	|MAXKEY

{: .bs-callout .bs-callout-info }
\* doc_type=STRING is useful if the _id value would be a valid ObjectId but it is actually stored as a String.
Refer to [URI Format](https://softinstigate.atlassian.net/wiki/x/ToCM) for more information.

{: .bs-callout .bs-callout-info }
Updating an existing file in not yet possibile. These are immutable resources.

## Examples

### create a file

{% highlight bash %}
http -f POST 127.0.0.01:8080/testdb/mybucket.files file@image.png properties='{"filename":"image.png"}'
HTTP/1.1 201 CREATED
...
Location: http://127.0.0.01:8080/test/mybucket.files/560537d3c2e6b6654c501da9
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Creating a file requires a multi-part request: parts are *file* and *properties*, the former is the data, the latter a json string with properties to attach to the file.

{: .bs-callout .bs-callout-info }
Note the Location response header. This is the URL of the created file.

### create a file using curl
{% highlight bash %}
curl -v -u user:password -X POST -F 'properties={"filename":"image.png"}' -F "file=@image.png" 127.0.0.1:8080/test/mybucket.files
HTTP/1.1 201 CREATED
...
Location: http://127.0.0.01:8080/test/mybucket.files/560537d3c2e6b6654c501da9
{% endhighlight %}

### get the file properties

{% highlight bash %}
http GET 127.0.0.01:8080/test/mybucket.files/5516d178c2e657ee55badc8c
HTTP/1.1 200 OK
ETag: 560537d3c2e6b6654c501dab
...

{
    "_id": {
        "$oid": "5516d178c2e657ee55badc8c"
    }, 
    "_links": {
        "rh:bucket": {
            "href": "/test/mybucket.files"
        }, 
        "rh:data": {
            "href": "/test/mybucket.files/5516d178c2e657ee55badc8c/binary"
        },
        ...
    }, 
    "_type": "FILE", 
    "chunkSize": 261120, 
    "contentType": "image/png", 
    "filename": "image.png", 
    "length": 234712, 
    "md5": "b4f30f3485b1b86eba5b34ac06fc31a1", 
    "uploadDate": {
        "$date": 1443182547167
    },
    ...
}
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the contentType. This property is automatically detected and stored by RESTHeart.

{: .bs-callout .bs-callout-info }
Note the file representation and its **rh:data** link:<br>
GET /test/mybucket.files/5516d178c2e657ee55badc8c returns the file properties.<br>
GET /test/mybucket.files/5516d178c2e657ee55badc8c/binary downloads the binary data.

### get the file binary

{% highlight bash %}
http GET 127.0.0.01:8080/test/mybucket.files/5516d178c2e657ee55badc8c/binary
TTP/1.1 200 OK
Transfer-Encoding: chunked

+-----------------------------------------+
| NOTE: binary data not shown in terminal |
+-----------------------------------------+
{% endhighlight %}

### web caching

Browsers use the ETAG response header for web caching. 
Further requests to the resource including the If-None-Match header, gets **304 Not Modified** as response.
This effectively save bandwidth.

{% highlight bash %}
http GET 127.0.0.01:8080/test/mybucket.files/5516d178c2e657ee55badc8c/binary If-None-Match:560537d3c2e6b6654c501dab
HTTP/1.1 304 Not Modified
...
{% endhighlight %}

### delete a file

{% highlight bash %}
http DELETE 127.0.0.01:8080/test/mybucket.files/5516d178c2e657ee55badc8c If-Match:560537d3c2e6b6654c501dab
HTTP/1.1 204 No Content
...
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the If-Match request header. This needs to be added to modify an existing resource. 
See [ETag](https://softinstigate.atlassian.net/wiki/x/hICM) documentation section for more information.

## Documentation references

* [Bucket Resource](bucket.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/ToCM" target="_blank">URI Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/UICM" target="_blank">Representation Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/XACk" target="_blank">Query Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.