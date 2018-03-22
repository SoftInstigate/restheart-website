---
layout: docs
title: Custom Access Manager
---

* [Introduction](#introduction)
* [Develop](#develop)
    * [The AM class](#the-am-class)
    * [Constructor](#constructor)
    * [Methods to implement](#methods-to-implement)
* [How to add the custom classes to the classpath](#how-to-add-the-custom-classes-to-the-classpath)
    * [Using the java classpath option](#using-the-java-classpath-option)
    * [Using the Maven shade plugin](#using-the-maven-shade-plugin)
* [Example](#example)

**/\*\*/ Introduction Develop The AM class Constructor Methods to
implement How to add the custom classes to the classpath Using the java
classpath option Using the Maven shade plugin Example**

This section will provide detailed information on how to implement a
custom Access Manager.

For further help, please refer to the RESTHeart support channels
<http://restheart.org/support.html>

## Introduction

The Access Manager is responsible of authorizing the users against a
security policy.

Following the dependency injection approach, the actual AM
implementation to use is specified in the configuration file.

There is a ready-to-use AM implementation and custom ones can be
developed.

This section explains how to develop a custom AM.

If you develop a general purpose AM please consider contributing to
[RESTHeart project](https://github.com/softinstigate/restheart) using
the github pull request feature.

The steps required to develop and configure an AM are:

1.  develop the AM in Java
2.  configure RESTHeart to use the new AM via its configuration file
3.  add the implementation class(es) to the java classpath

## Develop

### The AM class

The AM implementation class must implement the
interface* org.restheart.security.AccessManager* 

The AM is a singleton instance of this class.

### Constructor

The constructor must have the following signature:

``` plain
public MyAccessManager(Map<String, Object> args)
```

The argument *args* maps the *access-manager* properties as specified in
the configuration file.

### Methods to implement

The interface *org.restheart.security.AccessManager* mandates to
implement 2 methods:

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Modifier and Type</th>
<th>Method and Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>boolean</code></td>
<td>isAllowed(HttpServerExchange exchange, RequestContext context);<br />

<div class="block">
returns true if request is allowed
</div></td>
</tr>
<tr class="even">
<td>boolean</td>
<td>isAuthenticationRequired(final HttpServerExchange exchange);<br />

<div class="block">
return true if not authenticated user won't be allowed
</div></td>
</tr>
</tbody>
</table>

The second method *isAuthenticationRequired()* checks if authentication
is required. If it returns *true*, then the request is actually checked
against the first method. If it return *false*, then any user, including
unauthenticated ones, will be allowed.

The actual security policy check occurs in the method *isAllowed().*

The *RequestContext* context argument easily allows to get information
about the request. More information is avaialbe in
the HttpServerExchange exchange arguments. In fact, context is derived
from exchange.

context vs exchange

The *context *object is easier to use.

For instance:

-   it incapsulates the request json payload as an object resulting form
    the parsing of the json string data, where the exchange gives access
    to it as a an *StreamSourceChannel*
-   In case of a file resource, it incapsulates the file type (e.g.
    image/png for images)
-   it provides some convenient properties, such as type (resource type,
    such as DOCUMENT or COLLECTION) and method (GET, PUT, POST, etc)
-   etc.

Configuration

The AM is configured in the *access-manager* section of the yaml
configuration file.

Here you specify the actual AM implementation to use and any parameters
it needs (for instance, the path of the file where the security policy
is defined or some parameters that control caching).

For example, if the *access-manager* configuration section is:

``` plain
access-manager:    
    implementation-class: org.restheart.examples.security.MyAccessManager
    arg1: 5
    arg2: hey man!
    arg3:
        arg31: 1
        arg32: 2
```

Then:

-   the AM singleton will be of class *MyAccessManager*
-   its constructor will be invoked passing a Map argument with 4 keys
    1.  *implementation-class* of class String
    2.  *arg1* of class *Integer*
    3.  *arg2* of class *String*
    4.  *arg3* of class *Map&lt;String, Object&gt;*, having in turn 2
        keys (*arg31* and *arg32*)

## How to add the custom classes to the classpath

### Using the java classpath option

The custom classes must be added to the java classpath.

In order to achieve this, start RESTHeart with the following command:

``` plain
$ java -server -classpath restheart.jar:custom-classes.jar org.restheart.Bootstrapper restheart.yml
```

### Using the Maven shade plugin

The [maven share
plugin](https://maven.apache.org/plugins/maven-shade-plugin/) provides
the capability to package the artifact in an uber-jar, including its
dependencies and to *shade* - i.e. rename - the packages of some of the
dependencies.

 It allows to create a single jar including any RESTHeart class and your
custom ones. In this case you can start RESTHeart with

``` plain
$ java -server -jar restheart_plus_custom.jar restheart.yml
```

## Example

A project with RESTHeart customization examples is available on github;
find it
at [restheart-customization-examples](https://github.com/SoftInstigate/restheart-customization-examples).

It includes the **ExampleAccessManager; **this is a simple AM that
hardcodes the security policy:

-   allow any authenticated user to GET /\_logic/aggregate
-   allow any authenticated user to GET,POST /test/bands
-   allow any authenticated user to GET /test/bands/&lt;bandid&gt;
-   allow users with ROLE admin to GET,PUT,PATCH,DELETE
    /test/bands/&lt;bandid&gt;

Any other requests are not allowed.

The implementation class follows:

``` java
package org.restheart.examples.security;

import io.undertow.attribute.ExchangeAttributes;
import io.undertow.server.HttpServerExchange;
import io.undertow.util.HttpString;
import io.undertow.util.Methods;
import java.util.Map;
import java.util.Set;
import org.restheart.examples.applogic.ExampleAggregateHandler;
import org.restheart.handlers.RequestContext;
import org.restheart.handlers.RequestContext.METHOD;
import static org.restheart.handlers.RequestContext.PATCH;
import org.restheart.handlers.RequestContext.TYPE;
import org.restheart.security.AccessManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Andrea Di Cesare <andrea@softinstigate.com>
 */
public class ExampleAccessManager implements AccessManager {
    private static final Logger LOGGER = LoggerFactory.getLogger("org.restheart.examples.security.ExampleAccessManager");

    public static final String AGGREGATE_URI = "/_logic/aggregate";

    public ExampleAccessManager(Map<String, Object> arguments) {
        // args are ignored
    }

    @Override
    public boolean isAllowed(HttpServerExchange exchange, RequestContext context) {
        // *** request info
        String requestURI = exchange.getRequestURI();
        String db = null;
        String collection = null;
        TYPE requestType;
        METHOD requestMethod;

        // context is null for secured non-mongodb resources, e.g. /_logic
        if (context != null) {
            db = context.getDBName();
            collection = context.getCollectionName();
            requestType = context.getType();
            requestMethod = context.getMethod();
        } else {
            db = null;
            collection = null;
            requestType = null;
            requestMethod = selectRequestMethod(exchange.getRequestMethod());
        }

        // *** user info
        String username = ExchangeAttributes.remoteUser().readAttribute(exchange);
        Set<String> roles = null;

        if (exchange.getSecurityContext() != null && exchange.getSecurityContext().getAuthenticatedAccount() != null) {
            roles = exchange.getSecurityContext().getAuthenticatedAccount().getRoles();
        }

        if (username == null || roles == null) {
            LOGGER.warn("DENIED, user is not authenticated.");
            return false;
        }

        // log request
        LOGGER.debug("checking request {} {} from user {} with roles {}", requestMethod, requestURI, username, roles);

        // allow any authenticated user to GET /_logic/aggregate
        if (AGGREGATE_URI.equals(requestURI)) {
            if (METHOD.GET.equals(requestMethod)) {
                LOGGER.debug("ALLOWED (GET request to {} are allowed)", requestURI);
                return true;
            }
        }

        // allow any authenticated user to GET,POST /test/bands
        if (TYPE.COLLECTION.equals(requestType)) {
            if (ExampleAggregateHandler.DB.equals(db)
                    && ExampleAggregateHandler.COLL.equals(collection)
                    && (METHOD.GET.equals(requestMethod))
                    || METHOD.POST.equals(requestMethod)) {
                LOGGER.debug("ALLOWED (anyone can GET and POST /test/bands)");
                return true;
            }
        }

        // allow any authenticated user to GET /test/bands/<bandid>
        if (TYPE.DOCUMENT.equals(requestType)
                && ExampleAggregateHandler.DB.equals(db)
                && ExampleAggregateHandler.COLL.equals(collection)
                && METHOD.GET.equals(requestMethod)) {
            LOGGER.debug("ALLOWED (anyone can GET /test/bands/<docid>)");
            return true;
        }

        // allow users with ROLE admin to GET,PUT,PATCH,DELETE /test/bands/<bandid>
        if (roles.contains(ExampleIdentityManager.ROLE.ADMIN.name())
                && TYPE.DOCUMENT.equals(requestType)
                && ExampleAggregateHandler.DB.equals(db)
                && ExampleAggregateHandler.COLL.equals(collection)
                && (METHOD.PUT.equals(requestMethod)
                || METHOD.PATCH.equals(requestMethod)
                || METHOD.DELETE.equals(requestMethod))) {
            LOGGER.debug("ALLOWED (admins can PUT, PATCH and DELETE /test/bands/<docid>)");
            return true;
        }

        LOGGER.warn("DENIED, no permission found.");
        return false;
    }

    @Override
    public boolean isAuthenticationRequired(HttpServerExchange exchange) {
        // always require authentication
        return true;
    }
    
    private static METHOD selectRequestMethod(HttpString _method) {
        METHOD method;
        if (Methods.GET.equals(_method)) {
            method = METHOD.GET;
        } else if (Methods.POST.equals(_method)) {
            method = METHOD.POST;
        } else if (Methods.PUT.equals(_method)) {
            method = METHOD.PUT;
        } else if (Methods.DELETE.equals(_method)) {
            method = METHOD.DELETE;
        } else if (PATCH.equals(_method.toString())) {
            method = METHOD.PATCH;
        } else if (Methods.OPTIONS.equals(_method)) {
            method = METHOD.OPTIONS;
        } else {
            method = METHOD.OTHER;
        }
        return method;
    }
}
```
