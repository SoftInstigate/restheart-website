---
title: Tutorial
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Running the example requests](#running-the-example-requests)
-   [GET Documents from the Collection](#get-documents-from-the-collection)
-   [GET filtered Documents from the Collection](#get-filtered-documents-from-the-collection)
-   [POST a new document](#post-a-new-document)
-   [PUT a new document](#put-a-new-document)
-   [PATCH a document](#patch-a-document)
-   [DELETE a document](#delete-a-document)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include running-examples.md %}

## GET Documents from the Collection

Now let’s get all documents in a row. For this, we send a GET request to the whole collection:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/e1d4fc9769d1fd15fc11f8b0b360897668ff11a9/1"
%}

```http
GET /inventory HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```json
[
  {
    "_id": {
      "$oid": "5d0b3dbc2ec9ff0d92ddc2aa"
    },
    "_etag": {
      "$oid": "5d0b3dbc2ec9ff0d92ddc2a5"
    },
    "item": "postcard",
    "qty": 45,
    "size": {
      "h": 10,
      "w": 15.25,
      "uom": "cm"
    },
    "status": "A"
  },
  {
    "_id": {
      "$oid": "5d0b3dbc2ec9ff0d92ddc2a9"
    },
    "_etag": {
      "$oid": "5d0b3dbc2ec9ff0d92ddc2a5"
    },
    "item": "planner",
    "qty": 75,
    "size": {
      "h": 22.85,
      "w": 30,
      "uom": "cm"
    },
    "status": "D"
  },
  ...
]
```

## GET filtered Documents from the Collection

It's possible to apply a filter at the end of the request to reduce the number of output documents.
The following request asks for all documents with a "qty" property greather than 75:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/2f4fa18afdfd17aa5b1ce0af0e99316015d905a4/1"
%}

```http
GET /inventory?filter={"qty":{"$gt":75}} HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```json
[
    {
        "_id": {
            "$oid": "5d0b3dbc2ec9ff0d92ddc2a8"
        },
        "_etag": {
            "$oid": "5d0b3dbc2ec9ff0d92ddc2a5"
        },
        "item": "paper",
        "qty": 100,
        "size": {
            "h": 8.5,
            "w": 11,
            "uom": "in"
        },
        "status": "D"
    }
]
```

{: .bs-callout.bs-callout-info}
Note that only the retrieved document meets the filter's condition.

## POST a new document

Now we are going to insert a new document to the collection.

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/39921ec3386f81ff963b070a64171e3c3968bd1f/0"
%}

```http
POST /inventory HTTP/1.1

{"item": "newItem", "qty": 10, "size": { "h": 2, "w": 4, "uom": "cm" }, "status": "C"}
```

{% include code-header.html
    type="Response"
%}

```
ETag: 5d0b47422ec9ff0d92ddc2ad
X-Powered-By: restheart.org
Content-Type: application/json
Location: http://localhost:8080/inventory/5d0b47425beb2029a8d1bc72
```

{: .bs-callout.bs-callout-info}
Note the `Location` header in the response, as it contains a link to the newly created document! To get the document you can directly copy that link and use it in a subsequent query.

## PUT a new document

It's possible to PUT a document into the collection by specifing the document identifier at the end of the request:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/fe7c43013f9a9f8bc9e0f35d7e0980d14e2fd64c/0"
%}

```http
PUT /inventory/newDocument HTTP/1.1

{ "item": "yetAnotherItem", "qty": 90, "size": { "h": 3, "w": 4, "uom": "cm" }, "status": "C" }
```

## PATCH a document

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/a2cad148132e2fa8a5c95e4e681b6c3a85f60215/0"
%}

```http
PATCH /inventory/newDocument HTTP/1.1

{ "qty": 40, "status": "A", "newProperty": "value" }
```

{% include code-header.html
    type="Response"
%}

```json
{
    "_id": "newDocument",
    "item": "yetAnotherItem",
    "qty": 40,
    "size": {
        "h": 3,
        "w": 4,
        "uom": "cm"
    },
    "status": "A",
    "_etag": {
        "$oid": "5d0b4b9e2ec9ff0d92ddc2af"
    },
    "newProperty": "value"
}
```

{: .bs-callout.bs-callout-info}
The previous request changes the document created in the previous example as indicated in the request body.

## DELETE a document

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/311d230363a4c073a1e67ef327bd403cadb1238f/0"
%}

```http
DELETE /inventory/newDocument HTTP/1.1
```

</div>
