---
title: How to package custom code
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Create a Uber jar](#create-a-uber-jar)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content pt-0">

{% include docs-head.html %}


## Introduction

You can extend RESTHeart by implementing custom extensions, such as
[Application Logic Handlers](/docs/v3/application-logic) and [Request Hooks](/docs/v3/request-hooks). As RESTHeart is a Java application, to package
custom code you usually use Maven or any Maven-compatible tool, such as
Gradle.

A basic knowledge of [Maven](https://maven.apache.org) is required to
follow this guide.

RESTHeart is available as a Maven artifact and so it can be included in
your own custom POM. Here you can see examples of how to configure
dependencies with different build tools.

To add RESTHeart JAR as a dependency to your pom.xml, add this fragment:

``` xml
<dependency>
    <groupId>org.restheart</groupId>
    <artifactId>restheart</artifactId>
    <version>3.10.0</version>
</dependency>
```

## Create a Uber jar

The Maven [Shade](https://maven.apache.org/plugins/maven-shade-plugin/) plugin provides the capability to package the artifacts in an single, self-executable JAR file, which includes all necessary dependencies.

``` xml
<project>
  ...
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.2.1</version>
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

Now you can run `mvn package` or `mvn install`.

> Remember that if you have written any integration test, you'll probably need a running MongoDB instance on `localhost:27017` to exceute them succesfully. To create and run end to end tests, from the REST API down to the database, we recommend having a look at [Karate DSL](https://intuit.github.io/karate/).

The above configuration will produce a single JAR file whose name is the `artifactId`, for instance `foo.jar`. This jar will include both your custom code and RESTHeart. You can start the customized RESTHeart with:

``` bash
$ java -server -jar foo.jar conf.yml
```

</div>
