---
docs_version: 8
title: Development Environment Setup
layout: docs
menu: framework
applies_to: restheart
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Plugin Project Skeleton](#plugin-project-skeleton)
* [Requirements](#requirements)
* [Quick Start](#quick-start)
* [Build Systems](#build-systems)
* [Working with MongoDB](#working-with-mongodb)
* [Native Image Builds](#native-image-builds)
* [Configuration with RHO](#configuration-with-rho)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content pt-0">

{% include docs-head.html %}

## Introduction

Here at [SoftInstigate](https://softinstigate.com) we have developed many projects with RESTHeart.

During our projects we have been constantly enhancing our development environment and building tools to make our life easier.

This page summarizes our findings and provides you with links and tips to setup your development environment in the most effective way.

## Plugin Project Skeleton

You can start developing a plugin by forking the repository [restheart-plugin-skeleton](https://github.com/SoftInstigate/restheart-plugin-skeleton).

{: .bs-callout.bs-callout-info }
The skeleton targets RESTHeart 9+. For RESTHeart 8.x, use the git tag `8.x`.

## Requirements

- **GraalVM 25 (or Java 25)**: required to compile and run the plugin.
- **Docker**: used to run RESTHeart and MongoDB.

Install GraalVM via [SDKMAN](https://sdkman.io/):

```bash
sdk install java 25.0.1-graalce
sdk use java 25.0.1-graalce
```

## Quick Start

### Option 1: Use the RESTHeart CLI (Recommended)

The [RESTHeart CLI](https://github.com/SoftInstigate/restheart-cli) (`rh`) is the recommended tool for plugin development. It streamlines the entire development lifecycle — installing RESTHeart, building your plugin, and running it — with a single command.

Install it via npm:

```bash
npm install -g @softinstigate/rh
```

Then install RESTHeart and start developing with watch mode (auto-rebuild on code changes):

```bash
rh install
rh watch --build -- -s
```

The `watch` command monitors your source files and automatically rebuilds and restarts RESTHeart whenever you save a change. The `-s` flag runs in standalone mode (no MongoDB required).

To connect to a MongoDB instance, use the `RHO` variable to override the connection string:

```bash
RHO='/mclient/connection-string->"mongodb://localhost:27017"' rh watch
```

You can also attach a remote debugger (JDWP) on port `HTTP_PORT + 1000` (default: `9080`):

```bash
rh watch --debug
```

See the [RESTHeart CLI Usage Guide](https://github.com/SoftInstigate/restheart-cli/blob/master/usage-guide.md) for the full command reference.

### Option 2: Build and Run with Docker

**Clone the repository:**

```bash
git clone --depth 1 git@github.com:SoftInstigate/restheart-plugin-skeleton.git
cd restheart-plugin-skeleton
```

**Build (choose Maven or Gradle):**

```bash
# Maven
./mvnw clean package

# Gradle
./gradlew clean build
```

**Run with Docker (standalone mode, no MongoDB):**

```bash
docker run --pull=always --name restheart --rm -p "8080:8080" -v ./target:/opt/restheart/plugins/custom softinstigate/restheart -s
```

**Test the service:**

```bash
curl localhost:8080/srv
{"message":"Hello World!","rnd":"njXZksfKFW"}
```

## Build Systems

Both Maven and Gradle are fully supported and produce identical outputs:

{: .table }
| Feature | Maven | Gradle |
|---------|-------|--------|
| Build | `./mvnw clean package` | `./gradlew clean build` |
| Native Image | `./mvnw package -Pnative` | `./gradlew build -Pnative` |
| Profile Activation | `-Psecurity,mongodb` | `-Psecurity -Pmongodb` |
| Build Speed | Moderate | Faster (incremental, daemon) |

## Working with MongoDB

To run RESTHeart with MongoDB:

```bash
# Start MongoDB replica set
docker run -d --name mongodb -p 27017:27017 mongo --replSet=rs0
docker exec mongodb mongosh --quiet --eval "rs.initiate()"

# Build the plugin
./mvnw clean package  # or: ./gradlew clean build

# Run RESTHeart without -s flag to enable MongoDB plugins
docker run --name restheart --rm -p "8080:8080" -v ./target:/opt/restheart/plugins/custom softinstigate/restheart
```

{: .bs-callout.bs-callout-warning }
Default credentials are `admin:secret`. This setup is for development/testing only.

## Native Image Builds

Native images provide faster startup and lower memory usage. Use the `-Pnative` flag:

```bash
# Quick build (default)
./mvnw clean package -Pnative
# or: ./gradlew clean build -Pnative

# Full optimization (slower build, faster runtime)
./mvnw clean package -Pnative -Dnative.quickBuild=false
```

Use profiles to bundle RESTHeart plugins into the native executable:

{: .table }
| Profile | Description |
|---------|-------------|
| `security` | Bundle RESTHeart Security |
| `mongodb` | Bundle RESTHeart MongoDB |
| `graphql` | Bundle RESTHeart GraphQL |
| `metrics` | Bundle RESTHeart Metrics |
| `all-restheart-plugins` | Bundle all RESTHeart plugins |

Example — native build with Security and MongoDB:

```bash
./mvnw clean package -Pnative,security,mongodb
# or: ./gradlew clean build -Pnative -Psecurity -Pmongodb
```

## Configuration with RHO

Override settings at runtime without rebuilding using the `RHO` environment variable:

```bash
docker run --name restheart --rm \
  -e RHO="/http-listener/host->'0.0.0.0';/helloWorldService/message->'Ciao Mondo!'" \
  -p "8080:8080" \
  -v ./target:/opt/restheart/plugins/custom \
  softinstigate/restheart -s
```

See [RESTHeart Configuration](/docs/configuration#change-the-configuration-in-docker-container) for more details.
