---
layout: docs
title: Resources Configuration
---

* [Introduction](#introduction)
* [Data resources](#data-resources)
    * [Some examples](#some-examples)
* [Static resources](#static-resources)
* [Application logic](#application-logic)

## Introduction

RESTHeart not only exposes **data**, but also serves **static
resources** and **custom application logic**. Everything goes through
its simple yaml configuration file: this is what we call *piping* and it
is **easy** and **effective**, so that you don’t have to deal with
complex deployments anymore.

## Data resources

Data resources are managed via the **mongo-mounts** configuration
option.

The default configuration just *pipes* in any MongoDB resource so that
the API client can, if authorized, request any db and any collection
resource.

``` plain
 # Use mongo-mounts to bind URLs to MongoDB resources
mongo-mounts:
  - what: "*"
    where: /
```

It is easy to reconfigure it, so that just some MongoDB resources are
piped in.

### Some examples

The following configuration pipes in the
collections **db.c1** and **db.c2**, binding them to the
URIs **/one** and **/two** respectively. With this configuration,
RESTHeart does not expose any other MongoDB resource.

``` plain
mongo-mounts:
  - what: /db/c1
    where: /one
  - what: /db/c2
    where: /two
```

     

The following configuration makes accessible just the document **D** of
the collection *C* of the database *DB* binding it to the
URI **/just/a/document**. 

``` plain
mongo-mounts:
  - what: /DB/C/D
    where: /just/a/document
```

## Static resources

The static resources are managed via
the **static-resources-mounts** configuration option.

The default configuration just *pipes* in the [HAL
browser](https://github.com/mikekelly/hal-browser). Its HTML, CSS and
JavaScript resources are embedded within the restheart.jar file and
bound to the URI **/browser**.

The following yaml fragment is the corresponding configuration:

``` text
static-resources-mounts:
  - what: browser
    where: /browser
    welcome-file: browser.html
    secured: false
    embedded: true
```

     

Note that:

-   **what**: the directory path containing the static resources. Since
    these are embedded in the jar, this path is relative to the jar
    package root directory;
-   **where**: the URI where the resources are served;
-   **welcome-file**: the file to serve when the *where* URI is
    requested;
-   **secured**: true if the configured RESTHeart Access Manager, if
    any, should be used for these resources;
-   **embedded** true if the resources are embedded in the jar file,
    false if they are in the file system.

You can find another good example of piping static resources in
the [RESTHeart example blog
application](https://github.com/SoftInstigate/restheart-blog-example).
This blog application uses the AngularJS MVC framework and RESTHeart as
web server and data storage.

Its **static-resources-mounts** configuration section is:

``` text
static-resources-mounts:
  ...
  - what: app
    where: /blog
    welcome-file: index.html
    secured: false
    embedded: false
```

    This tells RESTHeart to serve the resources located in the app directory that contains the AngularJS single page web application. These are be bound to the /blog URI.

## Application logic

The application logic handlers are managed via
the **application-logic-mounts** configuration option.

For instance, the mentioned [RESTHeart example blog
application](https://github.com/SoftInstigate/restheart-blog-example) uses
the *GetRoleHandler* (GETing the /\_logic/roles/mine resource) to
determine if the current user is logged in and show the login form
eventually.

Refer to [Application Logic](Application_Logic) section for more
information on how to develop a custom application handler.

The default configuration pipes in three example application logic
handlers:

-   **PingHandler** bound to **/\_logic/ping** and implements a simple
    ping service
-   **GetRoleHandler** bound to /\_logic/roles/mine and returns the
    current user authentication status and eventually its roles
-   **CacheInvalidator** bound to / and allows to invalidate a db or
    collection cache entries

The following is the default configuration file
application-logic-mounts section

``` text
application-logic-mounts:
    - what: org.restheart.handlers.applicationlogic.PingHandler
      where: /ping
      secured: false
      args:
          msg: "greetings from the restheart team"
    - what: org.restheart.handlers.applicationlogic.GetRoleHandler
      where: /roles
      secured: false
      args:
          url: /_logic/roles
    - what: org.restheart.handlers.applicationlogic.CacheInvalidator
      where: /ic
      secured: true
```
