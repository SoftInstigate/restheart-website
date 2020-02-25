---
title: Packaging Plugins
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Package RESTHeart Core plugins](#package-restheart-core-plugins)
  * [Create a Uber jar for Core](#create-a-uber-jar-for-core)
* [Package RESTHeart Security plugins](#package-restheart-security-plugins)
  * [Create a Uber jar for Security](#create-a-uber-jar-for-security) 

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}

## Introduction

This page provides information on how to package custom plugins for the [RESTHeart Platform](https://restheart.org/get).

It's possible to package plugins for both RESTHeart Platform Security or RESTHeart Platform core.

Please [contact us](https://restheart.org/contact/) for any question.

## Package RESTHeart Core plugins

After downloading the the [RESTHeart Platform](https://restheart.org/get), follow the below sequence of commands to install `restheart-platform-core.jar` as a local Maven dependency. Usually on Linux and MacOS the Maven local repo is into a `.m2/` folder.

{: .black-code}
```bash
$ unzip restheart-platform-4.0.zip
$ cd restheart-platform-4.0
$ mvn org.apache.maven.plugins:maven-install-plugin:3.0.0-M1:install-file -Dfile=restheart-platform-core.jar

...

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.830 s
[INFO] Finished at: 2019-07-15T11:40:57+02:00
[INFO] ------------------------------------------------------------------------
```

Then it's possible to use it as a Maven dependency:

{: .black-code}
```xml
<dependency>
    <groupId>com.restheart</groupId>
    <artifactId>restheart-platform-core</artifactId>
    <version>4.0.0</version>
</dependency>
```

### Create a Uber jar for Core

The Maven [Shade](https://maven.apache.org/plugins/maven-shade-plugin/) plugin provides the capability to package artifacts into a single uber-jar, including all dependencies.

{: .black-code}
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
                            <exclude>META-INF/*.txt</exclude>
                        </excludes>
                    </filter>
                    <filter>
                        <!-- removing overlapping classes, defined also in guava -->
                        <artifact>com.google.guava:failureaccess</artifact>
                        <excludes>
                            <exclude>com/google/common/util/concurrent/internal/InternalFutureFailureAccess.class</exclude>
                            <exclude>com/google/common/util/concurrent/internal/InternalFutures.class</exclude>
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

## Package RESTHeart Security plugins

After downloading the the [RESTHeart Platform](https://restheart.org/get), follow the below sequence of commands to install `restheart-platform-security.jar` as a local Maven dependency. Usually on Linux and MacOS the Maven local repo is into a `.m2/` folder.

{: .black-code}
```bash
$ unzip restheart-platform-4.0.zip
$ cd restheart-platform-4.0
$ mvn org.apache.maven.plugins:maven-install-plugin:3.0.0-M1:install-file -Dfile=restheart-platform-security.jar

...

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  1.608 s
[INFO] Finished at: 2019-07-15T10:44:14+02:00
[INFO] ------------------------------------------------------------------------
```

Then it's possible to use it as a Maven dependency:

{: .black-code}
```xml
<dependency>
    <groupId>com.restheart</groupId>
    <artifactId>restheart-platform-security</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Create a Uber jar for Security

The Maven [Shade](https://maven.apache.org/plugins/maven-shade-plugin/) plugin provides the capability to package artifacts into a single uber-jar, including all dependencies.

{: .black-code}
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
                    <filter>
                        <!-- removing overlapping classes, defined also in guava -->
                        <artifact>com.google.guava:failureaccess</artifact>
                        <excludes>
                            <exclude>com/google/common/util/concurrent/internal/InternalFutureFailureAccess.class</exclude>
                            <exclude>com/google/common/util/concurrent/internal/InternalFutures.class</exclude>
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
                                <mainClass>org.restheart.security.Bootstrapper</mainClass>
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