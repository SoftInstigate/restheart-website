---
title: Setup
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Download and Run](#download-and-run)
    -   [Get the latest release](#get-the-latest-release)
    -   [Run with Java](#run-with-java)
-   [Configuration files](#configuration-files)
    -   [Environment variables](#environment-variables)
    -   [Run the process in background](#run-the-process-in-background)
-   [Run with Docker](#run-with-docker)
-   [Build it yourself](#build-it-yourself)
    -   [Integration Tests](#integration-tests)
    -   [Maven Dependencies](#maven-dependencies)
    -   [Project structure](#project-structure)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Download and Run

### Get the latest release

Download the ZIP or TAR archive.

[zip](https://github.com/SoftInstigate/restheart/releases/download/5.1.5/restheart.zip){: .btn btn-md}
[tgz](https://github.com/SoftInstigate/restheart/releases/download/5.1.5/restheart.tar.gz){: .btn btn-md}

Un-zip

```bash
$ unzip restheart.zip
```

Or un-tar

```bash
$ tar -xzf restheart.tar.gz
```

Configuration files are under the `etc/` folder.

```
.
├── etc/
│   ├── acl.yml
│   ├── default.properties
│   ├── restheart.yml
│   └── users.yml
├── plugins/
│   ├── restheart-mongodb.jar
│   └── restheart-security.jar
└── restheart.jar
```

### Run with Java

To run RESTHeart connected to a local instance of MongoDB you need:

-   At least Java v11;
-   MongoDB v3 or v4 running on `localhost` on port `27017`.

```bash
$ cd restheart
$ java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

To check that RESTHeart is up and running, open the URL [http://localhost:8080/ping](http://localhost:8080/ping), you should see the message: "Greetings from RESTHeart!".

Alternatively, use a command line HTTP client like [curl](https://curl.haxx.se) and [httpie](https://httpie.org) or a API client like [Postman](https://www.postman.com).

---

By default RESTHeart only mounts the database `restheart`. This is controlled by the `root-mongo-resource` in the `restheart/etc/default.properties` file.

---

```properties
# The MongoDB resource to bind to the root URI /
# The format is /db[/coll[/docid]] or '*' to expose all dbs
root-mongo-resource = /restheart
```

It means that the root resource `/` is bound to the `/restheart` database. This database **doesn't actually exist** until you explicitly create it by issuing a `PUT /` HTTP command.

Example for localhost:

```bash
$ curl --user admin:secret -I -X PUT :8080/
HTTP/1.1 201 OK
```

RESTHeart will start bound on HTTP port `8080`.

#### Default users and ACL

The default `users.yml` defines the following users:

-   id: `admin`, password: `secret`, role: `admin`
-   id: `user`, password: `secret`, role: `user`

The default `acl.yml` defines the following permission:

-   _admin_ role can execute any request
-   _user_ role can execute any request on collection `/{username}`

#### Check that everything works

```bash
# create database 'restheart'
$ curl --user admin:secret -I -X PUT :8080/
HTTP/1.1 201 OK

# create collection 'restheart.collection'
$ curl --user admin:secret -I -X PUT :8080/collection
HTTP/1.1 201 OK

# create a couple of documents
$ curl --user admin:secret -X POST :8080/collection -d '{"a":1}' -H "Content-Type: application/json"
$ curl --user admin:secret -X POST :8080/collection -d '{"a":2}' -H "Content-Type: application/json"

# get documents
$ curl --user admin:secret :8080/collection
[{"_id":{"$oid":"5dd3cfb2fe3c18a7834121d3"},"a":1,"_etag":{"$oid":"5dd3cfb2439f805aea9d5130"}},{"_id":{"$oid":"5dd3cfb0fe3c18a7834121d1"},"a":2,"_etag":{"$oid":"5dd3cfb0439f805aea9d512f"}}]%
```

## Configuration files

The main configuration file is [restheart.yml](https://github.com/SoftInstigate/restheart/blob/master/core/etc/restheart.yml) which is parametrized using [Mustache.java](https://github.com/spullara/mustache.java). The [default.properties](https://github.com/SoftInstigate/restheart/blob/master/core/etc/default.properties) contains actual values for parameters defined into the YAML file. You pass these properties at startup, using the `-e` or `--envFile` parameter, like this:

```bash
$ java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

---

To connect RESTHeart to a remote MongoDB instance you have to edit the `mongo-uri` property, setting you own [Connection String](https://docs.mongodb.com/manual/reference/connection-string/). For example, a MongoDB Atlas cluster connection string could be something like `mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?w=majority`. Remember that RESTHeart internally uses the MongoDB Java driver, so you must follow that connection string format.

---

You have to restart the core `restheart.jar` process to reload a new configuration. How to stop and start the process depends on how it was started: either within a docker container or as a native Java process. In case of native Java, usually you have to kill the background `java` process but it depends on your operating system.

You can edit the YAML configuration file or create distinct properties file. Usually one set of properties for each deployment environment is a common practice.

### Environment variables

It is possible to override any primitive type parameter in `restheart.yml` with an environment variable, without the need to edit any configuration file. Primitive types are:

-   String
-   Integer
-   Long
-   Boolean

For example, the parameter `mongo-uri` in the YAML file can be overridden by setting a `MONGO_URI` environment variable:

```bash
$ MONGO_URI="mongodb://127.0.0.1" java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

> Have a look at the [docker-compose.yml](https://github.com/SoftInstigate/restheart/blob/master/docker-compose.yml) file for an example of how to export an environment variable if using Docker.

The following log entry appears at the very beginning of logs during the startup process:

```
[main] WARN  org.restheart.Configuration - >>> Overriding parameter 'mongo-uri' with environment value 'MONGO_URI=mongodb://127.0.0.1'
```

A shell environment variable is equivalent to a YAML parameter in `restheart.yml`, but it’s all uppercase and '-' (dash) are replaced with '\_' (underscore).

---

Environment variables replacement works only with primitive types: it doesn’t work with YAML structured data in configuration files, like arrays or maps. It's mandatory to use properties files and mustache syntax for that.

---

To know the available CLI parameters, run RESTHeart with `--help`:

```bash
$ java -jar restheart.jar --help

Usage: java -Dfile.encoding=UTF-8 -jar -server restheart.jar [options]
      <Configuration file>
  Options:
    --envFile, --envfile, -e
      Environment file name
    --fork
      Fork the process
      Default: false
    --help, -?
      This help message
```

### Run the process in background

To run RESTHeart in background add the `--fork` parameter, like this:

```bash
$ java -jar restheart.jar --fork etc/restheart.yml -e etc/default.properties
```

In this case to see the logs you first need to enable file logging and set an absolute path to a log file. For example, check that `/usr/local/var/log/restheart.log` is writeable and then edit `etc/default.properties` like this:

```properties
enable-log-file = true
log-file-path = /usr/local/var/log/restheart.log
```

## Run with Docker

The official RESTHeart's public docker image is freely available on [Docker hub](https://hub.docker.com/r/softinstigate/restheart). Have a look at the [Dockerfile](https://github.com/SoftInstigate/restheart/blob/master/core/Dockerfile).

To run both RESTHeart and MongoDB services you can use `docker-compose`. Just copy and paste the following shell command:

```bash
curl https://raw.githubusercontent.com/SoftInstigate/restheart/master/docker-compose.yml --output docker-compose.yml && docker-compose up
```

You should see something similar to the following logs:

```
...
restheart    |  09:50:46.619 [main] INFO  o.r.mongodb.db.MongoClientSingleton - Connecting to MongoDB...
restheart-mongo | 2020-04-26T09:50:46.633+0000 I  NETWORK  [listener] connection accepted from 172.19.0.3:42898 #2 (2 connections now open)
restheart-mongo | 2020-04-26T09:50:46.635+0000 I  NETWORK  [conn2] received client metadata from 172.19.0.3:42898 conn2: { driver: { name: "mongo-java-driver|legacy", version: "3.11.2" }, os: { type: "Linux", name: "Linux", architecture: "amd64", version: "4.19.76-linuxkit" }, platform: "Java/Debian/11.0.6+10-post-Debian-1bpo91" }
restheart-mongo | 2020-04-26T09:50:46.636+0000 I  SHARDING [conn2] Marking collection admin.system.users as collection version: <unsharded>
restheart-mongo | 2020-04-26T09:50:46.870+0000 I  ACCESS   [conn2] Successfully authenticated as principal restheart on admin from client 172.19.0.3:42898
restheart    |  09:50:46.892 [main] INFO  o.r.mongodb.db.MongoClientSingleton - MongoDB version 4.2.1
restheart    |  09:50:46.893 [main] WARN  o.r.mongodb.db.MongoClientSingleton - MongoDB is a standalone instance.
restheart    |  09:50:47.156 [main] INFO  org.restheart.mongodb.MongoService - URI / bound to MongoDB resource /restheart
restheart    |  09:50:47.482 [main] INFO  org.restheart.Bootstrapper - HTTP listener bound at 0.0.0.0:8080
restheart    |  09:50:47.483 [main] DEBUG org.restheart.Bootstrapper - Content buffers maximun size is 16777216 bytes
restheart    |  09:50:47.498 [main] INFO  org.restheart.Bootstrapper - URI / bound to service mongo, secured: true
restheart    |  09:50:47.501 [main] INFO  org.restheart.Bootstrapper - URI /ic bound to service cacheInvalidator, secured: false
restheart    |  09:50:47.502 [main] INFO  org.restheart.Bootstrapper - URI /csv bound to service csvLoader, secured: false
restheart    |  09:50:47.503 [main] INFO  org.restheart.Bootstrapper - URI /roles bound to service roles, secured: true
restheart    |  09:50:47.504 [main] INFO  org.restheart.Bootstrapper - URI /ping bound to service ping, secured: false
restheart    |  09:50:47.506 [main] INFO  org.restheart.Bootstrapper - URI /tokens bound to service rndTokenService, secured: false
restheart    |  09:50:47.506 [main] DEBUG org.restheart.Bootstrapper - No proxies specified
restheart    |  09:50:47.515 [main] DEBUG org.restheart.Bootstrapper - Allow unescaped characters in URL: true
restheart    |  09:50:47.771 [main] INFO  org.restheart.Bootstrapper - Pid file /var/run/restheart-security--1411126229.pid
restheart    |  09:50:47.773 [main] INFO  org.restheart.Bootstrapper - RESTHeart started
```

Now point your browser to RESTHeart's [ping resource](http://localhost:8080/ping), you'll see the single line of text "**Greetings from RESTHeart!**".

Alternatively, use curl:

```bash
$ curl -i http://localhost:8080/ping

HTTP/1.1 200 OK
Connection: keep-alive
Access-Control-Allow-Origin: *
X-Powered-By: restheart.org
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Content-Length: 25
Date: Sun, 26 Apr 2020 10:05:43 GMT

Greetings from RESTHeart!
```

Press `Ctrl+C` to stop the containers:

```
^CGracefully stopping... (press Ctrl+C again to force)
Stopping restheart       ... done
Stopping restheart-mongo ... done
```

If you want to run the services in background just add the `-d` parameter, like `docker-compose up -d`. In this case you can tail the logs with `docker-compose logs -f`. 

To stop the containers use `docker-compose stop` then `docker-compose start` to start them again. 

To completely shutdown the containers and clean-up everything use `docker-compose down -v`. 

Beware the `down` command with `-v` parameter erases the MongoDB attached docker volume (named `restheart-mongo-volume`) with all its data.

Read the [docker compose documentation](https://docs.docker.com/compose/) for more.

## Build it yourself

Building RESTHeart by yourself is not necessary, but if you want to try then it requires [Maven](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and **Java 11** or later.

```bash
$ mvn clean package
```

After building `cd core/target` where, among other files, you'll have the structure below

```
.
├── restheart.jar
└──  plugins/
    ├── restheart-mongodb.jar
    └── restheart-security.jar
```

You can copy these files somewhere else and the [run the executable restheart.jar](#run-restheart) passing to it the path of the YAML configuration file.

Have a look at [core/etc/restheart.yml](https://github.com/SoftInstigate/restheart/blob/master/core/etc/restheart.yml) and [core/etc/default.properties](https://github.com/SoftInstigate/restheart/blob/master/core/etc/default.properties) for more.

### Integration Tests

To run the integration test suite, first make sure that Docker is running. Maven starts a MongoDB volatile instance with Docker.

```bash
$ mvn verify
```

### Maven Dependencies

RESTHeart's releases are available on [Maven Central](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.restheart%22).

Stable releases are available at: https://oss.sonatype.org/content/repositories/releases/org/restheart/restheart/

---

The main difference with the past is that in RESTHeart v5 for a developer is just enough to compile against the `restheart-commons` library to create a plugin, which is a JAR file to be copied into the `plugins/` folder and class-loaded during startup.

---

To compile new plugins, add the `restheart-commons` dependency to your POM file:

```xml
<dependencies>
    <dependency>
        <groupId>org.restheart</groupId>
        <artifactId>restheart-commons</artifactId>
        <version>5.1.5</version>
    </dependency>
</dependencies>
```

**IMPORTANT**: The `restheart-commons` artifact in the `commons` module has been released using the Apache v2 license instead of the AGPL v3. This is much like MongoDB is doing with the Java driver. It implies **your projects does not incur in the AGPL restrictions when extending RESTHeart with plugins**.

### Project structure

Starting from RESTHeart v5 we have merged all sub-projects into a single [Maven multi module project](https://maven.apache.org/guides/mini/guide-multiple-modules.html) and a single Git repository (this one).

> The v4 architecture, in fact, was split into two separate Java processes: one for managing security, identity and access management (restheart-security) and one to access the database layer (restheart). The new v5 architecture is monolithic, like it was RESTHeart v3. This decision was due to the excessive complexity of building and deploying two distinct processes and the little gains we have observed in real applications.

Then `core` module now is just [Undertow](http://undertow.io) plus a _bootstrapper_ which reads the configuration and starts the HTTP server. The `security` module provides **Authentication** and **Authorization** services, while the `mongodb` module interacts with MongoDB and exposes all of its services via a REST API, as usual. Besides, we added a new `commons` module which is a shared library, including all interfaces and implementations in common among the other modules.

```
.
├── commons
├── core
├── mongodb
└── security
```

</div>
