---
layout: page-notopnav
title: filter
permalink: /curies/1.2/filter.html
---

## Filtering documents

To filter the documents (or files) embedded in a collection (or bucket) representation, use the **filter** query parameter.

{: .bs-callout .bs-callout-info }
The value of the filter query parameter is any * <a href="https://docs.mongodb.org/manual/tutorial/query-documents/" target="_blank">MongoDB query</a>

{: .bs-callout .bs-callout-info }
RESTHeart use the stric mode representation of BSON: in some cases, notably the ObjectId, the property type must be specified. See example 1.

## Examples:

### how to use the ObjectId is filters

{% highlight bash %}
http -a a:a GET 127.0.0.1:8080/test/coll?filter="{'_id':{'\$oid':'56053ea1c2e6b6654c501db2'}}"
...
{% endhighlight %}

{: .bs-callout .bs-callout-info }
the backslash prepending $oid is only needed in Linux or MacOS terminals, that whould interpret it as an environmental variable, thus need to be escaped.

* the condition <code>{'_id':{'$oid':'56053ea1c2e6b6654c501db2'}}</code> checks the _id to be an ObjectId
* the condition <code>{'_id':'56053ea1c2e6b6654c501db2'}</code>  checks the _id to be a String

### return the document whose _id is title starts with "Star Trek"

{% highlight bash %}
$ http GET "127.0.0.1:8080/test/coll?filter={'title':{'$regex':'(?i)^STAR TREK.*'}}"
...
{% endhighlight %}

### return documents whose title starts with "Star Trek"

{% highlight bash %}
$ http GET "127.0.0.1:8080/test/coll?filter={'title':{'$regex':'(?i)^STAR TREK.*'}}"
...
{% endhighlight %}

This query uses the mongodb $regex operator where the i option performs a case-insensitive match for documents with title value that starts with "star trek".

###  documents whose title starts with "Star Trek" and publishing_date is later than 4/9/2015, 8AM

{% highlight bash %}
$ http -a a:a GET "127.0.0.1:8080/test/coll?filter={'$and':[{'title': {'$regex':'(?i)^STAR TREK.*'}, {'publishing_date':{'$gte':{'$date':'2015-09-04T08:00:00Z'}}}]}"
 
or
 
$ http -a a:a GET "127.0.0.1:8080/test/coll?filter={'title':{'$regex':'(?i)^STAR TREK.*'}&filter={'publishing_date':{'$gte':{'$date':'2015-09-04T08:00:00Z'}}}"
{% endhighlight %}

{: .bs-callout .bs-callout-info }
Note the second form of the last example. If multiple filter query parameters are specified, they are logically composed with the AND operator.
This can be very useful in conjunction with path based security permission.
For instance the following permission can be used with the simple file based Access Manager to restrict users to GET a collection only specifying a filter on the author property to be equal to their username:
<code>regex[pattern="/test/coll/\?.*filter={'author':'(.*?)'}.*", value="%R", full-match=true] and equals[%u, "${1}"]<code>

## Documentation references

* [Collection Resource](coll.html)
* [Document Resource](document.html)
* [Bucket Resource](bucket.html)
* [File Resource](file.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/UICM" target="_blank">Representation Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/XACk" target="_blank">Query Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.
