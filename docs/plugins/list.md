---
layout: docs
title: List of available Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction ](#introduction)
* [List of plugins](#list-of-plugins)

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