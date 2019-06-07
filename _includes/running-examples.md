## Running the example requests

The following examples assume that RESTHeart is running on the localhost with the default configuration: notably the database *restheart* is bound to `/` and the user *admin* exists with default password *secret*.

To create the *restheart* db, run the following:

```
PUT /
```

<a href="http://restninja.io/share/e1d4fc9769d1fd15fc11f8b0b360897668ff11a9/0" class="btn btn-sm float-right" target="restninjatab">Execute on rest ninja</a>

The examples on this page use the *inventory* collection. To create the *inventory* collection, run the following:

```
PUT /inventory
```

<a href="http://restninja.io/share/2f4fa18afdfd17aa5b1ce0af0e99316015d905a4/0" class="btn btn-sm float-right" target="restninjatab">Execute on rest ninja</a>

To populate the *inventory* collection, run the following:

```
POST /inventory [
   { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
   { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
   { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
   { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
   { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]
```

<a href="http://restninja.io/share/cf5cba6e1d391b475e04c33d01715b883e1a5490/0" class="btn btn-sm float-right" target="restninjatab">Execute on rest ninja</a>

<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  Execute on rest ninja
</button>

<!-- Modal -->
<div class="modal modal-fullscreen fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Execute request with REST Ninja title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <iframe width="1000px" height="800px" frameborder="0" src="http://restninja.io/share/cf5cba6e1d391b475e04c33d01715b883e1a5490/0">
        </iframe>
      </div>
    </div>
  </div>
</div>