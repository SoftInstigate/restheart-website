---
layout: docs
title: Quickstart
edited: in progress -- this markdown file is not rendering on the live site, why?
spellCheck: n
notes: This fragment appeared at the top of the page-- parked here for now: Recommend configuration assistance (1 page or many)
---


The main configuration file is [restheart.yml](https://github.com/SoftInstigate/restheart/blob/master/core/etc/restheart.yml) which is parametrized using [Mustache.java](https://github.com/spullara/mustache.java). The [default.properties](https://github.com/SoftInstigate/restheart/blob/master/core/etc/default.properties) contain actual values for parameters defined into the YAML file. You pass these properties at startup, using the `-e` or `--envFile` parameter, like so:

```bash
$ java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

### Apply Changes

You have to restart the core `restheart.jar` process to reload a new configuration. How to stop and start the process depends on how it was started: either within a docker container or as a native Java process. In case of native Java, usually you have to kill the background `java` process but it depends on your operating system.

You can edit the YAML configuration file or create distinct properties file. Usually one set of properties for each deployment environment is a common practice.

### Environment variables

It is possible to override any primitive type parameter in `restheart.yml` with an environment variable, without the need to edit any configuration file. Primitive types are:

-   String
-   Integer
-   Long
-   Boolean

For example, the parameter `mongo-uri` in the YAML file can be overridden by setting a `MONGO_URI` environment variable:

```bash
$ MONGO_URI="mongodb://127.0.0.1" java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

<!-- this is fine detail for docker-- park or relocate-->

> Have a look at the [docker-compose.yml](https://github.com/SoftInstigate/restheart/blob/master/docker-compose.yml) file for an example of how to export an environment variable if using Docker.

The following log entry appears at the very beginning of logs during the startup process:

```
[main] WARN  org.restheart.Configuration - >>> Overriding parameter 'mongo-uri' with environment value 'MONGO_URI=mongodb://127.0.0.1'
```

A shell environment variable is equivalent to a YAML parameter in `restheart.yml`, but it’s all uppercase and '-' (dash) are replaced with '\_' (underscore).

---

Environment variables replacement works only with primitive types: it doesn’t work with YAML structured data in configuration files, like arrays or maps. It's mandatory to use properties files and mustache syntax for that.

---

To know the available CLI parameters, run RESTHeart with `--help`:

```bash
$ java -jar restheart.jar --help

Usage: java -Dfile.encoding=UTF-8 -jar -server restheart.jar [options]
      <Configuration file>
  Options:
    --envFile, --envfile, -e
      Environment file name
    --fork
      Fork the process
      Default: false
    --help, -?
      This help message
```
<!-- this is deployment info relocate-->

### Run the process in background

To run RESTHeart in background add the `--fork` parameter, like this:

```bash
$ java -jar restheart.jar --fork etc/restheart.yml -e etc/default.properties
```

In this case to see the logs you first need to enable file logging and set an absolute path to a log file. For example, check that `/usr/local/var/log/restheart.log` is writeable and then edit `etc/default.properties` like this:

```properties
enable-log-file = true
log-file-path = /usr/local/var/log/restheart.log
```