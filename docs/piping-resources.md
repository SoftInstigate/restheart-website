---
layout: doc-page-md
title: Piping resources
permalink: /docs/piping-resources.html
menu:
 id: 4
 subid: 6
---

RESTHeart not only exposes __data__, but also serves __static resources__ and __custom application logic__. Everything goes through its simple yaml configuration file: this is what we call _piping_ and it is __easy__ and __effective__, so that you don't have to deal with complex deployments anymore.

## Data resources
{: .post}

Data resources are managed via the **mongo-mounts** configuration option.

The default configuration just _pipes_ in any MongoDB resource so that the API client can, if authorized, request any db and any collection resource.

{% highlight yaml %}
# Use mongo-mounts to bind URLs to MongoDB resources
mongo-mounts:
  - what: "*"
    where: /
{% endhighlight %}

It is easy to reconfigure it, so that just some MongoDB resources are piped in.

### Some examples

The following configuration pipes in the collections **db.c1** and **db.c2**, binding them to the URIs **/one** and **/two** respectively. With this configuration, RESTHeart does not expose any other MongoDB resource.

{% highlight yaml %}
mongo-mounts:
  - what: /db/c1
    where: /one
  - what: /db/c2
    where: /two
{% endhighlight %}

The following configuration makes accessible just the document **D** of the collection *C* of the database *DB* binding it to the URI **/just/a/document**. 

{% highlight yaml %}
mongo-mounts:
  - what: /DB/C/D
    where: /just/a/document
{% endhighlight %}

## Static resources
{: .post}

The static resources are managed via the **static-resources-mounts** configuration option.

The default configuration just _pipes_ in the [HAL browser](https://github.com/mikekelly/hal-browser). Its HTML, CSS and JavaScript resources are embedded within the restheart.jar file and bound to the URI **/browser**.

The following yaml fragment is the corresponding configuration:

{% highlight yaml %}
static-resources-mounts:
  - what: browser
    where: /browser
    welcome-file: browser.html
    secured: false
    embedded: true
{% endhighlight %}

Note that:

 *	**what**: the directory path containing the static resources. Since these are embedded in the jar, this path is relative to the jar package root directory;
 *	**where**: the URI where the resources are served;
 *	**welcome-file**: the file to serve when the _where_ URI is requested;
 *	**secured**: true if the configured RESTHeart Access Manager, if any, should be used for these resources;
 *	**embedded** true if the resources are embedded in the jar file, false if they are in the file system.

You can find another good example of piping static resources in the [RESTHeart example blog application](https://github.com/SoftInstigate/restheart-blog-example). This blog application uses the AngularJS MVC framework and RESTHeart as web server and data storage.

Its **static-resources-mounts** configuration section is:

{% highlight yaml %}
static-resources-mounts:
  ...
  - what: app
    where: /blog
    welcome-file: index.html
    secured: false
    embedded: false
{% endhighlight %}

This tells RESTHeart to serve the resources located in the _app_ directory that contains the AngularJS single page web application. These are be bound to the **/blog** URI.

## Application logic
{: .post}

The application logic handlers are managed via the **application-logic-mounts** configuration option.

The default configuration pipes in two example application logic handlers. RESTHeart has a pipeline architecture where Java handlers are chained to serve the requests.

In order to provide additional application logic, custom handlers can be piped in and bound under the /_logic URI.
The custom handler must extends the org.restheart.handlers.ApplicationLogicHandler class

{% highlight yaml %}
application-logic-mounts:
  - what: org.restheart.handlers.applicationlogic.PingHandler
    where: /ping
    secured: false
    args:
      msg: "ciao from the restheart team"
  - what: org.restheart.handlers.applicationlogic.GetRoleHandler
    where: /roles/mine
    secured: false
    args:
      url: /_logic/roles/mine
      send-challenge: false
      idm-implementation-class: org.restheart.security.impl.SimpleFileIdentityManager
      idm-conf-file: ../etc/security-integrationtest.yml
{% endhighlight %}

*	**PingHandler** is bound to **/_logic/ping** and implements a simple ping service
*	**GetRoleHandler** is bound to /_logic/roles/mine and returns the current user authentication status and eventually its roles

For instance, the mentioned [RESTHeart example blog application](https://github.com/SoftInstigate/restheart-blog-example) uses the _GetRoleHandler_ (GETing the /_logic/roles/mine resource) to determine if the current user is logged in and show the login form eventually.