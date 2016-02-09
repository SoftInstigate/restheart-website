---
layout: page-notopnav
title: bucket
permalink: /curies/2.0/bucket.html
---

## The Bucket resource

The Bucket resource represents a containers for binary files (GridFS). 
Requests to Bucket URI allow to manage the file buckets, create files and get the list of existing files.

Allowed methods are:

{: .table }
**Method**|**Description**
GET	|Returns the files bucket properties and the <a href="paging.html">paginated</a> list of its files
PUT	|Creates or updates the files bucket
POST	|Creates a file in the bucket
DELETE	|Deletes the files bucket

The resource URI format is <code>/&lt;dbname&gt;/&lt;bucketname&gt;.files</code>

{: .bs-callout .bs-callout-info }
The name of the bucket **must** end with the **.files** suffix. This is how a bucket resource URI is distinguished from a collection resource URI.

{: .bs-callout .bs-callout-info }
The following options influence the files returned as embedded resources to a GET bucket request: [pagination](paging.html), [sorting](sort.html), [filtering](filter.html) and [projecting](keys.html).

{: .bs-callout .bs-callout-info }
Updating an existing file in not yet possibile. These are immutable resources.

## Examples:

### create the file bucket <code>/test/mybucket.files</code> with the property *descr*

{% highlight bash %}
$ http PUT 127.0.0.1:8080/test/mybucket.files descr="my first bucket"
HTTP/1.1 201 Created
...
ETag: 5516731ec2e6e922cf58d6af
{% endhighlight %}

### update the bucket <code>/test</mybucket.files</code> adding the property *creator*

{% highlight bash %}
$ http PUT 127.0.0.1:8080/test/mybucket.files creator="ujibang" If-Match:5516731ec2e6e922cf58d6af
HTTP/1.1 201 CREATED
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the If-Match request header. This needs to be added to modify an existing resource. 
See [ETag](https://softinstigate.atlassian.net/wiki/x/hICM) documentation section for more information.

### create a file in the bucket <code>/test/mybucket.files</code>.

{% highlight bash %}
http -f POST 127.0.0.01:8080/testdb/mybucket.files file@image.png properties='{"filename":"image.png"}'
HTTP/1.1 201 CREATED
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Creating a file requires a multi-part request: parts are *file* and *properties*, the former is the data, the latter a json string with properties to attach to the file.

### create a file in the bucket <code>/test/mybucket.files</code> with curl.
{% highlight bash %}
curl -v -u user:password -X POST -F 'properties={"filename":"image.png"}' -F "file=@image.png" 127.0.0.1:8080/test/mybucket.files
HTTP/1.1 201 CREATED
...
Location: http://127.0.0.01:8080/test/mybucket.files/560537d3c2e6b6654c501da9
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the Location response header. This is the URL of the created file.

### get the bucket <code>/test/mybucket.files</code> which includes its files as _embedded resources.

{% highlight bash %}
$ http GET 127.0.0.1:8080/test/mybucket.files
HTTP/1.1 200 OK
...

{
  "_embedded": {
    "rh:file": [
      {
        "_embedded": {},
        "_links": {
          "self": {
            "href": "/test/mybucket.files/5516d178c2e657ee55badc8c"
          },
          "rh:data": {
            "href": "/test/mybucket.files/5516d178c2e657ee55badc8c/binary"
          },
          "rh:bucket": {
            "href": "/test/mybucket.files"
          }
          ...
        },
        "_type": "FILE",
        "filename": "image.png",
        "length": 3225,
        "contentType": "image/png",
        "_id": {
          "$oid": "5516d178c2e657ee55badc8c"
        }
      ]
  },
  ...
  "_type": "FILES_BUCKET",
  "_id": "checksize.files",
  "descr": "my first bucket",
  "_returned": 1
}
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the contentType. This property is automatically detected and stored by RESTHeart.

{: .bs-callout .bs-callout-info }
Note the file representation and its **rh:data** link:<br>
GET /test/mybucket.files/5516d178c2e657ee55badc8c returns the file properties.<br>
GET /test/mybucket.files/5516d178c2e657ee55badc8c/binary downloads the binary data.

## Documentation references

* [Collection Resource](coll.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/ToCM" target="_blank">URI Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/hICM" target="_blank">ETag</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/RoCw" target="_blank">Binary Data (GridFS)</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/XACk" target="_blank">Query Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.