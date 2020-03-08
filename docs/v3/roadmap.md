---
layout: docs
title: Roadmap
---

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## RESTHeart 4.0

## Security

RESTHeart 4.0 is split in two modules, restheart-core and restheart-security.

[restheart-security](https://github.com/softInstigate/restheart-security) is a spin-off project from RESTHeart. It is a Identity and Access Manager that includes and extends the security features embedded in RESTHeart 3.x.

> restheart-security only focus on security while restheart-core just provides a Web API for MongoDB in the spirit of having software bricks each of whom *does just one thing and does it well*. 

restheart-security follows the same dual licensing scheme of RESTHeart.

### Development status

- <span style="color:green">**done**</span>

## Representation format

We received many feedbacks asking for a simpler representation format and we have worked on it for [mrest.io](https://mrest.io), the cloud RESTHeart service (currenlty in beta). 

> You can try the new format creating a free account at [mrest.io](https://mrest.io).

Starting with RESTHeart 4.0 a new simpler representation format is available. The 3.x representation formats (plain json and HAL) will be still be available. 

The new format, called STANDARD, is as follows:

```bash
# list of dbs -> GET /

[
    "db_1", 
    "db_2", 
    ...,
    "db_n"
]

# list of collections of a db -> GET /db

[ 
    "collection_1", 
    "collection_2", 
    ...,
    "collection_n" 
]

# metadata of a collection  -> GET /db/_meta

{
    "args": [...]
    "checkers": [...],
    "transformers": [...],
    "streams": [...]
}

# documents of a collection -> GET /db/coll
[ 
    { <doc_1> },
    { <doc_2> },
    ...,
    { <doc_n> }
]

# cound documents of a collection -> GET /db/coll/_size

{ "_size": n }

# a document -> GET /db/coll/docid

{ 
    "prop_1": value,
    "prop_2": value,
    ...,
    "prop_n": value,
}
```

### Development status

- <span style="color:green">**done**</span>
- added new representation format called STANDARD
- add integration tests using karate

### TODOs

- <span style="color:green">**done**</span>

## Changes Streams with Websocket

RESTHeart Platform 4.0 fully supports [change streams](https://docs.mongodb.com/manual/changeStreams/index.html) introduced by MongoDB 3.6 for replica sets.

> note: this feature is only available with RESTHeart Platform.

A new resource is available, called `stream`. A stream can be created specifying a collection metadata that defines an aggregation and a URI in a similar way than an aggregation resource is currently defined.

The stream URI endpoint will open a *Websocket* for the client to be notified of updates on the aggregation result.

### Development status

- <span style="color:green">**done**</span>

## Sessions

RESTHeart 4.0 fully supports [sessions](https://docs.mongodb.com/manual/changeStreams/index.html) introduced by MongoDB 3.6.

### Development status

- <span style="color:green">**done**</span>

## Transactions

RESTHeart Platform 4.0 fully supports [multi document transactions](https://docs.mongodb.com/manual/core/write-operations-atomicity/#multi-document-transactions) introduced by MongoDB 4.0 for replica sets.

> note: this feature is only available with RESTHeart Platform.

Following the REST paradigm, the approach to support transactions is modeling them as first class resources. 

The client can start a transaction:

```bash
#start a session
POST /_sessions
Location: /_sessions/53874250-874f-4f48-84e2-145428e9af7b

#start a tx in the session
POST /53874250-874f-4f48-84e2-145428e9af7b/_txns

HTTP/1.1 200 OK
```

Once a transaction has been created, requests can be executed under tis scope:

```bash
#create a document in the tx scope
POST /db/coll?sid=53874250-874f-4f48-84e2-145428e9af7b&txn=1 {"a": 1}

HTTP/1.1 201 Created
```

The transaction can be committed or rolled back:

```bash
#commit txn 1 od session 53874250-874f-4f48-84e2-145428e9af7b
PATCH /_sessions/53874250-874f-4f48-84e2-145428e9af7b/_txns/1

HTTP/1.1 204 No Content
```

```bash
#roll back txn 1 of session 53874250-874f-4f48-84e2-145428e9af7b
DELETE /_sessions/53874250-874f-4f48-84e2-145428e9af7b/_txns/1

HTTP/1.1 204 No Content
```

### Development status

- <span style="color:green">**done**</span>

## Plugin API changes

The java API for plugins (Transformers, Hooks, Checkers and Initializers) will undergo a refactoring aimed at simplify and cleaning the API with limited impacts on existing implementations.

### Development status

- <span style="color:green">**done**</span>
