---
layout: docs
title: Setup
edited: in progress
spellCheck: n
notes: requires links for configuration, environmental, and plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Install with Docker](##install-restheart-with-docker)
-   [Install with Java](#restheart-with-java)
-   [Run RESTHeart](#run-restheart)
- 	[Customise RESTHeart](#customisation)
-	[Remote vs. Local](#remote-vs-local)


</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Ready to Start?

If you are familiar with RESTHeart and ready to install, follow the [Quickstart]({% link docs/quickstart.md %}) guide.

If you are new to RESTHeart read on to learn more.

## RESTHeart Setup Options 

RESTHeart may be run with [Docker](#install-restheart-with-docker), [Java](#restheart-with-java), or you can build it yourself using [Maven](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and Java. There is no need to self-build, so we will concentrate here on Java or Docker options.

RESTHeart can work with **any database compatible with the MongoDB API**. It has been tested with MongoDB Community and Enterprise (v2–4), [Percona Server for MongoDB](https://www.percona.com/software/mongodb/percona-server-for-mongodb), [Microsoft Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/mongodb-introduction) and [Amazon DocumentDB](https://medium.com/softinstigate-team/how-to-create-a-web-api-for-aws-documentdb-using-restheart-987921df3ced).

For more information on **how to install and run MongoDB** check the [Installation Tutorial](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials) and [Manage MongoDB](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/) on MongoDB's documentation.


## Install RESTHeart with Docker

RESTHeart is distributed as a [public Docker image](https://hub.docker.com/r/softinstigate/restheart). With `docker-compose` you can run Java, RESTHeart, and a dedicated MongoDB instance with a single command!

```bash
# 1 - create a new directory
$ mkdir restheart && cd restheart

# 2 - download the restheart docker-compose file
$ curl https://raw.githubusercontent.com/SoftInstigate/restheart/master/docker-compose.yml --output docker-compose.yml

# 3 - run the stack
$ docker-compose up -d

Creating network "temp_restheart-backend" with the default driver
Creating volume "temp_restheart-mongo-volume" with default driver
Creating restheart-mongo ... done
Creating restheart       ... done
```

### Control your Docker Container

`Ctrl+C` will stop the container:

```
^CGracefully stopping... (press Ctrl+C again to force)
Stopping restheart       ... done
Stopping restheart-mongo ... done
```

To stop and start the containers you may use `docker-compose stop` then `docker-compose start` to start them again. 

To completely shutdown the containers and clean-up everything use `docker-compose down -v`. 

Beware, the `down` command with `-v` parameter erases the MongoDB attached docker volume (named `restheart-mongo-volume`) with all its data.

To run the services in background, add the `-d` parameter: `docker-compose up -d`. In this case, you can tail the logs with `docker-compose logs -f`. 

Read the [docker compose documentation](https://docs.docker.com/compose/) for more.

Skip ahead to [Run RESTHeart](#run-restheart)

## RESTHeart with Java

### Prerequisites When Using Java

{% include java-requirements.md %}

> RESTHeart needs, at minimum, the **Java 11 Runtime Environment**. It won't even start with older versions of Java.

If you are a Java developer and need to manage multiple JDKs, we suggest to have a look at [SDKMAN!](https://sdkman.io)


### Install RESTHeart with Java

To install RESTHeart and run it with Java, download either the [ZIP](https://github.com/SoftInstigate/restheart/releases/download/5.0.0/restheart.zip) or the [TAR.GZ](https://github.com/SoftInstigate/restheart/releases/download/5.0.0/restheart.tar.gz) file and uncompress it.

[zip](https://github.com/SoftInstigate/restheart/releases/download/5.0.0/restheart.zip){: .btn btn-md}
[tgz](https://github.com/SoftInstigate/restheart/releases/download/5.0.0/restheart.tar.gz){: .btn btn-md}

Un-zip it,

```bash
$ unzip restheart.zip
```

or un-tar it.

```bash
$ tar -xzf restheart.tar.gz
```

The archive will uncompress in the `restheart/` folder.

```bash
$ cd restheart
```

## Run RESTHeart

{% include run-restheart.md %}

### Check it works

{% include check-is-running.md %}


## Customisation 

RESTHeart is highly-customisable through the use of:
- configuration files,
- environment variables,
- plugins.

Configuration files are in the `etc/` folder, while extensions are in the `plugins/` folder. The main `restheart.jar` file is in the root.

The directory tree is:

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

<!-- this can later be moved to a configuration how to -->

### Remote vs. Local

To connect RESTHeart to a remote MongoDB instance you have to edit the `mongo-uri` property, setting you own [connection string](https://docs.mongodb.com/manual/reference/connection-string/). For example, a MongoDB Atlas cluster connection string could be something like `mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?w=majority`. Remember that RESTHeart internally uses the MongoDB Java driver, so you must follow that connection string format.

## Defaults and First Steps

The default setup provides a local instance. By default, RESTHeart only mounts the database `restheart`. This is controlled by the `root-mongo-resource` in the `restheart/etc/default.properties` file.

{% include initiate-database.md %}

<!-- This requires further explanation, have relocated it to the best of my abilities -->

```properties
# The MongoDB resource to bind to the root URI /
# The format is /db[/coll[/docid]] or '*' to expose all dbs
root-mongo-resource = /restheart
```

### Default Users and ACL

The default `users.yml` defines the following users:

-   id: `admin`, password: `secret`, role: `admin`
-   id: `user`, password: `secret`, role: `user`

The default `acl.yml` defines the following permissions:

-   _admin_ role can execute any request
-   _user_ role can execute any request on collection `/{username}`

### Run Tests

```bash
# create database 'restheart'
$ curl --user admin:secret -I -X PUT :8080/
HTTP/1.1 201 OK

# create collection 'restheart.collection'
$ curl --user admin:secret -I -X PUT :8080/collection
HTTP/1.1 201 OK

# create a couple of test documents
$ curl --user admin:secret -X POST :8080/collection -d '{"a":1}' -H "Content-Type: application/json"
$ curl --user admin:secret -X POST :8080/collection -d '{"a":2}' -H "Content-Type: application/json"

# get documents
$ curl --user admin:secret :8080/collection
[{"_id":{"$oid":"5dd3cfb2fe3c18a7834121d3"},"a":1,"_etag":{"$oid":"5dd3cfb2439f805aea9d5130"}},{"_id":{"$oid":"5dd3cfb0fe3c18a7834121d1"},"a":2,"_etag":{"$oid":"5dd3cfb0439f805aea9d512f"}}]%
```

## Source Code

The full source code is available on [GitHub](https://github.com/SoftInstigate/restheart).

RESTHeart is distributed under the terms of the OSI-approved AGPL v3 license. A commercial license is available [upon request](mailto:ask@restheart.org).


</div>
