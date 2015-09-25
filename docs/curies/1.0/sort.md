---
layout: page
title: sort
permalink: /curies/1.0/sort.html
---

## Sorting documents

To sort the documents (or files) embedded in a collection (or bucket) representation, use the **sort_by** query parameter.

Default sorting is by _id descending. If _id are ObjectId, this makes sure that last created document or file is the first returned.
{: .bs-callout .bs-callout-info }

## Examples:

### sort by the property date ascending

{% highlight bash %}
$ http GET 127.0.0.1:8080/test/coll?sort_by=date
{% endhighlight %}

### sort by the property date descending

{% highlight bash %}
$ http GET 127.0.0.1:8080/test/coll?sort_by=-date
{% endhighlight %}

### sort by the property date descending and title ascending 

{% highlight bash %}
http GET 127.0.0.1:8080/test/coll?sort_by=-date&sort_by=title
{% endhighlight %}

note that you specify multiple sort options using multiple sort_by query parameters
{: .bs-callout .bs-callout-info }

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
