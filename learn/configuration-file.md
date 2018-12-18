---
layout: docs
title: Configuration File
---
<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [title: Configuration File](#title-configuration-file)
- [Sample configuration file](#sample-configuration-file)
- [Configuration options](#configuration-options)
  - [Properties files](#properties-files)
  - [Environment variables](#environment-variables)
  - [Command line parameters](#command-line-parameters)
    
</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Sample configuration file ##

An example of a complete configuration file is [available here](https://github.com/SoftInstigate/restheart/blob/master/etc/restheart.yml).

## Configuration options ##

### Properties files ###

Starting from RESTHeart `3.6.0` it is possibile to pass an optional [properties file](https://docs.oracle.com/javase/tutorial/essential/environment/properties.html) as a startup parameter or via a environment variable:

For example, the `dev.properties` file in `etc/` folder contains a single property:

```properties
mongouri = mongodb://127.0.0.1
```

The [`restheart-dev.yml`](https://github.com/SoftInstigate/restheart/blob/master/etc/restheart-dev.yml) contains a  `mongouri ` parameter, expressed with the following syntax:

```yaml
mongo-uri: {{mongouri}}
```
The implementation uses the [Mustache.java](https://github.com/spullara/mustache.java) library, which is a derivative of [mustache.js](http://mustache.github.io), to create parametric configurations for RESTHeart.

To start RESTHeart with a properties file use the `--envfile` command line parameter:

```
java -Dfile.encoding=UTF-8 -server -jar target/restheart.jar etc/restheart-dev.yml --envfile etc/dev.properties
```

Alternatively, pass the envfile path via `RESTHEART_ENVFILE` environment variable:

```bash
$ export RESTHEART_ENVFILE=etc/dev.properties
$ java -Dfile.encoding=UTF-8 -server -jar target/restheart.jar etc/restheart-dev.yml
```

This approach allows to share one single configuration file among several environments. For example, one could create `dev.properties`, `test.properties` and `production.properties`, one for each environment, with one single common `restheart.yml` configuration file.

### Environment variables ###

RESTHeart `3.6.0` introduces also the possibility to override any **primitive type parameter** in `restheart.yml` with an environment variable. Primitive types are:

 - String
 - Integer
 - Long
 - Boolean
  
 For example, the parameter `mongo-uri` in the yaml file can be overridden by exporting a `MONGO_URI` environment variable:

```bash
$ export MONGO_URI="mongodb://127.0.0.1"
```

The following log entry appears at the very beginning of logs during the startup process:

```bash
[main] WARN  org.restheart.Configuration - >>> Overriding parameter 'mongo-uri' with environment value 'MONGO_URI=mongodb://127.0.0.1'
```

A shell environment variable is equivalent to a yaml parameter in `restheart.yml`, but it's all uppercase and `'-'` (dash) are replaced with `'_'` (underscore).

__Remember__: _environment variables replacement doesn't work with YAML structured data in configuration files, like arrays or maps. You must use properties files and mustache syntax for that._

### Command line parameters ###

To know the available CLI parameters, run RESTHeart with `--help`:

```bash
$ java -jar target/restheart.jar --help
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

</div>