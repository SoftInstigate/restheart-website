---
layout: docs
title: Relationships
---

* [Introduction](#introduction)
* [The <em>rels</em> collection metadata](#the-rels-collection-metadata)
* [Examples](#examples)
    * [Tree of documents](#tree-of-documents)
    * [One-to-Many, owning](#one-to-many-owning)
    * [One-to-Many, inverse](#one-to-many-inverse)

## Introduction

In MongoDB, documents can have relationships with other documents (see
MongoDB
[Relationships](http://docs.mongodb.org/master/applications/data-models-relationships/)
documentation section). 

**RESTHeart allows to declare the existing relationships in a
collection, so that it automatically adds the links to related documents
in its representation.**

As discussed in the [Representation Format](Representation_Format)
section, RESTHeart uses
the [HAL+json](http://stateless.co/hal_specification.html) hypermedia
format. HAL builds up on 2 simple concepts: **Resources** and **Links**

-   **Resources** have state (plain JSON), embedded resources and links
-   **Links** have target (href URI) and relations (aka `rel`)

Let's see the following simple example, a GET on a document resource:

``` bash
$ http -a a:a GET 127.0.0.1:8080/test/coll/doc
HTTP/1.1 200 OK
...
{
    "_etag": {
        "$oid": "55e84f5ac2e66d1e0a8e46b8"
    }, 
    "_id": "doc", 
    "_links": {
        "curies": [], 
        "self": {
            "href": "/test/coll/doc"
        }
    }, 
    "descr": "a document for testing but modified"
}
```

The representation of the document resource includes
the `_links `property. In this case it has three nested properties:

-   `self` whose `href` property is the URI of the document itself;
-   `rh:coll `whose `href` property is the URI of the parent collection
    of the document;
-   `curies `that is an array of named links, pointing to the API
    documentation.

**Declaring a relationship will add to the `_links` property the related
documents links.**

## The *rels* collection metadata

In RESTHeart, not only documents but also dbs and collections have
properties. Some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

The collection metadata property `rels` allows to declare the existing
relationship so that the representation of the collection's documents
auto-magically include the links to the referenced documents between the
HAL `_link` property

`rels` is an array of `rel` objects having the following format:

``` json
{
  "real": "<relid>",
  "type": "<type>",
  "role": "<role>",
  "target-db": "<dname>",
  "target-cill": "<collname>",
  "ref-field": "<reffieldname>"
}
```

<table>
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

## Examples

### Tree of documents

In this example, we create a collection to store documents organized in
a tree (each document has a single parent document).

Let's create a collection, declaring a **many-to-one** relationship
called **`parent`**, so that documents can refer a *parent document* in
the collection itself.

``` bash
$ http -a a:a PUT 127.0.0.1:8080/test/parentcoll rels:='[{"rel":"parent","type":"MANY_TO_ONE","role":"OWNING","target-coll":"parentcoll","ref-field":"parent"}]'
HTTP/1.1 201 CREATED
...
```

  

Let's now create few documents, specifying the `parent` property:

``` bash
$ http -a a:a PUT 127.0.0.1:8080/test/parentcoll/root parent=root
HTTP/1.1 201 CREATED
...
 
$ http -a a:a PUT 127.0.0.1:8080/test/parentcoll/1 parent=root
HTTP/1.1 201 CREATED
...
 
$ http -a a:a PUT 127.0.0.1:8080/test/parentcoll/1.1 parent=1
HTTP/1.1 201 CREATED
...
 
$ http -a a:a PUT 127.0.0.1:8080/test/parentcoll/1.2 parent=1
HTTP/1.1 201 CREATED
...
```

  

If we now get the document `/test/parentcoll/1.2`, the `_links` property
includes `parent` with the correct URI of the
document `/test/parentcoll/1`

``` bash
$ http -a a:a GET 127.0.0.1:8080/test/parentcoll/1.2
HTTP/1.1 200 OK
...
{
    "_etag": {
        "$oid": "55f15b43c2e65448b566d18b"
    }, 
    "_id": "1.2", 
    "_lastupdated_on": "2015-09-10T10:28:19Z", 
    "_links": {
        "curies": [], 
        "self": {
            "href": "/test/parentcoll/1.2"
        }
    }, 
    "parent": "1"
}
```

### One-to-Many, owning

In this example, we create two collections: `bands` and `albums`; of
course, each band has a **1:N** relationship to albums.

``` bash
$ http -a a:a PUT 127.0.0.1:8080/test/bands rels:='[{"rel":"albums","type":"ONE_TO_MANY","role":"OWNING","target-coll":"albums","ref-field":"albums"}]' descr="music bands"
HTTP/1.1 201 CREATED
...
 
$ http -a a:a PUT 127.0.0.1:8080/test/albums descr="albums published by music bands"
HTTP/1.1 201 CREATED
...
```

  

Let's now create few albums:

``` bash
$ http -a a:a PUT 127.0.0.1:8080/test/albums/Disintegration year:=1989
HTTP/1.1 201 CREATED
...
 
$ http -a a:a PUT 127.0.0.1:8080/test/albums/Wish year:=1992
HTTP/1.1 201 CREATED
...
 
$ http -a a:a PUT 127.0.0.1:8080/test/albums/Bloodflowers year:=2000
HTTP/1.1 201 CREATED
...
```

  

Now we create the band referring these albums:

``` plain
$ http -a a:a PUT "127.0.0.1:8080/test/bands/The Cure" albums:='["Disintegration","Wish","Bloodflowers"]'
HTTP/1.1 201 CREATED
...
```

  

If we now get The Cure document, we can notice the `albums` link:

    /test/albums?filter={'_id':{'$in':['Disintegration','Wish','Bloodflowers']}}"

  

Since the other side of the relationship has cardinality N, the `albums`
link is a collection resource URI with a **filter query parameter**.

``` bash
$ http -a a:a GET "127.0.0.1:8080/test/bands/The Cure"
HTTP/1.1 200 OK
...
    "_embedded": {}, 
    "_etag": {
        "$oid": "55f16029c2e65448b566d191"
    }, 
    "_id": "The Cure", 
    "_lastupdated_on": "2015-09-10T10:49:13Z", 
    "_links": {
        "albums": {
            "href": "/test/albums?filter={'_id':{'$in':['Disintegration','Wish','Bloodflowers']}}"
        }, 
        "curies": [], 
        "self": {
            "href": "/test/bands/The Cure"
        }
    }, 
    "albums": [
        "Disintegration", 
        "Three Imaginary Boys", 
        "Seventeen Seconds"
    ]
}
```

If we want to get the referenced document with httpie (or curl) we need
to issue the following command:

`http -a a:a GET 127.0.0.1:8080/test/albums?filter="{'_id':{'\$in':['Disintegration','Wish','Bloodflowers']}}"`

Note the "\\" char prefixing the operator `$in`. This prevents the
command line interpreter replacing `$in` with an (not existing)
environment variable.

### One-to-Many, inverse

We'll resemble the previous example, but using an inverse relationship,
i.e. the filed storing the relationship will be stored in the album
documents.

``` plain
$ http -a a:a PUT 127.0.0.1:8080/test/bandsi rels:='[{"rel":"albums","type":"ONE_TO_MANY","role":"INVERSE","target-coll":"albums","ref-field":"band"}]' descr="music bands"
HTTP/1.1 201 CREATED
...
 
$ http -a a:a PUT 127.0.0.1:8080/test/albumsi descr="albums published by music bands"
HTTP/1.1 201 CREATED
...
```

  

Let's now create few albums:

``` plain
$ http -a a:a PUT 127.0.0.1:8080/test/albumsi/Disintegration year:=1989 band="The Cure"
HTTP/1.1 201 CREATED
...
 
$ http -a a:a PUT 127.0.0.1:8080/test/albumsi/Wish year:=1992 band="The Cure"
HTTP/1.1 201 CREATED
...
 
$ http -a a:a PUT 127.0.0.1:8080/test/albumsi/Bloodflowers year:=2000 band="The Cure"
HTTP/1.1 201 CREATED
...
```

  

Now we create the band referred by these albums:

``` bash
$ http -a a:a PUT "127.0.0.1:8080/test/bandsi/The Cure" descr="The Cure are an English rock band formed in Crawley, West Sussex, in 1976"
HTTP/1.1 201 CREATED
...
```

  

If we now get "The Cure" document, we can notice the `albums` link:

    /test/albumsi?filter={'band':'The Cure'}

``` bash
$ http -a a:a GET "127.0.0.1:8080/test/bandsi/The Cure"
HTTP/1.1 200 OK
...
    {
    "_etag": {
        "$oid": "55f19409b8e449c1e1304ec5"
    }, 
    "_id": "The Cure", 
    "_links": {
        "albums": {
            "href": "/test/albums?filter={'band':'The Cure'}"
        }, 
        "curies": [], 
        "self": {
            "href": "/test/bandsi/The Cure"
        }
    }, 
    "descr": "The Cure are an English rock band formed in Crawley, West Sussex, in 1976"
}
```

  

  
