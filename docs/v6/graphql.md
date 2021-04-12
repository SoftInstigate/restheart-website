---
title: GraphQL API
layout: docs
---

<div  markdown="1"  class="d-none d-xl-block col-xl-2 order-last bd-toc">

-  [Overview](#overview)
-  [GraphQL Applications](#graphql-applications)
	-  [Descriptor](#descriptor)
	-  [Schema](#schema)
	-  [Mappings](#mappings)
-  [Queries](#queries)
-  [Optimization](#optimization)

</div>

<div  markdown="1"  class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress-v6.html %}

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

1.  **descriptor**;
2.  **schema**;
3.  **mappings**.

### Descriptor


Here you can specify:

-  **name**: GraphQL application name.
-  **description**: GraphQL application description.
-  **enabled**: can be *true* or *false*. If it's *false*, the GraphQL application can't be queried and vice-versa. By default it is *true*.
-  **uri**: it specifies at which endpoint your GraphQL application is reachable (e.g. `/graphql/uri`). If you don't specify the URI, application's name is used instead (so, at least one between *name* and *URI* must be present).

### Schema

This section must contain GraphQL application's schema written with *Schema Definition Language* (SDL). For example:

```json
{
    "schema": "type User{name: String surname: String email: String posts: [Post]} type Post{text: String author: User} type Query{users(limit: Int = 0, skip: Int = 0)}",
    "mapping": "..."
}
```

Remember that, in order to be a valid schema, it must contain type *Query*.

### Mappings

In this section you can specify how GraphQL types fields are mapped on MongoDB data. Mappings have to be organized following the same hierarchical structure of GraphQL SDL schema, so for each GraphQL type you can insert a JSON object with a property for each field that you want to map. For instance:

```json
{
    "schema": "...",
    "mappings": {
        "User": {
            "name": "...",
            "surname": "..."
        },

        "Post": {
            "text": "...",
            "author": "..."
        },

        "Query": {
            "users": "..."
        }
    }
}
```

Up to now, two kinds of mapping can be made:

1. you can map a GraphQL field with a specific MongoDB document field or with an element of a MongoDB array by **dot-notation**. For instance:

```json
{
    "schema": "...",
	"mappings":{
		"User": {
			"name": "firstName",
			"phone": "contacts.phone",
			"email": "contacts.emails.0",
		}
	}
}
```

Whit this configuration:

- `name` is mapped with MongoDB document `firstName` field
- `phone` is mapped with field `phone` in `contacts` nested document
- `email` is mapped with 1st element of `emails` array within `contacts` nested document

Notice that, if you don't specify a mapping for a field, RESTHeart will map it with a MongoDB document field with the same name.

2. You can map a GraphQL field with a MongoDB query using the following parameters:

-  **db** (String): database name;
-  **collection** (String): collection name;
-  **find** (Document): selection filter using query operators (e.g. `$in`, `$and`, `$or`, ...);
-  **sort** (Document): order in which the query returns matching documents;
-  **skip** (Document or Integer): how many documents should be skipped of those resulting;
-  **limit** (Document or Integer): how many documents should be returned at most of those resulting.

Moreover, a query could be:

- **predefined** : if you establish directly in the configuration all the parameters above;
- **parametric** : if one or more parameters, of the MongoDB query, are determined by arguments passed through GraphQL query or by values that come from MongoDB documents that are already fetched.

In order to make a **parametric mapping**, two *operators* could be used:

 - **`$arg`**: allows you to use, inside the query mapping, values passed through GraphQL arguments;
 - **`$fk`**: allows you to map a GraphQL field with a MongoDB relation, specifying which is the document field that hold the relation.

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
{ "_id": {"$oid": "6037732f5fa7d52581015ed9" },
  "firstName": "Foo",
  "lastName": "Bar",
  "contacts": { "phone": "+39113", "emails": ["foo@domain.com", "f.bar@domain.com"],
  "posts_ids": [ { "$oid": "606d963f74744a3fa6f4489a" }, { "$oid": "606d963f74744a3fa6f4489e" } ] }
}
```

**POSTS**
```json
[ { "_id": {"$oid": "606d963f74744a3fa6f4489a" },
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

 - given a **User**, his posts are the MongoDB documents, within the **posts** collection, with value of field **_id** that falls in the **posts_ids** array of **User**'s document;
 - given a **Post**, its author is the MongoDB document, within the **users** collection, with value of field **_id** equal to **author_id** of **Post**'s document;
 - asking for **userByName** GraphQL field, the MongoDB documents searched are the ones within the **users** collection with field **name** equal to value of **_name** GraphQL argument. Moreover, we are asking to return at most **_limit** documents, to skip the firsts **_skip** ones and to sort them by name in reverse order.

{: .bs-callout.bs-callout-info}
Note that you can use also *dot-notation* with the `$fk` operator.

## Queries

Up to now, only GraphQL Query can be made, so no subscription or mutation. In order to make a query you can use HTTP request with POST method and both content-type *application/json* and *application/graphql*. For instance:

- application/json
```
POST /graphql/<app-uri> HTTP/1.1
Host: <host-name>
Content-Type: application/json

{
    "query": "query test_operation($name: String){ userByName(_name: $name){name posts{text}} }",
    "variables": { "name": "..." },
    "operationName": ""
}
```
- application/graphql

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
		author { name }
	}
}
```
RESTHeart will make:

- a MongoDB query to fetch the first 10 documents of **posts** collection;
- a MongoDB query for each one of the 10 posts returned by the first one.

Precisely, N+1 requests.

In order to mitigate the N+1 problem and optimize performances of yours GraphQL API, RESTHeart allows you to use **per-request DataLoaders** to batch and cache MongoDB queries. This can be done specifying **dataLoader** field within the query mapping. For instance, the author mapping seen above becomes:

```json
{
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

- **batching** (boolean): allows you to specify if queries batching is enabled. By default it's *false*;
- **caching** (boolean): allows you to specify if queries caching is enabled. By default it's *false*;
- **maxBatchSize** (int): allows you to specify how many queries batch together at most.

{: .bs-callout.bs-callout-info}
Note that there's no magic number for *maxBatchSize*, so you have to tune it experiencing. For this purpose you can set *verbose = true* under the GraphQL plugin configuration within *restheart.yaml*.   In this way, RESTHeart will insert DataLoader statistics inside GraphQL queries answers.