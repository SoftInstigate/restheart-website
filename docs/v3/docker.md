---
title: Docker
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [How to run RESTHeart 3 with Docker](#how-to-run-restheart-3-with-docker)
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

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## How to run RESTHeart 3 with Docker

Note that you need to know a bit of [Docker](https://docs.docker.com) and [Docker Compose](https://docs.docker.com/compose/) to follow these instructions. Alternatively, you can scroll down and read how to run RESTHeart directly on a server.

[![Docker Stars](https://img.shields.io/docker/stars/softinstigate/restheart.svg?maxAge=2592000)](https://hub.docker.com/r/softinstigate/restheart/) [![Docker Pulls](https://img.shields.io/docker/pulls/softinstigate/restheart.svg?maxAge=2592000)](https://hub.docker.com/r/softinstigate/restheart/)

__PLease help us improving this documentation__: if you encounter a problem, something you don't understand or a typo, use [this link](https://github.com/SoftInstigate/restheart-website/issues) to ask a question. You could also open a PR to directly fix the documentation on Github, if you want.  

## Quick Start with Docker Compose

Nothing is easier and faster than Docker Compose to run RESTHeart and MongoDB. However, this is neither a docker nor a docker-compose tutorial, so please refer to the [official documentation](https://docs.docker.com/compose/).

Download the example [docker-compose.yml](https://github.com/SoftInstigate/restheart/blob/3.11.x/docker-compose.yml)

```bash
$ mkdir restheart && cd restheart
$ curl https://raw.githubusercontent.com/SoftInstigate/restheart/3.11.x/docker-compose.yml --output docker-compose.yml
```

The file `docker-compose.yml` defines a single micro-service made of a RESTHeart instance on port `8080` and a MongoDB instance configured to work together.

Start both services just typing:

```
$ docker-compose up -d
```

Open the the following URL: 

__[localhost:8080/browser](http://localhost:8080/browser)__

> **NOTE**: The HAL browser has been removed from RESTHeart 4, these instructions are for RESTHeart 3 only.

Insert the default admin credentials, which are:

    username: admin
    password: changeit

You should then see the __HAL Browser__:

<img src="/images/browser.png" width="100%" height="auto" class="img-responsive">

Note that by default docker-compose runs the latest RESTHeart release, which usually is a `SNAPSHOT`. If this is not what you want, then edit the `docker-compose.yml` file accordingly.

If everything is working as expected, then **you can jump to the [tutorial](/docs/v3/tutorial/)**.

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
$ docker logs -f restheart
$ docker logs -f restheart-mongo
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

* The Dockefile is [here](https://github.com/SoftInstigate/restheart/blob/3.11.x/Dockerfile).

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

```bash
$ docker run -d -e MONGO_INITDB_ROOT_USERNAME='restheart' -e MONGO_INITDB_ROOT_PASSWORD='R3ste4rt!' \
 --name mongodb mongo:3.6 --bind_ip_all --auth
```

If you change the `MONGO_INITDB_ROOT_USERNAME` or `MONGO_INITDB_ROOT_PASSWORD` then you need to change the `mongo-uri` in `Docker/etc/restheart.yml` accordingly and re-build the Docker image.

```yml
    mongo-uri: mongodb://restheart:R3ste4rt!@mongodb
```

#### RESTHeart < 3.3

If you are running RESTHeart 3.2 or below.

```bash
$ docker run -d --name mongodb mongo:3.6
```

To make it accessible from your host and add a [persistent data volume](https://docs.docker.com/userguide/dockervolumes/):

```bash
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

To stop MongoDB:

``` bash
$ docker stop mongodb
```

Restart it with:

``` bash
$ docker start mongodb
```

Note that you must **always stop RESTHeart before MongoDB**, or you might experience data losses.

</div>
