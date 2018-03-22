---
layout: docs
title: Speedup Requests with Cursor Pools
---

* [Introduction](#introduction)
* [How it works](#how-it-works)
* [Request parameters](#request-parameters)
* [Configuration](#configuration)
* [Consideration on concurrent insertions](#consideration-on-concurrent-insertions)
* [Attachments:](#attachments)

## Introduction

RESTHeart speedups the execution of GET requests to collections
resources via its **db cursors pre-allocation engine**. 

This applies when several documents need to be read from a big
collection and moderates the effects of the
MongoDB [cursor.skip()](http://docs.mongodb.org/manual/reference/method/cursor.skip/#cursor.skip) method
**that slows downs linearly**.

In common scenarios, RESTHeart's db cursor pre-allocation engine allows
to deliver brilliant performances, even up to a 1000% increase over
querying MongoDB directly with its Java driver.

Refer to the [Performances](Performances) section for more information
and real case results.

Let's first clarify the issue addressed by the engine.

RESTHeart allows to [query documents](Query_Documents) via GET requests
on collection resources where documents are returned as embedded
resources.

``` bash
$ http -a a:a GET "127.0.0.1:8080/test/coll?count&page=3&pagesize=10"
HTTP/1.1 200 OK
...
{
    "_embedded": {
        "rh:doc": [
            { <DOC30> }, { <DOC31> }, ... { <DOC39> }
        ]
    },
    ...
}
```

Of course documents are returned as **paginated** result sets, i.e. each
request returns a limited number of documents.

Pagination is controlled via the following query parameters:

-   `page`: the range of documents to return
-   `pagesize`: the number of documents to return (default value is 100,
    maximum is 1000).

**Behind the scene, this is implemented via the MongoDB *cursor.skip()*
method; **

The issue is that MongoDB queries with a large "skip" slow down
linearly. As the MongoDB manual says:

> The cursor.skip() method is often expensive because it requires the
> server to walk from the beginning of the collection or index to get
> the offset or skip position before beginning to return result. As
> offset (e.g. pageNumber above) increases, cursor.skip() will become
> slower and more CPU intensive. With larger collections, cursor.skip()
> may become IO bound.

That is why the MongoDB documentation section about
[skips](http://docs.mongodb.org/manual/reference/method/cursor.skip/#cursor.skip)
suggests:

> Consider using range-based pagination for these kinds of tasks. That
> is, query for a range of objects, using logic within the application
> to determine the pagination rather than the database itself. This
> approach features better index utilization, if you do not need to
> easily jump to a specific page.

## How it works

When RESTHeart detects a query involving many skips (with a big *page*
query parameter), in parallel it starts pre-allocating other cursors
(with same sort, filter and projection parameters) in a pool; further
similar requests will be served much quicker because the cursors needed
to retrieve the data will probably be in the pool and already skipped.

-   Requests involving less skips
    than eager-cursor-allocation-linear-slice-width parameter value,
    will not trigger the pre-allocation of cursors.
-   A request involving to skip N documents will use a cursor from the
    pool only if it has been skipped by more than 90% of N documents
    (tests suggests this to be the case).
-   Cursors will last in the pool for 8 minutes (MongoDB will timeout
    the cursors in 10 minutes anyway).
-   Two different cursors allocation policies can be applied and
    controlled by the *eager* query parameter: LINEAR and RANDOM. The
    former will better improve a linear scanning of the collection
    (reading pages in sequence), the latter, random accesses.

The difference between the two policies is that in the LINEAR case, a
configurable number of cursors are allocated **near** the original
request, following the [principle of
locality](https://en.wikipedia.org/wiki/Locality_of_reference); in the
RANDOM case, a configurable number of cursors is allocated uniformly.

The following images depicts how it works, in the LINEAR case:**  
**

1.  **Request A** asks for 5 documents starting from the 1.000.000th
    document. MongoDB needs to generate a cursor skipping 1.000.000
    documents: this takes time to complete;
2.  Asynchronously, the **db cursor pre-allocation engine** creates few
    cursor in the pool (*delta*, *slice width* and actual number of
    cursors being configurable);
3.  **Request B** asks for 5 documents starting for the next page.
    RESTHeart finds cursor in the pool that has been already skipped. In
    this case, only 3 more skips are needed.

![](attachments/9207943/12058633.png?width=640){.image-center
width="640" height="400"}

The following images depicts how it works, in the RANDOM case:

1.  **Request A** asks for 5 documents starting from the 1.000.000th
    document (page=200.000). MongoDB needs to generate a cursor skipping
    1.000.000 documents that takes time to complete;
2.  Asynchronously, the **db cursor pre-allocation engine** creates few
    cursor in the pool (*slice width* and actual number of cursors being
    configurable)
3.  **Request B** asks for the 250.000th page. RESTHeart finds a cursor
    in the pool that has been already skipped. In the worst case only
    *slice width* skips are needed.

![](attachments/9207943/12058637.png?width=640){.image-center
width="640"}

 

## Request parameters

The engine is controlled by the *eager* query parameter. Possible values
are:

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th><div>
value
</div></th>
<th><div>
description
</div></th>
<th><div>
default
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong><code>linear </code></strong></td>
<td>LINEAR policy</td>
<td>√</td>
</tr>
<tr class="even">
<td><strong>random</strong></td>
<td>allocate cursors RANDOM policy</td>
<td> </td>
</tr>
<tr class="odd">
<td><strong>none</strong></td>
<td>the cursor pool will not be used</td>
<td> </td>
</tr>
</tbody>
</table>

Example

``` bash
$ http -a a:a GET "127.0.0.1:8080/test/coll?count&page=1000&pagesize=1000&eager=random"
```

## Configuration

``` plain
## eager db cursor preallocation policy
# in big collections, reading a far page involves skipping the db cursor for many documents resulting in a performance bottleneck
# for instance, with default pagesize of 100, a GET with page=50.000 involves 500.000 skips on the db cursor.
# the eager db cursor preallocation engine boosts up performaces (in some use cases, up to 1000%). the following options control its behavior.

eager-cursor-allocation-pool-size: 100
eager-cursor-allocation-linear-slice-width: 1000
eager-cursor-allocation-linear-slice-delta: 100
eager-cursor-allocation-linear-slice-heights: [ 4, 2, 1 ]
eager-cursor-allocation-random-max-cursors: 20
eager-cursor-allocation-random-slice-min-width: 1000
```

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>parameter</th>
<th>description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><pre><code>eager-cursor-allocation-pool-size</code></pre></td>
<td>The maximum number of cursors to allocate overall. Note that a pool is generate for each combination of filter, sort_by and key parameters.</td>
</tr>
<tr class="even">
<td><pre><code>eager-cursor-allocation-linear-slice-width</code></pre></td>
<td>Applies for the LINEAR policy. It is the width of a pool slice, i.e. the distance between two cursors clusters.</td>
</tr>
<tr class="odd">
<td><pre><code>eager-cursor-allocation-linear-slice-delta</code></pre></td>
<td><p>Applies for the LINEAR policy. Cursors are not preallocated exactly from the first request page, but Delta skips before.</p>
<p>This allows to cover the case when further requests are actually for a previous pages.</p></td>
</tr>
<tr class="even">
<td><pre><code>eager-cursor-allocation-linear-slice-heights</code></pre></td>
<td><p>Applies for the LINEAR policy. It is the number of clusters to generate and cursors to allocate</p>
<p>For instance the value [4,2,1] means to create 3 clusters, the first with 4 cursors, the second with 2 and the last with 1.</p></td>
</tr>
<tr class="odd">
<td><pre><code>eager-cursor-allocation-random-max-cursors</code></pre></td>
<td>Applies for the RANDOM policy. It is the the maximum number of cursors to allocate for each combination of filter, sort_by and key parameters.</td>
</tr>
<tr class="even">
<td><pre><code>eager-cursor-allocation-random-slice-min-width</code></pre></td>
<td>Applies for the RANDOM policy. It is the minimum width of a pool slice, i.e. the minimum distance between two cursors clusters.</td>
</tr>
</tbody>
</table>

## Consideration on concurrent insertions

When iterating a cursor that uses an index for the sort, then:

-   a document inserted *after* the cursor's position will appear in the
    results. 
-   a document inserted *before* the cursor's position doesn't affect
    the cursor's position or meaning of the current "skip". 

When iterating a sorted cursor without an index, documents inserted
after the cursor will not appear in the results. Note that, if the
collection is big, sorting by properties that are not indexed is not a
good idea and will probably lead to a MongoDB error anyway.

In this case, the **eager=none** parameter can be specified.

## Attachments:

![](images/icons/bullet_blue.gif){width="8" height="8"} [Schermata
2015-09-21 alle 16.10.40.png](attachments/9207943/12058632.png)
(image/png)  
![](images/icons/bullet_blue.gif){width="8" height="8"} [dbcursor
preallocation linear policy.png](attachments/9207943/12058633.png)
(image/png)  
![](images/icons/bullet_blue.gif){width="8" height="8"} [dbcursor
preallocation random policy.png](attachments/9207943/12058637.png)
(image/png)  
