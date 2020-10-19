---
title: Read JSON Documents
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
- [Paging](#paging)
    - [Examples](#paging-examples)
- [Filtering](#filtering)
    - [Multifilter qparams](#multifilter-qparams)
    - [Examples](#filtering-examples)
- [Counting](#counting)
    - [Examples](#counting-examples)
- [Sorting](#sorting)
    - [Sort simple format](#sort-simple-format)
    - [Sort JSON expression format](#sort-json-expression-format)
    - [Default sorting](#default-sorting)
    - [Examples](#sorting-examples)
- [Projection](#projection)
    - [Dot Notation](#dot-notation)
    - [Examples](#projection-examples)
- [Hint](#hint)
    - [Examples](#hint-examples)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

This page provides examples of query operations using the `GET` method.

You will learn how to get documents from a collection, optionally specifying a query, sort criteria, fields projections options and deal with pagination.  

You will also learn hot to get a single document knowing its _id.

{% include running-examples.md %}

## GETting Documents from a Collection

To GET documents in the collection, run the following:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/5b1ea0cbcd6826ebaab3de45ce57963dfeb037d0/0"
%}


```
GET /inventory HTTP/1.1
```

## Paging

The response is paginated,  i..e. only a subset of the collection’s document is returned in the response array.

The number of documents to return is controlled via the `pagesize` query
parameter. Its default value is 100, maximum allowable size is 1000.

The pages to return is specified with the `page` query parameter. The
pagination links (first, last, next, previous) are **only returned on
hal full mode** (`hal=f` query parameter); see [HAL
mode](https://restheart.org/docs/representation-format/)
for more information.

### Paging Examples

#### Return documents on second page when pagesize is 3 

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/623a4d4d9338e182ae8fc6a7d2b1382a0e4f029e/3"
%}


```
GET /inventory?page=2&pagesize=3 HTTP/1.1
```

## Filtering

The **`filter`** query parameter allows to specify conditions on the
documents to be returned.

The `filter` qparam value is any [mongodb
query](https://docs.mongodb.org/manual/tutorial/query-documents/).

Note that system properties (properties starting with \_ that are
managed automatically by RESTHeart) are not affected by this option.


<div class="anchor-offset" id="multifilter-qparams">
</div>

<div class="bs-callout bs-callout-info">
    <h4>Multifilter qparams</h4>
    <hr class="my-2">
    <p>
    Note the second form of the last example. If multiple filter query
    parameters are specified, they are logically composed with the AND
    operator.
    </p>
    <p>
    This can be very useful in conjunction with path based security
    permission.
    </p>
    <p>
    For instance the following permission can be used with the simple file
    based Access Manager to restrict users to GET a collection only
    specifying a filter on the author property to be equal to their
    username:
    </p>
    <code>regex[pattern="/test/coll/\?.*filter={'author':'(.*?)'}.*", value="%R", full-match=true] and equals[%u, "${1}"]</code>
</div>

### Filtering Examples

#### Return documents whose `quantity` is more than 50

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/e3a1a8ba94de959d9e0099d4a3aee64ce05dff52/0"
%}


```
GET /inventory?filter={"qty":{"$gt":50}} HTTP/1.1
```

#### Return documents whose `quantity` is more than 25 and with `status` set to "D" value


{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/9274556528ca5f4fd356a7245102bb7b483011fb/0"
%}


``` http
GET /inventory?filter={"$and":[{"qty":{"$gt":75}},{"status":"D"}]} HTTP/1.1
```

or equivalently:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/d104f56976eac72a4237324fbdcc951e9e255fc6/0"
%}


{: .mt-2.black-code }
``` http
GET /inventory?filter={"qty":{"$gt":75}}&filter={"status":"D"} HTTP/1.1
```

## Counting

Use `_size` keyword after the collection path to retrieve the number of documents that meets the filter condition (if present).

<div class="bs-callout bs-callout-info">
    <h4 id="impact-on-performances">Impact on performances</h4>
    <hr class="my-2">
    <p>
    <code><strong>count</strong></code> involves querying the collection twice: once for counting
    and once of actually retrieving the data; this has performance
    implications!
    </p>
</div>

### Counting Examples

#### Return the number of documents into "inventory" collection 

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/feaa50aac771e3d7c9b9058855d79f322afa20c0/1"
%}


``` http
GET /inventory/_size?filter={"status":"A"} HTTP/1.1
```

## Sorting

Sorting is controlled by the `sort` query parameter.

Note that documents cannot be sorted by system properties (properties
starting with \_ that are managed automatically by RESTHeart).

<div class="bs-callout bs-callout-info">
    <h4 id="multifilter-qparams">Multiple sort properties</h4>
    <hr class="my-2">
    <p>
    Specify multiple sort options using multiple `sort` query parameters
    </p>
    <p class="black-code">
    <pre><code class="language-bash">> GET /inventory?sort=qty&amp;sort=-status</code></pre>
    </p>
</div>

### Sort simple format

The `sort` simplified format is :


```
sort=[ |-]<fieldname>
```

### Sort JSON expression format

`sort` can also be a MongoDB [sort
expression](https://docs.mongodb.com/manual/reference/method/cursor.sort/#cursor.sort).

JSON expression format is available starting from version 2.0.1. See
improvement [RH-190](https://softinstigate.atlassian.net/browse/RH-190)


```
sort={"field": 1}
```

<div class="anchor-offset" id="default-sorting">
</div>

<div class="bs-callout bs-callout-info mt-5" role="alert">
    <h4>Default sorting</h4>
    <hr class="my-2">
    <p>
    The default sorting of the documents is by the <strong>_id descending</strong>.
    </p>
    <p>
    In the usual case, where the type of the ids of the documents is
    ObjectId, this makes the documents sorted by creation time by default
    (ObjectId have a timestamp in the most significant bits).
    </p>
    <p>
    RESTHeart returns data in pages (default being 100) and it is stateless.
    This means that two requests use different db cursors. A default sorting
    makes sure that requests on different pages returns documents in a well
    defined order.
    </p>
    <div class="alert alert-warning" role="alert">
        <h2 class="alert-heading">Disable default sorting</h2>
        <hr class="my-2">
        <p>
        Default sorting could impact performances for some use cases.
        </p>
        <p>
        To disable default sorting just add the <strong>"sort={}"</strong> query parameter 
        </p>
        <p>
        See the <a href="#sorting">sorting</a> section to know how to
        specify different sorting criteria.
        </p>
    </div>
</div>

### Sorting Examples

### Sort by *status* ascending

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/65aa0aae4ef7cf984c960113b21b42819a8b034b/0"
%}


``` http
GET /inventory?sort=status HTTP/1.1
```

or equivalently:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/dd99c056f88e5ac9f990ffcd3f2a18032007d639/0"
%}

{: .mt-2.black-code }
``` http
GET /inventory?sort={"status":1} HTTP/1.1
```

{: .mt-4 }
#### Sort by *status* descending

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/cc4cdce5906cef6fee7859a09f5aae197d8b10f2/0"
%}


``` http
GET /inventory?sort=-status HTTP/1.1
```

or equivalently:


{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/e6fe674153926f9834c1aa10e156b0792dc35bc5/0"
%}

{: .mt-2.black-code }
```
GET /inventory?sort={"status":-1} HTTP/1.1
```

{: .mt-4 }
#### Sort by *status* ascending and *qty* descending

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/fe1fde2e234e08de495ab533ea62529ef0f37cd6/0"
%}


``` http
GET /inventory?sort=status&sort=-qty HTTP/1.1
```

or equivalently:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/13bd5e1b3889b3c0f42fea5c694fae4c4cff5493/0"
%}

{: .mt-2.black-code }
``` http
GET /inventory?sort={"status":1,"qty":-1} HTTP/1.1
```

{: .mt-4 }
#### Sort by search score

{: .bs-callout.bs-callout-info }
This is only possible with json expression format

**create a text index**

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/ce942a7557a061396ad65dd27560158df32cc17a/0"
%}


``` http
PUT /inventory/_indexes/text HTTP/1.1

{"keys": {"item": "text" }}
```

{: .mt-3 }
**sort by score**

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/da896056a261d129fddd086d5c43425b328dc7c8/0"
%}


``` http
GET /inventory?filter={"$text":{"$search":"paper"}}&keys={"item":1,"score":{"$meta":"textScore"}}&sort={"score":{"$meta":"textScore"}} HTTP/1.1
```

## Projection

Projection limits the fields to return for all matching documents,
specifying the inclusion or the exclusion of fields.

This is done via the `keys` query parameter. 

Note that system properties (properties starting with \_ that are
managed automatically by RESTHeart) are not affected by this option.

<div class="anchor-offset" id="dot-notation">
</div>

<div class="bs-callout bs-callout-info mt-3" role="alert">
    <h4>Dot Notation</h4>
    <hr class="my-2">
    <p>
    It's possible to use the "dot notation" to specify fields within an
    object, for example, let's say that both <strong>item</strong> and <strong>status</strong> are
    part of an <strong>header</strong> object:
    </p>
    <p class="black-code">
    <div class="black-code highlighter-rouge"><div class="highlight"><pre class="highlight"><code>&gt; GET /inventory?keys={'header.item':1}&amp;keys={'header.status':1}</code></pre></div></div>
    </p>
</div>

### Projection Examples

#### Only return the property *item*

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/358ee35c14b7e564bb1cc9fa207c35286c2692fa/0"
%}


``` http
GET /inventory?keys={'item':1} HTTP/1.1
```

#### Return all but the property *item*

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/cf2e40e99b1e3ba36500ee331092b24812b85622/0"
%}


``` http
GET /inventory?keys={'item':0} HTTP/1.1
```

#### Only return the properties *item* and *qty*

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/1e60f50d60ed667a06f504f7831d7c8e85692670/0"
%}


``` http
GET /inventory?keys={'item':1}&keys={'qty':1} HTTP/1.1
```

## Hint

Hint allows overriding MongoDB’s default index selection and query optimization process. See [cursor hint](https://docs.mongodb.com/manual/reference/method/cursor.hint/#cursor.hint) on MongoDB documentation.

This is done via the `hint` query parameter.

Specify the index by the index specification document, either using a json document or the compact string representation; specifying the index by name is not supported.

Use `$natural` to force the query to perform a forwards collection scan.

### Hint Examples
<div class="bs-callout bs-callout-info mt-3 pb-5" role="alert">
    <p>
        Before running the following examples create the following indexes:
    </p>
    <p class="black-code">
        <div class="black-code highlighter-rouge"><div class="highlight"><pre class="highlight"><code>&gt; PUT /inventory/_indexes/item {"keys": {"item": 1}}</code></pre></div></div>
        <a href="http://restninja.io/share/12101c3d1033820c768ab65692a7816f823973db/0" class="btn btn-sm float-right" target="restninjatab">Execute on rest ninja</a>
    </p>
    <p class="black-code">
        <div class="black-code highlighter-rouge mt-5"><div class="highlight"><pre class="highlight"><code>&gt; PUT /inventory/_indexes/status {"keys": {"status": 1 }}</code></pre></div></div>
        <a href="http://restninja.io/share/0bebde37afbb97a5c5362b54bc18748394c76059/0" class="btn btn-sm float-right" target="restninjatab">Execute on rest ninja</a>
    </p>
    
</div>

#### Use the index on item field

The following example returns all documents in the collection named **coll** using the index on the **item** field.

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/fd17ca5f145ca84abeb3d7ea6a15c7e2e5932749/0"
%}


``` http
GET /inventory?hint={'item':1} HTTP/1.1
```

#### Use the compound index on age and timestamp fields using the compact string format

The following example returns the documents using the compound index on the **item** and reverse **status** fields.

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/9cf833a9840717317888aab86eb5a92ea828dc5a/0"
%}


``` http
GET /inventory?hint=item&hint=-status HTTP/1.1
```

#### Perform a forwards collection scan

The following example returns the documents using a forwards collection scan.

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/26721abb1946b0f5464565e568dff2bf52b1623c/0"
%}


``` http
GET /inventory?hint={'$natural':1} HTTP/1.1
```

#### Perform a reverse collection scan

The following example returns the documents using a reverse collection scan.

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/4f64c9e56340214607d08f293488d3d90beffa2b/0"
%}


``` http
GET /inventory?hint={'$natural':-1} HTTP/1.1
``` 

</div>
