---
title: Transactions
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Sessions](#sessions)
    -   [Start a session](#start-a-session)
    -   [Execute a request in a session](#execute-a-request-in-a-session)
-   [Transactions](#transactions)
    -   [Transaction Status](#transaction-Status)
    -   [Error handling](#error-handling)
    -   [Start the transaction](#start-the-transaction)
    -   [Get the current transaction status](#get-the-current-transaction-status)
    -   [Execute requests in the transaction](#execute-requests-in-the-transaction)
    -   [Commit the transaction](#commit-the-transaction)
    -   [Abort the transaction](#abort-the-transaction)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

<div class="alert alert-success" role="alert">
    <h2 class="alert-heading"><strong>Stay consistent!</strong></h2>
    <hr class="my-2">
    <p>Enforce <strong>A</strong>tomicity, <strong>C</strong>onsistency, <strong>I</strong>solation and <strong>D</strong>urability with multi-document transactions.</p>
</div>

## Introduction 

An operation on a single document is atomic. This is enough in most use cases since embedded documents can capture relationships between data in a single document.

However, for situations that require atomicity for multiple write requests or consistency between multiple read requests, multi-document transactions must be used.

{: .bs-callout.bs-callout-info }
Multi-document transaction requires at least MongoDB v4.0 configured as a [Replica Set](https://docs.mongodb.com/manual/replication/).

<div class="text-center">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/VMaKyQkXByo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <div class="text-muted">Tech talk on Transaction in RESTHeart at MongoDB Live 2020</div>
</div>

{: .bs-callout.bs-callout-info }
The demo application shown during the talk is available from github at [restheart-txn-demo](https://github.com/softInstigate/restheart-txn-demo)

## Sessions

MongoDB v3.6 introduced _sessions_, defined as follows:

> A session is an abstract concept that represents a set of sequential operations executed by an application that are related in some way.

Sessions allows to enforce <a href="https://docs.mongodb.com/manual/core/read-isolation-consistency-recency/#causal-consistency" target="_blank">casual consistency</a> and are the foundation for transactions.

{: .bs-callout.bs-callout-success }
Sessions are available also in the OS version of RESTHeart. RESTHeart adds support for multi-document transactions on top of sessions.

### Start a session

```http
POST /_sessions HTTP/1.1
{ "causallyConsistent": true }

HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Connection: keep-alive
Content-Length: 0
Content-Type: application/json
Date: Wed, 19 Jun 2019 09:01:04 GMT
Location: http://localhost:8009/_sessions/11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0
X-Powered-By: restheart.org
```

The _causallyConsistent_ property is optional, true by default.

The session id is returned via the _Location_ response header. In this case

```
sid=11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0
```

### Execute a request in a session

Requests can be executed in a session using the |`sid` query parameter.

```http
POST /coll?sid=11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0 HTTP/1.1
{"foo": "bar"}

HTTP/1.1 201 Created
```

```http
GET /coll?sid=11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0 HTTP/1.1

HTTP/1.1 200 OK
```

## Transactions

Transactions are handled in sessions; per each session, one transaction at a time can be started.

### Transaction Status

The following tables lists all possible transactions status.

{: .table.table-responsive}
|status|description|
|IN|The transaction is in progress|
|ABORTED|The transaction has been aborted, either explicitly or due to an error or because it expired|
|COMMITTED|The transaction has been successfully committed|

### Error handling

{: .bs-callout.bs-callout-warning }
The client is responsible of handling the following errors when executing requests inside a transaction and incorporate retry logic.

The following table shows the most important error status that should be handled.

{: .table.table-responsive}
|error|response status|description|
|-|-|
|The given transaction is not in-progress|406|A request is executed in a transaction whose status is not IN|
|Write conflict inside transaction|409|This error occurs when a transaction updating one of more documents tries to commit after a second transaction have been successfully committed updating the same data.|

{: .bs-callout.bs-callout-warning }
By default, a transaction must have a runtime of less than one minute. After that, the transaction is automatically ABORTED.
Check
<a href="https://docs.mongodb.com/manual/core/transactions-production-consideration/#runtime-limit" target="_blank">MongoDB Documentation</a> for more information.

### Start the transaction

Transaction are started in sessions.

The following POST request starts the transaction in session `11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0`

```http
POST /_sessions/11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0/_txns HTTP/1.1

HTTP/1.1 201 Created
Location: http://localhost:8009/_sessions/11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0/_txns/1
...
```

Note that the `Location` response header returns the id of the transaction or `txn`. In this case:

```
txn=1
```

### Get the current transaction status

```http
GET /_sessions/11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0/_txns HTTP/1.1

HTTP/1.1 200 Ok
...
{
    "currentTxn": {
        "id": 1,
        "status": "IN"
    }
}
```

### Execute requests in the transaction

Requests can be executed in the transaction using the `sid` and `txn` query parameters.

```http
POST /coll?sid=11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0&txn=1 HTTP/1.1
{"foo": "bar"}

HTTP/1.1 201 Created
```

```http
GET /coll?sid=11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0&txn=1 HTTP/1.1

HTTP/1.1 200 Ok
```

### Commit the transaction

Use the method PATCH to commit the transaction.

```http
PATCH /_sessions/11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0/_txns/1 HTTP/1.1

HTTP/1.1 200 OK
```

### Abort the transaction

Use the method DELETE to abort the transaction.

```http
DELETE /_sessions/11c3ceb6-7b97-4f34-ba3f-689ea22ce6e0/_txns/1 HTTP/1.1

HTTP/1.1 204 No Content
```
