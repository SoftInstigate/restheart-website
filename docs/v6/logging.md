---
title: Documentation
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Default LogBack configuration](#default-logback-configuration)
-   [Logging preferences in restheart.yml](#logging-preferences-in-restheartyml)
-   [Specify a custom LogBack configuration](#specify-a-custom-logback-configuration)
    - [Custom LogBack with docker compose](#custom-logback-with-docker-compose)
-   [Example: print the full stack trace](#example-print-the-full-stack-trace)
-   [Example: enable logging from the MongoDB driver](#example-enable-logging-from-the-mongodb-driver)
-   [Example: log trace headers](#example-log-trace-headers)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

RESTHeart uses for logging the [LogBack](http://logback.qos.ch) implementation of [SLF4J](http://www.slf4j.org).

## Default LogBack configuration

restheart.jar embeds the following default `logback.xml` configuration.

**Note** the default configuration defines loggers only for `org.restheart` and `com.restheart` packages. If you are developing a plugin in a different package, you'll need to specify a custom configuration in order to get log messages from your classes.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <withJansi>true</withJansi>
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %highlight(%-5level) %logger{36} - %msg%n %throwable{short}</pattern>
        </encoder>
    </appender>

    <root level="ERROR">
        <appender-ref ref="STDOUT" />
    </root>

    <logger name="org.restheart" level="INFO"/>
    <logger name="com.restheart" level="INFO"/>
</configuration>

```

## Logging preferences in restheart.yml

The configuration file `restheart.yml` allows to modify the log level and other logging options.

```yml
#### Logging

# enable-log-console: true => log messages to the console (default value: true)
# enable-log-file: true => log messages to a file (default value: true)
# log-file-path: to specify the log file path (default value: restheart.log in system temporary directory)
# log-level: to set the log level. Value can be OFF, ERROR, WARN, INFO, DEBUG, TRACE and ALL. (default value is INFO)
# ansi-console: use Ansi console for logging. Default to 'true' if parameter missing, for backward compatibility
# requests-log-level: log the request-response. 0 => no log, 1 => light log, 2 => detailed dump
# requests-log-trace-headers: add the HTTP headers you want to be put on the MDC for logback. Use with %X{header-name} in logback.xml.
#                             Useful for tracing support in the logs. Leave empty to deactivate this feature.
# metrics-gathering-level: metrics gathering for which level? OFF => no gathering, ROOT => gathering at root level,
#                          DATABASE => at db level, COLLECTION => at collection level
# WARNING: use requests-log-level level 2 only for development purposes, it logs user credentials (Authorization and Auth-Token headers)


enable-log-file: false
log-file-path: ./restheart.log
enable-log-console: true
log-level: INFO
requests-log-level: 1
ansi-console: true
metrics-gathering-level: DATABASE
requests-log-trace-headers:
#  - x-b3-traceid      # vv Zipkin headers, see https://github.com/openzipkin/b3-propagation
#  - x-b3-spanid
#  - x-b3-parentspanid
#  - x-b3-sampled      # ^^
#  - uber-trace-id     # jaeger header, see https://www.jaegertracing.io/docs/client-libraries/#trace-span-identity
#  - traceparent       # vv opencensus.io headers, see https://github.com/w3c/distributed-tracing/blob/master/trace_context/HTTP_HEADER_FORMAT.md
#  - tracestate        # ^^
```

## Specify a custom LogBack configuration

To define a different logging configuration, set the property `logback.configurationFile`, as follows:

```bash
$ java -Dlogback.configurationFile=./logback.xml -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

### Custom LogBack with docker compose

To use a custom LogBack configuration when running RESTHeart with docker compose:

1. override the `entrypoint` to specify the `logback.configurationFile` JVM property
2. mount the custom `logback.xml` configuration file into the docker image using `volume`

Replace the `restheart` service definition in the [docker-compose.yml](https://github.com/SoftInstigate/restheart/blob/6.2.x/docker-compose.yml) with the following:

```yml
    restheart:
        image: softinstigate/restheart:latest
        container_name: restheart
        # override the entrypoint to specify the logback.configurationFile JVM property
        entrypoint: [ "java", "-Dfile.encoding=UTF-8", "-Dlogback.configurationFile=etc/logback.xml", "-server", "-jar", "restheart.jar", "etc/restheart.yml"]
        # mount the custom `logback.xml` configuration file
        volumes:
            - ./etc/logback.xml:/opt/restheart/etc/logback.xml:ro
        command: ["--envFile", "/opt/restheart/etc/default.properties"]
        environment:
            MONGO_URI: mongodb://restheart:R3ste4rt!@restheart-mongo
        depends_on:
            - mongodb
        networks:
            - restheart-backend
        ports:
            - "8080:8080"
```

## Example: print the full stack trace

The following `logback.xml` sets the log level to `TRACE` and replaces the pattern `%throwable{short}` (prints the first line of the stack trace) with `%throwable{full}` that prints the full stack trace

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <withJansi>true</withJansi>
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %highlight(%-5level) %logger{36} - %msg%n %throwable{full}</pattern>
        </encoder>
    </appender>

    <root level="ERROR">
        <appender-ref ref="STDOUT" />
    </root>

    <logger name="org.restheart" level="INFO"/>
    <logger name="com.restheart" level="INFO"/>
    <logger name="org.mongodb" level="ALL"/>
</configuration>
```

## Example: enable logging from the MongoDB driver

The following `logback.xml` adds `<logger name="org.mongodb" level="ALL"/>` to enable trace level logging from the MongoDB driver.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <withJansi>true</withJansi>
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %highlight(%-5level) %logger{36} - %msg%n %throwable{short}</pattern>
        </encoder>
    </appender>

    <root level="ERROR">
        <appender-ref ref="STDOUT" />
    </root>

    <logger name="org.restheart" level="INFO"/>
    <logger name="com.restheart" level="INFO"/>
    <logger name="org.mongodb" level="ALL"/>
</configuration>
```

## Example: log trace headers

Trace headers allow to trace a request context propagation across service boundaries. See for reference [b3-propagation](https://github.com/openzipkin/b3-propagation)

In `restheart.yml` configuration, enable `requests-log-trace-headers:`

```yml
requests-log-trace-headers:
    -x-b3-traceid
    -uber-trace-id
    -traceparent
```

The define a custom `logback.xml` with the following `pattern` (note that is includes `%X{x-b3-traceid}`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <withJansi>true</withJansi>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread / %X{x-b3-traceid}] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="ERROR">
        <appender-ref ref="STDOUT" />
    </root>

    <logger name="org.restheart" level="INFO"/>
    <logger name="com.restheart" level="INFO"/>
    <logger name="org.mongodb" level="ALL"/>
</configuration>
```



{: .bs-callout.bs-callout-info }
Watch [Logging](https://www.youtube.com/watch?v=dzggm7Wp2fU&t=1152s)

</div>
