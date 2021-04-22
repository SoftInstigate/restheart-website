---
title: GraphQL API
layout: docs
---

<div  markdown="1"  class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Overview](#overview)
- [GraphQL Applications](#graphql-applications)
	- [Descriptor](#descriptor)
	- [Schema](#schema)
	- [Mappings](#mappings)
		- [Field to Field mapping](#field-to-field-mapping)
		- [Field to Query mapping](#field-to-query-mapping)
- [Queries](#queries)
- [Responses](#responses)
- [Optimization](#optimization)

</div>

<div  markdown="1"  class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Overview

The GraphQL plugin works side by side with the already existing REST endpoints to get a managed unified GraphQL API to build modern applications.

The `restheart-graphql` service added to RESTHeart exposes a read-only (no mutations and subscription) GraphQL API for inquiring MongoDB resources.

## GraphQL Applications

For each GraphQL application you need to upload on MongoDB a so called **definition**. You can specify the MongoDB's collection reserved for this purpose within the RESTHeart's YAML configuration as follow:

```yml
plugins-args:
  graphql:
    enabled: true
    secured: false
    uri: /graphql
    db: <db_name>
    collection: <reserved_collection_name>
    verbose: false
```
by default:

-  `<db_name>`= *restheart*
-  `<reserved_collection_name>`= *gql-apps*

This kind of configuration  allows you to change dynamically the behavior of your GraphQL application by updating the related document on MongoDB.

A GraphQL application definition is composed by three sections:

```json
{
  "descriptor": "...",
  "schema": "...",
  "mapping": "..."
}
```

### Descriptor


Here you can specify:

-  `name`: GraphQL application name.
-  `description`: GraphQL application description.
-  `enabled`: can be *true* or *false*. If it's *false*, the GraphQL application can't be queried and vice-versa. By default it is *true*.
-  `uri`: it specifies at which endpoint your GraphQL application is reachable (e.g. `/graphql/uri`). If you don't specify the URI, application's name is used instead (so, at least one between *name* and *URI* must be present).

```json
{
  "descriptor": {
    "name": "MyApp",
    "description": "my first test GraphQL application",
    "enabled": true,
    "uri": "myapp"
  },
  "schema": "...",
  "mapping": "..."
}
```

### Schema

This section must contain GraphQL application's schema written with *Schema Definition Language* (SDL). For example:

```json
{
  "descriptor": "...",
  "schema": "type User{name: String surname: String email: String posts: [Post]} type Post{text: String author: User} type Query{users(limit: Int = 0, skip: Int = 0)}",
  "mapping": "..."
}
```

Remember that, in order to be a valid schema, it must contain type *Query*.

### Mappings

In this section you can specify how GraphQL types fields are mapped on MongoDB data. Mappings have to be organized following the same hierarchical structure of GraphQL SDL schema, so for each GraphQL type you can insert a JSON object with a property for each field that you want to map.

Two kinds of mapping can be made:

- Field to Field mapping
- Field to Query mapping

#### Field to Field mapping

You can map a GraphQL field with a specific MongoDB document field or with an element of a MongoDB array by **dot-notation**. For instance:

```json
{
  "descriptor": "...",
  "schema": "...",
  "mappings":{
    "User": {
      "name": "firstName",
      "phone": "contacts.phone",
      "email": "contacts.emails.0",
    },
    "Post": "...",
    "Query": "..."
  }
}
```

Whit this configuration:

- `name` is mapped with MongoDB document `firstName` field
- `phone` is mapped with field `phone` in `contacts` nested document
- `email` is mapped with 1st element of `emails` array within `contacts` nested document

Notice that, if you don't specify a mapping for a field, RESTHeart will map it with a MongoDB document field with the same name.

#### Field to Query mapping

You can map a GraphQL field with a MongoDB query using the following parameters:

-  `db` (String): database name;
-  `collection` (String): collection name;
-  `find` (Document): selection filter using query operators (e.g. `$in`, `$and`, `$or`, ...);
-  `sort` (Document): order in which the query returns matching documents;
-  `skip` (Document or Integer): how many documents should be skipped of those resulting;
-  `limit` (Document or Integer): how many documents should be returned at most of those resulting.

Moreover, a query is **parametric** when the mapped MongoDb query includes one or more `$arg` and `$fk` operators:

 - `$arg`: allows to use the arguments of the GraphQL query in the MongoDb query;
 - `$fk`: allows to map a GraphQL field with a MongoDB relation, specifying which is the document field that holds the relation.

For example, having the following GraphQL schema:

```
type User {
  id: Int!
  name: String
  posts: [Post]
}

type Post {
  id: Int!
  text: String
  author: User
}

type Query {
  usersByName(_name: String!, _limit: Int = 0, _skip: Int = 0): [Users]
}
```
with MongoDB data organized in the two collections *users* and *posts*:

**USERS**
```json
{
  "_id": {"$oid": "6037732f5fa7d52581015ed9" },
  "firstName": "Foo",
  "lastName": "Bar",
  "contacts": { "phone": "+39113", "emails": ["foo@domain.com", "f.bar@domain.com"],
  "posts_ids": [ { "$oid": "606d963f74744a3fa6f4489a" }, { "$oid": "606d963f74744a3fa6f4489e" } ] }
}
```

**POSTS**
```json
[
  { "_id": {"$oid": "606d963f74744a3fa6f4489a" },
    "text": "Lorem ipsum dolor sit amet",
    "author_id": {"$oid": "6037732f5fa7d52581015ed9" }
  },
  { "_id": {"$oid": "606d963f74744a3fa6f4489e" },
    "text": "Lorem ipsum dolor sit amet",
    "author_id": {"$oid": "6037732f5fa7d52581015ed9" }
  }
]
```
then, possible mappings are:

```json
{
  "descriptor": "...",
  "schema": "...",
  "mappings": {
    "User": {
      "posts": {
        "db": "restheart",
        "collection": "posts",
        "find": {
          "_id": {
            "$in": {
              "$fk": "posts_ids"
            }
          }
        }
      }
    },
    "Post": {
      "author": {
        "db": "restheart",
        "collection": "user",
        "find": {
          "_id": {
            "$fk": "author_id"
          }
        }
      }
    },
    "Query": {
      "usersByName": {
        "db": "restheart",
        "collection": "users",
        "find": {
          "name": {
            "$arg": "_name"
          }
        },
        "limit": {
          "$arg": "_limit"
        },
        "skip": {
          "$arg": "_skip"
        },
        "sort": {
          "name": -1
        }
      }
    }
  }
}
```
As result, we are saying that:

 - given a `User`, his posts are the MongoDB documents, within the `posts` collection, with value of field `_id` that falls in the `posts_ids` array of `User`'s document;
 - given a `Post`, its author is the MongoDB document, within the `users` collection, with value of field `_id` equal to `author_id` of `Post`'s document;
 - asking for `userByName` GraphQL field, the MongoDB documents searched are the ones within the `users` collection with field `name` equal to value of `_name` GraphQL argument. Moreover, we are asking to return at most `_limit` documents, to skip the firsts `_skip` ones and to sort them by name in reverse order.

{: .bs-callout.bs-callout-info}
Note that you can use also *dot-notation* with the `$fk` operator.

## Queries

Up to now, only GraphQL Query can be made, so no subscription or mutation. In order to make a query you can use HTTP request with POST method and both content-type *application/json* and *application/graphql*. For instance:

**application/json**

```
POST /graphql/<app-uri> HTTP/1.1
Host: <host-name>
Content-Type: application/json

{
  "query": "query test_operation($name: String){ userByName(_name: $name){name posts{text}} }",
  "variables": { "name": "..." },
  "operationName": "..."
}
```

**application/graphql**

```
POST /graphql/<app-uri> HTTP/1.1
Host: <host-name>
Content-Type: application/graphql

{
  userByName(_name: "...") {
      name
      posts {
        text
      }
  }
}
```

## Responses

In the following table are reported possible RESTHeart GraphQL Service responses:

{: .table .table-responsive}
|**HTTP Status code**|**description**|
|:--:|:--:|
| 200 |It's all OK!|
| 400 |Invalid GraphQL query (e.g. required fields are not in the schema, argument type mismatch), schema - MongoDB data type mismatch, invalid app definition|
| 401 |Unauthorized|
| 404 |There is no GraphQL app bound to the requested endpoint |
| 405 |HTTP method used not supported|
| 500 |Internal Server Error|

### Example responses

#### 200 - OK

```json

{
  "data":{
    "userByName":[
      {
        "firstName": "nameUser1",
        "lastName": "surnameUser1"
      },
      {
        "firstName": "nameUser2",
        "lastName": "surnameUser2"
      }
    ]
  }
}

```

#### 400 - Bad Request - Invalid GraphQL Query / schema - MongoDB data type mismatch

```json
{
  "data": "...",
  "errors" : "..."
}
```

#### 400 - Bad Request - Invalid GraphQL App Definition

```json
{
  "http status code":  400,
  "http status description":  "Bad Request",
  "message":  "..."
}
```

#### 405 - Method Not Allowed

```json
{
  "http status code":  405,
  "http status description":  "Method Not Allowed"
}
```

#### 500 - Internal Server Error

```json
{
  "http status code":  500,
  "http status description":  "Internal Server Error"
}
```

## Optimization

It's well known that every GraphQL service suffers of *N+1 requests problem* (link?). In our case this problem arises every time that a relation is mapped through the `$fk` operator with a MongoDB query. For example, given the following GraphQL schema:

```
type User {
  id: Int!
  name: String
  posts: [Post]
}

type Post {
  id: Int!
  text: String
  author: User
}

type Query {
  posts(_limit: Int = 0, _skip: Int = 0): [Post]
}
```

mapped with:

```json
{
  "descriptor": "...",
  "schema": "...",
  "mappings": {
    "User": {
      "posts": {
        "db": "restheart",
        "collection": "posts",
        "find": {
          "_id": {
            "$in": {
              "$fk": "posts_ids"
            }
          }
        }
      }
    },
    "Post": {
      "author": {
        "db": "restheart",
        "collection": "user",
        "find": {
          "_id": {
            "$fk": "author_id"
          }
        }
      }
    },
    "Query": {
      "posts": {
        "db": "restheart",
        "collection": "posts",
        "limit": {
          "$arg": "_limit"
        },
        "skip": {
          "$arg": "_skip"
        }
      }
    }
  }
}
```

then, executing the GraphQL query:

```
{ posts(_limit: 10) {
    text
    author {
      name
    }
  }
}
```
RESTHeart will make:

- a MongoDB query to fetch the first 10 documents of `posts` collection;
- a MongoDB query for each one of the 10 posts returned by the first one.

Precisely, N+1 requests.

In order to mitigate the N+1 problem and optimize performances of yours GraphQL API, RESTHeart allows you to use **per-request DataLoaders** to batch and cache MongoDB queries. This can be done specifying **dataLoader** field within the Field to Query mapping. For instance, the author mapping seen above becomes:

```json
{
  "descriptor": "...",
  "schema": "...",
  "mappings": {
    "User": "...",
    "Post": {
      "author": {
        "db": "restheart",
        "collection": "user",
        "find": {
          "_id": {
            "$fk": "author_id"
          }
        },
        "dataLoader": {
          "batching": true,
          "caching": true,
          "maxBatchSize": 20
        }
      }
    },
    "Query": "..."
  }
}
```
where:

- `batching` (boolean): allows you to specify if queries batching is enabled. By default it's *false*;
- `caching` (boolean): allows you to specify if queries caching is enabled. By default it's *false*;
- `maxBatchSize` (int): allows you to specify how many queries batch together at most.

{: .bs-callout.bs-callout-info}
Note that there's no magic number for *maxBatchSize*, so you have to tune it experiencing. For this purpose you can set *verbose = true* under the GraphQL plugin configuration within *restheart.yaml*.   In this way, RESTHeart will insert DataLoader statistics inside GraphQL queries answers.

**Example**

```json
{
"data":  {"..."},
  "extensions":  {
  "dataloader":  {
      "overall-statistics":  {
        "loadCount":  0,
        "loadErrorCount":  0,
        "loadErrorRatio":  0.0,
        "batchInvokeCount":  0,
        "batchLoadCount":  0,
        "batchLoadRatio":  0.0,
        "batchLoadExceptionCount":  0,
        "batchLoadExceptionRatio":  0.0,
        "cacheHitCount":  0,
        "cacheHitRatio":  0.0
      },
      "individual-statistics":  {
        "dataLoader1":"...",
        "dataLoader2":"...",
        "dataLoader3":"..."
      }
    }
  }
}
```