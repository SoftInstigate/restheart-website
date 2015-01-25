---
layout: doc-page-md
title:  "RESTHeart performances"
permalink: /docs/performances.html
class2: active
---

RESTHeart delivers excellent performances and it often outcomes the results that can be achieved accessing MongoDB directly via its driver. This section includes the performance test results gathered by the SoftInstigate development team and includes all the information needed to reproduce the tests. 

<!-- more -->

## Results
{: .post}

### test case 1
{: .post}

> measure the execution time to create 1 million documents with random data using 200 test threads.

![test 1 execution time](/images/perftest/test-1-et.png)

> In this scenario, using RESTHeart introduces just 2,41% overhead over the total execution time.

||Execution Time|TPS|
|-|:-:|:-:|
|__RESTHeart__|250s|3990tps|
|__Direct__|244s|4086tps|

<br/>

### test case 2
{: .post}

> measure the execution time to query a collection 100.000 times, getting 5 documents each time (limit 5) and skipping just 25 documents, under different concurrency levels. 

![test 2 execution time](/images/perftest/test-2-et.png)

![test 2 tps](/images/perftest/test-2-tps.png)

> RESTHeart delivers better performances under any concurrency level over the direct access via the MongoDB driver.

||50|100|200|250|400|500|
|:-|:-:|:-:||:-:|:-:||:-:|:-:|
|__RESTHeart__|78s|82s|78s|76s|76s|76s|
|__Direct__|97s|95s|96s|96s|109s|112s|

<br/>

### test case 3
{: .post}

> measure the execution time to query a collection 2.000 times, getting 5 documents each time (limit 5) and skipping just 250.000 documents, under different concurrency levels.

![test 3 execution time](/images/perftest/test-3-et.png)

![test 3 tps](/images/perftest/test-3-tps.png)

> Thanks to the eager pre-allocation dbcursor engine, queries with significant skip parameter executes much faster (50 times in this case) with RESTHeart.

||1|2|4|5|8|10|20|40|50|80|100|200|400|500|
|:-|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|__RESTHeart__|16,28s|6,22|5,05s|2,53s|3,76s|3,6s|2,98s|5,65s|9,04s|10,74s|6,76s|9,24s|6,76s|12,71s|
|__Direct__|1091s|627s|324s|328s|329s|325s|324s|321s|321s|304s|302s|305s|327s|327s|

<br/>

### test case 4
{: .post}

> measure the execution time to query a collection 500 times, getting 5 documents each time (limit 5) skipping more and more documents each time, with a concurrency level of 4.

![test 4 execution time](/images/perftest/test-3-et.png)

![test 4 tps](/images/perftest/test-3-tps.png)

> Thanks to the eager pre-allocation dbcursor engine, queries with significant skip parameter executes much faster (up to 470 times in this scenario) with RESTHeart.

Kskips = 1000 skip

||250 Kskips|500 Kskips|750 Kskips|1.000 Kskips|1.250 Kskips|1.500 Kskips|1.750 kskips|2.000 kskips|2.250 Kskips|
|:-|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|__RESTHeart__|2,6s|1,91s|1,9s|1,88s|1,58s|2,05s|1,51s|1,52s|1,51s|
|__Direct__|79s|156s|242s|317s|375s|453s|558s|601s|713s|


## How we tested
{: .post}

### hardware
{: .post}

MongoDB and RESTHeart running on Sunfire X2200 M2 with 2 CPU with 16 Gbyte of RAM. See full specification [here](http://docs.oracle.com/cd/E19121-01/sf.x2200m2/819-6597-12/Chap1.html). This is an _old_ server (8 years old) with 2 dual core 2,2GHz AMD Opteron CPUs.

Test cases run by MacBook Pro with 2,66 GHz Intel Core i7 and 8 GB 1067 MHz DDR3

The client and the server on the same local network linked by a 10/100 Ethernet switch.

### software
{: .post}

* __Server OS__: Ubuntu server 64bit 14.04.1 LTS
* __Client OS__: Mac OS X Yosemite 10.10.1
* __MongoDB__: 2.6.7
* __RESTHeart__: 2.8-SNAPSHOT (commit 01d403a5db8b765ad5b0a8eec1fda420c392ab58)

### configuration
{: .post}

__MongoDB__: run (without authentication enabled) with the following command

{% highlight bash %}
$numactl --interleave=all /opt/mongodb/bin/mongod --fork --syslog
{% endhighlight %}


__RESTHeart__: run with default parameters with the following exception:

* logging to file off
* eager-cursor-allocation-linear-slice-heights set to [50]
* io-threads: 8 
* worker-threads: 64 

### test cases
{: .post}

We used the brilliant [load test tool](https://github.com/bazhenov/load-test-tool).

The test case code is available on github as part of the RESTHeart source code baseline. You can find it [here](https://github.com/SoftInstigate/restheart/tree/develop/src/test/java/org/restheart/test/performance)

