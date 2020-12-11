---
title: GraalVM
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Why GraalVM](#why-graalvm)
* [Install the GraalVM](#install-the-graalvm)
* [Run RESTHeart with GraalVM](#run-restheart-with-graalvm)
* [Build RESTHeart with default plugins as native image](#build-restheart-with-default-plugins-as-native-image)
* [Build RESTHeart with custom plugins as native image](#build-restheart-with-custom-plugins-as-native-image)
* [A docker image to build Linux native images](#a-docker-image-to-build-linux-native-images)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

[GraalVM](https://www.graalvm.org/) is a new virtual machine from Oracle that supports a polyglot runtime environment and the ability to compile Java applications to native images.

RESTHeart fully supports the GraalVM:

- you can run RESTHeart using the GraalVM
- starting from v5.2, you can build RESTHeart (and your custom plugins) to a native image using GraalVM’s `native-image` tool

## Why GraalVM

GraalVM provides advanced optimizing compiler that generates fast lean code which requires fewer compute resources and allows Ahead-of-Time Compilation to build
Native binaries that start up instantly and deliver peak performance with no warm up time.

<div class="row mb-4">
    <div class="col-6 text-center"><strong>Startup time</strong></div>
    <div class="col-6 text-center"><strong>Memory Footprint</strong></div>
</div>
<div class="row">
<div class="col-6"><img class="img-fluid mx-auto d-block" style="max-width: 65%" src="https://www.graalvm.org/resources/img/home/perf.png"></div>
<div class="col-6"><img class="img-fluid mx-auto d-block" style="max-width: 65%" src="https://www.graalvm.org/resources/img/home/mem.png"></div>
</div>

{: .bs-callout.bs-callout-info.mt-3.small}
Images from graalvm.org website.

### Benefits of running RESTHeart with the GraalVM

The GraalVM is faster than OpenJDK and it is also a polyglot runtime environment, so that you can seamlessly use multiple languages to implement RESTHeart plugins.

{: .bs-callout.bs-callout-info}
In the v5.2 product line we will progressively leverage the GraalVM to allow you to develop plugins, such as [services](/docs/plugins/core-plugins/#services) and [interceptors](https://restheart.org/docs/plugins/core-plugins/#interceptors) by just defining JavaScript lambda functions.

### Benefits of running RESTHeart as a native image

Building a RESTHeart application to native image provides multiple advantages, including faster startup time and smaller memory footprint.

{: .bs-callout.bs-callout-info}
A *RESTHeart application* is a bundle of RESTHeart core and plugins. The plugins can include the one shipped with RESTHeart (`restheart-mongodb.jar` and `restheart-security.jar`) and custom plugins that implement your application logic.

The following table compares RESTHeart (with default plugins) running on a MacBook Pro with OpenJDK, GraalVM CE and GraalVM CE native image.

{: .table .table-responsive}
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

RESTHeart's `pom.xml` includes the `native` profile.

Check that GraalVM SDK is active:

```bash
$ java -version
openjdk version "11.0.9" 2020-10-20
OpenJDK Runtime Environment GraalVM CE 20.3.0 (build 11.0.9+10-jvmci-20.3-b06)
OpenJDK 64-Bit Server VM GraalVM CE 20.3.0 (build 11.0.9+10-jvmci-20.3-b06, mixed mode, sharing)
```

You can then simply build it with:

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

Define the Maven `native` profile following this example [pom.xml](https://github.com/SoftInstigate/web-frameworks/blob/native/java/restheart/pom.xml).

You can now build the native image with:

```bash
$ mvn clean package -Pnative
```

In order for some java features to work, like reflection, you might need to tweak the native image build properties found in the repo directory [core/src/main/resources/META-INF/native-image/org.restheart/restheart](https://github.com/SoftInstigate/restheart/tree/master/core/src/main/resources/META-INF/native-image/org.restheart/restheart).

For further information, good starting points are:

- [Native Image Compatibility and Optimization Guide](https://www.graalvm.org/reference-manual/native-image/Limitations/) on GraalVM website
- [GRAALVM.md](https://github.com/SoftInstigate/restheart/blob/master/GRAALVM.md) on RESTHeart github repository

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
    clean package -Pnative
```