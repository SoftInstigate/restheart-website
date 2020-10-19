---
title: Write Requests
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
- [Write Verbs](#write-verbs)
- [Basic Examples](#basic-examples)
- [Dot Notation](#dot-notation)
  - [Dot Notation Examples](#dot-notation-examples)
- [Update Operators](#update-operators)
  - [Update Operators Examples](#update-operators-examples)
- [Bulk Write Requests](#bulk-write-requests)
  - [Bulk Write Requests Examples](#bulk-write-requests-examples)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

This document shows how RESTHeart can use the `PUT`, `POST`, `PATCH` and
`DELETE` verbs to create, modify and delete resources within a MongoDB
database, using only the HTTP protocol.

{% include running-examples.md %}

## Write Verbs

The following table summarizes the semantic of the write verbs:

<div class="table-responsive">
<table class="table">
<colgroup>
<col class="w-50" />
<col class="w-50" />
</colgroup>
<thead>
<tr class="header">
<th>verb</th>
<th>semantic</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>PUT</code></td>
<td><p>Upserts the resource identified by the request URL:</p>
<ul>
<li>if the resource does not already exist, the <code>PUT</code> request creates it setting its state as specified in the request JSON body;</li>
<li>if the resource alreadyn exists, the <code>PUT</code> request sets the resource state as specified in the request JSON body.</li>
<li><code>$currentDate</code> update operator is supported. Using any other update operator (such as <code>$min</code>) is not allowed and would result in <code>BAD REQUEST</code> response.</li>
<li>Properties keys can use the dot notation (such as <code>foo.bar</code>).</li>
</ul></td>
</tr>
<tr class="even">
<td><code>POST</code></td>
<td><p>Upserts a resource under the resource identified by the request URL:</p>
<ul>
<li>if the resource does not already exist, the <code>POST</code> request creates it setting its state as specified in the request JSON body;</li>
<li>if the resource exists, the <code>POST</code> sets the resource properties as specified in the request JSON body.</li>
</ul>
<p>The resource to upsert is identified by the <em>_id</em> property of the request JSON body. If the request body does not include it, the <em>_id</em> it is auto generated as a new ObjectId and the URL of the new document is returned in the response via the <em>Location</em> header.</p>
<ul>
<li><code>$currentDate</code> update operator is supported. Using any other update operator (such as <code>$min</code>) is not allowed and would result in BAD REQUEST response.</li>
<li>Properties keys can use the dot notation (such as <code>foo.bar</code>).</li>
</ul>

</td>
</tr>
<tr class="odd">
<td><code>PATCH</code></td>
<td><p>While <code>PUT</code> and <code>POST</code> verbs replace the whole state of the resource identified by the request URL, <code>PATCH</code> verb only modifies the properties passed with the request JSON body. All write requests, including <code>PATCH</code>, have upsert semantic.</p>
<ul>
<li>All update operators are allowed.</li>
<li>Properties keys can use the dot notation (such as <code>foo.bar</code>).</li>
</ul>
</td>
</tr>
<tr class="even">
<td><code>DELETE</code></td>
<td>Deletes the resource identified by the request URL.</td>
</tr>
</tbody>
</table>
</div>

<div class="bs-callout bs-callout-info">
    <h4>Upsert</h4>
    <hr class="my-2">
    <p>
    The term <i>upsert</i> means either to create a resource, if it does not already exist or to update it, if it does. It comes from joining the terms <strong>up</strong>date and in<strong>sert</strong>.
    </p>
</div>

## Basic Examples

#### Create a document with a given "newItem" Id


{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/21de47ede7d9e910b80ac0d998184bf992b98895/2"
%}


```
PUT /inventory/newItem HTTP/1.1

{ "item": "pencil", "qty": 55, "size": { "h": 10, "w": 0.5, "uom": "cm" }, "status": "B", "suppliers": ["brand_1", "brand_2", "brand_3"] }
```

#### Create a document without a given Id


{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/fcf2a3da225dc2018581416fee19f96fb105cca3/0"
%}


```
POST /inventory HTTP/1.1

{ "item": "rubber", "qty": 15, "size": { "h": 2, "w": 1, "uom": "cm" }, "status": "A" }
```

#### Edit "newItem" document's property "status"


{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/cad8a808b52787063c7544d396d7b4ba30be489f/0"
%}


```
PATCH /inventory/newItem HTTP/1.1

{ "status": "A" }
```

## Dot Notation

RESTHeart uses the dot notation to access the elements of an array and to access the fields of an embedded document.

The dot notation can be used in `PUT`, `PATCH` and `POST` verbs.

### Dot Notation Examples

#### Edit "newItem" document's array element "supplier[1]"

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/d891c0dfaf794019f7cebf79dafa895cd9697da7/0"
%}


```
PATCH /inventory/newItem HTTP/1.1

{"suppliers.1": "new_brand" }
```

#### Edit "newItem.size" embedded document's "h" property 

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/fef0424bf8e69d11a7aae35f41a82e67164a1dfc/0"
%}


```
PATCH /inventory/newItem HTTP/1.1

{"size.h": 20 }
```
## Update Operators

Refer to MongoDB [Update
Operators](https://docs.mongodb.org/manual/reference/operator/update/) documentation
for more information.

{: .bs-callout.bs-callout-info}
RESTHeart allows to use all MongoDB update operators on `PATCH` requests. 
`PUT` and `POST` can only use `$currentDate` update operator.

### Update Operators Examples

#### Apply given update operators to "newItem" document

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/1f3c2941dc649dfb8a3ba6628451093f83d02fea/0"
%}


```
PATCH /inventory/newItem HTTP/1.1

{
  "$inc": { "qty": 1 },
  "$push": { "suppliers": "pushed_brand" },
  "$unset": { "status": null },
  "$currentDate": { "timestamp": true }
}
```

<div class="bs-callout bs-callout-info">
<p>The request above will:</p>

<ul>
    <li>increment the properties&nbsp;<em>qty</em>&nbsp;using the
<a href="https://docs.mongodb.org/manual/reference/operator/update/inc/#up._S_inc">$inc</a>&nbsp;field
operator</li>
    <li>add a new item to the <em>suppliers</em> using the
<a href="https://docs.mongodb.org/manual/reference/operator/update/push/">$push</a>
array operator</li>
    <li>remove the property <em>status</em> using the
<a href="https://docs.mongodb.org/manual/reference/operator/update/unset/">$unset</a>
field operator</li>
    <li>update the <em>timestamp</em> with the current date using the
<a href="https://docs.mongodb.org/manual/reference/operator/update/currentDate/">$currentDate</a>
operator</li>
  </ul>

</div>


## Bulk Write Requests

Bulk write requests create, update or delete multiple documents with a
single request.

A bulk request response contains the URIs of the created documents.

{: .bs-callout.bs-callout-info}
All the upserted documents have the same *\_etag* property value as
reported in the *ETag* response header. To retrieve the upserted
documents with a single request GET the collection filtering on
the *\_etag* property.

### Bulk Write Requests Examples

#### POST an array of documents

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/cf5cba6e1d391b475e04c33d01715b883e1a5490/0"
%}


```
POST /inventory HTTP/1.1

[
   { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
   { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
   { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
   { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
   { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]
```

{: .bs-callout.bs-callout-info}
**The bulk POST has the same behavior of PATCH:** *only the properties in the
request data will be updated*. POSTing documents containing existing *\_id*s will update the them (and not replace the existing onces at all). 

#### PATCH multiple documents with "qty" property greater than (or that equals) 50 using the wildcard document id

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/0e5b13f1e048ea373f86c19e8fb48be7c70c7531/0"
%}


```
PATCH /inventory/*?filter={"qty":{"$gte":50}} HTTP/1.1

{
  "qty":1000 
}
```

#### DELETE multiple documents with "qty" property less than (or that equals) 50 using the wildcard document id

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/acba248263a0be8e55ed03d7ff52e79a27449bbd/0"
%}


```
DELETE /inventory/*?filter={"qty":{"$lte":50}} HTTP/1.1
```

</div>
