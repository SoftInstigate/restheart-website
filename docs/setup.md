---
title: Setup
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Download and Run](#download-and-run)
  - [Get the latest release](#get-the-latest-release)
  - [Run with Java](#run-with-java)
    - [Default users and ACL](#default-users-and-acl)
    - [Check that everything works](#check-that-everything-works)
- [Configuration files](#configuration-files)
  - [Environment variables](#environment-variables)
  - [Run the process in background](#run-the-process-in-background)
- [Run with Docker](#run-with-docker)
- [Run with docker-compose](#run-with-docker-compose)
- [Build it yourself](#build-it-yourself)
  - [Integration Tests](#integration-tests)
  - [Maven Dependencies](#maven-dependencies)
  - [Project structure](#project-structure)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Download and Run

> The easiest way to run RESTHeart and MongoDB is with __Docker__, please go to [Run with Docker](#run-with-docker) or [Run with docker-compose](#run-with-docker-compose) for instructions.

### Get the latest release

Download the ZIP or TAR archive.

<a class="btn btn-md" id="zipdl" href="https://gitreleases.dev/gh/SoftInstigate/restheart/latest/restheart.zip">zip</a>
<a class="btn btn-md" id="tgzdl" href="https://gitreleases.dev/gh/SoftInstigate/restheart/latest/restheart.tar.gz">tgz</a>

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

To run RESTHeart 6.x connected to a local instance of MongoDB you need:

-   At least Java 16;
-   MongoDB running on `localhost` on port `27017`.

{: .bs-callout .bs-callout-info }
RESTHeart supports MongoDB from version 3 throughout 5 and it is extensively tested with MongoDB 3.6, 4.2, 4.4 and v5.0

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

{: .bs-callout.bs-callout-info }
Watch [Java binaries](https://www.youtube.com/watch?v=dzggm7Wp2fU&t=57s) video.

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

It is possible to override any primitive type parameter in `restheart.yml` with environment variables.

Primitive types are:

-   String
-   Integer
-   Long
-   Boolean

The  name of the shell environment variable is equal to a YAML parameter in `restheart.yml`, in uppercase and replacing `-` (dash) with `_` (underscore).

To avoid conflicts with other variables, the environment variable name can be prefixed with `RH_`, `RESTHEART_` or the legacy `RESTHEART_SECURITY_` .

For example, the parameter `mongo-uri` in the YAML file can be overridden by the `MONGO_URI` environment variable:

```bash
$ MONGO_URI="mongodb://127.0.0.1" java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

{: .bs-callout.bs-callout-info }
Have a look at the [docker-compose.yml](https://github.com/SoftInstigate/restheart/blob/master/docker-compose.yml) file for an example of how to export an environment variable if using Docker.

The following log entry appears at the very beginning of logs during the startup process:

```
[main] WARN  org.restheart.Configuration - >>> Overriding parameter 'mongo-uri' with environment value 'MONGO_URI=mongodb://127.0.0.1'
```

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

{: .bs-callout.bs-callout-info }
Watch [Configuration](https://www.youtube.com/watch?v=dzggm7Wp2fU&t=820s) video.

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

## Run with docker

How to manually run RESTHeart + MongoDB with Docker:

1) Create a Docker network:

```
docker network create restheart-network
```

2) Run a MongoDB container

```
docker run -d --name mongodb --network restheart-network mongo:4.2
```

3) Run a RESTHeart container

```
docker run -d --rm --network restheart-network -p "8080:8080" -e MONGO_URI="mongodb://mongodb" softinstigate/restheart
```

4) Point your browser to the "ping" resource at http://localhost:8080/ping. Alternatively, use curl or [httpie](https://httpie.io).

```
$ http http://localhost:8080/ping

HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 45
Date: Fri, 26 Mar 2021 13:49:20 GMT
X-Powered-By: restheart.org

Greetings from RESTHeart!
```

You can now play with the [tutorial](https://restheart.org/docs/tutorial/). 

### Dockerfile

- [Dockerfile](https://github.com/SoftInstigate/restheart/blob/master/core/Dockerfile)

### Distroless images

 The "distroless" images are for special deployment requirements, where having the smallest possible image size and the very minimal security attack surface is required and their tag contains a `distroless` label. You usually don't need these images unless you exactly know what you are doing.

- [distroless.Dockerfile](https://github.com/SoftInstigate/restheart/blob/master/core/distroless.Dockerfile)

### Native images

Images tags ending with `-native` are created with the [GraalVM Native Image technology](https://www.graalvm.org/reference-manual/native-image/) starting from stable builds of the product, especially suited for high demanding environments, like Kubernetes. These are experimental and not fully documented yet, please contact us for questions.

> Native Image is a technology to ahead-of-time compile Java code to a standalone executable, called a native image. This executable includes the application classes, classes from its dependencies, runtime library classes, and statically linked native code from JDK. It does not run on the Java VM, but includes necessary components like memory management, thread scheduling, and so on from a different runtime system, called “Substrate VM”.

## Run with docker-compose

To run both RESTHeart and MongoDB services you can use docker-compose. Just copy and paste the following shell command:

```shell
curl https://raw.githubusercontent.com/SoftInstigate/restheart/master/docker-compose.yml --output docker-compose.yml
docker-compose pull
docker-compose up
```

Now point your browser to RESTHeart’s ping resource http://localhost:8080/ping, you’ll see the single line of text “Greetings from RESTHeart!”.

You can now play with the [tutorial](https://restheart.org/docs/tutorial/). 

{: .bs-callout.bs-callout-info }
Watch [Docker / Docker Compose](https://www.youtube.com/watch?v=dzggm7Wp2fU&t=206s) video.

## Build it yourself

Building RESTHeart by yourself is not necessary, but if you want to try then it requires [Maven](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and **Java 16**.

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
        <version>6.0.3</version>
    </dependency>
</dependencies>
```

**IMPORTANT**: The `restheart-commons` artifact in the `commons` module has been released using the Apache v2 license instead of the AGPL v3. This is much like MongoDB is doing with the Java driver. It implies **your projects does not incur in the AGPL restrictions when extending RESTHeart with plugins**.

### Project structure

All sub-projects are merged into a single [Maven multi module project](https://maven.apache.org/guides/mini/guide-multiple-modules.html) and a single Git repository.


Then `core` module now is just [Undertow](http://undertow.io) plus a _bootstrapper_ which reads the configuration and starts the HTTP server. The `security` module provides **Authentication** and **Authorization** services, while the `mongodb` module interacts with MongoDB and exposes all of its services via a REST API, as usual. Besides, we added a new `commons` module which is a shared library, including all interfaces and implementations in common among the other modules.

```
.
├── commons
├── core
├── mongodb
├── graphql
└── security
```

{: .bs-callout.bs-callout-info }
Watch [Compile source code from scratch](https://www.youtube.com/watch?v=dzggm7Wp2fU&t=605s) video.

</div>

<script async type="text/javascript">
// avoid caching download link redirects
var z = document.getElementById("zipdl");
var t = document.getElementById("tgzdl");

z.href = `${z.href}?nocache=${Math.random()}`;
t.href = `${t.href}?nocache=${Math.random()}`;
</script>
