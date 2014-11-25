---
layout: doc-page-md
title:  "RESTHeart up and running"
permalink: /docs/v0.9/get-up-and-running.html
class1: active
---

## What you need
{: .post}

If you don't have them already, please download the following packages:

* [Java 1.8](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [mongodb](http://www.mongodb.org/downloads)
* [RESTHeart](https://github.com/softinstigate/restheart) 

## Install Java and mongodb
{: .post}

Install java and mongodb and make sure that their binaries are in your PATH env variable.

Check java and mongodb. You should get _something_ like that (output might vary depending on java version and your OS):

{% highlight bash %}
$ java -version
java version "1.8.0"
Java(TM) SE Runtime Environment (build 1.8.0-b132)
Java HotSpot(TM) 64-Bit Server VM (build 25.0-b70, mixed mode)
{% endhighlight %}

{% highlight bash %}
$ mongod --version
db version v2.6.3
2014-11-24T15:42:54.389+0100 git version: 255f67a66f9603c59380b2a389e386910bbb52cb
{% endhighlight %} 

RESTHeart has been tested with mongodb version 2.4 and 2.6.
{: .bs-callout.bs-callout-info}

## Install RESTHeart
{: .post}

To _install_ RESTHeart just extract the content of the dowloaded package in a known directory.

You are interested in two files:

* restheart.jar
* etc/restheart.yml <- an example configuration file

## Start mongodb
{: .post}

In pursuit of simplicity we are first going to start mongodb without enabling authetication. We'll see later how to enable it.

{% highlight bash %}
$ mongod --fork --syslog
about to fork child process, waiting until server is ready for connections.
forked process: 11471
child process started successfully, parent exiting
{% endhighlight %} 

## Start RESTHeart
{: .post}

> just run restheart.jar with java. This starts RESTHeart with the default configuration which is fine for mongodb running on the local host, on default port and without authentication.

{% highlight bash %}
$ java -server -jar restheart.jar
18:14:56.854 [main] INFO  c.s.restheart.Bootstrapper - starting RESTHeart ********************************************
18:14:56.885 [main] INFO  c.s.restheart.Bootstrapper - RESTHeart version 0.9.3
18:14:57.016 [main] INFO  c.s.restheart.Bootstrapper - initializing mongodb connection pool to 127.0.0.1:27017 
18:14:57.017 [main] INFO  c.s.restheart.Bootstrapper - mongodb connection pool initialized
18:14:58.096 [main] WARN  c.s.restheart.Bootstrapper - ***** no identity manager specified. authentication disabled.
18:14:58.097 [main] WARN  c.s.restheart.Bootstrapper - ***** no access manager specified. users can do anything.
18:14:58.325 [main] INFO  c.s.restheart.Bootstrapper - https listener bound at 0.0.0.0:4443
18:14:58.326 [main] INFO  c.s.restheart.Bootstrapper - http listener bound at 0.0.0.0:8080
18:14:58.345 [main] INFO  c.s.restheart.Bootstrapper - local cache enabled
18:14:58.389 [main] INFO  c.s.restheart.Bootstrapper - url / bound to mongodb resource *
18:14:58.711 [main] INFO  c.s.restheart.Bootstrapper - embedded static resources browser extracted in /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart-1028992838784154303
18:14:58.757 [main] INFO  c.s.restheart.Bootstrapper - url /browser bound to static resources browser. access manager: false
18:14:59.100 [main] INFO  c.s.restheart.Bootstrapper - logging to /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart.log with level INFO
18:14:59.101 [main] INFO  c.s.restheart.Bootstrapper - logging to console with level INFO
18:14:59.101 [main] INFO  c.s.restheart.Bootstrapper - RESTHeart started **********************************************
{% endhighlight %}

We'll now use the embedded HAL browser to check that everythig is fine. The HAL browser allows you to surf the DATA API with your browser.
{: .bs-callout.bs-callout-info}

Open your browser at [http://127.0.0.1:8080/browser](http://127.0.0.1:8080/browser)


## Enable mongodb authentication
{: .post}

> WORK IN PROGRESS

## Enable RESTHeart security
{: .post}

> WORK IN PROGRESS