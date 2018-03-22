---
layout: docs
title: Performances
---

* [Results](#results)
    * [Test case 1](#test-case-1)
* [Test case 2](#test-case-2)
    * [Test case 3](#test-case-3)
    * [Test case 4](#test-case-4)
* [How we tested](#how-we-tested)
    * [Hardware](#hardware)
    * [Software](#software)
    * [Configurations](#configurations)
    * [Test cases](#test-cases)

RESTHeart has been designed and developed with lightness and
performances as fundamental parameters. On this regards, also thanks to
its caching capabilities, RESTHeart often overcomes the results that can
be achieved accessing MongoDB directly via its Java driver.

This section includes the performance test results gathered by the
SoftInstigate’s development team and includes all the information needed
to autonomously reproduce the tests.

## Results

### Test case 1

Measure the execution time to create **1 million documents** with random
data, using **200 test threads.**

![test 1 execution
time](http://restheart.org/images/perftest/test-1-et.png)

In this scenario, RESTHeart introduces just a **2,41% overhead** over
the total execution time:

|               | Execution Time |    TPS   |
|---------------|:--------------:|:--------:|
| **RESTHeart** |      250s      | 3990 tps |
| **Direct**    |      244s      | 4086 tps |

## Test case 2

Measure the execution time to **query a collection 100.000 times**,
getting 5 documents each time (limit 5) and skipping just 25 documents,
under different concurrency levels. 

![test 2 execution
time](http://restheart.org/images/perftest/test-2-et.png)

![test 2 tps](http://restheart.org/images/perftest/test-2-tps.png)

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
time](http://restheart.org/images/perftest/test-3-et.png)

![test 3 tps](http://restheart.org/images/perftest/test-3-tps.png)

Thanks to the eager pre-allocation DBCursor engine, queries with
significant skip parameter executes much faster (50 times in this case)
with RESTHeart:

| Threads       |    1   |   2   |   4   |   5   |   8   |  10  |   20  |   40  |   50  |   80   |  100  |  200  |  400  |   500  |
|---------------|:------:|:-----:|:-----:|:-----:|:-----:|:----:|:-----:|:-----:|:-----:|:------:|:-----:|:-----:|:-----:|:------:|
| **RESTHeart** | 16,28s | 6,22s | 5,05s | 2,53s | 3,76s | 3,6s | 2,98s | 5,65s | 9,04s | 10,74s | 6,76s | 9,24s | 6,76s | 12,71s |
| **Direct**    |  1091s |  627s |  324s |  328s |  329s | 325s |  324s |  321s |  321s |  304s  |  302s |  305s |  327s |  327s  |

### Test case 4

Measure the execution time to **query a collection 500 times**, getting
5 documents each time (limit 5) skipping more and more documents each
time, with a concurrency level of 4.

![test 4 execution
time](http://restheart.org/images/perftest/test-3-et.png)

![test 4 tps](http://restheart.org/images/perftest/test-3-tps.png)

Thanks to the eager pre-allocation DBCursor engine, queries with
significant skip parameter executes much faster (up to 470 times in this
scenario) with RESTHeart.

(Kskips = 1000 skip)

| Kskips        |  250 |  500  |  750 | 1.000 | 1.250 | 1.500 | 1.750 | 2.000 | 2.250 |
|---------------|:----:|:-----:|:----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| **RESTHeart** | 2,6s | 1,91s | 1,9s | 1,88s | 1,58s | 2,05s | 1,51s | 1,52s | 1,51s |
| **Direct**    |  79s |  156s | 242s |  317s |  375s |  453s |  558s |  601s |  713s |

## How we tested

### Hardware

MongoDB and RESTHeart running on Sunfire X2200 M2 with 2 CPU with 16
Gbyte of RAM. See full
specification [here](http://docs.oracle.com/cd/E19121-01/sf.x2200m2/819-6597-12/Chap1.html).
This is an *old *server with 2 dual core 2,2GHz AMD Opteron CPUs.

Test cases run by MacBook Pro client with 2,66 GHz Intel Core i7 and 8
GB 1067 MHz DDR3

The client and the server on the same local network linked by a 10/100
Ethernet switch.

### Software

-   **Server OS**: Ubuntu server 64bit 14.04.1 LTS
-   **Client OS**: Mac OS X Yosemite 10.10.1
-   **MongoDB**: 2.6.7
-   **RESTHeart**: commit 01d403a5db8b765ad5b0a8eec1fda420c392ab58

### Configurations

**MongoDB**: run (without authentication enabled) with the following
command

``` plain
$numactl --interleave=all /opt/mongodb/bin/mongod --fork --syslog
```

**RESTHeart**: run with default parameters with the following exception:

-   logging to file off
-   eager-cursor-allocation-linear-slice-heights set to \[50\]
-   io-threads: 8 
-   worker-threads: 64 

### Test cases

We used the brilliant [load test
tool](https://github.com/bazhenov/load-test-tool).

The test case code is available on Github as part of the RESTHeart
source code baseline. You can find
it [here](https://github.com/SoftInstigate/restheart/tree/develop/src/test/java/org/restheart/test/performance).

 
