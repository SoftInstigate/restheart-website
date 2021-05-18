---
title: Clustering and Load Balancing
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [What are Clustering and Load Balancing](#what-are-clustering-and-load-balancing)

* [How it works](#how-it-works)

* [RESTHeart EE capabilities](#restheart-ee-capabilities)

* [References](#references)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">
{% include docs-head.html %}

## What are Clustering and Load Balancing

**Server Clustering** is a method of turning multiple computer servers into a cluster, which is a group of servers that acts like a single system.

**Load Balancing** is about the distribution of workloads across multiple computing resources, such as computers, server clusters, network links, etc. Load balancing aims to optimize resource usage, maximize throughput, minimize response time, and avoid overload of any single resource.

A **MongoDB Replica Set** is a group of `mongod` processes that maintain the same data set. Replica sets provide redundancy and high availability, and are the basis for all production deployments.

**High availability (HA)** is a general characteristic of a system, which aims to ensure an agreed level of operational performance, usually uptime, for a higher than normal period.

![MongDB Replica Set](/images/mongodb_replicaset.png){: width="50%" height="auto" class="mx-auto d-block img-responsive" style="padding: 20px"}

RESTHeart has always been a very good fit for Microservices and other styles of distributed architecture. It has been deployed successfully with clustering technologies such as **AWS ECS** and **Fargate**, **Kubernetes** and many others.

## How it works

RESTHeart basically receives HTTP requests and transforms them into MongoDB queries, through the Java driver. Creating a cluster has been a matter of putting a plain HTTP load balancer on top of the chosen clustering technology, exactly as one would do with any other HTTP server.

RESTHeart is stateless for all features but for the default Token Manager used for [token authentication](/docs/security/authentication/#token-authentication). This implementation that comes with RESTHeart OSS holds the tokens in memory. As a result, it does not support clustering.

Thus a cluster of RESTHeart nodes requires **sticky sessions** when using token authentication otherwise the RESTHeart node could receive an authentication token created by another instance, which results in a HTTP 401 "Unauthorized" error.

As RESTHeart instances don't communicate directly (to avoid expensive synchronization steps), then they can't validate authentication tokens created by other instances in the same cluster. To overcome this situation, the HTTP Load Balancer inserts a sticky session token into a cookie and then handle the communication flow from clients to RESTHeart instances accordingly. Sticky sessions, from an architectural point of view, introduce a level of statefulness in the system and their expiration timeout must be carefully tuned.

## RESTHeart EE capabilities

RESTHeart EE adds a feature to make clustering easier, without the need for any sticky session. This enables a fully **stateless deployment**.

RESTHeart EE comes with a specialized Token Manager which creates cryptographically signed tokens that can be acknowledged by any RESTHeart node in the cluster without direct communication and synchronization among them: fast, simple and safe.

For more information refer to the [Token Manager](/docs/plugins/security-plugins/#token-managers) documentation page.

![ALB](/images/alb.png){: class="mx-auto d-block img-responsive"}

In summary, the top level steps for a highly available RESTHeart \+ MongoDB configuration are:

1. Create a MongoDB Replica Set;

2. Create a RESTHeart cluster connected to the MongoDB Replica Set;

3. Put an HTTP Load Balancer on top of it.

{: .bs-callout.bs-callout-info}
If you want to know more about clustering, load balancing and high availability, please [contact us](/services).

## References

To understand more in general about Load Balancing, Affinity, Persistence, Sticky Sessions you can read this [overview](https://www.haproxy.com/fr/blog/load-balancing-affinity-persistence-sticky-sessions-what-you-need-to-know/).

</div>