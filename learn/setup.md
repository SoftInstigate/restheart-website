---
layout: docs
title: Setup
---

* [Run RESTHeart With Docker](#run-restheart-with-docker)
    * [Quick Start with Docker Compose](#quick-start-with-docker-compose)
    * [Docker Image](#docker-image)
* [Installation](#installation)
    * [1. Install Java and MongoDB](#1-install-java-and-mongodb)
    * [2. Install RESTHeart](#2-install-restheart)
    * [3. Start MongoDB](#3-start-mongodb)
    * [4. Start the RESTHeart server](#4-start-the-restheart-server)
    * [5. Enable MongoDB authentication](#5-enable-mongodb-authentication)
    * [5.1 Connect RESTHeart to MongoDB over TLS/SSL](#51-connect-restheart-to-mongodb-over-tlsssl)
    * [5.2. MongoDB authentication with just enough permissions ](#52-mongodb-authentication-with-just-enough-permissions)
    * [6. Clients Authentication and Authorization](#6-clients-authentication-and-authorization)


## Run RESTHeart with Docker

> Docker is the best way to run RESTHeart.

[![Docker Stars](https://img.shields.io/docker/stars/softinstigate/restheart.svg?maxAge=2592000)](https://hub.docker.com/r/softinstigate/restheart/) [![Docker Pulls](https://img.shields.io/docker/pulls/softinstigate/restheart.svg?maxAge=2592000)](https://hub.docker.com/r/softinstigate/restheart/)

## Quick Start with Docker Compose

Download the example [docker-compose.yml](https://github.com/SoftInstigate/restheart/blob/master/docker-compose.yml)

```
$ curl https://raw.githubusercontent.com/SoftInstigate/restheart/master/docker-compose.yml --output docker-compose.yml
```

The file `docker-compose.yml` defines a single microservice made of a RESTHeart and MongoDB instance configured to work together.
Start both services just typying:

```
$ docker-compose up -d
```

Check that everything is fine:

```
$ docker-compose ps

       Name                      Command               State                Ports               
-----------------------------------------------------------------------------------------------
restheart-dev         ./entrypoint.sh etc/resthe ...   Up      4443/tcp, 0.0.0.0:8080->8080/tcp 
restheart-dev-mongo   /entrypoint.sh mongod            Up      27017/tcp   
```

Tail the logs of both services:

```
$ docker-compose logs -f
```

Open the HAL browser [http://127.0.0.1:8080/browser](http://127.0.0.1:8080/browser)

The RESTHeart default admin credentials are

    username: admin
    password: changeit

## Docker Image

### Tags

The `latest` tag is automatically associated with `SNAPSHOT` maven builds on `master` branch. If you really want to run a stable docker image, please always pull a exact version number, like
```
docker pull softinstigate/restheart:3.2.2
```

### Dockerfile

 * The Dockefile is [here](https://github.com/SoftInstigate/restheart/blob/master/Dockerfile).

### How to Run

This section is useful if you want to run RESTHeart with docker but you already have an existing MongoDB container to connect to. Note that if instead you want to connect to a remote MongoDB instance then you must edit the restheart.yml configuration file and change the mongouri.

`mongo-uri: mongodb://<remote-host>`

You can then decide to rebuild the container itself with your version of this file or mount the folder as a volume, so that you can override the default configuration files. For example:

``` bash
$ docker run -d -p 80:8080 --name restheart -v "$PWD"/etc:/opt/restheart/etc:ro softinstigate/restheart`
```

*We strongly recommend to always add the tag to the image (e.g. `softinstigate/restheart:3.2.2`), so that you are sure which version of RESTHeart you are running.*

### 1) Pull the MongoDB and RESTHeart images

 1. `docker pull mongo:3.6`
 1. `docker pull softinstigate/restheart:3.2.2`

### 2) Run the MongoDB container

```
docker run -d --name mongodb mongo:3.6
```

To make it accessible from your host and add a [persistent data volume](https://docs.docker.com/userguide/dockervolumes/):

```
docker run -d -p 27017:27017 --name mongodb -v <db-dir>:/data/db mongo:3.6
```

The `<db-dir>` must be a folder in your host, such as `/var/data/db` or whatever you like. If you don't attach a volume then your data will be lost when you delete the container.

### 3) Run RESTHeart interactively

Run in **foreground**, linking to the `mongodb` instance, mapping the container's 8080 port to the 80 port on host:

```
docker run --rm -i -t -p 80:8080 --name restheart --link mongodb softinstigate/restheart
```

However, you will usually run it in **background**:

```
docker run -d -p 80:8080 --name restheart --link mongodb softinstigate/restheart
```

### 4) Check that is working:

If it's running in background, you can open the RESTHeart's logs:

```
docker logs restheart
```

### 5) Pass arguments to RESTHeart and JVM

You can append arguments to *docker run* command to provide RESTHeart and the JVM with arguments.

For example you can mount an alternate configuration file and specify it as an argument

```
docker run --rm -i -t -p 80:8080 -v my-conf-file.yml:/opt/restheart/etc/my-conf-file.yml:ro --name restheart --link mongodb:mongodb softinstigate/restheart my-conf-file.yml
```

If you want to pass system properties to the JVM, just specify -D or -X arguments. Note that in this case you **need** to provide the configuration file as well.

```
docker run --rm -i -t -p 80:8080 --name restheart --link mongodb:mongodb softinstigate/restheart etc/restheart.yml -Dkey=value
```

## Stop and start again

To stop the RESTHeart background daemon just issue

    docker stop restheart

or simply press `CTRL-C` if it was running in foreground.

You can start it again with

    docker start restheart

but it's **not recommended**: RESTHeart is a stateless service, best Docker practices would suggest to just delete the stopped container with `docker rm restheart` or to run it in foreground with the `--rm` parameter, so that it will be automatically removed when it exits.

The MongoDB container instead is stateful, so if you delete it then you'll lose all data unless you attached to it a persistent volume. In this case you might prefer to start it again, so that your data is preserved, or ypu might prefer to attach a local [Docker Volume](https://docs.docker.com/userguide/dockervolumes/) to it.

To stop MongoDb issue

    docker stop mongodb

To start MongoDb again

    docker start mongodb

Note that you must **always stop RESTHeart before MongoDB**, or you might experience data losses.

## Installation

If you don’t have them already, download the following packages:

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

RESTHeart has been tested with MongoDB version 3.6, 3.4, 3.2, 3.0, 2.6 and 2.4.

### 2. Install RESTHeart

To *install* RESTHeart download the latest stable release package from [github](https://github.com/SoftInstigate/RESTHeart/releases) and just extract its the content in the desired directory.

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

``` bash
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

#### Convention over configuration

Different configuration options can be specified passing a configuration
file as argument. Note that the configuration file path is either
absolute or relative to the restheart.jar file location.

The configuration file can specify any option that will overwrite the
default value: this way it is not required to specify all the possible
options in the configuration file following the *convention over
configuration* approach.

For more information about the configuration file format refer to [Default
Configuration File](/learn/configuration-file) section.

On Linux, OSX and Solaris you can run RESTHeart as a [daemon
process](https://en.wikipedia.org/wiki/Daemon_(computing)): `java -server -jar restheart.jar --fork`.
Note that this will force the console logging and the file logging to be
turned off and on respectively, regardless the specified log
configuration options.

For example:

``` bash
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

We’ll now use the embedded [HAL browser](https://github.com/mikekelly/hal-browser) to check that everything is fine. The HAL browser allows you to surf the DATA API with your regular Web browser.

To see the HAL user interface, now open your browser
at: [`http://127.0.0.1:8080/browser`](http://127.0.0.1:8080/browser)

### 5. Enable MongoDB authentication

This section assumes using MongoDB 3.2 or later. For other versions, the security
configuration is similar but different. Rrefer to the [MongoDB
documentation](http://docs.mongodb.org/manual/tutorial/enable-authentication/)
for more information.

Start MongoDB with authentication and connect to the MongoDB instance
from a client running on the same system. This access is made possible
by the localhost exception. Again, you might prefer to run the MongoDB
process in background, using the `--fork `parameter.

``` bash
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

``` bash
$ vi etc/restheart.yml
```

Find and modify the following section providing the user-name, password
and authentication db (the db where the MongoDB user is defined, in our
case ‘admin’).

``` plain
mongo-uri: mongodb://admin:changeit@127.0.0.1/?authSource=admin
```

Now start RESTHeart specifying the configuration file:

``` bash
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

In the previous examples we used a mongodb user with *root *role for the
sake of simplicity. This allows RESTHeart to execute any command on any
mongodb resource.

On production environments a strong security isolation is mandatory.

In order to achieve it, the best practice is:

1.  use the
    mongo-mounts configuration option to restrict the resources exposed by RESTHeart;
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

Refert to [Security](/learn/security) section for detailed information about
how enable, configure and customize clients authentication and
authorization.