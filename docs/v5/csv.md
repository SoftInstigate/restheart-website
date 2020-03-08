---
layout: docs
title: Upload CSV files
---

<div markdown="1"  class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction ](#introduction)
- [Upload the CSV file](#upload-the-csv-file)
- [Query parameters](#query-parameters)
- [Update documents from CSV](#update-documents-from-csv)
- [Apply a transformer](#apply-a-transformer)

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

The following examples assume the RESTHeart Platform running on `localhost` with the default configuration: the database `restheart` is bound to `/` and the user `admin` exists with default password `secret`.

To create the `restheart` db, run the following:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/e1d4fc9769d1fd15fc11f8b0b360897668ff11a9/0"
%}

{: .black-code}
``` http
PUT / HTTP/1.1
```

Let's create a `poi` collection, run the following:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/0f076791d9d87f503299c588b626675296ec4adb/0"
%}

{: .black-code }
``` http
PUT /poi HTTP/1.1
```

## Upload the CSV file

We are going to use the following example file `POI.csv`:

{: .black-code }
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

{: .black-code }
``` http
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

{: .black-code }
```
GET /poi HTTP/1.1
```

{% include code-header.html 
    type="Response" 
%}

{: .black-code }
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
|`db`|(*required*) the name of the database|no default|
|`coll`|(*required*) the name of the collection|no default|
|`id`|id column index |no id column|
|`sep`|column separator |,|
|`transformer`|name of a transformer to apply to imported data |no transformer|
|`update`|if `true`, update matching documents|false|
|`upsert`|applies when `update=true`; if `true`, create new document if no documents match the _id |true|
|`props`|additional properties to add to each row, e.g. `?props=foo&props=bar`|no props|
|`values`|values of additional properties to add to each row e.g. `?values=1&values=2`|no values|

{: .bs-callout.bs-callout-info}
If the `id` parameter is not specified, a document is created with a new `ObjectId` per each CSV row.

## Update documents from CSV

If the CSV lines are changed or new ones are added, you can update your collection with the `update` and `upsert` parameters.

To update your collection use the `update` parameter.

{: .bs-callout.bs-callout-warning }
New lines in the CSV will *NOT* be added.

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/79039d27d707ec45ecd0c65b9485c169606c0cf3/0"
%}

{: .black-code }
``` http
POST /csv?db=restheart&coll=poi&id=0&update=true HTTP/1.1
Content-Type: text/csv

id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre -UPDATED-
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral -UPDATED-
3,Cattedrale di Santa Maria del Fiore,43.773251,11.255474,Florence Cathedral
```

To update existing documents *and* add new ones, add the `upsert=true` query parameter:

{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/102cc2b5ebddc0b1ee0856bb04d2864c1916b436/0"
%}

{: .black-code }
``` http
POST /csv?db=restheart&coll=poi&id=0&update=true&upsert=true HTTP/1.1
Content-Type: text/csv

id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral
3,Cattedrale di Santa Maria del Fiore,43.773251,11.255474,Florence Cathedral
```

### Apply a transformer

To apply a transformer use the `transformer` query parameter.

{: .bs-callout.bs-callout-info }
The CSV format allows creating flat documents. The transformer modifies the request body so that we can take advantage of the nested nature of JSON.

{% include code-header.html 
    type="Request" 
%}

{: .black-code }
``` http
POST /csv?db=restheart&coll=poi&id=0&update=true&transformer=GeoJSONTransformer HTTP/1.1
Content-Type: text/csv

id,name,city,lat,lon,note
1,Coliseum,Rome,41.8902614,12.4930871,Also known as the Flavian Amphitheatre
2,Duomo,Milan,45.464278,9.190596,Milan Cathedral
```

The `GeoJSONTransformer` is the name of a custom transformer that must me packaged with RESTHeart. It transforms the latitude and longitude coordinates into a <a href="https://geojson.org/" target="_blank">GeoJson</a> object.

{: .bs-callout.bs-callout-info }
Check [Package RESTHeart Core plugins](/docs/v5/develop/packaging/#package-restheart-core-plugins) to know how to package the custom transformer.

{: .black-code }
```java
@RegisterPlugin(name = "GeoJSONTransformer", description = "Transform the x,y coordinate in GeoJSON object ")
public class GeoJSONTransformer implements Transformer {

    @Override
    public void transform(final HttpServerExchange exchange, final RequestContext context, BsonValue contentToTransform, final BsonValue args) {
        var body = contentToTransform.asDocument();
        
        // get Coordinates
        var coordinates = new BsonArray();
        coordinates.add(body.get("lon"));
        coordinates.add(body.get("lat"));

        var point = new BsonDocument();
        
        point.put("type", new BsonString("Point"));
        point.put("coordinates", coordinates);

        // Add the object to the document
        body.append("point", point);
    }
}
```

Now the documents have the new property `point` with the GeoJSON Point object:

{: .black-code }
```json
[
    {
        "point": { 
            "coordinates": [
                9.190596,
                45.464278
            ],
            "type": "Point"       
        }
        "_etag": {
            "$oid": "5d2c40021861f94794721285"
        },
        "_id": 2,
        "city": "Milan",
        "lat": 45.464278,
        "lon": 9.190596,
        "name": "Duomo",
        "note": "Milan Cathedral"
    },
    {
        "point": {
            "coordinates": [
                12.4930871,
                41.8902614
            ],
            "type": "Point"
        },
        "_etag": {
            "$oid": "5d2c40021861f94794721284"
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

