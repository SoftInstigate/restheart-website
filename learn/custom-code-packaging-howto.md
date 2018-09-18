---
title: How to package custom code
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Create a Uber jar](#create-a-uber-jar)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 


## Introduction

You can extend RESTHeart by implementing custom extensions, such as
[Application Logic Handlers](/learn/application-logic) and [Request
Hooks](/learn/request-hooks). As RESTHeart is a Java application, to package
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

## Create a Uber jar

The Maven [Shade](https://maven.apache.org/plugins/maven-shade-plugin/) plugin provides the capability to package the artifact in an uber-jar, including its dependencies.

The following configuration will produce a single jar file whose name is the artifactId, for instance `foo.jar`. This jar will include both your custon code and RESTHeart. You can start the customized RESTHeart with:

``` bash
$ java -server -jar foo.jar conf.yml
```

**Important**: RESTHeart is distributed under the AGPL, so you are obliged to distribute the software that use and/or embeds RESTHeart under the AGPL itslef. SoftInstigate sells commercial licenses that overcome this limitation.


``` xml
<project>
  ...
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.1.1</version>
        <configuration>
          <finalName>${project.artifactId}</finalName>
          <createDependencyReducedPom>true</createDependencyReducedPom>
          <filters>
            <filter>
              <artifact>*:*</artifact>
              <excludes>
                <exclude>META-INF/*.SF</exclude>
                <exclude>META-INF/*.DSA</exclude>
                <exclude>META-INF/*.RSA</exclude>
              </excludes>
            </filter>
          </filters>
        </configuration>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
            <configuration>
              <transformers>
                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                  <mainClass>org.restheart.Bootstrapper</mainClass>
                </transformer>
              </transformers>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
  ...
</project>
```

</div>