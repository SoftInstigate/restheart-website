---
title: Request Hooks
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [The <em>hooks</em> collection metadata](#the-hooks-collection-metadata)
* [How to develop an Hook](#how-to-develop-an-hook)
* [How to declare an Hook in the configuration file](#how-to-declare-an-hook-in-the-configuration-file)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content pt-0">

{% include docs-head.html %}


## Introduction

Request Hooks allow to execute custom code after a request completes.

For example, request hooks can be used:

-   to send a confirmation email when a user registers 
-   to send push notifications when a resource is updated so that its
    properties satisfy a given condition.

## The *hooks* collection metadata

In RESTHeart, not only documents but also dbs and collections
(and files buckets, schema stores, etc.) have properties.
Some properties are metadata, i.e. have a special meaning
for RESTheart that controls its behavior.

The collection metadata property `hooks` allows to declare the hooks to
be applied to the requests involving the collection and its documents.

`hooks` is an array of objects with the following format:

``` json
{ "name": <hook_name>, "args": <arguments> }
```
<div class="table-responsive">
<table class="ts">
<thead>
<tr class="header">
<th><div>
Property
</div></th>
<th><div>
Description
</div></th>
<th><div>
Mandatory
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>name</code></td>
<td><p>name of the hook as defined in the configuration file.</p></td>
<td>Yes</td>
</tr>
<tr class="even">
<td><code>args</code></td>
<td>arguments to be passed to the hook.</td>
<td>No</td>
</tr>
</tbody>
</table>
</div>
## How to develop an Hook

Request Hooks are implemented in java and declared in the RESTHeart
configuration file; once the are configured, they can be bound to
collections via the `hooks` collection metadata.

Of course, the class(es) that implements the Hook must be added to the java
classpath. See (How to package custom code)[/docs/v3/custom-code-packaging-howto] for more information.

For example, if the hook is packaged in the *myhook.jar* file, start
RESTHeart with the following command:

``` bash
$ java -server -classpath restheart.jar:myhook.jar org.restheart.Bootstrapper restheart.yml
```

Hooks are developed implementing the java
interface [org.restheart.metadata.hooks.Hook](https://github.com/SoftInstigate/restheart/tree/master/core/src/main/java/org/restheart/metadata/hooks/Hook.java).

To add a dependency on RESTHeart using Maven, use the following:

``` xml
<dependency>
    <groupId>org.restheart</groupId>
    <artifactId>restheart</artifactId>
    <version>3.0.2</version>
</dependency>
```

The Hook interface requires to implement the following interface:


``` java
public interface Hook {
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

The method `doesSupportRequests()` determines if the `hook()` method
should be against the `RequestContext` object that
encapsulates all information about the request.

For instance, the following implementation returns `true` if the request
actually *created* a document (either POSTing the collection or PUTing
the document):

``` java
@Override
public boolean doesSupportRequests(RequestContext rc) {
    if (rc.getDbOperationResult() == null) {
        return false;
    }

    int status = rc.getDbOperationResult().getHttpCode();

    return (status == HttpStatus.SC_CREATED
            && (rc.isCollection() && rc.isPost()
            || rc.isDocument()  && rc.isPut());
}
```

Note the following useful `RequestContext` getters:
<div class="table-responsive">
<table class="ts">
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
</div>
The `hook()` method is where the custom logic is defined.

It has four arguments:

-   the `HttpServerExchange` and the `RequestContext` that give information
    about the request
-   the optional json `args` object specified in the hook collection
    metadata.
-   the optional json `confArgs` object specified in the definition of the hook in the configuration file

## How to declare an Hook in the configuration file

The metadata-named-singletons section of the configuration file defines,
among others, the *hooks* group: here hook implementation classes can be
given names that can be used in the _hooks_ collection metadata property.

The following is the default hooks configuration that declares the
example [snooper
hook](https://github.com/SoftInstigate/restheart/blob/master/core/src/main/java/org/restheart/metadata/hooks/SnooperHook.java)(that
just logs resource status before and after request db operation
execution).

``` yml
metadata-named-singletons:
    - group: hooks
      interface: org.restheart.metadata.hooks.Hook
      singletons:
        - name: snooper
          class: org.restheart.metadata.hooks.SnooperHook
```

</div>
