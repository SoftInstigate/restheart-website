---
layout: docs
title: Upload CSV files
---

<div markdown="1"  class="d-none d-xl-block col-xl-2 order-last bd-toc">

-  [Introduction ](#introduction)
-  [Upload the CSV file](#upload-the-csv-file)
-  [Update documents from CSV](#update-documents-from-csv)

</div>

<div  markdown="1"  class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

The CSV Uploader Service allows importing data from a CSV file into a collection.

The service is bound to `/csv` by default.

{: .bs-callout.bs-callout-info}
By uploading a csv file you create or update one document per each row of file. 

### Before running the example requests

The following examples assume RESTHeart Platform running on `localhost` with default configuration: it means, a database named `restheart` is bound to `/` and the user *admin* exists with default password *secret*.

{: .bs-callout.bs-callout-info}
The examples in this page use <a href="https://httpie.org" target= "_blank">httpie</a>

To create the `restheart` db, run the following:

```bash
http -a admin:secret PUT http://localhost:8080/
```

Let's create a `poi` collection, run the following:

```bash
http -a admin:secret PUT http://localhost:8080/poi
```
  
## Upload the CSV file

We are going to use the following example file `POI.csv`:

```
id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral
```
To import the `POI.csv` into the collection `poi`, run the following:

```bash
$ http -a admin:secret POST http://localhost:8080/csv Content-Type:text/csv db=="restheart" coll=="poi" id=="0" < POI.csv
```

The `/csv` path is a reserved path, used by the RESTHeart CSV Uploader Service 
{: .bs-callout.bs-callout-info}

Now the `/poi` collection contains the documents:

```bash
> GET /poi

[{
    "_id": 2,
    "city": "Milan",
    "lat": 45.464278,
    "lon": 9.190596,
    "name": "Duomo",
    "note": "Milan Cathedral",
    "_etag": {
        "$oid": "5d249beebb77e333b6dc9c84"
    }
},
{
    "_id": 1,
    "city": "Rome",
    "lat": 41.8902614,
    "lon": 12.4930871,
    "name": "Coliseum",
    "note": "Also known as the Flavian Amphitheatre",
    "_etag": {
        "$oid": "5d249beebb77e333b6dc9c83"
    }
}]
```

The parameters `db` and `coll` are mandatory and are used to specify the name of the database and the collection in which you want to import the data.

The optional parameters are:

{: .table.table-responsive }
|qparam|description|default value|
|-|-|
|`id`|id column index |no id column|
|`sep`|column separator |,|
|`props`|additional props to add to each row |no props|
|`values`|values of additional props to add to each row |no values|
|`transformer`|name of a transformer to apply to imported data |no transformer|
|`update`|use data to update matching documents |false|
|`upsert`|create new document if no documents match the row |true|


{: .bs-callout.bs-callout-info}
If the `id` parameter is not specified, documents are created with a new `ObjectId`

Example of uploaded file without specifying the `id` :
``` bash
> GET /poi 

[{
    "_id": {
        "$oid": "5d24a114bb77e333b6dc9c88"
    },
    "city": "Milan",
    "id": 2,
    "lat": 45.464278,
    "lon": 9.190596,
    "name": "Duomo",
    "note": "Milan Cathedral",
    "_etag": {
        "$oid": "5d24a114bb77e333b6dc9c86"
    }
},
{
    "_id": {
        "$oid": "5d24a114bb77e333b6dc9c87"
    },
    "city": "Rome",
    "id": 1,
    "lat": 41.8902614,
    "lon": 12.4930871,
    "name": "Coliseum",
    "note": "Also known as the Flavian Amphitheatre",
    "_etag": {
        "$oid": "5d24a114bb77e333b6dc9c85"
    }
}]
```

## Update documents from CSV

If the CSV lines are changed or new ones are added, you can update your collection with the `update` and `upsert` parameters;

To update your collection use the `update` parameter: new lines in the CSV will *NOT* be added. Run the following:

```bash
http -a admin:secret POST http://localhost:8080/csv Content-Type:text/csv db=="restheart" coll=="poi" id=="0" "update"=="true" < POI.csv
```

To add new CSV lines use the `upsert` parameter. Run the following

```bash
http -a admin:secret POST http://localhost:8080/csv Content-Type:text/csv db=="restheart" coll=="poi" id=="0" "upsert"=="true" < POI.csv
```

To add the new CSV lines and update your collection use the `update` and the `upsert` together:

```bash
http -a admin:secret POST http://localhost:8080/csv Content-Type:text/csv db=="restheart" coll=="poi" id=="0" "update"=="true" "upsert"=="true" < POI.csv
```