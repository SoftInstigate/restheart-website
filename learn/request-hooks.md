---
layout: docs
title: Request Hooks
---

* [Introduction](#introduction)
* [The <em>hooks</em> collection metadata](#the-hooks-collection-metadata)
* [How to develop an Hook](#how-to-develop-an-hook)
* [How to declare an Hook in the configuration file](#how-to-declare-an-hook-in-the-configuration-file)

## Introduction

Request Hooks allow to execute custom code after a request completes.

For example, request hooks can be used:

-   to send a confirmation email when a user registers 
-   to send push notifications when a resource is updated so that its
    properties satisfy a given condition.

Request Hooks are implemented in java and declared in the RESTHeart
configuration file; once they are ready, they can be bound to resources
via the `hooks` collection metadata.

The class(es) that implements the Hook must be added to the java
classpath.

For example, if the hook is packaged in the *myhook.jar* file, start
RESTHeart with the following command:

    $ java -server -classpath restheart.jar:myhook.jar org.restheart.Bootstrapper restheart.yml

Another option is packaging the classes with RESTHeart in a single jar
using the [maven shade
plugin](https://maven.apache.org/plugins/maven-shade-plugin/). For more
information refer to the [How to package custom
code](How_to_package_custom_code) section.

## The *hooks* collection metadata

With RESTHeart, not only documents but also dbs and collections have
properties. Some properties are *metadata*, i.e. they have a special
meaning for RESTheart that influences its behavior.

The collection metadata property `hooks` allows to declare the hooks to
be applied to the requests involving the collection and its documents.

`hooks` is an array of objects with the following format:

``` json
{ "hooks": [ 
    { "name": <hook_name>, "args": <arguments> }, 
    ...
   ]
}
```

<table>
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

## How to develop an Hook

Hooks are developed implementing the java
interface [org.restheart.hal.metadata.singletons.Hook](https://github.com/SoftInstigate/restheart/blob/master/src/main/java/org/restheart/hal/metadata/singletons/Hook.java).

To add a dependency on RESTHeart using Maven, use the following:

``` xml
<dependency>
    <groupId>org.restheart</groupId>
    <artifactId>restheart</artifactId>
    <version>3.0.2</version>
</dependency>
```

The Hook interface requires to implement two methods:

-   `doesSupportRequests(RequestContext context)`
-   `hook(HttpServerExchange exchange, RequestContext context, BsonValue args);`

The method `doesSupportRequests()` determines if the* *`hook()` method
should be executed checking the `RequestContext` object that
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
            && (rc.getType() == RequestContext.TYPE.COLLECTION && rc.getMethod() == POST
            || rc.getType() == RequestContext.TYPE.DOCUMENT && rc.getMethod() == PUT));
}
```

Note the following useful `RequestContext` getters:

<table>
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

The `hook()` method is where the custom logic is defined.

It has three arguments:

-   the HttpServerExchange and the RequestContext that give information
    about the request
-   the optional json args object specified in the hook collection
    metadata.

## How to declare an Hook in the configuration file

The metadata-named-singletons section of the configuration file defines,
among others, the *hooks* group: here hook implementation classes can be
bound to logical names that can be used in the hooks collection
metadata.

The following is the default hooks configuration that declares the
example [snooper
hook ](https://github.com/SoftInstigate/restheart/blob/master/src/main/java/org/restheart/metadata/hooks/SnooperHook.java)(that
just logs resource status before and after request db operation
execution).

``` text
metadata-named-singletons:
    - group: hooks
      interface: org.restheart.hal.metadata.singletons.Hook
      singletons:
        - name: snooper
          class: org.restheart.hal.metadata.singletons.SnooperHook
```
