---
layout: page-notopnav
title: shardkey
permalink: /curies/2.0/shardkey.html
---

## Shards

> The shard key determines the distribution of the collection’s documents among the cluster’s shards.

This is specified via the **shardkey** query parameter. 

{: .bs-callout .bs-callout-info }

## Examples

### return documents with given shardkey

{% highlight bash %}
GET 127.0.0.1:8080/test/coll?shardkey={"skey":"A"}
{% endhighlight %}

### write document specifying the shardkey

{% highlight bash %}
$ http POST "127.0.0.1:8080/test/coll?shardkey={"skey":"B"} desc="just a document"
{% endhighlight %}

## Documentation references

* <a href="https://softinstigate.atlassian.net/wiki/x/BoBRAQ" target="_blank">Shard Keys Documents</a>

## How to use the examples
The examples make use of the brilliant [httpie](https://github.com/jkbrzt/httpie) CLI HTTP client and are ment to be used with RESTHeart stareted on the localhost without the authentication enabled.

Eventually pass username and password with the <code>-a username:password</code> option.