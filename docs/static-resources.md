---
title: Serving static resources
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}

## Introduction

RESTHeart allows serving static resources. 

An example configuration follows:

```yml
#### Static Web Resources

# Static web resources to bind to the URL specified by the 'where' property.
# The 'what' property is the path of the directory containing the resources.
# The path is either absolute (starts with /) or relative to the restheart.jar file
# Set embedded: true, if resources are embedded in the file restheart.jar

static-resources-mounts:
  - what: /data/www
    where: /static
    welcome-file: index.html
    embedded: false
```