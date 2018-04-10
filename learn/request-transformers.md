---
layout: docs
title: Request Transformers
---

* [Introduction](#introduction)
* [The <em>rts</em> collection metadata](#thertscollection-metadata)
* [Available and Custom Transformers](#available-and-custom-transformers)
* [Inject properties with add RequestProperties transformer](#inject-properties-withaddrequestproperties-transformer)
* [Filter out properties with <em>filterProperties</em> transformer](#filter-out-properties-withfilterproperties-transformer)
* [Custom Transformers](#custom-transformers)

## Introduction

Transformers allow to change the request or the response, for instance adding, modifying or filtering out some properties in the body.
A Transformer can also be used to modify the request in other ways such as adding a query parameter. An example would be adding the `filter={"visibility":"public"}` query parameter to the request `GET /db/coll` in order to limit the client visibility on the collection documents.

Resources data flows in and out of RESTHeart in json format (see
[Representation Format](/learn/representation-format) section), where the state
is represented as a json document.

## The *rts* collection metadata

In RESTHeart, not only documents but also dbs and collections have
properties. Some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

The metadata property *rts* allows to declare transformers; *rts* 
is an array of *transformer* objects. 
A *transformer* object has the following format:

``` json
{"name":<name>, "phase":<phase>, "scope":<scope>, "args":<args>}
```

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
<td><p>The name of the transformer to apply.</p></td>
<td>Yes</td>
</tr>
<tr class="even">
<td><code>phase</code></td>
<td><p>Defines if the transformer is to be applied to the request or to the response</p>
    <p>Valid values are <code>REQUEST</code> or <code>RESPONSE</code></p></td>
<td>Yes</td>
</tr>
<tr class="odd">
<td><code>scope</code></td>
<td>
<p>The scope applies only to RESPONSE transformers; with <code>"scope": "THIS"</code> the transformer is executed once on the whole response, with <code>"scope":"CHILDREN"</code> it is executed once per embedded document.</p>
</td>
<td>When <code>"phase": "RESPONSE"</code></td>
</tr>
<tr class="even">
<td><code>args</code></td>
<td>arguments to be passed to the transformer.</td>
<td>No</td>
</tr>
</tbody>
</table>

## Available and Custom Transformers

RESTHeart comes with some ready-to-be-used transformers:

-   [addRequestProperties](#inject-properties-withaddrequestproperties-transformer) to
    add properties.
-   [filterProperties](#filter-out-properties-withfilterproperties-transformer) to filter
    out properties.
-   __stringsToOids__ and __oidsToStrings__ to convert strings to ObjectIds and
    vice versa (usually from requests and responses the respectively).
-   __writeResult__ that uses `context.getDbOperationResult()` to add to the response body the old and the new version of the modified document on write requests
-   __hashProperties__ that allows to hash properties using bcrypt on write requests

[Custom transformers](#custom-transformers) can also
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

In [Security](/learn/security) section, the *DbIdentityManager* is described.
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
interface [org.restheart.metadata.transformers.Transformer](https://github.com/SoftInstigate/restheart/blob/develop/src/main/java/org/restheart/metadata/transformers/Transformer.java).

It requires to implement the method tranform() with 5 arguments:

1.  [HttpServerExchange](https://github.com/undertow-io/undertow/blob/master/core/src/main/java/io/undertow/server/HttpServerExchange.java) exachange
2.  [RequestContext](https://github.com/SoftInstigate/restheart/blob/develop/src/main/java/org/restheart/handlers/RequestContext.java) context
    (that is the suggested way to retrieve the information of the
    request such as the payload) 
3.  BsonValue contentToTransform (the json document to transform)
4.  BsonValue args (the arguments passed via the *args* property
    of the transformer metadata object)
5.  BsonValue confArgs (the arguments passed via the *args* property
    specified in the configuration file)
 

``` java
    /**
     * 
     * @param exchange the server exchange
     * @param context the request context
     * @param contentToTransform the content data to transform
     * @param args the args sepcified in the collection metadata via args property
     * @param confArgs the args specified in the configuration file via args property
     * @return true if completed successfully
     */
    default void transform(
            HttpServerExchange exchange,
            RequestContext context,
            BsonValue contentToTransform,
            final BsonValue args,
            BsonValue confArgs)
}
```

Once a transformer has been implemented, it can be defined in the
configuration file.

The following is the default configuration file section declaring the
off-the-shelf transformers provided with RESTHeart plus custom one.

``` yml
    # transformers group used by handlers:
    # org.restheart.handlers.metadata.RequestTransformerMetadataHandler and
    # org.restheart.handlers.metadata.ResponseTransformerMetadataHandler
    # More information in transformers javadoc
    - group: transformers
      interface: org.restheart.metadata.transformers.Transformer
      singletons:
        - name: addRequestProperties
          class: org.restheart.metadata.transformers.RequestPropsInjecterTransformer
        - name: filterProperties
          class: org.restheart.metadata.transformers.FilterTransformer
        - name: stringsToOids
          class: org.restheart.metadata.transformers.ValidOidsStringsAsOidsTransformer
        - name: oidsToStrings
          class: org.restheart.metadata.transformers.OidsAsStringsTransformer
        - name: writeResult
          class: org.restheart.metadata.transformers.WriteResultTransformer
        - name: hashProperties
          class: org.restheart.metadata.transformers.HashTransformer
        - name: myTransformer
          class: com.whatever.MyTransformer
          args:
            msg: "foo bar"
                    
        
```

Or course, the class of the custom transformer must be added to the java
classpath.

For example, RESTHeart could be started with the following command:

``` bash
$ java -server -classpath restheart.jar:custom-transformer.jar org.restheart.Bootstrapper restheart.yml
```

The following code, is an example transformer that adds to the content
the property *timestamp*.

``` java
import org.restheart.metadata.transformers.Transformer;
import io.undertow.server.HttpServerExchange;
import org.restheart.handlers.RequestContext;
import com.mongodb.DBObject;

package com.whatever;

public class MyTransformer implements Transformer {
    tranform(final HttpServerExchange exchange, 
        final RequestContext context, 
        BsonValue contentToTransform, 
        final BsonValue args,
        BsonValue confArgs) {
        contentToTransform.put("msg", confArgs.get("msg"));
        contentToTransform.put("_timestamp", System.currentTimeMillis());
    }
}
```
