---
layout: docs
title: Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Types of Plugins](#types-of-plugins)
* [Available Plugins](#available-plugins)
* [Apply Plugins to Requests](#apply-plugins-to-requests)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}

## Introduction 

RESTHeart Platform works *out-of-the-box* by merely installing it and requires no coding. On the other side real applications often need the API to be extended in some way.

{:.alert.alert-success}
RESTHeart Platform can be extended via *Plugins*. 

Both `restheart-platform-core` and `restheart-platform-security` make use of Plugins.

The Plugins of `restheart-platform-core` are intended for extending the API, while the plugins of `restheart-platform-security` allow customizing security, for instance by implementing a custom Authentication Mechanism that integrates with your Enterprise IDM.

{:.bs-callout.bs-callout-info}
This section focuses on extending `restheart-platform-core` through the Plugins. The Plugins for `restheart-platform-security` are described on [Develop Security Plugins](/docs/v5/develop/security-plugins/).

## Types of Plugins

The following table lists the different types of Plugins of `restheart-platform-core`.

{: .table.table-responsive }
|**Plugin**|**Use for**|**Example Use Case**|
|**Transformer**|Manipulate the request or the response|Filter out sensitive properties from the response, such as `password`|
|**Checker**|Verify the request|Enforce that the write requests on `users` collection contains `email`  and `password` properties|
|**Hook**|Execute code after a request completes|Send a verification email when a document is created in the `users` collection|
|**Service**|Extend the API with a custom Web Service|Add a web service `/verify` to handle the link in the verification email in the user registration process|
|**Initializer**|Perform initialization logic|Initialize the db creating required collection if not existing|

## Available Plugins

RESTHeart Platform is shipped with some general purpose Plugins. For a complete list of available Plugins please refer to [Available Plugins](/docs/v5/plugins/list/).

You can also develop and add your own Plugins. For more information refer to [Develop Core Plugins](/docs/v5/develop/core-plugins/)

{:.bs-callout.bs-callout-info}
Developing a Plugins is done in java programming language and it is as easy as implementing a simple interface.

Note that RESTHeart logs out the registered plugins at startup time. 


```
Registered initializer commLicense: Activates the commercial license
Registered initializer rhPlatformActivator: Activates RESTHeart Platform
Registered service istatus: Internal service that allows querying for server status
Registered service cacheInvalidator: Invalidates the db and collection metadata cache
Registered service csvLoader: Uploads a csv file in a collection
Registered service pingService: Ping service
Registered transformer filterProperties: Filters out a the properties specified by the args property of the transformer metadata object.
Registered transformer oidsToStrings: Replaces ObjectId with strings.
Registered transformer addRequestProperties: Adds properties to the request body
Registered transformer stringsToOids: Replaces strings that are valid ObjectIds with ObjectIds.
Registered transformer writeResult: Adds a body to write responses with updated and old version of the written document.
Registered hook snooper: An example hook that logs request and response info
Registered checker checkContentSize: Checks the request content length
Registered checker checkContent: Checks the request content by using conditions  based on json path expressions
Registered checker jsonSchema: Checks the request according to the specified JSON schema
```

## Apply Plugins to Requests

While `Services` and `Initializers` add logic that gets executed when the service URL is requested and at startup time respectively, the other Plugins can be applied to any request.

This is achieved by defining the Plugin(s) to apply in the *metadata* of databases and collections. This process is further described in detail on [Apply Plugins](/docs/v5/plugins/apply/)
