---
title: Performances
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Change Streams](#change-streams)

* [Read and Write JSON documents](#read-and-write-json-documents)
    * [Test case 1](#test-case-1)
    * [Test case 2](#test-case-2)
    * [Test case 3](#test-case-3)

* [How we tested](#how-we-tested)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

RESTHeart has been designed and developed with lightness and
performances as fundamental parameters.

This section includes the performance test results gathered by the
SoftInstigate’s development team and includes all the information needed
to autonomously reproduce the tests.

## Change Streams

Measure RESTHeart's notification throughput while _n_ Websockets are listening for targetted notifications.
RESTHeart will process 180 POSTs in 60 seconds while testing (3 RPS) and every client will wait until all notification have been received.


![change stream test](/images/perftest/change-stream-test.png){: class="img-responsive"}

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


## Read and Write JSON documents

### Test case 1

Measure the execution time to create **1 million documents** with random
data, using **200 test threads.**

![test 1 execution
time](https://restheart.org/images/perftest/test-1-et.png){: class="img-responsive"}

In this scenario, RESTHeart introduces just a **2,41% overhead** over
the total execution time:

|               | Execution Time |    TPS   |
|---------------|:--------------:|:--------:|
| **RESTHeart** |      250s      | 3990 tps |
| **Direct**    |      244s      | 4086 tps |

### Test case 2

Measure the execution time to **query a collection 100.000 times**,
getting 5 documents each time (limit 5) and skipping just 25 documents,
under different concurrency levels. 

![test 2 execution
time](https://restheart.org/images/perftest/test-2-et.png){: class="img-responsive"}

![test 2 tps](https://restheart.org/images/perftest/test-2-tps.png){: class="img-responsive"}

RESTHeart delivers better performances under any concurrency level over
direct access via MongoDB driver:

| Threads       |   50|  100|  200|  250|   400|   500|
|---------------|----:|----:|----:|----:|-----:|-----:|
| **RESTHeart** |  78s|  82s|  78s|  76s|   76s|   76s|
| **Direct**    |  97s|  95s|  96s|  96s|  109s|  112s|

### Test case 3

Measure the execution time to **query a collection 2.000 times**,
getting 5 documents each time (limit 5) and skipping just 250.000
documents, under different concurrency levels.

![test 3 execution
time](https://restheart.org/images/perftest/test-3-et.png){: class="img-responsive"}

![test 3 tps](https://restheart.org/images/perftest/test-3-tps.png){: class="img-responsive"}

Thanks to the eager pre-allocation DBCursor engine, queries with
significant skip parameter executes much faster (50 times in this case)
with RESTHeart:

| Threads       |    1   |   2   |   4   |   5   |   8   |  10  |   20  |   40  |   50  |   80   |  100  |  200  |  400  |   500  |
|---------------|:------:|:-----:|:-----:|:-----:|:-----:|:----:|:-----:|:-----:|:-----:|:------:|:-----:|:-----:|:-----:|:------:|
| **RESTHeart** | 16,28s | 6,22s | 5,05s | 2,53s | 3,76s | 3,6s | 2,98s | 5,65s | 9,04s | 10,74s | 6,76s | 9,24s | 6,76s | 12,71s |
| **Direct**    |  1091s |  627s |  324s |  328s |  329s | 325s |  324s |  321s |  321s |  304s  |  302s |  305s |  327s |  327s  |

## How we tested

### Reading and Writing JSON Documents

#### Hardware

MongoDB and RESTHeart running on Sunfire X2200 M2 with 2 CPU with 16
Gbyte of RAM. See full
specification [here](https://docs.oracle.com/cd/E19121-01/sf.x2200m2/819-6597-12/Chap1.html).
This is an *old *server with 2 dual core 2,2GHz AMD Opteron CPUs.

Test cases run by MacBook Pro client with 2,66 GHz Intel Core i7 and 8
GB 1067 MHz DDR3

The client and the server on the same local network linked by a 10/100
Ethernet switch.

#### Software

-   **Server OS**: Ubuntu server 64bit 14.04.1 LTS
-   **Client OS**: Mac OS X Yosemite 10.10.1
-   **MongoDB**: 2.6.7
-   **RESTHeart**: commit 01d403a5db8b765ad5b0a8eec1fda420c392ab58

#### Configurations

**MongoDB**: run (without authentication enabled) with the following
command


```
$numactl --interleave=all /opt/mongodb/bin/mongod --fork --syslog
```

**RESTHeart**: run with default parameters with the following exception:

-   logging to file off
-   eager-cursor-allocation-linear-slice-heights set to \[50\]
-   io-threads: 8 
-   worker-threads: 64 

#### Test code

We used the brilliant [load test
tool](https://github.com/bazhenov/load-test-tool).

The test case code is available on Github as part of the RESTHeart source code baseline. You can find
it [here](https://github.com/SoftInstigate/restheart/tree/master/core/src/test/java/org/restheart/test/performance).

### Change Streams

Tests have been made simulating a production environment composed by ***3 EC2 t3a.medium instances*** running with ***Ubuntu 18.04***

_Check [this repository](https://github.com/SoftInstigate/restheart-perftest) to learn how to setup by your own a local testing environment._

RESTHeart has been designed and developed with lightness and
performances as fundamental parameters. On this regards, also thanks to
its caching capabilities, RESTHeart often overcomes the results that can
be achieved accessing MongoDB directly via its Java driver.

This section includes the performance test results gathered by the
SoftInstigate’s development team and includes all the information needed
to autonomously reproduce the tests.