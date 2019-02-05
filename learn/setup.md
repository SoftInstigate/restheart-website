---
layout: docs
title: Setup

---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Run RESTHeart with Docker](#run-restheart-with-docker)
- [Quick Start with Docker Compose](#quick-start-with-docker-compose)
  - [If something is not working](#if-something-is-not-working)
  - [Modify the configuration for the RESTHeart container](#modify-the-configuration-for-the-restheart-container)
- [Docker Image](#docker-image)
  - [Tags](#tags)
  - [Dockerfile](#dockerfile)
  - [How to Run](#how-to-run)
  - [Pull the MongoDB and RESTHeart images](#pull-the-mongodb-and-restheart-images)
  - [Run the MongoDB container](#run-the-mongodb-container)
    - [RESTHeart < 3.3](#restheart--33)
  - [Run RESTHeart interactively](#run-restheart-interactively)
  - [Check that is working](#check-that-is-working)
  - [Pass arguments to RESTHeart and JVM](#pass-arguments-to-restheart-and-jvm)
- [Stop and restart](#stop-and-restart)
- [Manual installation](#manual-installation)
  - [Install Java and MongoDB](#install-java-and-mongodb)
  - [Install RESTHeart](#install-restheart)
  - [Start MongoDB](#start-mongodb)
  - [Run RESTHeart](#run-restheart)
  - [Enable MongoDB authentication](#enable-mongodb-authentication)
    - [Connect RESTHeart to MongoDB over TLS/SSL](#connect-restheart-to-mongodb-over-tlsssl)
    - [MongoDB authentication with just enough permissions](#mongodb-authentication-with-just-enough-permissions)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 


## Run RESTHeart with Docker

> Docker is the best way to run RESTHeart.

[![Docker Stars](https://img.shields.io/docker/stars/softinstigate/restheart.svg?maxAge=2592000)](https://hub.docker.com/r/softinstigate/restheart/) [![Docker Pulls](https://img.shields.io/docker/pulls/softinstigate/restheart.svg?maxAge=2592000)](https://hub.docker.com/r/softinstigate/restheart/)

__PLease help to improve this documentation__: if you encounter a problem, something you don't understand or a typo, use [this link](https://github.com/SoftInstigate/restheart-website/issues) to open a issue. You could also open a PR to directly fix the documentation on Github, if you want.  

## Quick Start with Docker Compose

Nothing is easier and faster than Docker Compose to run RESTHeart and MongoDB. However, this is neither a docker nor a docker-compose tutorial, so please refer to the [official documentation](https://docs.docker.com/compose/).

Download the example [docker-compose.yml](https://github.com/SoftInstigate/restheart/blob/master/docker-compose.yml)

```bash
$ mkdir restheart && cd restheart
$ curl https://raw.githubusercontent.com/SoftInstigate/restheart/master/docker-compose.yml --output docker-compose.yml
```

The file `docker-compose.yml` defines a single micro-service made of a RESTHeart instance on port `8080` and a MongoDB instance configured to work together.

Start both services just typing:

```
$ docker-compose up -d
```

Open the the following URL: 

__[localhost:8080/browser](http://localhost:8080/browser)__

Insert the default admin credentials, which are:

    username: admin
    password: changeit

You should then see the __HAL Browser__:

<img src="/images/browser.png" width="100%" height="auto" class="img-responsive">

Note that by default docker-compose runs the latest RESTHeart release, which usually is a `SNAPSHOT`. If this is not what you want, then edit the `docker-compose.yml` file accordingly.

If everything is working as expected, then **you can jump to the [tutorial](/learn/tutorial/)**.

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

The `latest` tag is automatically associated with `SNAPSHOT` maven builds on `master` branch. If you really want to run a stable docker image, please always pull a exact tag, like:

``` bash
$ docker pull softinstigate/restheart:<tag>
```

### Dockerfile

* The Dockefile is [here](https://github.com/SoftInstigate/restheart/blob/master/Dockerfile).

### How to Run

This section is useful if you want to run RESTHeart with docker but you already have an existing MongoDB container to connect to. Note that if instead you want to connect to a remote MongoDB instance then you must edit the restheart.yml configuration file and change the __mongo-uri__.

`mongo-uri: mongodb://<remote-host>`

You can then decide to rebuild the container itself with your version of this file or mount the folder as a volume, so that you can __override the default configuration files__. For example:

``` bash
$ docker run -d -p 8080:8080 --name restheart -v "$PWD"/etc:/opt/restheart/etc:ro softinstigate/restheart
```

*We strongly recommend to always add the __tag__ to the image (e.g. `softinstigate/restheart:<tag>`), so that you are sure which version of RESTHeart you are running.*

### Pull the MongoDB and RESTHeart images

``` bash
$ docker pull mongo:3.6
$ docker pull softinstigate/restheart:<tag>
```

### Run the MongoDB container

If you are running RESTHeart 3.3 and above (`latest` tag) then MongoDB authentication is enabled by default and you must start the mongo container passing the admin username and password via command line:

``` bash
$ docker run -d -e MONGO_INITDB_ROOT_USERNAME='restheart' -e MONGO_INITDB_ROOT_PASSWORD='R3ste4rt!' \
 --name mongodb mongo:3.6 --bind_ip_all --auth
```

If you change the `MONGO_INITDB_ROOT_USERNAME` or `MONGO_INITDB_ROOT_PASSWORD` then you need to change the `mongo-uri` in `Docker/etc/restheart.yml` accordingly and re-build the Docker image.

```yml
    mongo-uri: mongodb://restheart:R3ste4rt!@mongodb
```

#### RESTHeart < 3.3

If you are running RESTHeart 3.2 or below.

``` bash
$ docker run -d --name mongodb mongo:3.6
```

To make it accessible from your host and add a [persistent data volume](https://docs.docker.com/userguide/dockervolumes/):

``` bash
$ docker run -d -p 27017:27017 --name mongodb -v <db-dir>:/data/db mongo:3.6
```

The `<db-dir>` must be a folder in your host, such as `/var/data/db` or whatever you like. If you don't attach a volume then your data will be lost when you delete the container.

### Run RESTHeart interactively

> Remember to add always add an explicit tag to the image, as the `latest` tag is bound to SNAPSHOT releases and could be unstable.

Run in **foreground**, linking to the `mongodb` instance, mapping the container's 8080 port to the 80 port on host:

``` bash
$ docker run --rm -i -t -p 80:8080 --name restheart --link mongodb softinstigate/restheart
```

However, you will usually run it in **background**:

``` bash
$ docker run -d -p 80:8080 --name restheart --link mongodb softinstigate/restheart
```
### Check that is working

If it's running in background, you can open the RESTHeart's logs:

``` bash
$ docker logs restheart
```

### Pass arguments to RESTHeart and JVM

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

* [Java 8](https://jdk.java.net/8/)
* [MongoDB](https://www.mongodb.org/downloads)
* [RESTHeart](https://github.com/softinstigate/restheart)

Most of the work must be done using a command line interface.

RESTHeart works with Java versions from 8 to 11.

### Install Java and MongoDB

Install [Java
8](https://jdk.java.net/8/) and [MongoDB](https://docs.mongodb.org/manual/installation/) following
the instructions for your specific operating system and make sure that
their binaries are actually executable (so they are in your PATH env
variable).

To check Java and MongoDB, you should execute the following commands and
you should get *something* like the below (output might vary depending
on Java, your OS and MongoDB versions):

```bash
$ java -version
java version "1.8.0_151"
Java(TM) SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)

$ mongod --version
db version v4.0.4
```

RESTHeart has been tested with MongoDB from version 2.4 to 4.0. More recently, integration tests are executed against versions 3.6 and 4.0.

### Install RESTHeart

To *install* RESTHeart download the latest stable release package from [github](https://github.com/SoftInstigate/RESTHeart/releases) and just extract its the content in the desired directory.

You are interested in three files:

* `restheart.jar`
* `etc/restheart.yml` &lt;- an example configuration file
* `etc/default.properties`

### Start MongoDB

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

### Run RESTHeart

As a quick-start, RESTHeart can be run without any external configuration file, only with its own internal default values. That tries connecting to a MongoDB instance running on the `localhost:27017` mongo-uri:

```bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar

18:51:31.346 [main] WARN  org.restheart.Bootstrapper - No configuration file provided, starting with default values!
18:51:31.435 [main] INFO  org.restheart.Bootstrapper - Starting RESTHeart
  {
    "Version": "3.7.0-SNAPSHOT",
    "Instance-Name": "default",
    "Configuration": "null",
    "Environment": "null",
    "Build-Time": "2019-01-22T17:39:01Z"
  }
18:51:31.439 [main] INFO  org.restheart.Bootstrapper - Logging to file /var/folders/pk/56szmnfn5zlfxh2x6tkd5wqw0000gn/T/restheart.log with level INFO
18:51:31.439 [main] INFO  org.restheart.Bootstrapper - Logging to console with level INFO
18:51:31.819 [main] INFO  org.restheart.Bootstrapper - MongoDB connection pool initialized
18:51:31.819 [main] INFO  org.restheart.Bootstrapper - MongoDB version 3.6.7
18:51:31.819 [main] WARN  org.restheart.Bootstrapper - MongoDB is a standalone instance, use a replica set in production
18:51:31.819 [main] WARN  org.restheart.Bootstrapper - ***** No Identity Manager specified. Authentication disabled.
18:51:31.819 [main] WARN  org.restheart.Bootstrapper - ***** No access manager specified. users can do anything.
18:51:31.819 [main] INFO  org.restheart.Bootstrapper - Authentication Mechanism io.undertow.security.impl.BasicAuthenticationMechanism enabled
18:51:31.819 [main] INFO  org.restheart.Bootstrapper - Token based authentication enabled with token TTL 15 minutes
18:51:31.824 [main] INFO  org.restheart.Bootstrapper - HTTPS listener bound at 0.0.0.0:4443
18:51:31.824 [main] INFO  org.restheart.Bootstrapper - HTTP listener bound at 0.0.0.0:8080
18:51:31.825 [main] INFO  org.restheart.Bootstrapper - Local cache for db and collection properties enabled with TTL 1000 msecs
18:51:31.826 [main] INFO  org.restheart.Bootstrapper - Local cache for schema stores not enabled
18:51:31.961 [main] INFO  org.restheart.Bootstrapper - URL / bound to MongoDB resource *
18:51:32.047 [main] INFO  org.restheart.Bootstrapper - Embedded static resources browser extracted in /var/folders/pk/56szmnfn5zlfxh2x6tkd5wqw0000gn/T/restheart-7196941146163994258
18:51:32.055 [main] INFO  org.restheart.Bootstrapper - URL /browser bound to static resources /var/folders/pk/56szmnfn5zlfxh2x6tkd5wqw0000gn/T/restheart-7196941146163994258. Access Manager: false
18:51:32.076 [main] INFO  org.restheart.Bootstrapper - Allow unescaped characters in URL: true
18:51:32.244 [main] INFO  org.restheart.Bootstrapper - Pid file /var/folders/pk/56szmnfn5zlfxh2x6tkd5wqw0000gn/T/restheart-0.pid
18:51:32.244 [main] INFO  org.restheart.Bootstrapper - RESTHeart started
```

This default configuration is fine for MongoDB running on localhost, on default port and without any authentication.

Configuration options can be specified passing a configuration
file and configuration properties as arguments.

``` bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar restheart.yml --envFile default.properties
```

The configuration file path is either absolute or relative to the restheart.jar file location.

The configuration file can specify any option that will overwrite the
default value: this way it is not required to specify all the possible
options in the configuration file following a *convention over
configuration* approach.

For more information about the configuration file format refer to [Default
Configuration File](/learn/configuration-file) section.

On Linux, OSX and Solaris you can run RESTHeart as a [daemon
process](https://en.wikipedia.org/wiki/Daemon_(computing)): 

``` bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar restheart.yml --envFile default.properties --fork
```

Note that this will force the console logging and the file logging to be
turned off and on respectively, regardless the specified log
configuration options.

We’ll now use the embedded [HAL browser](https://github.com/mikekelly/hal-browser) to check that everything is fine. The HAL browser allows you to surf the DATA API with your regular Web browser.

To see the HAL user interface, now open your browser
at: [`http://127.0.0.1:8080/browser`](http://127.0.0.1:8080/browser)

### Enable MongoDB authentication

This section assumes using MongoDB 3.2 or later. For other versions, the security
configuration is similar but different. Refer to the [MongoDB
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

In this section we will use the MongoDB superuser
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

#### Connect RESTHeart to MongoDB over TLS/SSL

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

#### MongoDB authentication with just enough permissions

In the previous examples we used a MongoDB user with *root *role for the
sake of simplicity. This allows RESTHeart to execute any command on any
MongoDB resource.

On production environments a strong security isolation is mandatory.

In order to achieve it, the best practice is:

1. use the mongo-mounts configuration option to restrict the resources exposed by RESTHeart;
2. use a MongoDB user with just enough roles: *read* or *readWrite* on mounted databases 

The following example, creates a MongoDB user with appropriate roles to expose the databases *db1*, *db2* and *db3* in read only mode.

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


</div>
