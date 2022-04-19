---
title: How to deploy Plugins
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

To deploy a plugin, just copy its jar file in the `./plugins` directory of restheart.

For examples refer to [RESTHeart Examples](https://github.com/SoftInstigate/restheart/tree/master/examples) repo.

If a plugin requires external dependencies that are not bundled with the restheart.jar file you can just copy the jar files in the `./plugins` directory of restheart. 

More information on how to deploy a plugin is available in the [random-string-service](https://github.com/SoftInstigate/restheart/tree/master/examples/random-string-service) plugin example.