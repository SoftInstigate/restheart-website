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
  - [Example responses](#example-responses)
    - [200 - OK](#200---ok)
    - [400 - Bad Request - Invalid GraphQL Query / schema - MongoDB data type mismatch](#400---bad-request---invalid-graphql-query--schema---mongodb-data-type-mismatch)
    - [400 - Bad Request - Invalid GraphQL App Definition](#400---bad-request---invalid-graphql-app-definition)
    - [405 - Method Not Allowed](#405---method-not-allowed)
    - [500 - Internal Server Error](#500---internal-server-error)
- [Optimization](#optimization)
- [A complete example](#a-complete-example)
    - [Before running the example requests](#before-running-the-example-requests)

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
| **HTTP Status code** |                                                                     **description**                                                                     |
| :------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: |
|         200          |                                                                      It's all OK!                                                                       |
|         400          | Invalid GraphQL query (e.g. required fields are not in the schema, argument type mismatch), schema - MongoDB data type mismatch, invalid app definition |
|         401          |                                                                      Unauthorized                                                                       |
|         404          |                                                 There is no GraphQL app bound to the requested endpoint                                                 |
|         405          |                                                             HTTP method used not supported                                                              |
|         500          |                                                                  Internal Server Error                                                                  |

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


## A complete example

{: .bs-callout.bs-callout-warning}
*Execute on rest ninja* doesn't work with Safari because it requires HTTPS. Since configuring HTTPS requires a valid certificate and takes some time to [configure](/docs/security/tls/), we suggest to just use Chrome or Firefox for this tutorial.

#### Before running the example requests


The following example assume:

  - RESTHeart Platform running on the localhost with the default configuration: the database *restheart* is bound to `/`, the user *admin* exists with default password *secret*, *gql-apps* is the collection, within `restheart` database, reserved to GraphQL apps definitions and the GraphQL service is reachable at `/graphql`.
  - The `sample-mflix` database (downloadable [here](https://developer.mongodb.com/article/atlas-sample-datasets/#std-label-atlas-sample-data-local-installation)) is stored in the MongoDB instance associated to RESTHeart.


To create the *gql-apps* collection, run the following:

{% include code-header.html
    type="Request"
    link="https://restninja.io/share/cf0d3d9a0f811cf5d6921ad66fcf49cbad852a5a/0"
%}

```http
PUT /gql-apps HTTP/1.1
```

To upload the example GraphQL app definition, run the following:

{% include code-header.html
    type="Request"
    link="https://restninja.io/share/e582fd7affd60a00ee49a537845c1c4b692e1521/0"
%}

```http
POST /gql-apps HTTP/1.1


{
 "descriptor": {
   "name":"MFlix",
   "description":"GraphQL App example using MongoDB sample_mflix dataset",
   "enabled": true,
   "uri":"mflix"
  },
   "schema": "type Comment{  _id: ObjectId  user: User  movie: Movie  text: String  date: DateTime}type Movie{  _id: ObjectId  title: String  year: Int  runtime: Int  released: DateTime  poster: String  plot: String  fullPlot: String  lastUpdate: String  filmType: String  directors: [String]  imdbRate: Float  imdbVotes: Int  countries: [String]  genres: [String]  tomatoesRate: Float  tomatoesReviewsNum: Int  comments(startDate: DateTime = \"-9223372036854775808\", endDate: DateTime = \"9223372036854775807\", sort: Int = 1, skip: Int = 0, limit: Int = 0): [Comment]  relatedMovies: [Movie]}type Session{  _id: ObjectId  user: User  jwt: String} type Theater{  theaterId: Int  location: BsonDocument} type User{  _id: ObjectId  name: String  email: String  comments(startDate: DateTime = \"-9223372036854775808\", endDate: DateTime = \"9223372036854775807\", sort: Int = 1, skip: Int = 0, limit: Int = 0): [Comment]}type Query{  MoviesByTitle(title: String!): [Movie]  MoviesByYear(year: Int!, sort: Int = 1, skip: Int = 0, limit: Int = 0): [Movie]  UserByEmail(email: String!): [User]  MoviesByTomatoesRateRange(min: Float, max: Float, sort: Int = 1, skip: Int = 0, limit: Int = 0):[Movie]  TheatersByCity(city: String!, sort: Int = 1, skip: Int = 0, limit: Int = 0): [Theater]}",
 "mappings": {
   "Comment": {
     "user": {
       "db":"sample_mflix",
       "collection":"users",
       "find": {
         "email": {
           "$fk":"email"
          }
        },
       "dataLoader": {
         "batching": true,
         "caching": true
        }
      },
     "movie": {
       "db":"sample_mflix",
       "collection":"movies",
       "find": {
         "_id": {
           "$fk":"movie_id"
          }
        },
       "dataLoader": {
         "batching": true,
         "caching": false,
         "maxBatchSize": 30
        }
      }
    },
   "Movie": {
     "imdbRate":"imdb.rating",
     "imdbVotes":"imdb.votes",
     "tomatoesRate":"tomatoes.viewer.rating",
     "tomatoesReviewsNum":"tomatoes.viewer.numReviews",
     "lastUpdate":"lastupdated",
     "fullPlot":"fullplot",
     "filmType":"type",
     "comments": {
       "db":"sample_mflix",
       "collection":"comments",
       "find": {
         "$and": [
            {
             "movie_id": {
               "$fk":"_id"
              }
            },
            {
             "date": {
               "$gte": {
                 "$arg":"startDate"
                },
               "$lt": {
                 "$arg":"endDate"
                }
              }
            }
          ]
        },
       "sort": {
         "date": {
           "$arg":"sort"
          }
        },
       "skip": {
         "$arg":"skip"
        },
       "limit": {
         "$arg":"limit"
        },
       "dataLoader": {
         "batching": true,
         "caching": false,
         "maxBatchSize": 30
        }
      }
    },
   "Session": {
     "user": {
       "db":"sample_mflix",
       "collection":"user",
       "find": {
         "email": {
           "$fk":"user_id"
          }
        },
       "dataLoader": {
         "batching": true,
         "caching": false,
         "maxBatchSize": 30
        }
      }
    },
   "User": {
     "comments": {
       "db":"sample_mflix",
       "collection":"comments",
       "find": {
         "email": {
           "$fk":"email"
          }
        },
       "sort": {
         "_id": {
           "$arg":"sort"
          }
        },
       "skip": {
         "$arg":"skip"
        },
       "limit": {
         "$arg":"limit"
        },
       "dataLoader": {
         "batching": true,
         "caching": false,
         "maxBatchSize": 30
        }
      }
    },
   "Query": {
     "MoviesByTitle": {
       "db":"sample_mflix",
       "collection":"movies",
       "find": {
         "title": {
           "$arg":"title"
          }
        }
      },
     "MoviesByYear": {
       "db":"sample_mflix",
       "collection":"movies",
       "find": {
         "year": {
           "$arg":"year"
          }
        },
       "sort": {
         "_id": {
           "$arg":"sort"
          }
        },
       "skip": {
         "$arg":"skip"
        },
       "limit": {
         "$arg":"limit"
        }
      },
     "UserByEmail": {
       "db":"sample_mflix",
       "collection":"users",
       "find": {
         "email": {
           "$arg":"email"
          }
        }
      },
     "MoviesByTomatoesRateRange": {
       "db":"sample_mflix",
       "collection":"movies",
       "find": {
         "tomatoes.viewer.rating": {
           "$gte": {
             "$arg":"min"
            },
           "$lt": {
             "$arg":"max"
            }
          }
        },
       "sort": {
         "tomatoes.viewer.rating": {
           "$arg":"sort"
          }
        },
       "skip": {
         "$arg":"skip"
        },
       "limit": {
         "$arg":"limit"
        }
      },
     "TheatersByCity": {
       "db":"sample_mflix",
       "collection":"theaters",
       "find": {
         "location.address.city": {
           "$arg":"city"
          }
        },
       "sort": {
         "location.address.city": {
           "$arg":"sort"
          }
        },
       "skip": {
         "$arg":"skip"
        },
       "limit": {
         "$arg":"limit"
        }
      }
    }
  }
}
```


To execute a GraphQL request to *Mflix* app with *Content-Type* `application/json`, run the following:

{% include code-header.html
    type="Request"
    link="https://restninja.io/share/e2aed3eb5867ee201b0bee790e3924a16da2219b/0"
%}

```http
POST /graphql/mflix HTTP/1.1

{
   "query":"query exampleOperation($year: Int!, $limit: Int = 0){MoviesByYear(year: $year, limit: $limit){ title comments{ text user{name} date} tomatoesRate}}",
   "variables":{
      "year":2008,
      "limit":2
   }
}
```

{% include code-header.html
    type="Response"
%}

```json
{
  "data": {
    "MoviesByYear": [
      {
        "title": "The Bank Job",
        "comments": [
          {
            "text": "Pariatur voluptatibus placeat quo architecto soluta non. Eaque exercitationem facilis consequuntur.",
            "user": {
              "name": "Shireen Baratheon"
            },
            "date": {
              "$date": 954044557000
            }
          },
          {
            "text": "Facilis ea voluptatem et velit rerum animi corrupti. Commodi esse distinctio modi in pariatur natus. Accusamus culpa voluptatem voluptatibus suscipit.",
            "user": {
              "name": "Lisa Russo"
            },
            "date": {
              "$date": 976465077000
            }
          }
        ],
        "tomatoesRate": 3.5
      },
      {
        "title": "The Flyboys",
        "comments": [],
        "tomatoesRate": 3.6
      }
    ]
  }
}
```


To execute a GraphQL request to *Mflix* app with *Content-Type* `application/graphql`, run the following:


{% include code-header.html
    type="Request"
    link="https://restninja.io/share/705cbffaa3daca184dde2958b15ffd5563faab46/0"
%}

```http
POST /graphql/mflix HTTP/1.1

{
    MoviesByTomatoesRateRange(min: 3.8, max: 4.5, limit: 3, skip: 20, sort: -1){
        title
        comments{
            text
            user{
                name
            }
        }
        tomatoesRate
    }
}
```

{% include code-header.html
    type="Response"
%}

```json
{
  "data": {
    "MoviesByTomatoesRateRange": [
      {
        "title": "The Wages of Fear",
        "comments": [
          {
            "text": "Commodi accusamus totam eaque sunt. Nihil reiciendis commodi molestiae esse ipsam corporis reprehenderit. Non nam similique vel dolor magni quia quis.",
            "user": {
              "name": "Doreah"
            }
          }
        ],
        "tomatoesRate": 4.4
      },
      {
        "title": "Chicago Deadline",
        "comments": [
          {
            "text": "Nihil itaque a architecto. Illo veritatis totam at quibusdam. Doloremque hic totam consequuntur omnis molestiae commodi iste. Quis alias commodi nemo eveniet.",
            "user": {
              "name": "Patricia Good"
            }
          }
        ],
        "tomatoesRate": 4.4
      },
      {
        "title": "The Passion of Joan of Arc",
        "comments": [],
        "tomatoesRate": 4.4
      }
    ]
  }
}
```