---
title: Relationships
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [The <em>rels</em> collection metadata](#the-rels-collection-metadata)
-   [Examples](#examples)
    -   [Tree of documents](#tree-of-documents)
    -   [One-to-Many, owning](#one-to-many-owning)
    -   [One-to-Many, inverse](#one-to-many-inverse)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress-v6.html %}

## Introduction

In MongoDB, documents can have relationships with other documents (see
MongoDB [Relationships](https://docs.mongodb.org/master/applications/data-models-relationships/)
documentation section).

**RESTHeart allows to declare the existing relationships in a
collection, so that it automatically adds the links to related documents
in its representation.**

{: bs-callout.bs-callout-info}
Declaring relationships adds the `_links` property to the documents only in the HAL representation format. This is not available in the default representation format. Add the query parameter `?rep=HAL` to display the `_links` property.

## The _rels_ collection metadata

In RESTHeart, not only documents but also dbs and collections have
properties. Some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

The collection metadata `rels` allows to declare existing
relationship so that links to the referenced documents are auto-magically included in the `_link` property

`rels` is an array of `rel` objects having the following format:

```json
{
    "rel": "<relid>",
    "type": "<type>",
    "role": "<role>",
    "target-db": "<dname>",
    "target-coll": "<collname>",
    "ref-field": "<reffieldname>"
}
```

<div class="table-responsive">
<table class="ts">
<thead>
<tr class="header">
<th><div>
Property
</div></th>
<th><div>
Description
</div></th>
<th><div>
Mandatory
</div></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>rel</code></td>
<td><p>Name of the relationship.</p></td>
<td>Yes</td>
</tr>
<tr class="even">
<td><code>type</code></td>
<td>Type of relationship: ONE_TO_ONE, MANY_TO_ONE, ONE_TO_MANY or MANY_TO_MANY</td>
<td>Yes</td>
</tr>
<tr class="odd">
<td><code>role</code></td>
<td>Role of the relationship: OWNING or INVERSE. This says where the reference field is. OWNING means it is in this document, INVERSE means that it is on the target document.</td>
<td>Yes</td>
</tr>
<tr class="even">
<td><code>target-db </code></td>
<td>Database name of the referenced document(s)</td>
<td><p>No. If omitted the target db is supposed to be the current one</p></td>
</tr>
<tr class="odd">
<td><code>target-coll </code></td>
<td>Collection's name of the referenced document(s)</td>
<td>Yes</td>
</tr>
<tr class="even">
<td><code>ref-field</code></td>
<td><p>Name of the first level field storing the id(s) of the referenced document(s) or the json path expression that resolves to the ids of the referenced documents (to reference nested fields).</p>
<p>The value of the first level field must be either the id string (in case the multiplicity of other side of the relationship is ONE) or an array of id strings (in case the multiplicity of other side of the relationship is MANY)</p>
<p>Note: json path expression must start with <code>$</code>, example:</p>
<p><code>$.a.nested.property</code> will bind to <code>{'a':{'nested':{'property':'docid'}}}</code> and resolve to the value '<code>docid</code>'</p></td>
<td>Yes</td>
</tr>
</tbody>
</table>
</div>
## Examples

### Tree of documents

In this example, we create a collection to store documents organized in
a tree (each document has a single parent document).

Let's create a collection, declaring a **many-to-one** relationship
called **`parent`**, so that documents can refer a _parent document_ in
the collection itself.

```http
PUT /parentcoll HTTP/1.1

{
    "rels": [
        {
            "rel": "parent",
            "type": "MANY_TO_ONE",
            "role": "OWNING",
            "target-coll": "parentcoll",
            "ref-field": "parent"
        }
    ]
}	

HTTP/1.1 201 CREATED
```

Let's now create few documents, specifying the `parent` property:

```http
PUT /parentcoll/root HTTP/1.1

{"parent":"root"}

HTTP/1.1 201 CREATED
```

```http
PUT /parentcoll/1 HTTP/1.1

{"parent":"root"}

HTTP/1.1 201 CREATED
```

```http
PUT /parentcoll/1.1 HTTP/1.1

{"parent":"1"}

HTTP/1.1 201 CREATED
```

```http
PUT /parentcoll/1.2 HTTP/1.1

{"parent":"1"}

HTTP/1.1 201 CREATED
```

If we now get the document `/parentcoll/1.2`, the `_links` property
includes `parent` with the correct URI of the
document `/parentcoll/1`

```http
GET /test/parentcoll/1.2 HTTP/1.1

HTTP/1.1 200 OK
{
    "_id": "1.2",
    "parent": 1,
    "_links": {
        "parent": {
            "href": "/parentcoll/1"
        }
    }
}
```

### One-to-Many, owning

In this example, we create two collections: `bands` and `albums`; of
course, each band has a **1:N** relationship to albums.

```http
PUT /bands HTTP/1.1

{
	"rels": [{
		"rel": "albums",
		"type": "ONE_TO_MANY",
		"role": "OWNING",
		"target-coll": "albums",
		"ref-field": "albums"
	}],
	"descr": "music bands"
}

HTTP/1.1 201 CREATED
```

```http
PUT /albums HTTP/1.1

{ "descr":"albums published by music bands" }

HTTP/1.1 201 CREATED
```

Let's now create few albums:

```http
PUT /albums/Disintegration HTTP/1.1

{"year":1989}

HTTP/1.1 201 CREATED
```

```http
PUT /albums/Wish HTTP/1.1

{"year":1992}

HTTP/1.1 201 CREATED
```

```http
PUT /albums/Bloodflowers HTTP/1.1

{"year":2000}

HTTP/1.1 201 CREATED
```

Now we create the band referring these albums:

```http
PUT /bands/The%20Cure HTTP/1.1

{"albums":["Disintegration","Wish","Bloodflowers"]}

HTTP/1.1 201 CREATED
```

If we now get The Cure document, we can notice the `albums` link: `/albums?filter={'_id':{'$in':['Disintegration','Wish','Bloodflowers']}}"`

Since the other side of the relationship has cardinality N, the `albums`
link is a collection resource URI with a **filter query parameter**.

```http
GET /bands/The%20Cure HTTP/1.1

HTTP/1.1 200 OK
{
    "_id": "The Cure",
    "_links": {
        "albums": {
            "href": "/albums?filter={'_id':{'$in':['Disintegration','Wish','Bloodflowers']}}"
        },
    },
    "albums": [
        "Disintegration",
        "Three Imaginary Boys",
        "Seventeen Seconds"
    ]
}
```

If we want to get the referenced document with httpie (or curl) we need
to issue the following request:

```http
GET /albums?filter="{'_id':{'$in':['Disintegration','Wish','Bloodflowers']}}"` HTTP/1.1
```

### One-to-Many, inverse

We'll resemble the previous example, but using an inverse relationship,
i.e. the field storing the relationship will be stored in the album
documents.

```http
PUT /bandsi HTTP/1.1

{
    "rels": [
        {
            "rel": "albums",
            "type": "ONE_TO_MANY",
            "role": "INVERSE",
            "target-coll": "albums",
            "ref-field": "band"
        }
    ],
    "descr": "music bands"
}

HTTP/1.1 201 CREATED
```

``` http
PUT /albumsi HTTP/1.1

{ "descr":"albums published by music bands" }

HTTP/1.1 201 CREATED
```

Let's now create few albums:

```http
PUT /albumsi/Disintegration HTTP/1.1

{ "year":1989, "band":"The Cure" }

HTTP/1.1 201 CREATED
```

```http
PUT /albumsi/Wish HTTP/1.1

{ "year":1992, "band":"The Cure" }

HTTP/1.1 201 CREATED
```

```http
PUT /test/albumsi/Bloodflowers HTTP/1.1

{ "year":2000, "band":"The Cure" }

HTTP/1.1 201 CREATED
```

Now we create the band referred by these albums:

```http
PUT /bandsi/The%20Cure HTTP/1.1

{"descr":"The Cure are an English rock band formed in Crawley, West Sussex, in 1976"}

HTTP/1.1 201 CREATED
```

If we now get "The Cure" document, we can notice the `albums` link: `/albumsi?filter={'band':'The Cure'}`

```http
GET /test/bandsi/The%20Cure

HTTP/1.1 200 OK

{
    "_id": "The Cure",
    "_links": {
        "albums": {
            "href": "/test/albums?filter={'band':'The Cure'}"
        }
    },
    "descr": "The Cure are an English rock band formed in Crawley, West Sussex, in 1976"
}
```

</div>
