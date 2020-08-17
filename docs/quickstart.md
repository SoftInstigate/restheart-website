---
layout: docs
title: Quickstart
edited: in progress
spellCheck: n
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Latest Release](#get-the-latest-release)
-   [Run RESTHeart](#run-restheart)
-   [Initiate the Database](#initiate-the-database)
-   [Further Information](#further-information)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Options

RESTHeart's setup process depends on which option you choose:

- [Run with Docker](#docker)
- [Run with Java](#java)


## Get the latest release

### Docker
Download the [image](https://hub.docker.com/r/softinstigate/restheart). This container will give you Java, MongoDB, and RESTHeart.

### Java

To run RESTHeart with your own Java installation, download the [ZIP](https://github.com/SoftInstigate/restheart/releases/download/5.1.1/restheart.zip) or [TAR.GZ](https://github.com/SoftInstigate/restheart/releases/download/5.1.1/restheart.tar.gz) archive.

#### Java Requirements

{% include java-requirements.md %}

## Run RESTHeart

{% include run-restheart.md %}

### Check RESTHeart is Running

{% include check-is-running.md %}

### Initiate the Database

{% include initiate-database.md %}

## Further Information

For more detailed information see:
- [Setup](/setup.md)
<!-- this may not be final location for configuration-->
- [Configuration Options](/v5/configuration.md)

</div>
