---
layout: docs
title: Collection Indexes
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [List the collection indexes](#list-the-collection-indexes)
- [Create an index](#create-an-index)
    - [Example - create an unique, sparse index on property 'qty'](#example---create-an-unique-sparse-index-on-property-qty)
    - [Example - create a text index on property 'item'](#example---create-a-text-index-on-property-item)
- [Delete an index](#delete-an-index)
- [Notes](#notes)
    - [Invalid options](#invalid-options)
    - [Indexes cannot be updated](#indexes-cannot-be-updated)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}

{% include running-examples.md %}


## List the collection indexes

To list the collection indexes use the following request:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/955c6f52f254b504694b8fb1b49b05e881427f8b/0"
%}

{: .black-code}
```
GET /inventory/_indexes
```
{% include code-header.html 
    type="Response" 
%}

{: .black-code }
```
[
    {
        "v": 2,
        "key": {
            "_id": 1
        },
        "ns": "restheart.inventory",
        "_id": "_id_"
    }
]
```

## Create an index

To create an index you have to specify the keys and the index options:

{: .black-code}
```
{ "keys":  <keys>, "ops": <options> }
```
### Example - create an unique, sparse index on property 'qty'

To create an unique, sparse index on property `qty` run the following:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/4e6c63ceba6860a37d53998e6e99be1ad35c226c/1"
%}


{: .black-code}
```
PUT /inventory/_indexes/qtyIndex HTTP/1.1

{"keys": {"qty": 1},"ops": {"unique": true, "sparse": true }}
```

{: .bs-callout.bs-callout-info}
See also
Indexes in MongoDB documentation
<https://docs.mongodb.com/manual/indexes/>


### Example - create a text index on property 'item'

To create a text index on property `item` run the following:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/bb3a7b30ac12ab387586ca41c62de7c257a27fff/1"
%}

{: .black-code}
```
PUT /inventory/_indexes/itemTextIndex HTTP/1.1

{ "keys": { "item": "text" } }
```


## Delete an index

To delete an index use the following request:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/a21462c556fba2279e4ba3071487a2ac271dcbe7/0"
%}

{: .black-code}
```
DELETE inventory/_indexes/qtyIndex HTTP/1.1
```

## Notes

### Invalid options

When creating an index the index options must be valid.

An example of invalid options is specifying the attribute *unique* on a
property that is not actually unique; in this case the response will
be 406:

{: .black-code}
```
HTTP/1.1 406 Not Acceptable
 
{
    "_exceptions": [
        {
            "exception": "com.mongodb.DuplicateKeyException", 
            "exception message": "Write failed with error code 11000 and error message 'E11000 duplicate key error index: test.coll.$name2 dup key: ...."
        }
    ],
    "http status code": 406, 
    "http status description": "Not Acceptable", 
    "message": "error creating the index",
    ...
}
```

### Indexes cannot be updated

To update an index, it must be **deleted** and **recreated**:

Trying to update an existing index returns 406 Not Acceptable.


</div>