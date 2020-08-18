<!--
edited: n
spellCheck: n
notes: Is it possible to have resthear db bound before creating the db? BECAUSE the first lines say -- assumes db is bound THEN how to create the database follows.
-->

### Before running the example requests

The following examples assume that the RESTHeart Platform is running on the localhost with the default configuration: the database _restheart_ is bound to `/` and the user _admin_ exists with default password _secret_.

To create the _restheart_ database, run the following:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/e1d4fc9769d1fd15fc11f8b0b360897668ff11a9/0"
%}

```http
PUT / HTTP/1.1
```

The examples on this page use the _inventory_ collection. To create the _inventory_ collection, run the following:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/2f4fa18afdfd17aa5b1ce0af0e99316015d905a4/0"
%}

```http
PUT /inventory HTTP/1.1
```

To populate the _inventory_ collection, run the following:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/cf5cba6e1d391b475e04c33d01715b883e1a5490/0"
%}

```http
POST /inventory HTTP/1.1

[
   { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
   { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
   { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
   { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
   { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]
```
