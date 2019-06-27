---
layout: docs
title: Configuration File
---
<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Default configuration file](#Default-configuration-file)
- [Configuration options](#Configuration-options)
  - [Properties files](#Properties-files)
  - [Environment variables](#Environment-variables)
  - [Command line parameters](#Command-line-parameters)
    
</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress.html %}

## Default configuration file ##

The default configuration file is [available here](https://github.com/SoftInstigate/restheart/blob/master/etc/restheart.yml).

## Configuration options ##

### Properties files ###

It is possible to pass an optional [properties file](https://docs.oracle.com/javase/tutorial/essential/environment/properties.html) (following the Java Properties syntax) as a startup parameter, via a OS environment variable or via a Java property (which you can pass to the JVM with the "-D" command line parameter). This has proven to be very useful when RESTHeart is deployed in several environments and the configuration files are just slightly different among the environments. In the past was necessary to copy and paste any modification on all the yaml configuration files, but now you can have a single parametric yaml file, with a set of small, different properties files for each environment.

For example, the `dev.properties` file in `etc/` folder contains the following properties:

```properties
https-listener = true
https-host = localhost
https-port = 4443

http-listener = true
http-host = localhost
http-port = 8080

ajp-listener = true
ajp-host = localhost
ajp-port = 8009

instance-name = development

default-representation-format = STANDARD

mongo-uri = mongodb://127.0.0.1

# The MongoDb resource to bind to the root URI / 
# The format is /db[/coll[/docid]] or '*' to expose all dbs
root-mongo-resource = /restheart

log-level = DEBUG

query-time-limit = 0
aggregation-time-limit = 0

#suggested value: core*2
io-threads: 4
#suggested value: core*16
worker-threads: 16
```

The [`restheart.yml`](https://github.com/SoftInstigate/restheart/blob/master/etc/restheart.yml) file contains the above parameters, expressed with the "Mustache syntax" (triple curly braces to indicate parametric values). Have a look at the below fragment for an example:

{% highlight yaml%}
{% raw %}
instance-name: {{{instance-name}}}

https-listener: {{{https-listener}}}
https-host: {{{https-host}}}
https-port: {{{https-port}}}

http-listener: {{{http-listener}}}
http-host: {{{http-host}}}
http-port: {{{http-port}}}

ajp-listener: {{{ajp-listener}}}
ajp-host: {{{ajp-host}}}
ajp-port: {{{ajp-port}}}

default-representation-format: {{{default-representation-format}}}

mongo-uri: {{{mongo-uri}}}

idm:
  implementation-class: org.restheart.security.impl.SimpleFileIdentityManager
  conf-file: {{{idm.conf-file}}}
access-manager:
  implementation-class: org.restheart.security.impl.SimpleAccessManager
  conf-file: {{{access-manager.conf-file}}}

log-level: {{{log-level}}}

query-time-limit: {{{query-time-limit}}}

aggregation-time-limit: {{{aggregation-time-limit}}}
{% endraw %}
{% endhighlight %}

The implementation uses the [Mustache.java](https://github.com/spullara/mustache.java) library, which is a derivative of [mustache.js](http://mustache.github.io), to create parametric configurations for RESTHeart.

> __NOTE__: for security reasons RESTHeart by default binds only on `localhost`, so it won't be reacheable from external systems unless you edit the configuration. To accept connections from everywhere, you must set at least the http listener in the `etc/dev.properties` file to bind to `0.0.0.0` like this:

```
http-listener = 0.0.0.0
```

> Beware that you must stop and run RESTHeart again to reload a new configuration.

Of course, you can decide which values in `restheart.yml` you want to become parametric or you can just use a static file
 as before version 3.7, this new configuration with properties is fully optional. 

To start RESTHeart and provide it with a properties file pass the `--envfile` command line parameter:

```
java -Dfile.encoding=UTF-8 -server -jar target/restheart.jar etc/restheart.yml --envfile etc/dev.properties
```

Alternatively, pass the envfile path via `RESTHEART_ENVFILE` environment variable:

```bash
$ export RESTHEART_ENVFILE=etc/dev.properties
$ java -Dfile.encoding=UTF-8 -server -jar target/restheart.jar etc/restheart.yml
```

__Note__: starting with release 3.9 it's possible to pass also the main RESTHeart's configuration file via the `RESTHEART_CONFFILE` environment variable, for example:

```bash
$ export RESTHEART_CONFFILE=etc/restheart.yml
```

This approach allows to share one single configuration file among several environments. For example, one could create `dev.properties`, `test.properties` and `production.properties`, one for each environment, with one single common `restheart.yml` configuration file.

### Environment variables ###

RESTHeart `3.7.0` introduces also the possibility to override any **primitive type parameter** in `restheart.yml` with an environment variable. Primitive types are:

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
