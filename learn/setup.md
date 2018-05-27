---
layout: docs
title: Setup
---

* [Run RESTHeart with Docker](#run-restheart-with-docker)
    * [Quick Start with Docker Compose](#quick-start-with-docker-compose)
        * [If something is not working](#if-something-is-not-working)
        * [Modify the configuration for the RESTHeart container](#modify-the-configuration-for-the-restheart-container)
    * [Docker Image](#docker-image)
        * [Tags](#tags)
        * [Dockerfile](#dockerfile)
        * [How to Run](#how-to-run)
        * [1. Pull the MongoDB and RESTHeart images](#1-pull-the-mongodb-and-restheart-images)
        * [2. Run the MongoDB container](#2-run-the-mongodb-container)
            * [2.1 RESTHeart &lt; 3.3](#22-restheart--33)
        * [3. Run RESTHeart interactively](#3-run-restheart-interactively)
        * [4. Check that is working](#4-check-that-is-working)
        * [5. Pass arguments to RESTHeart and JVM](#5-pass-arguments-to-restheart-and-jvm)
        * [6. Stop and restart](#stop-and-restart)
* [Manual installation](#manual-installation)
    * [1. Install Java and MongoDB](#1-install-java-and-mongodb)
    * [2. Install RESTHeart](#2-install-restheart)
    * [3. Start MongoDB](#3-start-mongodb)
    * [4. Start the RESTHeart server](#4-start-the-restheart-server)
    * [5. Enable MongoDB authentication](#5-enable-mongodb-authentication)
        * [5.1 Connect RESTHeart to MongoDB over TLS/SSL](#51-connect-restheart-to-mongodb-over-tlsssl)
        * [5.2 MongoDB authentication with just enough permissions](#52-mongodb-authentication-with-just-enough-permissions)

## Run RESTHeart with Docker

> Docker is the best way to run RESTHeart.

[![Docker Stars](https://img.shields.io/docker/stars/softinstigate/restheart.svg?maxAge=2592000)](https://hub.docker.com/r/softinstigate/restheart/) [![Docker Pulls](https://img.shields.io/docker/pulls/softinstigate/restheart.svg?maxAge=2592000)](https://hub.docker.com/r/softinstigate/restheart/)

## Quick Start with Docker Compose

Nothing is easier and faster than Docker Compose to run RESTHeart and MongoDB. However, this is neither a docker nor a docker-compose tutorial, so please refer to the [official documentation](https://docs.docker.com/compose/).

Download the example [docker-compose.yml](https://github.com/SoftInstigate/restheart/blob/master/docker-compose.yml)

``` bash
$ mkdir restheart
$ cd restheart
$ curl https://raw.githubusercontent.com/SoftInstigate/restheart/master/docker-compose.yml --output docker-compose.yml
```

The file `docker-compose.yml` defines a single microservice made of a RESTHeart instance on port `8080` and a MongoDB instance configured to work together.

Start both services just typying:

``` bash
$ docker-compose up -d
```

Open the the following URL: [localhost:8080/browser](http://localhost:8080/browser) which points to the HAL Browser.

The RESTHeart default admin credentials are

    username: admin
    password: changeit

You should see the HAL Browser:

<img src="/images/browser.png" width="100%" height="auto" class="img-responsive">

Note that by default docker-compose runs the latest RESTHeart release, which usually is a `SNAPSHOT`. If this is not what you want, then edit the `docker-compose.yml` file accordingly.

If everytihng is working as expected, then **you can jump to the [tutorial](/learn/tutorial/)**.

### If something is not working

Check that docker containers are both up and running:

``` bash
$ docker-compose ps

    Name                    Command               State                Ports
-------------------------------------------------------------------------------------------
restheart         ./entrypoint.sh etc/resthe ...   Up      4443/tcp, 0.0.0.0:8080->8080/tcp
restheart-mongo   docker-entrypoint.sh --bin ...   Up      27017/tcp
```

Then you can tail the logs of both services, to spot any error:

``` bash
$ docker-compose logs -f
```    

Or you could tail the logs of individual services:

``` bash
$ docker log -f restheart
$ docker log -f restheart-mongo
```

### Modify the configuration for the RESTHeart container

Download the configuration files `restheart.yml` and `security.yml` in the `etc` directory.

``` bash
$ mkdir etc
curl https://raw.githubusercontent.com/SoftInstigate/restheart/master/Docker/etc/restheart.yml --output etc/restheart.yml
$ curl https://raw.githubusercontent.com/SoftInstigate/restheart/master/Docker/etc/security.yml --output etc/security.yml
```

Edit the configuration files as needed. For instance, to change the `admin` user password edit `etc/security.yml` as follows:

```yml
    - userid: admin
      password: <your-password-here>
      roles: [users, admins]
```

Uncomment the following line in `docker-compose.yml`

```yml
      ### Uncoment below if you want to mount a local configuration folder
      ### to overwrite default restheart.yml and/or security.yml
      volumes:
         - ./etc:/opt/restheart/etc:ro
```

Restart the containers:

```bash
$ docker-compose stop
$ docker-compose up -d
```

## Docker Image

### Tags

The `latest` tag is automatically associated with `SNAPSHOT` maven builds on `master` branch. If you really want to run a stable docker image, please always pull a exact version number, like:

``` bash
$ docker pull softinstigate/restheart:3.3.1
```

### Dockerfile

* The Dockefile is [here](https://github.com/SoftInstigate/restheart/blob/master/Dockerfile).

### How to Run

This section is useful if you want to run RESTHeart with docker but you already have an existing MongoDB container to connect to. Note that if instead you want to connect to a remote MongoDB instance then you must edit the restheart.yml configuration file and change the mongouri.

`mongo-uri: mongodb://<remote-host>`

You can then decide to rebuild the container itself with your version of this file or mount the folder as a volume, so that you can override the default configuration files. For example:

``` bash
$ docker run -d -p 80:8080 --name restheart -v "$PWD"/etc:/opt/restheart/etc:ro softinstigate/restheart
```

*We strongly recommend to always add the tag to the image (e.g. `softinstigate/restheart:3.3.1`), so that you are sure which version of RESTHeart you are running.*

### 1. Pull the MongoDB and RESTHeart images

``` bash
$ docker pull mongo:3.6
$ docker pull softinstigate/restheart:3.3.1
```

### 2. Run the MongoDB container

If you are running RESTHeart 3.3 and above (`latest` tag) then MongoDB authentication is enabled by default and you must start the mongo container passing the admin username and password via command line:

``` bash
$ docker run -d -e MONGO_INITDB_ROOT_USERNAME='restheart' -e MONGO_INITDB_ROOT_PASSWORD='R3ste4rt!' --name mongodb mongo:3.6 --bind_ip_all --auth
```

If you change the `MONGO_INITDB_ROOT_USERNAME` or `MONGO_INITDB_ROOT_PASSWORD` then you need to change the `mongo-uri` in `Docker/etc/restheart.yml` accordingly and re-build the Docker image.

```yml
    mongo-uri: mongodb://restheart:R3ste4rt!@mongodb
```

#### 2.1 RESTHeart < 3.3

If you are running RESTHeart 3.2 or below.

``` bash
$ docker run -d --name mongodb mongo:3.6
```

To make it accessible from your host and add a [persistent data volume](https://docs.docker.com/userguide/dockervolumes/):

``` bash
$ docker run -d -p 27017:27017 --name mongodb -v <db-dir>:/data/db mongo:3.6
```

The `<db-dir>` must be a folder in your host, such as `/var/data/db` or whatever you like. If you don't attach a volume then your data will be lost when you delete the container.

### 3. Run RESTHeart interactively

> Remember to add always add an explicit tag to the image, as the `latest` tag is bound to SNAPSHOT releases and could be unstable.

Run in **foreground**, linking to the `mongodb` instance, mapping the container's 8080 port to the 80 port on host:

``` bash
$ docker run --rm -i -t -p 80:8080 --name restheart --link mongodb softinstigate/restheart
```

However, you will usually run it in **background**:

``` bash
$ docker run -d -p 80:8080 --name restheart --link mongodb softinstigate/restheart
```
### 4. Check that is working

If it's running in background, you can open the RESTHeart's logs:

``` bash
$ docker logs restheart
```

### 5. Pass arguments to RESTHeart and JVM

You can append arguments to *docker run* command to provide RESTHeart and the JVM with arguments.

For example you can mount an alternate configuration file and specify it as an argument

``` bash
$ docker run --rm -i -t -p 80:8080 -v my-conf-file.yml:/opt/restheart/etc/my-conf-file.yml:ro --name restheart --link mongodb:mongodb softinstigate/restheart my-conf-file.yml
```

If you want to pass system properties to the JVM, just specify -D or -X arguments. Note that in this case you **need** to provide the configuration file as well.

``` bash
    docker run --rm -i -t -p 80:8080 --name restheart --link mongodb:mongodb softinstigate/restheart etc/restheart.yml -Dkey=value
```

## Stop and restart

To stop the RESTHeart background daemon:

``` bash
$ docker stop restheart
```

or simply press `CTRL-C` if it is running in foreground.

Restart it with:

``` bash
$ docker start restheart
```

**note**: RESTHeart is a stateless service; best Docker practices suggest to just delete the stopped container with `docker rm restheart` or to run it in foreground with the `--rm` parameter, so that it will be automatically removed when it exits.

The MongoDB container instead is stateful, so deleting leads to lose all data unless you attached  a persistent [Docker Volume](https://docs.docker.com/userguide/dockervolumes/). 

To stop MongoDb:

``` bash
$ docker stop mongodb
```

Restart it with:

``` bash
$ docker start mongodb
```

Note that you must **always stop RESTHeart before MongoDB**, or you might experience data losses.

## Manual installation

> This section is about installing and configuring RESTHeart on _"bare metal"_, without Docker. It's recommended only if you know well RESTHeart already and have very specific requirements.

If you don’t have them already, download the following packages:

* [Java 8](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [MongoDB](https://www.mongodb.org/downloads)
* [RESTHeart](https://github.com/softinstigate/restheart)

Most of the work must be done using a command line interface. 

### 1. Install Java and MongoDB

Install [Java
8](https://www.oracle.com/technetwork/java/javase/downloads/index.html) and [MongoDB](https://docs.mongodb.org/manual/installation/) following
the instructions for your specific operating system and make sure that
their binaries are actually executable (so they are in your PATH env
variable).

To check Java and MongoDB, you should execute the following commands and
you should get *something* like the below (output might vary depending
on Java version and your OS):

```bash
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

* `restheart.jar`
* `etc/restheart.yml` &lt;- an example configuration file

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

```text
$ mongod --fork --syslog
about to fork child process, waiting until server is ready for connections.
forked process: 11471
child process started successfully, parent exiting

# By default MongoDB starts listening for connections on 127.0.0.1:27017.
```

### 4. Start the RESTHeart server

Run the RESTHeart

```bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar

15:22:18.518 [main] INFO  org.restheart.Bootstrapper - ANSI colored console: true
15:22:18.529 [main] INFO  org.restheart.Bootstrapper - Starting RESTHeart instance develop
15:22:18.529 [main] INFO  org.restheart.Bootstrapper - version 3.3.1
15:22:18.533 [main] INFO  org.restheart.Bootstrapper - Logging to file /tmp/restheart.log with level DEBUG
15:22:18.533 [main] INFO  org.restheart.Bootstrapper - Logging to console with level DEBUG
15:22:18.812 [main] INFO  org.restheart.Bootstrapper - MongoDB connection pool initialized
15:22:18.812 [main] INFO  org.restheart.Bootstrapper - MongoDB version 3.6.0
15:22:18.826 [main] INFO  org.restheart.Bootstrapper - Identity Manager org.restheart.security.impl.SimpleFileIdentityManager enabled
15:22:18.883 [main] INFO  org.restheart.Bootstrapper - Access Manager org.restheart.security.impl.SimpleAccessManager enabled
15:22:18.883 [main] INFO  org.restheart.Bootstrapper - Authentication Mechanism io.undertow.security.impl.BasicAuthenticationMechanism enabled
15:22:18.883 [main] INFO  org.restheart.Bootstrapper - Token based authentication enabled with token TTL 15 minutes
15:22:18.891 [main] INFO  org.restheart.Bootstrapper - HTTPS listener bound at 0.0.0.0:4443
15:22:18.892 [main] INFO  org.restheart.Bootstrapper - HTTP listener bound at 0.0.0.0:8080
15:22:18.893 [main] INFO  org.restheart.Bootstrapper - Local cache for db and collection properties enabled with TTL 1000 msecs
15:22:18.893 [main] INFO  org.restheart.Bootstrapper - Local cache for schema stores enabled  with TTL 60000 msecs
15:22:19.034 [main] INFO  org.restheart.Bootstrapper - URL / bound to MongoDB resource *
15:22:19.126 [main] INFO  org.restheart.Bootstrapper - Embedded static resources browser extracted in /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gp/T/restheart-6853484883019945941
15:22:19.132 [main] INFO  org.restheart.Bootstrapper - URL /browser bound to static resources /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gp/T/restheart-6853484883019945941. Access Manager: false
15:22:19.134 [main] INFO  org.restheart.Bootstrapper - URL /_logic/ping bound to application logic handler org.restheart.handlers.applicationlogic.PingHandler. Access manager: false
15:22:19.135 [main] INFO  org.restheart.Bootstrapper - URL /_logic/roles bound to application logic handler org.restheart.handlers.applicationlogic.GetRoleHandler. Access manager: false
15:22:19.135 [main] INFO  org.restheart.Bootstrapper - URL /_logic/ic bound to application logic handler org.restheart.handlers.applicationlogic.CacheInvalidator. Access manager: true
15:22:19.137 [main] INFO  org.restheart.Bootstrapper - URL /_logic/csv bound to application logic handler org.restheart.handlers.applicationlogic.CsvLoaderHandler. Access manager: true
15:22:19.322 [main] INFO  org.restheart.Bootstrapper - Pid file /var/folders/yx/mgksqtzn41j41xdnv74snjpc0000gp/T/restheart-1161966278.pid
15:22:19.322 [main] INFO  org.restheart.Bootstrapper - RESTHeart started
```

This starts it with the default configuration, which is fine for MongoDB
running on localhost, on default port and without authentication.

Configuration options can be specified passing a configuration
file as argument.

``` bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar restheart.yml
```

The configuration file path is either
absolute or relative to the restheart.jar file location.

The configuration file can specify any option that will overwrite the
default value: this way it is not required to specify all the possible
options in the configuration file following a *convention over
configuration* approach.

For more information about the configuration file format refer to [Default
Configuration File](/learn/configuration-file) section.

On Linux, OSX and Solaris you can run RESTHeart as a [daemon
process](https://en.wikipedia.org/wiki/Daemon_(computing)): 

``` bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar --fork
```

Note that this will force the console logging and the file logging to be
turned off and on respectively, regardless the specified log
configuration options.

We’ll now use the embedded [HAL browser](https://github.com/mikekelly/hal-browser) to check that everything is fine. The HAL browser allows you to surf the DATA API with your regular Web browser.

To see the HAL user interface, now open your browser
at: [`http://127.0.0.1:8080/browser`](http://127.0.0.1:8080/browser)

### 5. Enable MongoDB authentication

This section assumes using MongoDB 3.2 or later. For other versions, the security
configuration is similar but different. Rrefer to the [MongoDB
documentation](https://docs.mongodb.org/manual/tutorial/enable-authentication/)
for more information.

Start MongoDB with authentication and connect to the MongoDB instance
from a client running on the same system. This access is made possible
by the localhost exception. Again, you might prefer to run the MongoDB
process in background, using the `--fork` parameter.

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

```javascript
> use admin
> db.createUser({
    user: "admin",
    pwd: "changeit",
    roles:[ "root" ]
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

``` yml
    mongo-uri: mongodb://admin:changeit@127.0.0.1/?authSource=admin
```

Now start RESTHeart specifying the configuration file:

``` bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar etc/restheart.yml
```

Test the connection opening the HAL browser at `http://127.0.0.1:8080/browser`.

Note that the example configuration file `etc/restheart.yml` also
enables the RESTHeart security. Opening the HAL browser page, you’ll be
asked to authenticate. You can use of one of the credentials defined
in `etc/security.yml` file (try username = ‘a’ and password = ‘a’).

#### 5.1 Connect RESTHeart to MongoDB over TLS/SSL

MongoDB clients can use TLS/SSL to encrypt connections to mongod and
mongos instances.

To configure RESTHeart for TLS/SSL do as follows:

* create the keystore importing the public certificate used by mongod using keytool (with keytool, the java tool to manage keystores of cryptographic keys)

``` bash
$ keytool -importcert -file mongo.cer -alias mongoCert -keystore rhTrustStore

# asks for password, use "changeit"
```

* specify the ssl option in the mongo-uri in the restheart yml configuration file:

``` yml
    mongo-uri: mongodb://your.mongo-domain.com?ssl=true
```
* start restheart with following options:

``` bash
$ java -Dfile.encoding=UTF-8 -server -Djavax.net.ssl.trustStore=rhTrustStore -Djavax.net.ssl.trustStorePassword=changeit -Djavax.security.auth.useSubjectCredsOnly=false -jar restheart.jar restheart.yml
```

#### 5.2 MongoDB authentication with just enough permissions

In the previous examples we used a mongodb user with *root *role for the
sake of simplicity. This allows RESTHeart to execute any command on any
mongodb resource.

On production environments a strong security isolation is mandatory.

In order to achieve it, the best practice is:

1. use the mongo-mounts configuration option to restrict the resources exposed by RESTHeart;
2. use a mongodb user with just enough roles: *read* or *readWrite* on mounted databases 

The following example, creates a mongodb user with appropriate roles to expose the databases *db1*, *db2* and *db3* in read only mode.

```javascript
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
