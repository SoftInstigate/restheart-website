---
layout: page-notopnav
title: keys
permalink: /curies/2.0/keys.html
---

## Projecting documents

Projection limits the fields to return for all matching documents, specifying the inclusion or the exclusion of fields.

This is done via the **keys** query parameter. 

{: .bs-callout .bs-callout-info }
The system properties (properties starting with **_** that are managed automatically by RESTHeart) are not affected by this option.

## Examples

### return just the property *title*

{% highlight bash %}
$ http GET 127.0.0.1:8080/test/coll?keys={'title':1}
{% endhighlight %}

### return all but the property *title*

{% highlight bash %}
$ http GET 127.0.0.1:8080/test/coll?keys={'title':0}
{% endhighlight %}

### return just the properties *title* and *summary*

{% highlight bash %}
$ http GET "127.0.0.1:8080/test/coll?keys={title:1}&keys={'summary':1}"
{% endhighlight %}

{: .bs-callout .bs-callout-info }
note that you specify multiple keys using multiple keys query parameters

## Documentation references

* [Collection Resource](coll.html)
* [Document Resource](document.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/UICM" target="_blank">Representation Format</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/XACk" target="_blank">Query Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.