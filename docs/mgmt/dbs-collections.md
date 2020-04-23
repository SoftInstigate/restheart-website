---
layout: docs
title: Databases and Collections
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [Create a collection](#create-a-collection)
-   [Modify the properties of a collection](#modify-the-properties-of-a-collection)
-   [Delete a collection](#delete-a-collection)
-   [Before running the example requests for dbs](#before-running-the-example-requests-for-dbs)
-   [Create a db](#create-a-db)
-   [Modify the properties of a db](#modify-the-properties-of-a-db)
-   [Delete a db](#delete-a-db)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction 

RESTHeart allows managing dbs and collections.

## Create a collection

```http
PUT /foo HTTP/1.1

{ "descr": "just a test collection" }

HTTP/1.1 201 Created

```

Note that RESTHeart allows to set properties for collections.

{: .bs-callout.bs-callout-info }
Note that some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

The collection's properties can be read as follows:

```http
GET /foo/_meta HTTP/1.1

HTTP/1.1 200 OK

{
    "_etag": {
        "$oid": "5d95ef77ab3cf85b199ed3b7"
    },
    "_id": "_meta",
    "descr": "just a test collection"
}
```

## Modify the properties of a collection

`PUT` and `PATCH` verbs modify the properties of the collection.

{: .bs-callout.bs-callout-info}
`PATCH` modifies only properties in the request body; `PUT` replaces the whole properties set.

```http
PATCH /newDb HTTP/1.1

{ "owner": "Bob" }

HTTP/1.1 200 OK
```

## Delete a collection

To delete a collection, the ETag must be passed using the `If-Match` request header.

Let's try to delete the collection `foo` without passing it.

```http
DELETE /foo HTTP/1.1

HTTP/1.1 409 Conflict
...
ETag: 5d95ef77ab3cf85b199ed3b7

{
    "http status code": 409,
    "http status description": "Conflict",
    "message": "The ETag must be provided using the 'If-Match' header."
}
```

Now let's pass the If-Match` request header, the db will be deleted.

```http
DELETE /foo HTTP/1.1
If-Match: 5d95ef77ab3cf85b199ed3b7

HTTP/1.1 204 No Content
```

## Before running the example requests for dbs

The following examples that all dbs are exposes via RESTHeart. For this, edit the property file `etc/default.properties` and set `root-mongo-resource = '*'`:

```
# The MongoDb resource to bind to the root URI /
# The format is /db[/coll[/docid]] or '*' to expose all dbs
root-mongo-resource = '*'
```

After restarting RESTHeart, all MongoDB resources are exposes by RESTHeart. With this configuration the URIs are a follows:

-   database: `/restheart`,
-   collection: `/restheart/inventory`
-   document: `/restheart/inventory/5d08b08097c4c04680c41579`.

For instance, we can list the existing dbs as follows:

```http
GET / HTTP/1.1

[
    "restheart",
    "myDb",
    ...
]

```

## Create a db

```http
PUT /newDb HTTP/1.1

{ "descr": "just a test db" }

HTTP/1.1 201 Created

```

Note that RESTHeart allows to set properties for dbs.

{: .bs-callout.bs-callout-info }
Note that some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

This properties can be read as follows:

```http
GET /newDb/_meta HTTP/1.1

HTTP/1.1 200 OK

{
    "_etag": {
        "$oid": "5d95ed1dab3cf85b199ed3b6"
    },
    "_id": "_meta",
    "desc": "just a test db"
}
```

## Modify the properties of a db

`PUT` and `PATCH` verbs modify the properties of the collection.

```http
PATCH /newDb HTTP/1.1

{ "owner": "Bob" }

HTTP/1.1 200 OK
```

## Delete a db

To delete a db, the ETag must be passed using the `If-Match` request header.

Let's try to delete the `newDb` without passing it.

```http
DELETE /newDb HTTP/1.1

HTTP/1.1 409 Conflict
...
ETag: 5d95ed1dab3cf85b199ed3b6

{
    "http status code": 409,
    "http status description": "Conflict",
    "message": "The database's ETag must be provided using the 'If-Match' header."
}
```

Now let's pass the If-Match` request header, the db will be deleted.

```http
DELETE /newDb HTTP/1.1
If-Match: 5d95ed1dab3cf85b199ed3b6

HTTP/1.1 204 No Content
```
