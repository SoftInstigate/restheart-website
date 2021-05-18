---
title: Upload CSV files
layout: docs
---

<div markdown="1"  class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction ](#introduction)
-   [Upload the CSV file](#upload-the-csv-file)
-   [Query parameters](#query-parameters)
-   [Update documents from CSV](#update-documents-from-csv)
-   [Transform data](#transform-data)

</div>

<div  markdown="1"  class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

_A comma-separated values (CSV) file is a delimited text file that uses a comma to separate values. A CSV file stores tabular data (numbers and text) in plain text. Each line of the file is a data record. Each record consists of one or more fields, separated by commas. The use of the comma as a field separator is the source of the name for this file format._

The CSV file format is supported by almost all spreadsheets and database management systems, including Microsoft Excel, Apple Numbers, LibreOffice Calc, and Apache OpenOffice Calc.

The CSV Uploader Service allows importing data from a CSV file into a MongoDB collection.

This RESTHeart service is bound to the `/csv` API resource by default.

{: .bs-callout.bs-callout-info}
By uploading a CSV file you create or update one document per each row of the file.

### Before running the example requests

The following examples assume the RESTHeart running on `localhost` with the default configuration: the database `restheart` is bound to `/` and the user `admin` exists with default password `secret`.

To create the `restheart` db, run the following:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/e1d4fc9769d1fd15fc11f8b0b360897668ff11a9/0"
%}

```http
PUT / HTTP/1.1
```

Let's create a `poi` collection, run the following:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/0f076791d9d87f503299c588b626675296ec4adb/0"
%}

```http
PUT /poi HTTP/1.1
```

## Upload the CSV file

We are going to use the following example file `POI.csv`:

```
id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral
```

To import the `POI.csv` into the collection `poi`, run the following:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/93ed5c1c6b20f9e8899b2308232e8ab8b5ee6820/0"
%}

```http
POST /csv?db=restheart&coll=poi&id=0 HTTP/1.1
Content-Type: text/csv

id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral
```

{: .bs-callout.bs-callout-info}
The `/csv` path is a reserved path, used by the RESTHeart CSV Uploader Service

{: .bs-callout.bs-callout-info }
Note that the Content-Type must be `text/csv` otherwise you'll get a `400 Bad Request` error.

Now the `/poi` collection contains the documents:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/adf673704bf76f7c2ee8f3273f0f8cfe6d975596/0"
%}

```http
GET /poi HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```
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

## Query parameters

The CSV uploader service is controlled by the following query parameters.

{: .table.table-responsive }
|query parameter|description|default value|
|-|-|
|`db`|(_required_) the name of the database|no default|
|`coll`|(_required_) the name of the collection|no default|
|`id`|id column index |no id column|
|`sep`|column separator |,|
|`update`|if `true`, update matching documents|false|
|`upsert`|applies when `update=true`; if `true`, create new document if no documents match the \_id |true|
|`props`|additional properties to add to each row, e.g. `?props=foo&props=bar`|no props|
|`values`|values of additional properties to add to each row e.g. `?values=1&values=2`|no values|

{: .bs-callout.bs-callout-info}
If the `id` parameter is not specified, a document is created with a new `ObjectId` per each CSV row.

## Update documents from CSV

If the CSV lines are changed or new ones are added, you can update your collection with the `update` and `upsert` parameters.

To update your collection use the `update` parameter.

{: .bs-callout.bs-callout-warning }
New lines in the CSV will _NOT_ be added.

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/79039d27d707ec45ecd0c65b9485c169606c0cf3/0"
%}

```http
POST /csv?db=restheart&coll=poi&id=0&update=true HTTP/1.1
Content-Type: text/csv

id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre -UPDATED-
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral -UPDATED-
3,Cattedrale di Santa Maria del Fiore,43.773251,11.255474,Florence Cathedral
```

To update existing documents _and_ add new ones, add the `upsert=true` query parameter:

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/102cc2b5ebddc0b1ee0856bb04d2864c1916b436/0"
%}

```http
POST /csv?db=restheart&coll=poi&id=0&update=true&upsert=true HTTP/1.1
Content-Type: text/csv

id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral
3,Cattedrale di Santa Maria del Fiore,43.773251,11.255474,Florence Cathedral
```

## Transform Data

The CSV format allows creating flat documents. Using an Interceptor data can be modified to take advantage of the nested nature of JSON.

We will use [csv-interceptor](https://github.com/SoftInstigate/restheart-examples/tree/master/csv-interceptor) on the restheart-examples repository.

Clone the restheart-examples repository

```bash
$ git clone https://github.com/SoftInstigate/restheart-examples.git
```

Build the examples:

```
$ cd restheart-examples
$ mvn package
```

Deploy the csv-interceptor

```bash
$ cp csv-interceptor/target/csv-interceptor.jar <restheart>/plugins
```

Restarting RESTHeart, the plugins will be automatically deployed.

### The coordsToGeoJson Interceptor

The code of the coordsToGeoJson follows:

```java
@RegisterPlugin(name = "coordsToGeoJson", 
        description = "transforms cordinates array to GeoJSON point object for csv loader service")
public class CoordsToGeoJson implements Interceptor<BsonFromCsvRequest, BsonResponse> {
    @Override
    public void handle(BsonFromCsvRequest request, BsonResponse response) throws Exception {
        var docs = request.getContent();

        if (docs == null) {
            return;
        }

        docs.stream()
                .map(doc -> doc.asDocument())
                .filter(doc -> doc.containsKey("lon") && doc.containsKey("lat"))
                .forEachOrdered(doc -> {
                    // get Coordinates
                    var coordinates = new BsonArray();
                    coordinates.add(doc.get("lon"));
                    coordinates.add(doc.get("lat"));

                    var point = new BsonDocument();

                    point.put("type", new BsonString("Point"));
                    point.put("coordinates", coordinates);

                    // Add the object to the document
                    doc.append("point", point);
                });
    }

    @Override
    public boolean resolve(BsonFromCsvRequest request, BsonResponse response) {
        return request.isHandledBy("csvLoader")
                && request.isPost()
                && "/csv".equals(request.getPath());
    }
}
```

Note that the `resolve()` method returns true for POST requests on the /csv URI (where the csvLoader service is bound).

The `handle()` method receives the `BsonFromCsvRequest` object that contains a `BsonArray` of documents parsed from the uploaded CSV data. It uses a stream to process all documents containing the properties `lon` and `lat` to add the corresponding GeoJSON object.

The interceptor implements the `Interceptor` interface specifying the parametric types `BsonFromCsvRequest` and `BsonResponse`. This is mandatory since an interceptor can intercept requests handled by services that use the same exact types (Check the code of [CsvLoader](https://github.com/SoftInstigate/restheart/blob/master/mongodb/src/main/java/org/restheart/mongodb/services/CsvLoader.java) service, it implements the parametric `Service` interface using those types).

```java
public class CoordsToGeoJson implements Interceptor<BsonFromCsvRequest, BsonResponse>
```


After uploading csv data the result is the following. The GeoJSON field is `point`.

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/93ed5c1c6b20f9e8899b2308232e8ab8b5ee6820/0"
%}

```http
POST /csv?db=restheart&coll=poi&id=0 HTTP/1.1
Content-Type: text/csv

id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral
```

{% include code-header.html
    type="Request"
    link="http://restninja.io/share/adf673704bf76f7c2ee8f3273f0f8cfe6d975596/0"
%}

```http
GET /poi HTTP/1.1
```

{% include code-header.html
    type="Response"
%}

```
[
    {
        "_etag": {
            "$oid": "5ed905845db98d3376dc30c8"
        },
        "_id": 2,
        "city": "Milan",
        "lat": 45.464278,
        "lon": 9.190596,
        "name": "Duomo",
        "note": "Milan Cathedral",
        "point": {
            "coordinates": [
                9.190596,
                45.464278
            ],
            "type": "Point"
        }
    },
    {
        "_etag": {
            "$oid": "5ed905845db98d3376dc30c7"
        },
        "_id": 1,
        "city": "Rome",
        "lat": 41.8902614,
        "lon": 12.4930871,
        "name": "Coliseum",
        "note": "Also known as the Flavian Amphitheatre",
        "point": {
            "coordinates": [
                12.4930871,
                41.8902614
            ],
            "type": "Point"
        }
    }
]
```