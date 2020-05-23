---
layout: page-notitle
title: Get RESTHeart
permalink: /get
---

<div class="form-row text-center mt-4">
    <p class="mx-auto display-4 restheart-red">GET /<img class="mr-auto" width="20%"  src="{{ '/images/rh_logo_vert.png' | prepend: site.baseurl }}" /></p>
</div>


> RESTHeart is a modern **backend** for **Web** and **Mobile** apps, designed to _radically simplify server-side development and deployment_.

## Prerequisites

To run RESTHeart you need:

-   **Java 11** (alternatively, you can just **[run it with Docker](#run-with-docker)**).
-   **MongoDB** (or any API-compatible database).

RESTHeart can work with **any database compatible with the MongoDB API**. It has been tested with MongoDB Community and Enterprise (v2, v3 and v4), [Percona Server for MongoDB](https://www.percona.com/software/mongodb/percona-server-for-mongodb), [Microsoft Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/mongodb-introduction) and [Amazon DocumentDB](https://medium.com/softinstigate-team/how-to-create-a-web-api-for-aws-documentdb-using-restheart-987921df3ced).

For more information on **how to install and run MongoDB** check the [Installation Tutorial](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials) and [Manage MongoDB](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/) on MongoDB's documentation.

-   To **install Java** for your operating system download it from [AdoptOpenJDK](https://adoptopenjdk.net/releases.html?variant=openjdk11&jvmVariant=hotspot).
-   Are you a Java developer and need to manage multiple JDK? We suggest to have a look at [SDKMAN!](https://sdkman.io)
-   Do you have **Docker**? You can [run RESTHeart in a Docker container](#run-with-docker), even without Java!

## Download and Install RESTHeart

To install RESTHeart and run it with Java you just have to download either the [ZIP](https://github.com/SoftInstigate/restheart/releases/download/5.0.0/restheart.zip) or the [TAR.GZ](https://github.com/SoftInstigate/restheart/releases/download/5.0.0/restheart.tar.gz) file and uncompress it.

[zip](https://github.com/SoftInstigate/restheart/releases/download/5.0.0/restheart.zip){: .btn btn-md}
[tgz](https://github.com/SoftInstigate/restheart/releases/download/5.0.0/restheart.tar.gz){: .btn btn-md}

Then un-zip it

```bash
$ unzip restheart.zip
```

or un-tar it

```bash
$ tar -xzf restheart.tar.gz
```

The archive will uncompress in the `restheart/` folder.

```bash
$ cd restheart
```

Configuration files are in the `etc/` folder, while extensions are in the `plugins/` folder. You'll see the main `restheart.jar` file in the root.

See the whole directory tree:

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

## Run RESTHeart

By default, RESTHeart is configured to look for a **running MongoDB** instance on `localhost`, port `27017`.

-   RESTHeart needs at least the **Java 11 Runtime Environment**. It won't even start with older versions of Java.

Within the `restheart/` folder, execute the following command:

```bash
$ java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

## Check it works

To check that RESTHeart is up and running, open the URL [http://localhost:8080/ping](http://localhost:8080/ping). You will see the message:

> Greetings from RESTHeart!

Alternatively, you can open the above URL using a command line HTTP client like [curl](https://curl.haxx.se) and [httpie](https://httpie.org) or a API client like [Postman](https://www.postman.com).

## Run with Docker

If you prefer to run with containers, RESTHeart is also distributed as a [public Docker image](https://hub.docker.com/r/softinstigate/restheart). In this case you don't need to install Java, it is already packaged in the Docker image.

With `docker-compose` you can run both RESTHeart and a dedicated MongoDB instance with a single command!

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

Again, to check that RESTHeart is up and running, just open the URL [http://localhost:8080/ping](http://localhost:8080/ping).

## Tutorial

As soon as RESTHeart is up and running, you can jump to the [tutorial](/docs/tutorial/).

## Source code

The full source code is available on [GitHub](https://github.com/SoftInstigate/restheart).

RESTHeart is distributed under the terms of the OSI-approved AGPL v3 license. A commercial license is available upon request.
