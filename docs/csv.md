---
layout: docs
title: Upload CSV files
---

<div markdown="1"  class="d-none d-xl-block col-xl-2 order-last bd-toc">

*  [Introduction ](#introduction)
-  [Running the example requests](#running-the-example-requests)
-  [Upload the CSV file](#upload-the-csv-file)
-  [Update documents from CSV](#update-documents-from-csv)

</div>

<div  markdown="1"  class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

The CSV Uploader Service allows you to import data from a CSV file into a given collection.

{: .bs-callout.bs-callout-info}
The examples in this page use <a href="https://httpie.org" target= "_blank">httpie</a>

## Running the example requests

The following examples assume RESTHeart Platform running on `localhost` with default configuration: it means, a database named `restheart` is bound to `/` and the user *admin* exists with default password *secret*.

To create the `restheart` db, run the following:

```bash
http -a admin:secret PUT http://localhost:8080/
```

Let's create a `poi` collection, run the following:

```bash
http -a admin:secret PUT http://localhost:8080/poi
```
  
## Upload the CSV file

Let's take as an example the following file `POI.csv`:

```
id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral
```
To import the `POI.csv` into the collection `poi`, run the following:

```bash
http -a admin:secret POST http://localhost:8080/csv Content-Type:text/csv db=="restheart" coll=="poi" id=="0" < POI.csv
```

The `/csv` path is a reserved path, used by the RESTHeart CSV Uploader Service 
{: .bs-callout.bs-callout-info}

Now the `/poi` collection contains the documents:

```json
[
    {
		"_etag": {
			"$oid": "5d249beebb77e333b6dc9c84"
		},
		"_id": 2,
		"city": "Milan",
		"lat": 45.464278,
		"lon": 9.190596,
		"name": "Duomo",
		"note": "Milan Cathedral"
	},
	{
		"_etag": {
			"$oid": "5d249beebb77e333b6dc9c83"
		},
		"_id": 1,
		"city": "Rome",
		"lat": 41.8902614,
		"lon": 12.4930871,
		"name": "Coliseum",
		"note": "Also known as the Flavian Amphitheatre"
	}
]
```

The parameters `db` and `coll` are mandatory and are used to specify the name of the database and the collection in which you want to import the data.

The optional parameters are:

1.  `id` = id column index (default: no id column, each row will get an new ObjectId

2.  `sep` = column separator (default: ,)

3.  `props` = additional props to add to each row (default: no props)

4.  `values` = values of additional props to add to each row (default: no values)

5.  `transformer` = name of a transformer to apply to imported data (default: no transformer)

6.  `update` = use data to update matching documents (default: false)

7.  `upsert` = create new document if no documents match the row (default: false)

{: .bs-callout.bs-callout-info}
If the `id` parameter is not specified, documents are created with a new `ObjectId`

Example of uploaded file without specifying the `id` :
``` bash
> GET /poi 

<
[
    {
        "_etag": {
            "$oid": "5d24a114bb77e333b6dc9c86"
        },
        "_id": {
            "$oid": "5d24a114bb77e333b6dc9c88"
        },
        "city": "Milan",
        "id": 2,
        "lat": 45.464278,
        "lon": 9.190596,
        "name": "Duomo",
        "note": "Milan Cathedral"
    },
    {
        "_etag": {
            "$oid": "5d24a114bb77e333b6dc9c85"
        },
        "_id": {
            "$oid": "5d24a114bb77e333b6dc9c87"
        },
        "city": "Rome",
        "id": 1,
        "lat": 41.8902614,
        "lon": 12.4930871,
        "name": "Coliseum",
        "note": "Also known as the Flavian Amphitheatre"
    }
]
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
