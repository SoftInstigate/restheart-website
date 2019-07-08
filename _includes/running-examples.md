## Running the example requests

The following examples assume RESTHeart Platform running on the localhost with the default configuration: notably the database *restheart* is bound to `/` and the user *admin* exists with default password *secret*.

To create the *restheart* db, run the following:

```
> PUT /
```

<a href="http://restninja.io/share/e1d4fc9769d1fd15fc11f8b0b360897668ff11a9/0" class="btn btn-sm float-right" target="restninjatab">Execute on rest ninja</a>

The examples on this page use the *inventory* collection. To create the *inventory* collection, run the following:

```
> PUT /inventory
```

<a href="http://restninja.io/share/2f4fa18afdfd17aa5b1ce0af0e99316015d905a4/0" class="btn btn-sm float-right" target="restninjatab">Execute on rest ninja</a>

To populate the *inventory* collection, run the following:

```
> POST /inventory [
   { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
   { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
   { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
   { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
   { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]
```

<a href="http://restninja.io/share/cf5cba6e1d391b475e04c33d01715b883e1a5490/0" class="btn btn-sm float-right" target="restninjatab">Execute on rest ninja</a>