---
docs_version: 9
title: GraalVM
layout: docs
menu: setup
applies_to: restheart
redirect_from:
  - /docs/graalvm
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Why GraalVM](#why-graalvm)
* [Install the GraalVM](#install-the-graalvm)
* [Run RESTHeart with GraalVM](#run-restheart-with-graalvm)
* [Build stock RESTHeart as native image](#build-stock-restheart-as-native-image)
* [Build RESTHeart with custom plugins as native image](#build-restheart-with-custom-plugins-as-native-image)
* [A docker image to build Linux native images](#a-docker-image-to-build-linux-native-images)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content pt-0">

{% include docs-head.html %}

## Introduction

[GraalVM](https://www.graalvm.org/) is a new virtual machine that supports a polyglot runtime environment and the ability to compile Java applications to native images.

RESTHeart fully supports the GraalVM:

- RESTHeart can be run and is supported on the GraalVM
- Services and Interceptors can be implemented in JavaScript and TypeScript leveraging the GraalVM polyglot programming model
- RESTHeart (and your custom plugins) can be built as a native image using GraalVM’s `native-image` tool

## Why GraalVM

GraalVM provides advanced optimizing compiler that generates fast lean code which requires fewer compute resources and allows Ahead-of-Time Compilation to build
Native binaries that start up instantly and deliver peak performance with no warm up time.

<div class="row mb-4">
    <div class="col-6 text-center"><strong>Startup time</strong></div>
    <div class="col-6 text-center"><strong>Memory Footprint</strong></div>
</div>
<div class="row">
<div class="col-6"><img class="img-fluid mx-auto d-block" style="max-width: 65%" src="/images/graalvm-perf.png"></div>
<div class="col-6"><img class="img-fluid mx-auto d-block" style="max-width: 65%" src="/images/graalvm-mem.png"></div>
</div>

{: .bs-callout.bs-callout-info.mt-3.small}
Images from graalvm.org website.

### Benefits of running RESTHeart with the GraalVM

The GraalVM is faster than OpenJDK and it is also a polyglot runtime environment, so that you can seamlessly use multiple languages to implement RESTHeart plugins.

RESTHeart leverages the GraalVM to allow developing [services](/docs/plugins/core-plugins/#services) and [interceptors](https://restheart.org/docs/plugins/core-plugins/#interceptors) using JavaScript.

See [Polyglot JavaScript Services and Interceptors](/docs/plugins/core-plugins-js) for more details.

{: .bs-callout.bs-callout-info}
Want to see some code? Several [code examples](https://github.com/SoftInstigate/restheart/tree/master/polyglot/src/test/resources/test-js-plugins) are available as well.

### Benefits of running RESTHeart as a native image

Building a RESTHeart application to native image provides multiple advantages, including faster startup time and smaller memory footprint.

{: .bs-callout.bs-callout-info}
A *RESTHeart application* is a bundle of RESTHeart core and plugins. The plugins can include the one shipped with RESTHeart (`restheart-mongodb.jar` and `restheart-security.jar`) and custom plugins that implement your application logic.

The following table compares RESTHeart (with default plugins) running on a MacBook Pro with OpenJDK, GraalVM CE and GraalVM CE native image.

{: .table }
||OpenJDK|GraalVM CE|GraalVM CE native|
|-|-|-|-|
|startup time|2441ms|2042ms|249ms|
|memory|487Mbyte|761Mbyte|279Mbyte|
|integration test execution time|63,503s|57,292s|52,518s|

<img class="img-fluid" src="/images/graalvm-benchmark.png">

The numbers clearly show that running RESTHeart as a native image is ideal for microservices and clustering. With instant startup time and smaller memory footprint you can run multiple instances of RESTHeart Docker images and also better support dynamic scaling.

{: .bs-callout.bs-callout-warning}
In some use cases, native image might result in slightly worse peak performance. Read [this great article](https://stackoverflow.com/questions/59488654/does-graalvm-native-image-increase-overall-application-performance-or-just-reduc) for more information. The fact that peak performances might be worse, is well compensated by the ability to run more RESTHeart instances in parallel due to much smaller memory footprint.

## Install the GraalVM

We suggest to install GraalVM with [sdkman](https://sdkman.io)

You need at least version 25.0.1:

```bash
$ sdk install java 25.0.1-graalce
```
## Run RESTHeart with GraalVM

Check that GraalVM SDK is active:

```bash
$ java -version
openjdk version "25.0.1" 2025-10-21
OpenJDK Runtime Environment GraalVM CE 25.0.1+8.1 (build 25.0.1+8-jvmci-b01)
OpenJDK 64-Bit Server VM GraalVM CE 25.0.1+8.1 (build 25.0.1+8-jvmci-b01, mixed mode, sharing)
```

Then just run RESTHeart as usual:

```bash
$ java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

## Build stock RESTHeart as native image

{: .bs-callout.bs-callout-info }
A Docker image of RESTHeart native is available tagged as `softinstigate/restheart:<version>-native`

Example:

```bash
$ docker pull softinstigate/restheart:latest-native
```

The [docker-compose-native.yml](https://github.com/SoftInstigate/restheart/blob/master/docker-compose-native.yml) leveraging restheart-native is available as well. It runs restheart-native and MongoDB stack.

### how to build from source

RESTHeart's `pom.xml` includes the `native` profile.

Check that GraalVM SDK is active:

```bash
$ java -version
openjdk version "25.0.1" 2025-10-21
OpenJDK Runtime Environment GraalVM CE 25.0.1+8.1 (build 25.0.1+8-jvmci-b01)
OpenJDK 64-Bit Server VM GraalVM CE 25.0.1+8.1 (build 25.0.1+8-jvmci-b01, mixed mode, sharing)
```

You can then simply build it with:

```bash
$ git checkout https://github.com/SoftInstigate/restheart.git
$ cd restheart
$ ./mvnw clean package -Pnative
```

As a result, you'll find the executable binary file `target/restheart-native`.

## Build RESTHeart with custom plugins as native image

JavaScript plugins can be deployed on RESTHeart native. However you cannot deploy Java plugins in RESTHeart native by merely copying jars file into the plugins directory.

In order to use Java or Kotlin plugins on RESTHeart native you must build them as native image together with RESTHeart.

Refer to [Deploy Java Plugins On Restheart Native](https://restheart.org/docs/plugins/deploy/#deploy-java-plugins-on-restheart-native) for detailed instructions on how to do it.

### Automatic reflection configuration for plugins

Since RESTHeart v7, plugin reflection configuration for native images is handled automatically. RESTHeart implements a GraalVM feature that automatically generates the necessary reflection configuration for plugins annotated with `@RegisterPlugin`.

This means you no longer need to manually maintain `reflect-config.json` files for your plugins. The reflection configuration is automatically generated at build time, streamlining the development process for plugins that will be bundled in RESTHeart native builds.

The automatic reflection configuration covers:
- Plugin classes annotated with `@RegisterPlugin`
- Plugin initialization methods
- Dependency injection fields and methods
- Provider implementations

## build native image

Build image for local OS

```bash
$ ./mvnw clean package -Pnative -DskipTests
```

## A docker image to build Linux native images

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
    clean package -Pnative -DskipTests
```

native-image arguments are defined in [this file](https://github.com/SoftInstigate/restheart/blob/master/core/src/main/resources/META-INF/native-image/org.restheart/restheart/native-image.properties).

</div>
