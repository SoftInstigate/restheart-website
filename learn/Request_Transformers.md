---
layout: docs
title: Request Transformers
---

* [Introduction](#introduction)
* [The <em>rts</em> collection metadata](#thertscollection-metadata)
* [Available and Custom Transformers](#available-and-custom-transformers)
* [Inject properties with addRequestProperties transformer](#inject-properties-withaddrequestproperties-transformer)
* [Filter out properties with <em>filterProperties</em> transformer](#filter-out-properties-withfilterproperties-transformer)
* [Custom Transformers](#custom-transformers)

## Introduction

Transformers allow to change the json document representing the resource
state, for instance adding, modifying or filtering out some properties.

Resources data flows in and out of RESTHeart in HAL+json format (see
[Representation Format](Representation_Format) section), where the state
is represented as a json document.

A transformer can be applied either in the REQUEST or RESPONSE phases:

-   Applying it in the REQUEST phase makes sense only for PUT, POST and
    PATCH requests (when data is sent from the client). In these cases,
    the incoming data is first transformed and then stored in MongoDB
-   Applying it in the RESPONSE phase, makes sense only for GET requests
    (when data is sent back to clients). The data is first retrieved
    from MongoDB, than transformed and passed back to the client.

## The *rts* collection metadata

In RESTHeart, not only documents but also dbs and collections have
properties. Some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

The metadata property *rts* allows to declare a transformer. The
transformer can apply either to the resource itself or its children (for
instance, a transformer declared to a collection resource, can be
applied to the collection resource itself or to its documents) and to
requests or responses.

The metadata property *rts* is an array of *transformer* objects. A
*transformer* object has the following format:

``` js
{"name":<name>, "phase":<phase>, "scope":<scope>, "args":<args>}
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
<td><p><code>name</code></p></td>
<td><p>The name of the transformer to apply.</p></td>
<td>Yes</td>
</tr>
<tr class="even">
<td><strong><code>phase</code><br />
</strong></td>
<td><p>Defines if the transformer is to be applied to the request or to the response</p>
<p>Valid values are &quot;REQUEST&quot; or &quot;RESPONSE&quot;.</p></td>
<td>Yes</td>
</tr>
<tr class="odd">
<td><strong>scope</strong></td>
<td><p>The scope applies to RESPONSE transformers; with SCOPE=&quot;THIS&quot; transformer is executed once on the whole response, with SCOPE=&quot;children&quot; it is executed once per each children resource.</p>
<p>For instance, with scope=&quot;THIS&quot;</p>
<pre><code>GET /db/coll is executed once</code></pre>
<pre><code>GET /db/coll/docid is executed once</code></pre>
<p>with scope=&quot;CHILDREN&quot;</p>
<pre><code>GET /db/coll is executed once per each embedded document</code></pre>
<pre><code>GET /db/coll/docid is executed once</code></pre></td>
<td>Yes</td>
</tr>
<tr class="even">
<td><code>args</code></td>
<td>arguments to be passed to the transformer.</td>
<td>No</td>
</tr>
</tbody>
</table>

## Available and Custom Transformers

RESTHeart comes with 4 ready-to-be-used transformers:

-   [addRequestProperties](#RequestTransformers-addRequestProperties) to
    add properties.
-   [filterProperties](#RequestTransformers-filterProperties) to filter
    out properties.
-   stringsToOids and oidsToStrings to convert strings to ObjectIds and
    vice versa (usually from requests and responses the respectively).

[Custom transformers](#RequestTransformers-customTransformers) can also
be implemented.

## Inject properties with addRequestProperties transformer

*addRequestProperties* is a transformer shipped with RESTHeart that
allows to add some properties to the resource state.

The properties are specified via the *args* property of the transformer
object. It is mainly intended to be applied to REQUESTs.

These properties are injected server side. If we need to store some
information (such as the username) and we cannot rely on the client,
this transformer is the solution.

An example is a blog application where each post document has the
*author* property. This property could be valued server side via this
transformer to avoid users to publish posts under a fake identity.

The properties that can be added are:

-   userName
-   userRoles
-   dateTime
-   localIp
-   localPort
-   localServerName
-   queryString
-   relativePath
-   remoteIp
-   requestMethod
-   requestProtocol

For instance, the following request creates the
collection *rtsexample *with this transformer applying to documents in
the REQUEST phase. Looking at the *args* argument we can figure out that
the request json data will be transformed adding the *log* object with
the username of authenticated user and its remote ip.

``` bash
$ http -a a:a PUT 127.0.0.1:8080/test/rtsexample rts:='[{"name":"addRequestProperties","phase":"REQUEST","scope":"CHILDREN","args":{"log": ["userName","remoteIp"]}}]'
```

If we now create a document, we can see the *log* property stored in the
document because it was injected by RESTHeart in the request data.

``` bash
$ http -a a:a PUT 127.0.0.1:8080/test/rts/mydoc a:=1
HTTP/1.1 201 Created
...
 
$ http -a a:a GET 127.0.0.1:8080/test/rts/mydoc
HTTP/1.1 200 OK
...
{
    "_id": "mydoc", 
    "a": 1, 
    "log": {
        "remoteIp": "127.0.0.1", 
        "userName": "a"
    },
    ...
}
```

## Filter out properties with *filterProperties* transformer

*filterProperties* is a transformer shipped with RESTHeart that allows
to filter out a the properties specified via the *args* property of the
transformer metadata object.

The usual application of this transformer is hiding sensitive data to
clients.

In [Security](Security) section, the *DbIdentityManager* is described.
It allows to authenticate users defined in a mongodb collection
that must have the following fields: \_id as the userid, password
(string) and roles (an array of strings).

Let's say that the user collection is called *userbase*; we can remove
the password to be sent back to clients with the following
filterProperties transformer.

``` bash
$ http -a a:a PUT 127.0.0.1:8080/test/userbase rts:='[{"name":"filterProperties", "phase":"RESPONSE", "scope":"CHILDREN", "args":["password"]}]'
```

## Custom Transformers

A transformer is a java class that implements the
interface [org.restheart.hal.metadata.singletons.Transformer](https://github.com/SoftInstigate/restheart/blob/develop/src/main/java/org/restheart/hal/metadata/singletons/Transformer.java).

It requires to implement the method tranform() with 4 arguments:

1.  [HttpServerExchange](https://github.com/undertow-io/undertow/blob/master/core/src/main/java/io/undertow/server/HttpServerExchange.java) exachange
2.  [RequestContext](https://github.com/SoftInstigate/restheart/blob/develop/src/main/java/org/restheart/handlers/RequestContext.java) context
    (that is the suggested way to retrieve the information of the
    request such as the payload) 
3.  DBObject contentToTransform (the json document to transform)
4.  DBObject args (that is the arguments passed via the *args* property
    of the transformer metadata object).

 

``` java
public interface Transformer {
    void tranform(final HttpServerExchange exchange, final RequestContext context, DBObject contentToTransform, final DBObject args);
}
```

Once a transformer has been implemented, it can be given a name (to be
used as the *name *property of the transformer metadata object) in the
configuration file.

The following is the default configuration file section declaring the
off-the-shelf transformers provided with RESTHeart plus custom one.

``` plain
- group: transformers
      interface: org.restheart.hal.metadata.singletons.Transformer
      singletons:
        - name: addRequestProperties
          class: org.restheart.hal.metadata.singletons.RequestPropsInjecterTransformer
        - name: filterProperties
          class: org.restheart.hal.metadata.singletons.FilterTransformer
        - name: stringsToOids
          class: org.restheart.hal.metadata.singletons.ValidOidsStringsAsOidsTransformer
        - name: oidsToStrings
          class: com.whatever.MyTransformer
        - name: myTransformer
```

Or course, the class of the custom transformer must be added to the java
classpath.

For example, RESTHeart could be started with the following command:

 

    $ java -server -classpath restheart.jar:custom-transformer.jar org.restheart.Bootstrapper restheart.yml

The following code, is an example transformer that adds to the content
the property *timestamp*.

``` java
import org.restheart.hal.metadata.singletons.Transformer;
import io.undertow.server.HttpServerExchange;
import org.restheart.handlers.RequestContext;
import com.mongodb.DBObject;
 
package com.whatever;
 
public class MyTransformer implements Transformer {
    tranform(final HttpServerExchange exchange, final RequestContext context, DBObject contentToTransform, final DBObject args) {
        contentToTransform.put("_timestamp", System.currentTimeMillis());
    }
}
```
