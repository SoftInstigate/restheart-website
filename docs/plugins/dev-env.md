---
title: Development Environment Setup
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Plugin Project Skeleton](#plugin-project-skeleton)
* [HTTP Shell](#http-shell)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress-v6.html %}

## Introduction

Here at [SoftInstigate](https://softinstigate.com) we have developed many projects with RESTHeart.

During our projects we have been constantly enhancing our development environment and building tools to make our life easier.

This page summarizes our findings and provides you with links and tips to setup your development environment in the most effective way.

## Plugin Project Skeleton

You can start developing a pluging by forking the repository [restheart-plugin-skeleton](https://github.com/SoftInstigate/restheart-plugin-skeleton)

This repository includes a sample service and provides you with the following features:

{: .table }
|feature|description|
|-|-|
|**Easy Execution**|A script allows to automatically download and run RESTHeart with your plugin. docker-compose can be used to start MongoDB configured as a single instance Replica Set to enable transactions and change streams|
|**Watch Mode**|You can develop in *Watch Mode* so that the code is automatically rebuilt, and RESTHeart automatically restarted as soon as you change a source or configuration file.|
|**Notifications**| get notifications on OSX when the *watcher* builds and restarts RESTHeart, so you know when you can try your changes.|
|**microD profile**|Start RESTHeart without the MongoDB Service. We call this profile *microD*, because it is an effective runtime environment for micro-services.|
|**Debugging with Hot Code Replace**|RESTHeart runs in development mode, i.e. with the JVM configured for debugging on port 4000. RESTHeart is run with the Java Virtual Machine [dcevm](http://dcevm.github.io), that allows extended *Hot Code Replace*. This means that whenever you change the code while debugging, the changes are automatically applied to the running service, without the need for rebuilding and restarting.|

## HTTP Shell

**HTTP Shell** provides developers with a modern alternative to HTTP clients for interacting with RESTHeart.

{: .bs-callout.bs-callout-info}
Download HTTP Shell from [https://github.com/SoftInstigate/http-shell](https://github.com/SoftInstigate/http-shell)

Let's see it as something between a low-level command line interface, like curl or httpie, and a more user friendly GUI client, like Postman.

The idea is that tools like curl are very powerful but a bit cumbersome, it is often hard for us to remember the exact syntax for each HTTP verb. HTTP Shell instead is still a command line interface, but with a much straightforward user experience.

> HTTP Shell combines the power of familiar CLIs with visualizations in high-impact areas. HTTP Shell enables you to execute HTTP requests, manipulate complex JSON and YAML data models, integrate disparate tooling, and provides quick access to aggregate views of operational data.


![HTTP Shell Image](https://github.com/SoftInstigate/http-shell/raw/master/plugins/plugin-client-default/images/httpshellImage.png){: .img-fluid }

### Commands

{: .table }
| command | description | example
|---|---|---|
| `h set auth <id> <password>` | opens a dialog to sets the basic authentication credentials to use in further requests | `> set auth` |
| `h reset auth` | clear the basic authentication credentials | `> reset auth` |
| `h set url <base-url>` | sets the *base-url* to be used in further requests | `> set url http://127.0.0.1:8080` |
| `h get url` | prints the base url | `> get url` |
| `h get <uri>` | executes the GET request to URL *&lt;base-url&gt;+&lt;uri&gt;* | `> get /collection` |
| `edit <file>` | opens *&lt;file&gt;* for editing with the Monaco Editor | > `edit body.json` |
| `h post <uri> <file>` | executes the POST request request to URL *&lt;base-url>+&lt;uri&gt;*, sending the content of *&lt;file&gt;* as the request body | > `post /collection body.json` |
| `h put <uri> <file>` | executes the PUT request to URL *&lt;base-url&gt;+&lt;uri&gt;*, sending the content of *&lt;file&gt;* as the request body | `> put /collection body.json` |
| `h patch <uri> <file>` | executes the PATCH request to URL *&lt;base-url&gt;+&lt;uri&gt;*, sending the content of *&lt;file&gt;* as the request body | `> patch /collection body.json` |
| `h delete <uri>` | executes the DELETE request to URL *&lt;base-url&gt;+&lt;uri&gt;* | `> delete /collection` |
| `h set header <name> <value>` | sets the header *&lt;name&gt;* to *&lt;value&gt;* | `> set header If-Match 5f7f35efcb800f2502f95cb5` |
| `h get headers` | prints the current set headers | `> get headers` |
| `h clear headers` | clears the headers | `> clear headers` |

