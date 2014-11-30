---
layout: doc-page-md
title:  "RESTHeart up and running"
permalink: /docs/get-up-and-running.html
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

For more information, refer to the [mongodb documentation](http://docs.mongodb.org/manual/tutorial/enable-authentication/)
{: .bs-callout.bs-callout-info}

Start mongodb with authentication enablend and connect to the MongoDB instance from a client running on the same system. This access is made possible by the localhost exception.

{% highlight bash %}
$ mongod --fork --syslog --auth
$ mongo 
{% endhighlight %}

Create the admin user. The procedure is different depending on mongodb version.

#### For mongodb version 2.6

{% highlight bash %}
> use admin
> db.createUser(
  {
    user: "admin",
    pwd: "changeit",
    roles:
    [ {
        role: "root",
        db: "admin"
      } ] } )
{% endhighlight %}

#### For mongodb version 2.4

{% highlight bash %}
> use admin
> db.addUser( { 
              user: "admin",
              pwd: "changeit",
              roles: [ "clusterAdmin", "dbAdminAnyDatabase" ] } )
{% endhighlight %}

You can use a mongodb user with less priviledges; for instance, a user that can use just a single DB. In this case you might want to have RESTHeart serving requests just about this resource. You can achieve this via [mongo-mounts](http://127.0.0.1:4000/docs/configuration.html#conf-mongodb).
{: .bs-callout.bs-callout-warning}

We need to provide the mongodb authentication credentials in the RESTHeart configuration file: [see docs](./configuration.html). 
{: .bs-callout.bs-callout-info}

We'll use the restheart.yml example configuration file that comes with RESTHeart download package (you find it in the etc directory).

{% highlight bash %}
$ cd <RESTHeart_DIR>
$ vi etc/restheart.yml
{% endhighlight %}

Find, uncomment and modify the following section providing the chosen username, password and  authentication db (the db where the mongodb user is defined, in our case 'admin').

{% highlight yaml %}
# Provide mongodb users credentials with mongo-credentials.
mongo-credentials:
    - auth-db: admin
      user: admin
      password: changeit
{% endhighlight %}

Now start RESTHeart specifying the configuration file

{% highlight bash %}
$ java -server -jar restheart.jar etc/restheart.yml
{% endhighlight %}

Test the connection opening the HAL browser at [http://127.0.0.1:8080/browser](http://127.0.0.1:8080/browser)

## Enable RESTHeart security
{: .post}

> WORK IN PROGRESS