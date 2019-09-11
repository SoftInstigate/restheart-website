---
layout: docs
title: Develop Core Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
    * [Registering](#registering)
    * [Configuration](#configuration)
    * [Packaging](#packaging)
* [Initializers](#initializers)
* [Services](#services)
* [Transformers](#transformers)
* [Checkers](#checkers)
* [Hooks](#hooks)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}

## Introduction 

This page provides detailed information on how to develop core plugins for the [RESTHeart Platform](https://restheart.org/get).

{: .bs-callout.bs-callout-info}
Core plugins are executed by `restheart-platform-core` service.

### Registering Plugins

Plugins must be registered to be available using the `@RegisterPlugin` annotation:

{: .black-code}
``` java
@RegisterPlugin(name = "foo", description = "a fantastic plugin")
public class FooPlugin implements Service {
    ...
}
```

Additional attributes of `@RegisterPlugin` annotation:

{: .table.table-responsive }
|attribute|description|default value|
|-|-|-|
|**priority**|defines execution order for Intializer (less is higher priority)|10|
|**uri**|sets the URI of a Service overwriting its default value specified with the `Service.defaultUri()` method.|*none*|
|**enabledByDefault**|`true` to enable the plugin. If `false` it can be enabled setting the plugin  configuration argument 'enabled'|true|

{: .bs-callout.bs-callout-info}
Until RESTHeart version 3.x, registering a plugin involved declaring it in the configuration file. Thanks to the `@RegisterPlugin` annotation, this is not needed anymore.

### Configuration

All Plugins accept the argument `confArgs`. Set `confArgs` defining an object in the yml configuration file with the same name of the plugin (as defined in its @RegisterPlugin annotation) under the `plugins-args` configuration section:

{: .black-code}
``` yml
#### Plugins configuration

plugins-args:
  logMessageInitializer:
    enabled: false
    message: Hello World!
    log-level: INFO
  addBodyToWriteResponsesInitializer:
    enabled: false
  pingService:
    uri: "/hello"
    msg: Hello World!
```

### Packaging

Plugins implementation classes must be added to the java classpath. 

A convenient method is packaging the classes in the `restheart-platform-core.jar` file as suggested in [Packaging Plugins](/docs/develop/packaging) section.

## Initializers

{: .bs-callout.bs-callout-success }
An initializer is a class with the method `init()` that is invoked at RESTHeart startup time.

It can be used to perform initialization logic. For instance, it can programmatically add _Transformers_ and _Checkers_ or initialize the db.

The Initializer class must implement the `org.restheart.plugins.Initializer` interface.

The `Initializer` interface:

{: .black-code}
``` java
public interface Initializer extends Plugin {
    /**
     * 
     * @param confArgs arguments optionally specified in the configuration file
     */
    void init(Map<String, Object> confArgs);
}
```

## Services

{: .bs-callout.bs-callout-success }
Services are a simple yet powerful way of implementing custom Web Services.

The Service implementation class must extend handler must extend the
abstract class `org.restheart.plugins.Service`

{: .black-code}
``` java
public abstract class Service extends PipedHttpHandler implements Plugin {
    /**
     * The configuration properties passed to this handler.
     */
    protected final Map<String, Object> confArgs;

    /**
     * Creates a new instance of the Service
     *
     * @param confArgs arguments optionally specified in the configuration file
     */
    public Service(Map<String, Object> confArgs) {
        super(new ResponseSenderHandler());
        this.confArgs = confArgs;
    }

    /**
     *
     * @return the default uri of the service, used if not specified in plugin
     * configuration
     */
    public String defaultUri() {
        return null;
    }

    /**
     * helper method to handle OPTIONS requests
     *
     * @param exchange
     * @param context
     * @throws Exception
     */
    protected void handleOptions(
            HttpServerExchange exchange,
            RequestContext context)
            throws Exception {
        exchange.getResponseHeaders()
                .put(HttpString.tryFromString("Access-Control-Allow-Methods"), "GET, PUT, POST, PATCH, DELETE, OPTIONS")
                .put(HttpString.tryFromString("Access-Control-Allow-Headers"), "Accept, Accept-Encoding, Authorization, Content-Length, Content-Type, Host, If-Match, Origin, X-Requested-With, User-Agent, No-Auth-Challenge");
        exchange.setStatusCode(HttpStatus.SC_OK);
        exchange.endExchange();
    }
}
```

It requires to override the method `handleRequest()` inherited from `PipedHttpHandler`.

{: .black-code}
``` java
public abstract void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception;
```

The two arguments of `handleRequest()` are:

1. [HttpServerExchange](https://github.com/undertow-io/undertow/blob/master/core/src/main/java/io/undertow/server/HttpServerExchange.java) the
    exchange
2. [RequestContext](https://github.com/SoftInstigate/restheart/blob/master/src/main/java/org/restheart/handlers/RequestContext.java) context
    (that is the suggested way to retrieve the information of the
    request such as the payload) 

The method `defaultUri()` can return a String such as `/foo` that is the URI when the service will be bound. The URI can also be specified in the plugin configuration, see [Plugin Configuration](#configuration)

### Constructor

The Service implementation class must have a constructor with `confArgs` argument; this is optionally set from the configuration file.

{: .black-code}
```java
public MyService(final Map<String, Object> args) {
}
```

### A complete example: pingService

The following is the code of the [PingService](https://github.com/SoftInstigate/restheart/blob/master/src/main/java/org/restheart/plugins/services/PingService.java) that implements a
simple ping service.

{: .black-code}
``` java
@RegisterPlugin(name = "pingService",
        description = "Ping service")
public class PingService extends Service {

    private final String msg;

    /**
     *
     * @param confArgs arguments optionally specified in the configuration file
     */
    public PingService(Map<String, Object> confArgs) {
        super(confArgs);

        this.msg =  confArgs != null  && confArgs.containsKey("msg") 
                ? (String) confArgs.get("msg") 
                : "ping";
    }
    
    @Override
    public String defaultUri() {
        return "/ping";
    }

    /**
     *
     * @param exchange
     * @param context
     * @throws Exception
     */
    @Override
    public void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception {
        if (context.isOptions()) {
            handleOptions(exchange, context);
        } else if (context.isGet()) {
            context.setResponseContent(new BsonDocument("msg",
                    new BsonString(msg)));
            context.setResponseStatusCode(HttpStatus.SC_OK);
        } else {
            context.setResponseStatusCode(HttpStatus.SC_NOT_IMPLEMENTED);
        }
        
        next(exchange, context);
    }
}
```

**pingService Configuration** (to set the `msg` argument)

{: .black-code}
``` yml
plugins-args:
  pingService:
    msg: Hello World!
```

## Transformers

{:.alert.alert-warning}
work in progress

Transformers allow to transform the request or the response. 
For instance, a Transformer can be used to:
- filtering out from the response the *password* property of the `/db/users` resource
- adding the `filter={"visibility":"public"}` query parameter to requests limiting the client visibility on documents.

For implementation examples refer to the package [org.restheart.plugins.transformers](https://github.com/SoftInstigate/restheart/tree/master/src/main/java/org/restheart/plugins/transformers)

## Checkers

{:.alert.alert-warning}
work in progress

Checkers allows to check the request so that, if
it does not fulfill some conditions, it returns *400 BAD REQUEST*
response code thus enforcing a well defined structure to documents.

For implementation examples refer to the package [org.restheart.plugins.checkers](https://github.com/SoftInstigate/restheart/tree/master/src/main/java/org/restheart/plugins/checkers)

## Hooks

{:.alert.alert-warning}
work in progress

Request Hooks allow to execute custom code after a request completes.

For example, request hooks can be used:

-   to send a confirmation email when a user registers 
-   to send push notifications when a resource is updated so that its
    properties satisfy a given condition.

For implementation examples refer to the package [org.restheart.plugins.hooks](https://github.com/SoftInstigate/restheart/tree/master/src/main/java/org/restheart/plugins/hooks)