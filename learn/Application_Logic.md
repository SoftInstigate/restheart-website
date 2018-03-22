---
layout: docs
title: Application Logic
---

* [Introduction](#introduction)
* [How to](#how-to)
* [Examples](#examples)
    * [PingHandler](#pinghandler)
    * [Aggregation query](#aggregation-query)

## Introduction

RESTHeart has a pipeline architecture where specialized [undertow
handlers](http://undertow.io/undertow-docs/undertow-docs-2.0.0/undertow-handler-guide.html) are
chained together to serve the requests.

In order to provide additional application logic, custom handlers can be
bound under the /\_logic URL.

## How to

The custom handler must extend the
class `org.restheart.handlers.applicationlogic.ApplicationLogicHandler.`

It requires to override the method handleRequest() with 2 arguments:

1.  [HttpServerExchange](https://github.com/undertow-io/undertow/blob/master/core/src/main/java/io/undertow/server/HttpServerExchange.java) the
    exachange
2.  [RequestContext](https://github.com/SoftInstigate/restheart/blob/master/src/main/java/org/restheart/handlers/RequestContext.java) context
    (that is the suggested way to retrieve the information of the
    request such as the payload) 

``` plain
public abstract void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception;
```

Once an handler has been implemented, it can be bound to an URI in the
configuration file.

The following is the default configuration file section declaring the
two handlers provided with RESTHeart, that configures 3 application
logic handlers:

-   **PingHandler** bound at /\_logic/ping:  a simple ping service
-   **GetRolehanlder** bound at /\_logic/roles that allows a client to
    check the password and in case retrieve the roles of the user.
    Example GET /\_logic/roles/&lt;username&gt;
-   **ChacheInvalidator** bound a /\_logic/ic that allows to invalidate
    a cache db or collection entry. Example POST
    /\_logic/ic?db=&lt;dbnam&gt;&coll=&lt;collname&gt;

``` plain
application-logic-mounts:
    - what: org.restheart.handlers.applicationlogic.PingHandler
      where: /ping
      secured: false
      args:
          msg: "ciao from the restheart team"
    - what: org.restheart.handlers.applicationlogic.GetRoleHandler
      where: /roles
      secured: false
      args:
          url: /_logic/roles
    - what: org.restheart.handlers.applicationlogic.CacheInvalidator
      where: /ic
      secured: true
```

The following table describes the configuration options:

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>property</th>
<th>description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>what</strong></td>
<td>the class implementing the handler</td>
</tr>
<tr class="even">
<td><strong>where</strong></td>
<td>the URI to bound under the context /_logic. for instance if where: /a/b/c then the URI is /_logic/a/b/c</td>
</tr>
<tr class="odd">
<td><strong>secured</strong></td>
<td>if true put the handler under the RESTHeart security context</td>
</tr>
<tr class="even">
<td><strong>args</strong></td>
<td><p>arguments that are passed to the custom handler. They can be accessed via the class field Map args.</p></td>
</tr>
</tbody>
</table>

## Examples

The class(es) that implements the custom ApplicationHandler must be
added to the java classpath.

For example, it can be packaged in the *custom-handler.jar* jar file and
start RESTHeart with the following command:

 

    $ java -server -classpath restheart.jar:custom-handler.jar org.restheart.Bootstrapper restheart.yml

### PingHandler

The following is the code of the simple PingHandler that implements a
simple ping service.

The constructor must have the arguments PipedHttpHandler next and
Map args. In this way, the latter is set from the args property of the
configuration file.

``` java
package org.restheart.handlers.applicationlogic;
import org.restheart.handlers.PipedHttpHandler;
import org.restheart.handlers.RequestContext;
import org.restheart.handlers.RequestContext.METHOD;
import org.restheart.utils.HttpStatus;
import org.restheart.utils.ResponseHelper;
import io.undertow.server.HttpServerExchange;
import java.util.Map;
/**
 *
 * @author Andrea Di Cesare <andrea@softinstigate.com>
 */
public class PingHandler extends ApplicationLogicHandler {
    private final String msg;
    /**
     *
     * @param next
     * @param args
     */
    public PingHandler(PipedHttpHandler next, Map<String, Object> args) {
        super(next, args);
        this.msg = (String) args.get("msg");
    }
    /**
     *
     * @param exchange
     * @param context
     * @throws Exception
     */
    @Override
    public void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception {
        if (context.getMethod() == METHOD.GET) {
            ResponseHelper.endExchangeWithMessage(exchange, HttpStatus.SC_OK, msg);
        } else {
            exchange.setResponseCode(HttpStatus.SC_METHOD_NOT_ALLOWED);
            exchange.endExchange();
        }
    }
}
```

Configuration:

``` plain
application-logic-mounts:
    - what: org.restheart.handlers.applicationlogic.PingHandler
      where: /ping
      secured: false
      args:
          msg: "ciao from the restheart team"
```

### Aggregation query

The following example shows how to use the ApplicationHandler to run an
aggregation query.

Given the */test/bands* collection, where each document is supposed to
have the *albums* array property (listing the albums of the band), it
returns the number of albums by band:

``` bash
$ http -a a:a GET 127.0.0.1:8080/_logic/aggregate
HTTP/1.1 200 OK
...

 {
 "The Cure": 13,
 "The Clash": 7,
 "Pink Floyd": 15,
 ......
 }
```

**Code**

_Notes_

-   the mongo client is obtained via the **MongoDBClientSingleton**;
    it returns the MongoClient configured with the parameters from the
    configuration file.
-   the query is executed via the lambda expression argument of the
    class **LoadingCache**: this way, the query is cached and gets
    actually re-executed only after 5 seconds.

``` java
package org.restheart.example;
import com.mongodb.AggregationOutput;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import org.restheart.handlers.PipedHttpHandler;
import org.restheart.handlers.RequestContext;
import org.restheart.handlers.RequestContext.METHOD;
import org.restheart.utils.HttpStatus;
import io.undertow.server.HttpServerExchange;
import io.undertow.util.Headers;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.restheart.cache.Cache;
import org.restheart.cache.CacheFactory;
import org.restheart.cache.LoadingCache;
import org.restheart.db.MongoDBClientSingleton;
import org.restheart.hal.Representation;
import org.restheart.handlers.applicationlogic.ApplicationLogicHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 *
 * @author Andrea Di Cesare <andrea@softinstigate.com>
 */
public class AggregateHandler extends ApplicationLogicHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger("org.restheart.example.AggregateHandler");
    private static final MongoClient client;
    private static final LoadingCache<String, DBObject> cache;
    private static final String DB = "test";
    private static final String COLL = "bands";
    private static final List<DBObject> AGGREGATION_QUERY;
    static {
        client = MongoDBClientSingleton.getInstance().getClient();
        AGGREGATION_QUERY = Arrays.asList(
                BasicDBObjectBuilder.start()
                .add("$unwind", "$albums") // unwind stage
                .get(),
                BasicDBObjectBuilder.start()
                .push("$group") // group stage
                .add("_id", "$_id")
                .push("count")
                .add("$sum", 1)
                .get(),
                BasicDBObjectBuilder.start()
                .push("$project") // $project stage
                .add("albums", "$count")
                .get()
        );
        LOGGER.debug("query {}", AGGREGATION_QUERY.toString());
        // a 5 seconds cache
        cache = CacheFactory.createLocalLoadingCache(1, Cache.EXPIRE_POLICY.AFTER_WRITE, 5 * 1000, (String key) -> {
            DBCollection coll = client.getDB(DB).getCollection(COLL);
            AggregationOutput agout = coll.aggregate(AGGREGATION_QUERY);
            // wrap result in a BasicDBList
            BasicDBList ret = new BasicDBList();
            agout.results().forEach(dbobj -> {
                ret.add(dbobj);
            });
            return ret;
        });
    }
    /**
     *
     * @param next
     * @param args
     */
    public AggregateHandler(PipedHttpHandler next, Map<String, Object> args) {
        super(next, args);
    }
    /**
     *
     * @param exchange
     * @param context
     * @throws Exception
     */
    @Override
    public void handleRequest(HttpServerExchange exchange, RequestContext context) throws Exception {
        LOGGER.debug("got request");
        if (context.getMethod() == METHOD.GET) {
            Optional<DBObject> _results = cache.getLoading("result");
            if (_results.isPresent()) {
                BasicDBList results = (BasicDBList) _results.get();
                Representation rep = new Representation("/_logic/aggregate");
                BasicDBObject properties = new BasicDBObject();
                
                results.forEach( res -> { 
                    DBObject _res = (DBObject) res;
                    
                    properties.append((String) _res.get("_id"), _res.get("albums")); 
                });
                
                rep.addProperties(properties);
                exchange.setResponseCode(HttpStatus.SC_OK);
                exchange.getResponseHeaders().put(Headers.CONTENT_TYPE, Representation.JSON_MEDIA_TYPE);
                exchange.getResponseSender().send(rep.toString());
                exchange.endExchange();
            }
        } else {
            LOGGER.debug("request verb is not GET => NOT ALLOWED");
            exchange.setResponseCode(HttpStatus.SC_METHOD_NOT_ALLOWED);
            exchange.endExchange();
        }
    }
}
```

**Configuration**

``` plain
application-logic-mounts:
    - what: org.restheart.examples.AggregateHandler
      where: /aggregate
      secured: true
```
