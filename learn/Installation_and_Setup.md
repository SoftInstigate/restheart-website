---
layout: docs
title: Installation and Setup
---

* [Quick-start](#quick-start)
    * [Docker](#docker)
    * [Vagrant](#vagrant)
    * [Bare metal](#bare-metal)
* [Run it on your host](#run-it-on-your-host)
    * [1. Install Java and MongoDB](#1-install-java-and-mongodb)
    * [2. Install RESTHeart](#2-install-restheart)
    * [3. Start MongoDB](#3-start-mongodb)
    * [4. Start the RESTHeart server](#4-start-the-restheart-server)
    * [5. Enable MongoDB authentication](#5-enable-mongodb-authentication)
    * [5.1 Connect RESTHeart to MongoDB over TLS/SSL](#51-connect-restheart-to-mongodb-over-tlsssl)
    * [5.2. MongoDB authentication with just enough permissions ](#52-mongodb-authentication-with-just-enough-permissions)
    * [6. Clients Authentication and Authorization](#6-clients-authentication-and-authorization)
* [Additional resources for beginners](#additional-resources-for-beginners)

## Quick-start

### Docker

RESTHeart fits naturally a microservices architecture and a [Docker
image](https://hub.docker.com/r/softinstigate/restheart/) is available
and fully maintained by us. Docker should be considered the best and
easiest way to create a development or production environment with
RESTHeart. The source code contains a docker-compose configuration which
makes things straightforward. Please have a look at the [Docker
folder](https://github.com/SoftInstigate/restheart/tree/master/Docker)
in the source code distribution. We are using RESTHeart running within
Docker in production since a long time now, so we recommend it as the
way to go.

### Vagrant

Before switching to Docker we used Vagrant. A [Vagrant
box](https://github.com/SoftInstigate/restheart-vagrant) is available
for creating a complete virtual development environment, using a Ubuntu
14.04 image with JDK 8, MongoDB 3 and the latest RESTHeart server. You
can then skip section 2 to 6 and jump directly to section 7, in case you
want to know how to change the default security settings. Unfortunately
we don't fully maintain the Vagrant repository anymore, so it's up to
you to update it to fit your purpose. Pull requests are welcome.

### Bare metal

Please follow the next sections for a full local installation.

## Run it on your host

If you don’t have them already, please download the following packages:

-   [Java 8](index)
-   [MongoDB](http://www.mongodb.org/downloads)
-   [RESTHeart](https://github.com/softinstigate/restheart)

Most of the work must be done using a command line interface. 

### 1. Install Java and MongoDB

Install [Java
8](index) and [MongoDB](http://docs.mongodb.org/manual/installation/) following
the instructions for your specific operating system and make sure that
their binaries are actually executable (so they are in your PATH env
variable).

To check Java and MongoDB, you should execute the following commands and
you should get *something* like the below (output might vary depending
on Java version and your OS):

``` text
$ java -version
java version "1.8.0_66"
Java(TM) SE Runtime Environment (build 1.8.0_66-b17)
Java HotSpot(TM) 64-Bit Server VM (build 25.66-b17, mixed mode)

$ mongod --version
db version v3.0.7
```

RESTHeart has been tested with MongoDB version 3.2, 3.0, 2.6 and 2.4.

### 2. Install RESTHeart

To *install* RESTHeart just extract the content of
the [dowloaded](https://github.com/SoftInstigate/RESTHeart/releases) package
in the desired directory.

You are interested in two files:

-   `restheart.jar`
-   `etc/restheart.yml` &lt;- an example configuration file

### 3. Start MongoDB

In pursuit of simplicity we are first going to start MongoDB without
enabling authentication. We’ll see later how to enable it.

You can just start MongoDB by running the `mongod` command from a shell
prompt. It is configured by default to use the `/data/db`folder, which
must exist already or you have to create it beforehand. If you do not
want to use the default data directory (i.e., `/data/db`), specify the
path to the data directory using
the `--dbpath` option: `mongod --dbpath <path to data directory>`. You
might prefer to run the MongoDB process in background, using
the `--fork` parameter: `mongod --fork --syslog`:

``` text
$ mongod --fork --syslog
about to fork child process, waiting until server is ready for connections.
forked process: 11471
child process started successfully, parent exiting

By default MongoDB starts listening for connections on 127.0.0.1:27017. 
```

### 4. Start the RESTHeart server

Run the RESTHeart server by typing `java -server -jar restheart.jar`.

This starts it with the default configuration, which is fine for MongoDB
running on localhost, on default port and without authentication.

Convention over configuration

Different configuration options can be specified passing a configuration
file as argument. Note that the configuration file path is either
absolute or relative to the restheart.jar file location.

The configuration file can specify any option that will overwrite the
default value: this way it is not required to specify all the possible
options in the configuration file following the *convention over
configuration* approach.

For more information about the configuration file format refer to [Default
Configuration File](/learn/Default_Configuration_File) section.

On Linux, OSX and Solaris you can run RESTHeart as a [daemon
process](https://en.wikipedia.org/wiki/Daemon_(computing)): `java -server -jar restheart.jar --fork`.
Note that this will force the console logging and the file logging to be
turned off and on respectively, regardless the specified log
configuration options.

For example:

``` plain
$ java -jar restheart.jar 
14:01:09.968 [main] INFO  org.restheart.Bootstrapper - Starting RESTHeart
14:01:09.971 [main] INFO  org.restheart.Bootstrapper - version 2.0.0
14:01:09.978 [main] INFO  org.restheart.Bootstrapper - Logging to file /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart.log with level INFO
14:01:09.978 [main] INFO  org.restheart.Bootstrapper - Logging to console with level INFO
14:01:10.275 [main] INFO  org.restheart.Bootstrapper - MongoDB connection pool initialized
14:01:10.275 [main] INFO  org.restheart.Bootstrapper - MongoDB version 3.2.0
14:01:10.276 [main] WARN  org.restheart.Bootstrapper - ***** No Identity Manager specified. Authentication disabled.
14:01:10.277 [main] WARN  org.restheart.Bootstrapper - ***** No access manager specified. users can do anything.
14:01:10.277 [main] INFO  org.restheart.Bootstrapper - Token based authentication enabled with token TTL 15 minutes
14:01:10.593 [main] INFO  org.restheart.Bootstrapper - HTTPS listener bound at 0.0.0.0:4443
14:01:10.593 [main] INFO  org.restheart.Bootstrapper - HTTP listener bound at 0.0.0.0:8080
14:01:10.595 [main] INFO  org.restheart.Bootstrapper - Local cache for db and collection properties enabled with TTL 1000 msecs
14:01:10.595 [main] INFO  org.restheart.Bootstrapper - Local cache for schema stores not enabled
14:01:10.766 [main] INFO  org.restheart.Bootstrapper - URL / bound to MongoDB resource *
14:01:10.976 [main] INFO  org.restheart.Bootstrapper - Embedded static resources browser extracted in /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart-4469244188076444924
14:01:10.999 [main] INFO  org.restheart.Bootstrapper - URL /browser bound to static resources browser. Access Manager: false
14:01:11.246 [main] INFO  org.restheart.Bootstrapper - Pid file /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gn/T/restheart-0.pid
14:01:11.246 [main] INFO  org.restheart.Bootstrapper - RESTHeart started
```

We’ll now use
the [HAL](http://stateless.co/hal_specification.html) format and the
embedded [HAL browser](https://github.com/mikekelly/hal-browser) to
check that everything is fine. The HAL browser allows you to surf the
DATA API with your regular Web browser.

[HAL](http://stateless.co/hal_specification.html) is a simple format
that gives a consistent and easy way to hyperlink between resources in
your API. *Adopting HAL will make your API explorable, and its
documentation easily discoverable from within the API itself. In short,
it will make your API easier to work with and therefore more attractive
to client developers. APIs that adopt HAL can be easily served and
consumed using open source libraries available for most major
programming languages. It’s also simple enough that you can just deal
with it as you would any other JSON*.

To see the HAL user interface, now open your browser
at: [`http://127.0.0.1:8080/browser`](http://127.0.0.1:8080/browser)

### 5. Enable MongoDB authentication

This section assumes using MongoDB 3.2. For other versions, the security
configuration is similar but different. Rrefer to the [MongoDB
documentation](http://docs.mongodb.org/manual/tutorial/enable-authentication/)
for more information.

Start MongoDB with authentication and connect to the MongoDB instance
from a client running on the same system. This access is made possible
by the localhost exception. Again, you might prefer to run the MongoDB
process in background, using the `--fork `parameter.

``` plain
$ mongod --fork --syslog --auth
$ mongo
```

In this section we will use the mongodb superuser
role [root](https://docs.mongodb.org/manual/reference/built-in-roles/#superuser-roles)
that provides access to the all operations and all the resources.

However the best practice is to use a MongoDB user with
restricted access. For instance, it could be restricted to use only a
single DB in read only mode. For more information refer to [MongoDB
authentication with just enough
permissions](#auth-with-jep)section.

Create the *admin* user. The procedure is different depending on MongoDB
version.

``` bash
> use admin
> db.createUser({
    user: "admin",
    pwd: "changeit",
    roles:[ "root" ]
})
```

    We need to provide the MongoDB user authentication credentials in the RESTHeart configuration file: see docs. 

We’ll use the restheart.yml example configuration file that comes with
RESTHeart download package (you find it in the etc directory)

``` plain
$ vi etc/restheart.yml
```

Find and modify the following section providing the user-name, password
and authentication db (the db where the MongoDB user is defined, in our
case ‘admin’).

``` plain
mongo-uri: mongodb://admin:changeit@127.0.0.1/?authSource=admin
```

Now start RESTHeart specifying the configuration file:

``` plain
$ java -server -jar restheart.jar etc/restheart.yml
```

Test the connection opening the HAL browser
at` http://127.0.0.1:8080/browser`.

Note that the example configuration file `etc/restheart.yml` also
enables the RESTHeart security. Opening the HAL browser page, you’ll be
asked to authenticate. You can use of one of the credentials defined
in `etc/security.yml` file (try username = ‘a’ and password = ‘a’).

#### 5.1 Connect RESTHeart to MongoDB over TLS/SSL

MongoDB clients can use TLS/SSL to encrypt connections to mongod and
mongos instances.

To configure RESTHeart for TLS/SSL do as follows:

-   create the keystore importing the public certificate used by mongod
    using keytool (with keytool, the java tool to manage keystores of
    cryptographic keys)  
      

``` bash
$ keytool -importcert -file mongo.cer -alias mongoCert -keystore rhTrustStore


# asks for password, use "changeit"
```

  

-   specify the ssl option in the mongo-uri in the restheart yml
    configuration file:

  

``` bash
mongo-uri: mongodb://your.mongo-domain.com?ssl=true
```

  

-   start restheart with following options:

  

``` bash
$ java -server -Djavax.net.ssl.trustStore=rhTrustStore -Djavax.net.ssl.trustStorePassword=changeit -Djavax.security.auth.useSubjectCredsOnly=false -jar restheart.jar restheart.yml
```

#### 5.2. MongoDB authentication with just enough permissions 

In the previous examples we used a mongodb user with *root *role (or
*clusterAdmin* and *dbAdminAnyDatabase* roles for version 2.4) for the
sake of simplicity. This allows RESTHeart to execute any command on any
mongodb resource.

On production environments a strong security isolation is mandatory.

In order to achieve it, the best practice is:

1.  use the
    [mongo-mounts](https://softinstigate.atlassian.net/wiki/display/RH/Advanced+Configuration#AdvancedConfiguration-MongoDB)
    configuration option to restrict the resources exposed by RESTHeart;
2.  use a mongodb user with just enough roles: *read* or *readWrite* on
    mounted databases 

The following example, creates a mongodb user with appropriate roles to
expose the databases *db1*, *db2* and *db3* in read only mode.

``` bash
> use admin
> db.createUser({user: "mongousr",
    pwd: "secret",
    roles: [{role: "readWrite", db: "db1"},
            {role: "readWrite", db: "db2"},
            {role: "read", db: "db3"}
]})
```

To list the databases (i.e. GET /, the root resource) the listDatabases
permission is needed. This permission is granted by the
readWriteAnyDatabase role or you can create a custom role.

To allow deleting a database the *dropDatabase* permission is needed.
This permission is granted by the *dbAdmin* role or you can create a
custom role.

### 6. Clients Authentication and Authorization

Refert to [Security](Security) section for detailed information about
how enable, configure and customize clients authentication and
authorization.

## Additional resources for beginners

There are some introductory articles about RESTHeart from
[Compose.io](https://www.compose.com):

1.  [Building Instant RESTFul API's with MongoDB and
    RESTHeart](https://www.compose.com/articles/building-instant-restful-apis-with-mongodb-and-restheart/)
2.  [Building Secure Instant API's with RESTHeart and
    Compose](https://www.compose.com/articles/building-secure-instant-apis-with-restheart-and-compose/)
3.  [Launching RESTHeart into
    Production](https://www.compose.com/articles/launching-restheart-into-production/)
