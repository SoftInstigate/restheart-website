---
layout: docs
title: Configuration
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Configuration files](#configuration-files)
-   [Updating configuration in Docker containers](#updating-configuration-in-docker-containers)
-   [Important configuration options](#important-configuration-options)

-   [Parametric configuration](#parametric-configuration)
    -   [Environment variables](#environment-variables)
    -   [Command line parameters](#command-line-parameters)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Configuration files

{: .bs-callout.bs-callout-info}
Specifying the configuration files is optional; without them the processes run with the default configuration.

`restheart-platform-core` and `restheart-platform-security` are configured via configuration and properties files. Configuration files can be parametric and merged with a set of properties to get the final values.

```bash
$ java -jar restheart-platform-core.jar <configuration-file> -e <properties-file>
$ java -jar restheart-platform-security.jar <configuration-file> -e <properties-file>
```

{: .bs-callout.bs-callout-warning }
**Note**: properties files for `restheart-platform-security` are available starting from Platform release 4.1.

It's also possible to pass both the `restheart-platform-core`'s environment properties and configuration file respectively via the `RESTHEART_ENVFILE` and `RESTHEART_CONFFILE` environment variables or Java properties, for example:

```bash
$ export RESTHEART_ENVFILE=etc/restheart-platform-core.yml
$ export RESTHEART_CONFFILE=etc/core.properties
```

For RESTHeart Security use the equivalent `RESTHEART_SECURITY_CONFFILE` environment variable or Java property.

The RESTHeart Platform the configuration files are under the `etc/` folder.

**Core configuration**

{: .table.table-responsive }
|file|description|
|-|-|
|`etc/restheart-platform-core.yml`|parametric configuration file|
|`etc/core.properties`|default parameters values|
|`etc/core-standalone.properties`|run restheart-platform-core without restheart-platform-security|
|`etc/core-bwcv3.properties`|run restheart-platform-core in backward compatibility mode|
|`etc/core-docker.properties`|used by the Docker container|

**Security configuration**

{: .table.table-responsive }
|file|description|
|-|-|
|`etc/restheart-platform-security.yml`|parametric configuration file|
|`etc/security.properties`|default parameters values|
|`etc/security-docker.properties`|used by the Docker container|

{: .bs-callout.bs-callout-info}
The configuration files are documented in details with inline comments.

{: .bs-callout.bs-callout-info}
Be aware that before 4.1.10 the properties files have a slightly different names (e.g. `etc/core-bwcv3.properties` was called `etc/bwcv3.properties`).

## Updating configuration in Docker containers

The configuration files used by the Docker containers are:

-   `etc/restheart-platform-core.yml`
-   `etc/restheart-platform-security.yml`

The properties files used by the Docker containers are:

-   `etc/core-docker.properties`
-   `etc/security-docker.properties`

**Important** if a configuration or property file is modified, the containers must be rebuilt for changes to take effect:

```bash
$ docker-compose up --build
```

## Important configuration options

The following tables highlights the most important configuration options.

### Core

All the important configuration options of `resthart-platform-core` are defined in the properties file.

{: .table.table-responsive }
|property|default|description|
|-|-|-|-|
|_Listeners section_|ajp at `localhost:8009`|listeners allow to specify the protocol, ip, port and to use|
|instance-name|default|name of this instance of `resthart-platform-core`|
|default-representation-format|STANDARD|[representation format](/docs/representation-format) to use in case the `rep` query parameters is not specified|
|mongo-uri|mongodb://127.0.0.1|the <a href="https://docs.mongodb.com/manual/reference/connection-string/" target="_blank">MongoDB connection string</a>|
|root-mongo-resource|/restheart|MongoDB resource to bind to the root URI `/`|
|log-level|DEBUG|log level|
|query-time-limit|0 (no limit)|kill request with slow queries|
|aggregation-time-limit|0 (no limit)|kill slow aggregations requests|
|io-threads|4|number of io thread, suggested value: core*2|
|worker-threads|16|number of worker threads, suggested value: core*16|

{: .bs-callout.bs-callout-warning }
For security reasons RESTHeart by default binds only on `localhost`, so it won't be reachable from external systems unless you edit the configuration. To accept connections from everywhere, you must set the listeners host to `0.0.0.0`.

### Security

{: .table.table-responsive }
|section|default value|description|
|-|-|-|-|
|Listeners|https at `0.0.0.0:4443` and http at `0.0.0.0:8080` value|Listeners allow to specify the protocol, ip, port and to use|
|Proxied resources|`ajp://127.0.0.1:8009`|The URL of `restheart-platform-core` and of any other proxied resource|
|SSL Configuration|Use the **insecure** test self-signed certificate|Allow configuring the certificate to be used by the https listener|

## Parametric configuration

{: .bs-callout.bs-callout-info }
Until version 4.0, only `restheart-platform-core.yml` can make use of parameters. This feature has also been extended to `restheart-platform-security.yml` starting from version 4.1.

It is possible to pass an optional [properties file](https://docs.oracle.com/javase/tutorial/essential/environment/properties.html) (following the Java Properties syntax) as a startup parameter, via a OS environment variable or via a Java property (which you can pass to the JVM with the "-D" command line parameter).

This has proven to be very useful when RESTHeart is deployed in several environments and the configuration files are just slightly different among the environments. In the past was necessary to copy and paste any modification on all the YAML configuration files, but now you can have a single parametric YAML file, with a set of small, different properties files for each environment.

For example, the `core.properties` file in `etc/` folder contains the following properties:

```properties
## RESTHeart Configuration - development properties.
# Documentation: https://restheart.org/docs/configuration

https-listener = false
https-host = localhost
https-port = 4443

http-listener = true
http-host = localhost
http-port = 8081

ajp-listener = true
ajp-host = localhost
ajp-port = 8009

instance-name = default
instance-base-url = http://localhost:8080

default-representation-format = STANDARD

mongo-uri = mongodb://127.0.0.1

# The MongoDB resource to bind to the root URI /
# The format is /db[/coll[/docid]] or '*' to expose all dbs
root-mongo-resource = /restheart

enable-log-console: true
log-level = INFO
enable-log-file: false
# with --fork use an absoulte path of a writable file
log-file-path: /var/log/restheart-platform-core.log

query-time-limit = 0
aggregation-time-limit = 0

#suggested value: core*2
io-threads: 4
#suggested value: core*16
worker-threads: 32
```

The [restheart-platform-core.yml](https://gist.github.com/ujibang/d6256c8fcc3f67240e053b2bcc89c4d4) file contains the above parameters, expressed with the "Mustache syntax" (triple curly braces to indicate parametric values). Have a look at the below fragment for an example:

```properties
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
{% endraw %}
```

{: .bs-callout.bs-callout-info}
Beware that you must stop and run RESTHeart again to reload a new configuration.

Of course, you can decide which values in ``restheart-platform-core.yml` you want to become parametric or you can just use a static file.

To start RESTHeart and provide it with a properties file pass the `--envfile` command line parameter:

```bash
$ java -jar restheart-platform-core.jar etc/restheart-platform-core.yml --envfile etc/core.properties
```

Alternatively, pass the envfile path via `RESTHEART_ENVFILE` environment variable:

```bash
$ export RESTHEART_ENVFILE=etc/core.properties
$ java -jar restheart-platform-core.jar etc/restheart-platform-core.yml
```

This approach allows to share one single configuration file among several environments. For example, one could create `core-dev.properties`, `core-test.properties` and `core-production.properties`, one for each environment, with one single common `restheart-platform-core.yml` configuration file.

### Environment variables

Is is possible to override any **primitive type parameter** in `restheart-platform-core.yml` with an environment variable. Primitive types are:

-   String
-   Integer
-   Long
-   Boolean

For example, the parameter `mongo-uri` in the YAML file can be overridden by exporting a `MONGO_URI` environment variable:

```bash
$ export MONGO_URI="mongodb://127.0.0.1"
```

The following log entry appears at the very beginning of logs during the startup process:

```
[main] WARN  org.restheart.Configuration - >>> Overriding parameter 'mongo-uri' with environment value 'MONGO_URI=mongodb://127.0.0.1'
```

A shell environment variable is equivalent to a YAML parameter in `restheart-platform-core.yml`, but it's all uppercase and `'-'` (dash) are replaced with `'_'` (underscore).

**Remember**: _environment variables replacement doesn't work with YAML structured data in configuration files, like arrays or maps. You must use properties files and mustache syntax for that._

### Command line parameters

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
