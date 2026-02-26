---
docs_version: 9
title: Development Environment Setup
layout: docs
menu: framework
applies_to: restheart
redirect_from:
  - /docs/plugins/dev-env
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Plugin Project Skeleton](#plugin-project-skeleton)
* [HTTP Shell](#http-shell)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content pt-0">

{% include docs-head.html %}

## Introduction

Here at [SoftInstigate](https://softinstigate.com) we have developed many projects with RESTHeart.

During our projects we have been constantly enhancing our development environment and building tools to make our life easier.

This page summarizes our findings and provides you with links and tips to setup your development environment in the most effective way.

## Plugin Project Skeleton

You can start developing a plugin by forking the repository [restheart-plugin-skeleton](https://github.com/SoftInstigate/restheart-plugin-skeleton)

This repository includes a sample service and provides you with the following features:

{: .table }
|feature|description|
|-|-|
|**Easy Execution**|A script allows to automatically download and run RESTHeart with your plugin. `docker compose` can be used to start MongoDB configured as a single instance Replica Set to enable transactions and change streams|
|**Watch Mode**|You can develop in *Watch Mode* so that the code is automatically rebuilt, and RESTHeart automatically restarted as soon as you change a source or configuration file.|
|**Notifications**| get notifications on OSX when the *watcher* builds and restarts RESTHeart, so you know when you can try your changes.|
|**microD profile**|Start RESTHeart without the MongoDB Service. We call this profile *microD*, because it is an effective runtime environment for micro-services.|
|**Debugging and Hot Code Replace**|RESTHeart runs in development mode, i.e. with the JVM configured for remote debugging. This also allows IDEs to dynamically apply Hot Code Replace, i.e, the code changes are automatically applied (to some extent) to the running service, without the need for rebuilding and restarting.|
|**Native builds**|The skeleton `pom.xml` includes the native profile to build RESTHeart with the custom plugin as a native binary.|
