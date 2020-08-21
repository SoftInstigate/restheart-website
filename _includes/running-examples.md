<!--
edited: n
spellCheck: n
notes: Is it possible to have resthear db bound before creating the db? BECAUSE the first lines say -- assumes db is bound THEN how to create the database follows.
-->


The following assumes that the RESTHeart Platform is running on the localhost with its default configuration, i.e., the database _restheart_ is bound to `/` and the user _admin_ exists with default password _secret_.

<!-- removing this for use in Beginner Tutorial (already covered) BUT need to verify that this is not needed elsewhere 

To create the _restheart_ database, run the following:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/e1d4fc9769d1fd15fc11f8b0b360897668ff11a9/0"
%}

```http
PUT / HTTP/1.1
```

-->

For this walkthrough, we will use the _inventory_ collection. 

### Step 1 Create the sample collection

First, let's create the _inventory_ collection. Run the following:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/2f4fa18afdfd17aa5b1ce0af0e99316015d905a4/0"
%}

```http
  curl --user admin:secret -I -X PUT http://localhost:8080/inventory HTTP/1.1
```
Success will be indicated by a `201 Created`, don't be concerned about curl error messages.

### Step 2 Add data to the collection


To populate the _inventory_ collection, run the following:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/cf5cba6e1d391b475e04c33d01715b883e1a5490/0"
%}

<!-- TW trying the following-- no joy-->

```http
  curl --user admin:secret -I -X POST http://localhost:8080/inventory HTTP/1.1

  [
   { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
   { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
   { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
   { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
   { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]
```

<!-- TW this does not work as is --> 

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
