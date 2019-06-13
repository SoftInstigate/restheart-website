---
layout: docs
title: Performances
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Change Stream Performance Test Results](#change-stream-performance-test-results)
* [How we tested](#how-we-tested)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

RESTHeart has been designed and developed with lightness and
performances as fundamental parameters.

This section includes the performance test results gathered by the
SoftInstigate’s development team and includes all the information needed
to autonomously reproduce the tests.

## Change Stream Performance Test Results

Measure RESTHeart's notification throughput while _n_ Websockets are listening for targetted notifications.
RESTHeart will process 180 POSTs in 60 seconds while testing (3 RPS) and every client will wait until all notification have been received.


![change stream test](http://localhost:4000/images/perftest/change-stream-test.png){: class="img-responsive"}

Observing the graph, RESTHeart delivers almost real-time notification for a very huge amout of clients:

|  Clients     |              TPS             | Mean Notification Time (333ms = Real Time) |
|:-------------|-----------------------------:|-------------------------------------------:|
| **10**       |      27                      |             357ms                          |
| **100**      |      278                     |             359ms                          |                       
| **1000**     |      2790                    |             358ms                          |
| **10000**    |      27909                   |             358ms                          |
| **15000**    |      41812                   |             358ms                          |
| **20000**    |      54125                   |             369ms                          |
| **25000**    |      61995                   |             403ms                          |


### How we tested

Tests have been made simulating a production environment composed by ***3 EC2 t3a.medium instances*** running with ***Ubuntu 18.04***

_Check [this repository](https://github.com/SoftInstigate/restheart-perftest) to learn how to setup by your own a local testing environment._
