---
layout: docs
title: Request Checkers
---

* [Introduction](#introduction)
* [The <em>checkers</em> collection metadata](#the-checkerscollection-metadata)
* [Checkers](#checkers)
* [Schema validation with checkContent checker](#schema-validation-with-checkcontent-checker)
    * [Json path expressions](#json-path-expressions)
    * [Example](#example)
* [Limiting file size with checkContentSize](#limiting-file-size-with-checkcontentsize)
* [Custom Checkers](#custom-checkers)

## Introduction

Data in MongoDB has a flexible schema. There is no way to enforce a
structure to documents: as long as json is used to pass data to a write
operation, it is stored in the database despite its actual format.

This is not always desirable and RESTHeart comes into rescue with the
Request Checkers feature. This allows to check the request so that, if
it does not fulfill some conditions, it returns *400 BAD REQUEST*
response code.

Request Checkers allow to enforce document structure and constraints to
data.

## The *checkers* collection metadata

In RESTHeart, not only documents but also dbs and collections have
properties. Some properties are metadata, i.e. they have a special
meaning for RESTheart that influences its behavior.

The collection metadata property `checkers` allows to declare a checker
to be applied to the requests involving the documents of the collection.

*checkers* is an array of *`checker`* objects. A *checker* object has
the following format:

``` json
{ "name": <checker_name>,"args": <arguments>, "skipNotSupported": <boolean> }
```

<table>
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
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>name</code></td>
<td><p>name of the checker.</p></td>
<td>Yes</td>
</tr>
<tr class="even">
<td><code>args</code></td>
<td>arguments to be passed to the checker</td>
<td>no</td>
</tr>
<tr class="odd">
<td><strong>skipNotSupported</strong></td>
<td><p>if true, skip the checking if this checker does not support the request (Checker.doesSupportRequests())</p></td>
<td>no</td>
</tr>
</tbody>
</table>

## Checkers

RESTHeart comes with 3 ready-to-be-used checkers:

-   [checkContent](#RequestCheckers-checkContent) to enforce a structure
    to documents using json path expressions
-   [checkContentSize](#RequestCheckers-checkContentSize) to check the
    request size
-   **jsonSchemaChecker** to enforce a structure to documents using json
    schema; more information at [Document validation with JSON
    schema](Document_validation_with_JSON_schema)

[Custom checkers](#RequestCheckers-customCheckers) can also be
implemented.

## Schema validation with checkContent checker

*checkContent* is a checker shipped with RESTHeart that allows to
enforce a schema to the documents of a collection.

The schema definition is passed via the checker metadata args property
as an array of conditions. A condition has the following format

``` json
{ "path": <json_path>, "type": <property_type>, "regex": <regex>, "nullable": boolean, "optional": boolean }
```

If the type is 'object' the properties *mandatoryFields* and
*optionalFields* apply as well:

``` json
{ "path": <json_path>, "type": "object", "mandatoryFields": [ <field_names> ], "optionalFields": [ <field_names>] }
```

<table>
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
<td><strong>regex</strong></td>
<td>If specified, this regular expression must match the property (or its string representation).</td>
<td>No</td>
<td>null</td>
</tr>
<tr class="even">
<td><strong>nullable</strong></td>
<td>If true, no check will be performed if the value of the selected property is null.</td>
<td>No</td>
<td>false</td>
</tr>
<tr class="odd">
<td><strong>optional</strong></td>
<td>If true, no check will be performed if the property is missing.</td>
<td>No</td>
<td>false</td>
</tr>
<tr class="even">
<td><p><strong>mandatoryFields</strong></p></td>
<td><p>If the property type is 'object', this is the array of the properties that the object <strong>must</strong> have.</p>
<p>If specified, the object cannot have any other field, as long as they are not listed in the <em>optionalFields</em> array.</p></td>
<td>No</td>
<td>null</td>
</tr>
<tr class="odd">
<td><strong>optionalFields</strong></td>
<td><p>If the property type is 'object', this is the arrayof the properties that the object <strong>is allowed</strong> optionally to have.</p>
<p>If specified, the object cannot have any other field, as long as they are not listed in the <em>mandatoryFields</em> array.</p></td>
<td>No</td>
<td>null</td>
</tr>
</tbody>
</table>

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

``` json
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

<table>
<thead>
<tr class="header">
<th>json pat expr</th>
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
<p><code>{ </code><code>&quot;pi&quot;: 3.14, </code><code>&quot;href&quot;: &quot;https://en.wikipedia.org/wiki/Pi&quot; </code><code>}</code></p></td>
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

<table>
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

``` bash
$ http -a a:a PUT 127.0.0.1:8080/test/users \
checkers:='[{\
    "name":"checkContent","args":[\
        {"path":"$", "type":"object", "mandatoryFields": ["_id", "name", "password", "roles"], "optionalFields": ["bio"]},\
        {"path":"$._id", "type":"string", "regex": "^\\u0022[A-Z0-9._%+-]+@[A-Z0-9.-]+\\u005C.[A-Z]{2,6}\\u0022$"},\
        {"path":"$.password", "type":"string"},\
        {"path":"$.roles", "type":"array"},\
        {"path":"$.roles.[*]", "type":"string"},\
        {"path":"$.name", "type":"string"},\
        {"path":"$.bio", "type":"string", "nullable": true}
 ]\
}]'
```

## Limiting file size with checkContentSize

*checkContentSize* is a checker shipped with RESTHeart that allows to
check the size of a request. It is very useful with file resources to
limit the maximum size of the uploaded file.

The following example, creates a file bucket resource, limiting the file
size from 64 to 32768 bytes:

``` bash
$ http -a a:a PUT 127.0.0.1:8080/test/icons.files descr="icons" \
checkers:='[{"name":"checkContentSize","args":{"min": 64, "max": 32768}}]
```

## Custom Checkers

A checker is a java class that implements the
interface [org.restheart.hal.metadata.singletons.Checker](https://github.com/SoftInstigate/restheart/blob/develop/src/main/java/org/restheart/hal/metadata/singletons/Checker.java).

It only requires to implement the method check() with 3 arguments:

1.  [HttpServerExchange](https://github.com/undertow-io/undertow/blob/master/core/src/main/java/io/undertow/server/HttpServerExchange.java) exachange
2.  [RequestContext](https://github.com/SoftInstigate/restheart/blob/develop/src/main/java/org/restheart/handlers/RequestContext.java) context
    (that is the suggested way to retrieve the information of the
    request such as the payload) 
3.  DBObject args (that is the arguments passed via the *args* property
    of the checker metadata object).

  

``` java
    boolean check(
            HttpServerExchange exchange,
            RequestContext context,
            BsonDocument contentToCheck,
            BsonValue args);

    /**
     * Specify when the checker should be performed: with BEFORE_WRITE the
     * checkers gets the request data (that may use the dot notation and update
     * operators); with AFTER_WRITE the data is optimistically written to the db
     * and rolled back eventually. Note that AFTER_WRITE helps checking data
     * with dot notation and update operators since the data to check is
     * retrieved normalized from the db.
     *
     * @param context
     * @return BEFORE_WRITE or AFTER_WRITE
     */
    PHASE getPhase(RequestContext context);

    /**
     *
     * @param context
     * @return true if the checker supports the requests
     */
    boolean doesSupportRequests(RequestContext context);
```

Once a checker has been implemented, it can be given a name (to be used
as the *name *property of the checker metadata object) in the
configuration file.

The following is the default configuration file section declaring the
two off-the-shelf checkers provided with RESTHeart (checkContent and
checkContentSize) and a third, custom one.

``` text
metadata-named-singletons:
    - group: checkers
      interface: org.restheart.hal.metadata.singletons.Checker
      singletons:
        - name: checkContent
          class: org.restheart.hal.metadata.singletons.SimpleContentChecker
        - name: checkContentSize
          class: org.restheart.hal.metadata.singletons.ContentSizeChecker
        - name: myChecker
          class: com.whatever.MyChecker
```

Or course, the class of the custom checker must be added to the java
classpath.

For example, RESTHeart could be started with the following command:

  

    $ java -server -classpath restheart.jar:custom-checker.jar org.restheart.Bootstrapper restheart.yml

The following code, is an example checker that checks if the
*number* property is an integer between 0 and 10.

``` java
import org.restheart.hal.metadata.singletons.Checker;
import io.undertow.server.HttpServerExchange;
import org.restheart.handlers.RequestContext;
import com.mongodb.DBObject;
 
package com.whatever;
 
public class MyChecker implements Checker {
    boolean check(HttpServerExchange exchange, RequestContext context, DBObject args) {
        DBObject content = context.getContent();
        Object _value = content.get("number");
        if (context.getMethod() == RequestContext.METHOD.PATCH) {
            if (_value == null) {
                // if this is a PATCH and property value is not in the request, it won't be modified
                return true;
            }
        }
        if (_value != null && _value instanceof Integer) {
            Integer value = (Integer) _value;
            
            return value < 10 && value > 0;
        } else {
            return false; // BAD REQUEST
        }
    }
}
```
