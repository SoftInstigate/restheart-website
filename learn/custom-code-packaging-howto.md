---
title: How to package custom code
layout: docs
---

## Introduction

You can extend RESTHeart by implementing custom extensions, such as
[Application Logic Handlers](Application_Logic) and [Request
Hooks](Request_Hooks). As RESTHeart is a Java application, to package
custom code you usually use Maven or any Maven-compatible tool, such as
Gradle.

A basic knowledge of [Maven](https://maven.apache.org) is required to
follow this guide.

RESTHeart is available as a Maven artifact and so it can be included in
your own custom POM. Here you can see examples of how to configure
dependencies with different build tools.

To add RESTHeart dependency to your pom.xml, just add this:

``` xml
<dependency>
    <groupId>org.restheart</groupId>
    <artifactId>restheart</artifactId>
    <version>3.2.0</version>
</dependency>
```