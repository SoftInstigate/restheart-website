---
layout: docs
title: Develop Core Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
    -   [Registering](#registering)
    -   [Configuration](#configuration)
    -   [Packaging](#packaging)
-   [Initializers](#initializers)
-   [Services](#services)
-   [Transformers](#transformers)
-   [Checkers](#checkers)
-   [Hooks](#hooks)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress.html %}

## Introduction 

This page provides detailed information on how to develop core plugins for the [RESTHeart](https://restheart.org/get).

{: .bs-callout.bs-callout-info}
Core plugins are executed by `restheart-platform-core` service.

### Registering Plugins

Plugins must be registered to be available using the `@RegisterPlugin` annotation:

```java
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
|**uri**|sets the URI of a Service overwriting its default value specified with the `Service.defaultUri()` method.|_none_|
|**enabledByDefault**|`true` to enable the plugin. If `false` it can be enabled setting the plugin configuration argument 'enabled'|true|

{: .bs-callout.bs-callout-info}
Until RESTHeart version 3.x, registering a plugin involved declaring it in the configuration file. Thanks to the `@RegisterPlugin` annotation, this is not needed anymore.

### Configuration

All Plugins accept the argument `confArgs`. Set `confArgs` defining an object in the yml configuration file with the same name of the plugin (as defined in its @RegisterPlugin annotation) under the `plugins-args` configuration section:

```yml
#### Plugins configuration

plugins-args:
    logMessageInitializer:
        enabled: false
        message: Hello World!
        log-level: INFO
    addBodyToWriteResponsesInitializer:
        enabled: false
    pingService:
        uri: '/hello'
        msg: Hello World!
```

### Packaging

Plugins implementation classes must be added to the java classpath.

A convenient method is packaging the classes in the `restheart-platform-core.jar` file as suggested in [Packaging Plugins](/docs/v5/develop/packaging) section.

## Initializers

{: .bs-callout.bs-callout-success }
An initializer is a class with the method `init()` that is invoked at RESTHeart startup time.

It can be used to perform initialization logic. For instance, it can programmatically add _Transformers_ and _Checkers_ or initialize the db.

The Initializer class must implement the `org.restheart.plugins.Initializer` interface and use the `ResiterPlugin` annotation.

The `Initializer` interface:

```java
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

```java
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

```java
public abstract void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception;
```

The two arguments of `handleRequest()` are:

1. [HttpServerExchange](https://github.com/undertow-io/undertow/blob/master/core/src/main/java/io/undertow/server/HttpServerExchange.java) the
   exchange
2. [RequestContext](https://github.com/SoftInstigate/restheart/blob/master/core/src/main/java/org/restheart/handlers/RequestContext.java) context
   (that is the suggested way to retrieve the information of the
   request such as the payload)

The method `defaultUri()` can return a String such as `/foo` that is the URI when the service will be bound. The URI can also be specified in the plugin configuration, see [Plugin Configuration](#configuration)

### Constructor

The Service implementation class must have a constructor with `confArgs` argument; this is optionally set from the configuration file.

```java
public MyService(final Map<String, Object> args) {
}
```

### A complete example: pingService

The following is the code of the [PingService](https://github.com/SoftInstigate/restheart/blob/master/core/src/main/java/org/restheart/plugins/services/PingService.java) that implements a
simple ping service.

```java
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

```yml
plugins-args:
    pingService:
        msg: Hello World!
```

## Transformers

{: .bs-callout.bs-callout-info}
Transformers allow to transform the request or the response.

Examples of Transformers are:

-   filtering out from the response sensitive properties;
-   adding the `filter={"visibility":"public"}` query parameter to requests limiting the client visibility on documents.

{: .bs-callout.bs-callout-info}
For implementation examples refer to the package [org.restheart.plugins.transformers](https://github.com/SoftInstigate/restheart/tree/master/core/src/main/java/org/restheart/plugins/transformers)

A transformer is a java class that implements the
interface [org.restheart.plugins.Transformer](https://github.com/SoftInstigate/restheart/tree/master/core/src/main/java/org/restheart/plugins/Transformer.java).

```java
    /**
     * contentToTransform can be directly manipulated or
     * RequestContext.setResponseContent(BsonValue value) for response phase and
     * RequestContext.setContent(BsonValue value) for request phase can be used
     *
     * @param exchange the server exchange
     * @param context the request context
     * @param contentToTransform the content data to transform
     * @param args the args sepcified in the collection metadata via args
     * property property
     */
    void transform(
            final HttpServerExchange exchange,
            final RequestContext context,
            BsonValue contentToTransform,
            final BsonValue args);

    /**
     *
     * @param exchange the server exchange
     * @param context the request context
     * @param contentToTransform the content data to transform
     * @param args the args sepcified in the collection metadata via args
     * property
     * @param confArgs the args specified in the configuration file via args
     * property
     */
    default void transform(
            HttpServerExchange exchange,
            RequestContext context,
            BsonValue contentToTransform,
            final BsonValue args,
            BsonValue confArgs) {
        transform(exchange, context, contentToTransform, args);
    }
}
```

{: .bs-callout.bs-callout-info}
The default, 5 arguments, method `transform()` can be used to store the argument `confArgs` in a instance variable when the Transformer needs the arguments specified via the configuration file

The following code, is an example transformer that adds the property _\_timestamp_ to the response body.

```java
import io.undertow.server.HttpServerExchange;
import org.bson.BsonInt64;
import org.bson.BsonValue;
import org.restheart.handlers.RequestContext;
import org.restheart.plugins.Transformer;

package com.whatever;

@RegisterPlugin(name = "myTransformer",
        description = "Add _timestamp to the body")
public class MyTransformer implements Transformer {
    tranform(final HttpServerExchange exchange,
        final RequestContext context,
        BsonValue contentToTransform,
        final BsonValue args) {
          if (contentToTransform != null && contentToTransform.isDocument()){
            contentToTransform.asDocument().put("_timestamp",
                  new BsonInt64(System.currentTimeMillis()));
          }
    }
}
```

## Checkers

{: .bs-callout.bs-callout-info}
Checkers allows to check the request so that, if
it does not fulfill some conditions, it returns _400 BAD REQUEST_
response code thus enforcing a well defined structure to documents.

{: .bs-callout.bs-callout-info}
For implementation examples refer to the package [org.restheart.plugins.checkers](https://github.com/SoftInstigate/restheart/tree/master/core/src/main/java/org/restheart/plugins/checkers)

A checker is a java class that implements the
interface [org.restheart.plugins.Checker](https://github.com/SoftInstigate/restheart/tree/master/core/src/main/java/org/restheart/plugins/Checker.java).

```java
    public interface Checker extends Plugin {
    enum PHASE {
        BEFORE_WRITE,
        AFTER_WRITE // for optimistic checks, i.e. document is inserted and in case rolled back
    };

    /**
     *
     * @param exchange the server exchange
     * @param context the request context
     * @param contentToCheck the contet to check
     * @param args the args sepcified in the collection metadata via args
     * @return true if check completes successfully
     */
    boolean check(
            HttpServerExchange exchange,
            RequestContext context,
            BsonDocument contentToCheck,
            BsonValue args);

    /**
     *
     * @param exchange the server exchange
     * @param context the request context
     * @param args the args sepcified in the collection metadata via args property
     * @param confArgs the args specified in the configuration file via args property
     * @return true if check completes successfully
     */
    default boolean check(
            HttpServerExchange exchange,
            RequestContext context,
            BsonDocument contentToCheck,
            BsonValue args,
            BsonValue confArgs) {
        return check(exchange, context, contentToCheck, args);
    }

    /**
     * Specify when the checker should be performed: with BEFORE_WRITE the
     * checkers gets the request data (that may use the dot notation and update
     * operators); with AFTER_WRITE the data is optimistically written to the db
     * and rolled back eventually. Note that AFTER_WRITE helps checking data
     * with dot notation and update operators since the data to check is
     * retrieved normalized from the db.
     *
     * @param context
     * @return BEFORE_WRITE or AFTER_WRITE
     */
    PHASE getPhase(RequestContext context);

    /**
     *
     * @param context
     * @return true if the checker supports the requests
     */
    boolean doesSupportRequests(RequestContext context);
}
```

{: .bs-callout.bs-callout-info}
The default, 5 arguments, method `check()` can be used to store the argument `confArgs` in a instance variable when the Checker needs the arguments specified via the configuration file

If the checker cannot process the request, the method `doesSupportRequests()` should return false. This allows to skip executing the checker. The class `CheckersUtils` provides some helper method to check the type of the request, e.g `CheckersUtils.isBulkRequest()`.

When a checker does not support a request, the outcome depends on the attribute `skipNotSupported` of the checker definition (see [Apply a Checker via metadata](/docs/v5/plugins/apply/#apply-a-checker-via-metadata) and [Apply a Checker programmatically](/docs/v5/plugins/apply/#apply-a-checker-programmatically)); when `skipNotSupported=true`, it just skips the checker; otherwise the request is not processed further and BAD REQUEST is returned.

The following code, is an example checker that checks if the
*number* property in PATCH request body is between 0 and 10.

```java
package com.whatever;

@RegisterPlugin(
        name = "checkNumber",
        description = "Checks if number property is between 0 and 10 on PATCH requests")
public class MyChecker implements Checker {
    @Override
    boolean check(HttpServerExchange exchange, RequestContext context, BsonValue args) {
        // return true if request is not a PATCH or request body does not contain the property number
        if (context.getMethod() != RequestContext.METHOD.PATCH
                || context.getContent() == null
                || !context.getContent().isDocument()
                || !context.getContent().asDocument().containsKey("number")) {
            return true;
        }

        BsonValue _value = context.getContent().asDocument().get("number");

        if (_value != null && _value.isNumber()) {
            Integer value = _value.asInt32().getValue();

            return value < 10 && value > 0;
        } else {
            return false; // BAD REQUEST
        }
    }

    @Override
    public PHASE getPhase(RequestContext context) {
        return PHASE.BEFORE_WRITE;
    }

    @Override
    public boolean doesSupportRequests(RequestContext context) {
        return true;
    }
}
```

## Hooks

{: .bs-callout.bs-callout-info}
Request Hooks allow to execute custom code after a request completes.

For example, request hooks can be used:

-   to send a confirmation email when a user registers
-   to send push notifications when a resource is updated so that its
    properties satisfy a given condition.

{: .bs-callout.bs-callout-info}
For implementation examples refer to the package [org.restheart.plugins.hooks](https://github.com/SoftInstigate/restheart/tree/master/core/src/main/java/org/restheart/plugins/hooks)

Hooks are developed implementing the java
interface [org.restheart.plugins.Hook](https://github.com/SoftInstigate/restheart/tree/master/core/src/main/java/org/restheart/plugins/Hook.java).

The Hook interface requires to implement the following interface:

```java
public interface Hook extends Plugin {
    /**
     *
     * @param exchange the server exchange
     * @param context the request context
     * @param args the args sepcified in the collection metadata via args property
     * @return true if completed successfully
     */
    default boolean hook(
            HttpServerExchange exchange,
            RequestContext context,
            BsonValue args) {
        return hook(exchange, context, args, null);
    }


    /**
     *
     * @param exchange the server exchange
     * @param context the request context
     * @param args the args sepcified in the collection metadata via args property
     * @param confArgs args specified in the configuration file via args property
     * @return true if completed successfully
     */
    default boolean hook(
            HttpServerExchange exchange,
            RequestContext context,
            BsonValue args,
            BsonDocument confArgs) {
        return hook(exchange, context, args);
    }

    /**
     *
     * @param context
     * @return true if the hook supports the requests
     */
    boolean doesSupportRequests(RequestContext context);
}
```

{: .bs-callout.bs-callout-info}
The default, 4 arguments, method `hook()` can be used to store the argument `confArgs` in a instance variable when the Checker needs the arguments specified via the configuration file

The method `doesSupportRequests()` determines if the `hook()` method
should be executed against the `RequestContext` object that
encapsulates all information about the request.

For instance, the following implementation returns `true` if the request
actually _created_ a document (either POSTing the collection or PUTing
the document):

```java
@Override
public boolean doesSupportRequests(RequestContext rc) {
    if (rc.getDbOperationResult() == null) {
            return false;
        }

    int status = rc.getDbOperationResult().getHttpCode();

    return (status == HttpStatus.SC_CREATED
            && (rc.isCollection() && rc.isPost())
            || rc.isDocument() && rc.isPut());
}
```

Note the following useful `RequestContext` getters:

<table class="table table-responsive">
  <thead>
    <tr class="header">
      <th><br />
      </th>
      <th><br />
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="odd">
      <td>getDbOperationResult()</td>
      <td>returns the <code>OperationResult</code> object that encapsulates the information about the MongoDB operation, including the resource status (properties) <em>before</em> and <em>after</em> the request execution.</td>
    </tr>
    <tr class="even">
      <td>getType()</td>
      <td>returns the request resource type, e.g. DOCUMENT, COLLECTION, etc.</td>
      </tr>
      <tr class="odd">
      <td>getMethod()</td>
      <td>returns the request method, e.g. GET, PUT, POST, PATCH, DELETE, etc.</td>
    </tr>
  </tbody>
</table>
