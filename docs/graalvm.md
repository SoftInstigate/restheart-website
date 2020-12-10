---
title: GraalVM
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Install the GraalVM](#install-the-graalvm)
* [Run RESTHeart with GraalVM](#run-restheart-with-graalvm)
* [Build RESTHeart with default plugins as native image](#build-restheart-with-default-plugins-as-native-image)
* [Build RESTHeart with custom plugins as native image](#build-restheart-with-custom-plugins-as-native-image)
* [A docker image to build Linux native images](#a-docker-image-to-build-linux-native-images)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{: .bs-callout.bs-callout-warning}
This page is incomplete, work in progress.

## Introduction

[GraalVM](https://www.graalvm.org/) is a new virtual machine from Oracle that supports a polyglot runtime environment and the ability to compile Java applications to native images.

RESTHeart fully supports the GraalVM:

- you can run RESTHeart using the GraalVM
- starting from v5.2, you can build RESTHeart (and your custom plugins) to a native image using GraalVM’s `native-image` tool

### Benefits of running RESTHeart with the GraalVM

The GraalVM is a polyglot runtime environment, so that you can seamlessly use multiple languages to implement RESTHeart plugins.

{: .bs-callout.bs-callout-info}
In the v5.2 product line we will progressively leverage the GraalVM to allow you to develop plugins, such as [services](/docs/plugins/core-plugins/#services) and [interceptors](https://restheart.org/docs/plugins/core-plugins/#interceptors) by just defining JavaScript lambda functions.

### Benefits of building a native image

Build your RESTHeart application to native image provides multiple advantages, including faster startup times and lesser memory consumption.

For comparison, a RESTHeart with default plugins startup time


||JVM|native|
|-|-|-|
|startup time|~2 secs|~150ms|
|memory|1,25Gbyte|279Mbyte|
|througput|70,000 req/sec|48,000 req/sec|


{: .bs-callout.bs-callout-info}
Native image usually results in worse peak performance. Read [this great article](https://stackoverflow.com/questions/59488654/does-graalvm-native-image-increase-overall-application-performance-or-just-reduc) for more information.

The numbers clearly show that running RESTHeart as a native image is ideal for clustering. With instant startup time and much lesser memory consumption you can run multiple instances of RESTHeart Docker images and also better support dynamic scaling.

## Install the GraalVM

We suggest to install GraalVM with [sdkman](https://sdkman.io)

```
$ sdk install java 20.3.0.r11-grl
```

After having installed GraalVM, you can install the `native-image` tool with `gu`

```bash
$ gu install native-image
```

## Run RESTHeart with GraalVM

Check that GraalVM SDK is active:

```bash
$ java -version
openjdk version "11.0.9" 2020-10-20
OpenJDK Runtime Environment GraalVM CE 20.3.0 (build 11.0.9+10-jvmci-20.3-b06)
OpenJDK 64-Bit Server VM GraalVM CE 20.3.0 (build 11.0.9+10-jvmci-20.3-b06, mixed mode, sharing)
```

Then just run RESTHeart as usual:

```bash
$ java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

## Build RESTHeart with default plugins as native image

RESTHeart's `pom.xml` includes the `native` profile; you can then simply build it with

```bash
$ git checkout https://github.com/SoftInstigate/restheart.git
$ cd restheart
$ mvn clean package -Pnative
```

As a result, you'll find the executable binary file `target/restheart-native`.

## Build RESTHeart with custom plugins as native image

In order to build RESTHeart with custom plugins as native image you use maven to:

- build a uber-jar using the [Maven Shade Plugin](https://maven.apache.org/plugins/maven-shade-plugin/)
- define a the profile `native` that uses the [Native Image Maven Plugin](https://www.graalvm.org/reference-manual/native-image/NativeImageMavenPlugin/) to build the native image from the uber-jar

{: .bs-callout.bs-callout-info }
At startup time, RESTHeart dynamically loads the plugins jars found in  the `/plugins` directory. Dynamic class loading is simply not possible with GraalVM. This is why you need to package RESTHeart core and all plugins in a uber-jar.

Add the `native` profile to your `pom.xml`

Use this example [pom.xml](https://github.com/SoftInstigate/web-frameworks/blob/native/java/restheart/pom.xml) as a reference for your project.

You can now build the native image with:

```bash
$ mvn clean package -Pnative
```

### A docker image to build Linux native images

[SoftInstigate](https://softinstigate.com) maintains the Debian based, docker image [softinstigate/graalvm-maven](https://github.com/SoftInstigate/graalvm-maven-docker) with GraalVM and Maven and `native-image`.

Use it if you are running a different OS and you need to build a native image for Linux to include it in a Docker image.

```bash
$ docker pull softinstigate/graalvm-maven
```

You can build a Linux native image with:

```bash
$ docker run -it --rm \
    -v "$PWD":/opt/app  \
    -v "$HOME"/.m2:/root/.m2 \
    softinstigate/graalvm-maven \
    clean package -Pnative
```