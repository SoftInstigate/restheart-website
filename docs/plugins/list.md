---
layout: docs
title: List of available Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction ](#introduction)
* [List of plugins](#list-of-plugins)
* [Inject properties with addRequestProperties](#inject-properties-with-addRequestProperties)
* [Filter out properties with filterProperties](#Filter-out-properties with-filterProperties)
* [schema-validation-with-checkContent](#schema-validation-with-checkContent)
* [Limiting file size with checkContentSize](#limiting-file-size-with-checkContentSize)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

This page lists the plugins available out of the box in RESTHeart Platform.

## List of Plugins

{: .table.table-responsive }
|**Plugin**|**Type**|**Description**|**metadata**|
|**cacheInvalidator**|Service|`POST /ic?db=restheart&coll=inventory` invalidates the metadata cache of `inventory` collection of the database `restheart`|
|**csvLoader**|Service|Allows uploading data via csv file. More info at [Upload CSV files](/docs/csv/)|
|**pingService** |Service|An example ping service bound to `/ping`|
|**filterProperties**|Transformer|Filters out a the properties specified by the args property |`{ "rts": [{"name":"filterProperties", "phase": "RESPONSE", "scope": "CHILDREN", "args": [ "password" ] } ]}`|
|**oidsToStrings**|Transformer|Replaces ObjectId in the response body with strings|`{ "rts": [{"name":"oidsToStrings", "phase": "RESPONSE", "scope": "CHILDREN" } ]}`|
|**stringsToOids**|Transformer|Replaces strings in the request body that are valid ObjectIds with ObjectIds|`{ "rts": [{"name":"stringsToOids", "phase": "REQUEST", "args": ["array", "of", "properties", "to", "replace"] } ]}`|
|**addRequestProperties**|Transformer|Adds properties to the request body; the properties that can be added are: `epochTimeStamp`, `dateTime`, `localIp`, `localPort`, `localServerName`, `queryString`, `relativePath`, `remoteIp`, `requestMethod`, `requestProtocol`|`{ "rts": [{"name":"addRequestProperties", "phase": "REQUEST", "args":{ "log": ["userName", "remoteIp"]}} ]}`|
|**writeResult**|Transformer|Adds a body to write responses with updated and old version of the written document|`{ "checkers": [{"name":"writeResult", "phase": "RESPONSE", "scope": "THIS" } ]}`|
|**snooper**|Hook|An example hook that logs request and response info|`{ "hooks": [{ "name": "snooper" } ]}`|
|**checkContentSize**|Checker|Checks the request content length|`{ "checkers": [{ "name": "checkContentSize","args": { "max": 1048576, "min": null }, "skipNotSupported": true } ]}`|
|**checkContent**|Checker|Checks the request content by using conditions based on json path expressions|`{ "checkers": [ { "name": "checkContent","args": [ { "path": "$", "type": "object", "mandatoryFields": [ "email", "password", "roles", "description" ], "optionalFields": [ "_id", "_etag" ] } ], "skipNotSupported": true } ]}`|
|**jsonSchema**|Checker|Checks the request according to the specified JSON schema. More info at [JSON Schema Validation](/docs/json-schema-validation/)|`{ "checkers": [ { "name": "jsonSchema", "args": { "schemaId": "inventory", "schemaStoreDb": "restheart" } } ] }`|

## Inject properties with addRequestProperties

*addRequestProperties* is a transformer shipped with RESTHeart that
allows to add some properties to the resource state.

The properties are specified via the *args* property of the transformer
object. It is mainly intended to be applied to REQUESTs.

These properties are injected server side. If we need to store some
information (such as the username) and we cannot rely on the client,
this transformer is the solution.

An example is a blog application where each post document has the
*author* property. This property could be valued server side via this
transformer to avoid users to publish posts under a fake identity.

The properties that can be added are:

-   userName
-   userRoles
-   dateTime
-   localIp
-   localPort
-   localServerName
-   queryString
-   relativePath
-   remoteIp
-   requestMethod
-   requestProtocol

For instance, the following request creates the
collection *rtsexample *with this transformer applying to documents in
the REQUEST phase. Looking at the *args* argument we can figure out that
the request json data will be transformed adding the *log* object with
the username of authenticated user and its remote ip.


```
PUT /rtsexample HTTP/1.1

{"rts":[{"name":"addRequestProperties","phase":"REQUEST","scope":"CHILDREN","args":{"log": ["remoteIp"]}}]}
```

If we now create a document, we can see the *log* property stored in the
document because it was injected by RESTHeart in the request data.


```
PUT /rtsexample/mydoc HTTP/1.1

{"a":1}

HTTP/1.1 201 Created
```


```
GET /rtsexample/mydoc HTTP/1.1

HTTP/1.1 200 OK
{
    "_id": "mydoc", 
    "a": 1, 
    "log": {
        "remoteIp": "127.0.0.1"
    }
}
```

## Filter out properties with filterProperties

*filterProperties* is a transformer shipped with RESTHeart that allows
to filter out a the properties specified via the *args* property of the
transformer metadata object.

The usual application of this transformer is hiding sensitive data to
clients.

Let's assume a collection called *filterExample*; we can remove
the property `secret` from the response with the following
filterProperties transformer.


```
PUT /filterExample HTTP/1.1

{"rts":[{"name":"filterProperties", "phase":"RESPONSE", "scope":"CHILDREN", "args":["secret"]}]}
```

## Schema validation with checkContent

*checkContent* is a checker shipped with RESTHeart that allows to
enforce a schema to the documents of a collection.

The schema definition is passed via the checker metadata args property
as an array of conditions. A condition has the following format


```
{ "path": <json_path>, "type": <property_type>, "regex": <regex>, "nullable": boolean, "optional": boolean }
```

If the type is 'object' the properties *mandatoryFields* and
*optionalFields* apply as well:


```
{ "path": <json_path>, "type": "object", "mandatoryFields": [ <field_names> ], "optionalFields": [ <field_names>] }
```
<div class="table-responsive">
<table class="ts">
<thead>
<tr class="header">
<th><div>
Property
</div></th>
<th><div>
Description
</div></th>
<th><div>
Mandatory
</div></th>
<th>Default value</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>path</code></td>
<td><p>The json path expression that selects the property to verify the condition on.</p></td>
<td>Yes</td>
<td><br />
</td>
</tr>
<tr class="even">
<td><code>type</code></td>
<td><p>The type that the selected property must have. It can be the following BSON types:</p>
<ul>
<li>null</li>
<li>object</li>
<li>array</li>
<li>string</li>
<li>number</li>
<li>boolean</li>
<li>objectid</li>
<li>date</li>
<li>timestamp</li>
<li>maxkey</li>
<li>minkey</li>
<li>symbol</li>
<li>code</li>
</ul></td>
<td>Yes</td>
<td><br />
</td>
</tr>
<tr class="odd">
<td><code>regex</code></td>
<td>If specified, this regular expression must match the property (or its string representation).</td>
<td>No</td>
<td>null</td>
</tr>
<tr class="even">
<td><code>nullable</code></td>
<td>If true, no check will be performed if the value of the selected property is null.</td>
<td>No</td>
<td>false</td>
</tr>
<tr class="odd">
<td><code>optional</code></td>
<td>If true, no check will be performed if the property is missing.</td>
<td>No</td>
<td>false</td>
</tr>
<tr class="even">
<td><p><code>mandatoryFields</code></p></td>
<td><p>If the property type is 'object', this is the array of the properties that the object <strong>must</strong> have.</p>
<p>If specified, the object cannot have any other field, as long as they are not listed in the <em>optionalFields</em> array.</p></td>
<td>No</td>
<td>null</td>
</tr>
<tr class="odd">
<td><code>optionalFields</code></td>
<td><p>If the property type is 'object', this is the array of the properties that the object <strong>is allowed</strong> optionally to have.</p>
<p>If specified, the object cannot have any other field, as long as they are not listed in the <em>mandatoryFields</em> array.</p></td>
<td>No</td>
<td>null</td>
</tr>
</tbody>
</table>
</div>
### Json path expressions

A Json path expressions identifies a part of a Json document.

-   It uses the dot notation where the special symbol $ identifies the
    document itself. 
-   The special char \* selects all the properties of an object.
-   The special string \[\*\] selects all the elements of an array.

the \[n\] notation is not supported, i.e. you cannot use the following
json path expression $.array.\[3\] to select the n-th element of an
array.

For example, given the following document:


```
{
    "_id": {
        "$oid": "55f6ccf4c2e6be404fdef3dd"
    },
    "string": "hello",
    "object": {
        "pi": 3.14,
        "href": "https://en.wikipedia.org/wiki/Pi"
    },
    "array": [1, 2, 3]
}
```

The following table shows what document parts, different json path
expressions select:

<table  class="ts">
<thead>
<tr class="header">
<th>json path expr</th>
<th>selected part</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>$</td>
<td>the whole document, that is an object</td>
</tr>
<tr class="even">
<td>$.string</td>
<td>the property <em>string</em> with value &quot;hello&quot;</td>
</tr>
<tr class="odd">
<td>$.object</td>
<td><p>the object with value:</p>
<p><code>{ "pi": 3.14, "href": "https://en.wikipedia.org/wiki/Pi"}</code></p></td>
</tr>
<tr class="even">
<td>$.object.*</td>
<td>the 2 properties pi and href with values 3.14 (number) and &quot;https://en.wikipedia.org/wiki/Pi&quot; (string) respectively</td>
</tr>
<tr class="odd">
<td>$.object.pi</td>
<td>the property pi with numeric value 3.14</td>
</tr>
<tr class="even">
<td>$.array</td>
<td>the array with value [ 1, 2, 3]</td>
</tr>
<tr class="odd">
<td>$.array.[*]</td>
<td>the 3 elements of the array with numeric values 1, 2 and 3.</td>
</tr>
</tbody>
</table>

### Example

The following example creates the collection *user* enforcing its
document to have following fields:
<div class="table-responsive">
<table class="ts">
<thead>
<tr class="header">
<th>name</th>
<th>type</th>
<th>mandatory</th>
<th>notes</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>_id</td>
<td>string</td>
<td>yes</td>
<td>the string must satisfy the given regex, that makes sure that the string is a valid email address.</td>
</tr>
<tr class="even">
<td>name</td>
<td>string</td>
<td>yes</td>
<td><br />
</td>
</tr>
<tr class="odd">
<td>password</td>
<td>string</td>
<td>yes</td>
<td><br />
</td>
</tr>
<tr class="even">
<td>roles</td>
<td>array of strings</td>
<td>yes</td>
<td><br />
</td>
</tr>
<tr class="odd">
<td>bio</td>
<td>string</td>
<td>no</td>
<td><br />
</td>
</tr>
</tbody>
</table>
</div>


```
PUT /test/users HTTP/1.1

{ "checkers": [{
    "name": "checkContent",
    "args": [{
            "path": "$",
            "type": "object",
            "mandatoryFields": ["_id", "name", "password", "roles"],
            "optionalFields": ["bio"]
        },
        {
            "path": "$._id",
            "type": "string",
            "regex": "^\\u0022[A-Z0-9._%+-]+@[A-Z0-9.-]+\\u005C.[A-Z]{2,6}\\u0022$"
        },
        {
            "path": "$.password",
            "type": "string"
        },
        {
            "path": "$.roles",
            "type": "array"
        },
        {
            "path": "$.roles.[*]",
            "type": "string"
        },
        {
            "path": "$.name",
            "type": "string"
        },
        {
            "path": "$.bio",
            "type": "string",
            "nullable": true
        }
    ]
}]}
```

## Limiting file size with checkContentSize

*checkContentSize* is a checker shipped with RESTHeart that allows to
check the size of a request. It is very useful with file resources to
limit the maximum size of the uploaded file.

The following example, creates a file bucket resource, limiting the file
size from 64 to 32768 bytes:


```
PUT /test/icons.files HTTP/1.1

{ "descr":"icons",
  "checkers": [{
      "name":"checkContentSize",
      "args":{"min": 64, "max": 32768}
}]}
```