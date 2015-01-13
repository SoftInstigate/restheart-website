---
layout: doc-page-md
title:  "RESTHeart up and running"
permalink: /docs/get-up-and-running.html
class1: active
---

* Table of contents
{: toc}


## 1. Quick-start - run it with Vagrant ##
{: .post}

If you don't want to install and run all the components manually on your host, there is a handy [Vagrant box](https://github.com/SoftInstigate/restheart-ansible) available for creating a complete virtual development environment, using a Ubuntu 14.04 image with JDK 8, MongoDB 2.6 and the latest RESTHeart server. You can then skip section 2 to 6 and jump directly to section 7, in case you want to know how to change the default security settings.

> Vagrant is recommended as it makes your first contact with RESTHeart a lot simpler.

Otherwise, please follow the next sections for a full local installation.

## 2. Run it on your host - what you need ##
{: .post}

If you don't have them already, please download the following packages:

* [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [MongoDB](http://www.MongoDB.org/downloads)
* [RESTHeart](https://github.com/softinstigate/restheart)

Most of the work must be done using a command line interface. 

## 3. Install Java and MongoDB ##
{: .post}

Install [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and [MongoDB](http://docs.mongodb.org/manual/installation/) following the instructions for your specific operating system and make sure that their binaries are actually executable (so they are in your PATH env variable).

To check Java and MongoDB, you should execute the following commands and you should get _something_ like the below (output might vary depending on Java version and your OS):

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

RESTHeart has been tested with MongoDB version 2.4 and 2.6.
{: .bs-callout.bs-callout-info}

## 4. Install RESTHeart ##
{: .post}

To _install_ RESTHeart just extract the content of the [dowloaded](https://github.com/SoftInstigate/RESTHeart/releases) package in the desired directory.

You are interested in two files:

* `restheart.jar`
* `etc/restheart.yml` <- an example configuration file

## 5 .Start MongoDB ##
{: .post}

In pursuit of simplicity we are first going to start MongoDB without enabling authentication. We'll see later how to enable it.

You can just start MongoDB by running the `mongod` command from a shell prompt. It is configured by default to use the `/data/db` folder, which must exist already or you have to create it beforehand. If you do not want to use the default data directory (i.e., `/data/db`), specify the path to the data directory using the `--dbpath` option: `mongod --dbpath <path to data directory>`. You might prefer to run the MongoDB process in background, using the `--fork` parameter: `mongod --fork --syslog`:

{% highlight bash %}
$ mongod --fork --syslog
about to fork child process, waiting until server is ready for connections.
forked process: 11471
child process started successfully, parent exiting
{% endhighlight %}

By default MongoDB starts listening for connections on `127.0.0.1:27017`.

## 6. Start the RESTHeart server ##
{: .post}

Run the RESTHeart server by typing `java -server -jar restheart.jar`.

This starts it with the default configuration, which is fine for MongoDB running on localhost, on default port and without authentication.
{: .bs-callout.bs-callout-info}

On Linux, OSX and Solaris you can also run RESTHeart as a [daemon](https://en.wikipedia.org/wiki/Daemon_(computing)): `java -server -jar restheart.jar --fork`.
Note that this will force the console logging to be turned off and the file logging on, regardless the specified log configuration options.
{: .bs-callout.bs-callout-info}

For example:

{% highlight bash %}
$ java -server -jar restheart.jar
18:14:56.854 [main] INFO  c.s.restheart.Bootstrapper - starting RESTHeart ********************************************
18:14:56.885 [main] INFO  c.s.restheart.Bootstrapper - RESTHeart version 0.9.3
18:14:57.016 [main] INFO  c.s.restheart.Bootstrapper - initializing MongoDB connection pool to 127.0.0.1:27017 
18:14:57.017 [main] INFO  c.s.restheart.Bootstrapper - MongoDB connection pool initialized
18:14:58.096 [main] WARN  c.s.restheart.Bootstrapper - ***** no identity manager specified. authentication disabled.
18:14:58.097 [main] WARN  c.s.restheart.Bootstrapper - ***** no access manager specified. users can do anything.
18:14:58.325 [main] INFO  c.s.restheart.Bootstrapper - https listener bound at 0.0.0.0:4443
18:14:58.326 [main] INFO  c.s.restheart.Bootstrapper - http listener bound at 0.0.0.0:8080
18:14:58.345 [main] INFO  c.s.restheart.Bootstrapper - local cache enabled
18:14:58.389 [main] INFO  c.s.restheart.Bootstrapper - url / bound to MongoDB resource *
18:14:58.711 [main] INFO  c.s.restheart.Bootstrapper - embedded static resources browser extracted in /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart-1028992838784154303
18:14:58.757 [main] INFO  c.s.restheart.Bootstrapper - url /browser bound to static resources browser. access manager: false
18:14:59.100 [main] INFO  c.s.restheart.Bootstrapper - logging to /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart.log with level INFO
18:14:59.101 [main] INFO  c.s.restheart.Bootstrapper - logging to console with level INFO
18:14:59.101 [main] INFO  c.s.restheart.Bootstrapper - RESTHeart started **********************************************
{% endhighlight %}

We'll now use the [HAL](http://stateless.co/hal_specification.html) format and the embedded [HAL browser](https://github.com/mikekelly/hal-browser) to check that everything is fine. The HAL browser allows you to surf the DATA API with your regular Web browser.

[HAL](http://stateless.co/hal_specification.html) is a simple format that gives a consistent and easy way to hyperlink between resources in your API. _Adopting HAL will make your API explorable, and its documentation easily discoverable from within the API itself. In short, it will make your API easier to work with and therefore more attractive to client developers. APIs that adopt HAL can be easily served and consumed using open source libraries available for most major programming languages. It's also simple enough that you can just deal with it as you would any other JSON_.
{: .bs-callout.bs-callout-info}

To see the HAL user interface, now open your browser at:

[`http://127.0.0.1:8080/browser`](http://127.0.0.1:8080/browser)
{: .text-center}

## 7. Enable MongoDB authentication ##
{: .post}

For more information, refer to the [MongoDB documentation](http://docs.MongoDB.org/manual/tutorial/enable-authentication/)
{: .bs-callout.bs-callout-info}

Start MongoDB with authentication and connect to the MongoDB instance from a client running on the same system. This access is made possible by the localhost exception. Again, you might prefer to run the MongoDB process in background, using the `--fork` parameter: `mongod --fork --syslog --auth`

{% highlight bash %}
$ mongod --fork --syslog --auth
$ mongo 
{% endhighlight %}

Create the admin user. The procedure is different depending on MongoDB version.

### 7.1. For MongoDB version 2.6 ###

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

### 7.2. For MongoDB version 2.4 ###

{% highlight bash %}
> use admin
> db.addUser( { 
              user: "admin",
              pwd: "changeit",
              roles: [ "clusterAdmin", "dbAdminAnyDatabase" ] } )
{% endhighlight %}

You can use a MongoDB user with less privileges; for instance, a user could be restricted to use only a single DB. In this case you might want to have RESTHeart serving requests about this resource. You can achieve this via [mongo-mounts](http://127.0.0.1:4000/docs/configuration.html#conf-MongoDB).
{: .bs-callout.bs-callout-warning}

We need to provide the MongoDB authentication credentials in the RESTHeart configuration file: [see docs](./configuration.html). 
{: .bs-callout.bs-callout-info}

We'll use the restheart.yml example configuration file that comes with RESTHeart download package (you find it in the etc directory).

{% highlight bash %}
$ cd <RESTHeart_DIR>
$ vi etc/restheart.yml
{% endhighlight %}

Find, uncomment and modify the following section providing the chosen user-name, password and authentication db (the db where the MongoDB user is defined, in our case 'admin').

{% highlight yaml %}
# Provide MongoDB users credentials with mongo-credentials.
mongo-credentials:
    - auth-db: admin
      user: admin
      password: changeit
{% endhighlight %}

Now start RESTHeart specifying the configuration file:

{% highlight bash %}
$ java -server -jar restheart.jar etc/restheart.yml
{% endhighlight %}

Test the connection opening the HAL browser at [http://127.0.0.1:8080/browser](http://127.0.0.1:8080/browser).

Note that the example configuration file <code>etc/restheart.yml</code> also enables the RESTHeart security. 
Opening the HAL browser page, you'll be asked to authenticate. You can use of one of the credentials defined in <code>etc/security.yml</code> file (try username = 'a' and password = 'a').
{: .bs-callout.bs-callout-info}

## 8. Enable RESTHeart security ##
{: .post}

We'll use the default file based security implementation (<code>SimpleFileIdentityManager</code> and <code>SimpleAccessManager</code>) to enforce user authentication on RESTHeart API. 
Please refer to [configuration documentation](http://127.0.0.1:4000/docs/configuration.html#conf-security) for more information.

Open the <code>etc/restheart.yml</code>. The security section is the following:

{% highlight yaml %}
idm:
    implementation-class: com.softinstigate.restheart.security.impl.SimpleFileIdentityManager
    conf-file: ./etc/security.yml
access-manager:
    implementation-class: com.softinstigate.restheart.security.impl.SimpleAccessManager
    conf-file: ./etc/security.yml
{% endhighlight %}

This setting plugs the specified identity manager (IDM) and the access manager (AM) implementations to RESTHeart.

Both the IDM and AM are in turn configured by the <code>etc/security.yml</code> configuration file.
The security configuration file defines users, roles and permissions.

{% highlight yaml %}
users:
    - userid: a
      password: a
      roles: [admins]
...
permissions:
    - role: admins
      predicate: path-prefix[path="/"]
...
{% endhighlight %}

RESTHeart uses [Undertow](http://undertow.io) as the embedded HTTP server.

Undertow is a flexible performant web server written in java, providing both blocking and non-blocking API’s based on NIO. Undertow is extremely lightweight, with the Undertow core jar coming in at under 1Mb. It is lightweight at run-time too, with a simple embedded server using less than 4Mb of heap space. Undertow is sponsored by JBoss and is the default web server in the [Wildfly Application Server](https://github.com/wildfly/wildfly).
{: .bs-callout.bs-callout-info}

Permissions are given to roles by the means of Undertow's predicates on requests. Requests satisfying the predicates are accepted. For instance, the predicate <code>path-prefix[path="/"]</code> is satisfied by any request; thus users with _admin_ role is allowed any verb on any URI.

Refer to [Udertow's documentation](http://undertow.io/documentation/core/predicates-attributes-handlers.html) for more information on requests predicates.

The special role <code>$unauthenticated</code> allows to give permissions on resources without requiring authentication. 
For instance the following permission allows unauthenticated users to GET any resource with URI starting with /publicdb

{% highlight yaml %}
    - role: $unauthenticated
      predicate: path-prefix[path="/publicdb/"] and method[value="GET"]
{% endhighlight %}
