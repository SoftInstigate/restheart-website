---
layout: docs
title: Development Best Practices
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [restheart-core](#restheart-core)
  * [Get the MongoClient](#get-the-mongoclient)
* [restheart-security](#restheart-security)
    * [Interacting with the HttpServerExchange object](#interacting-with-the-httpserverexchange-object)
    * [How to send the response](#how-to-send-the-response)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

{% include doc-in-progress.html %}

## restheart-core

{:.alert.alert-warning}
work in progress

### Get the MongoClient

{: .black-code}
``` java
// get the MongoClient
MongoClient client = MongoDBClientSingleton.getInstance().getClient();
```

## restheart-security

### Interacting with the HttpServerExchange object

The helper classes `ByteArrayRequest`, `JsonRequest`, `ByteArrayResponse` and `JsonResponse` are available to make easy interacting the `HttpServerExchange` object. As a general rule, always prefer using the helper classes if the functionality you need is available.

For instance the following code snipped retrieves the request JSON content from the `HttpServerExchange`  

{: .black-code}
```java
HttpServerExchange exchange = ...;

if (Request.isContentTypeJson(exchange)) {
  JsonElement content = JsonRequest.wrap(exchange).readContent();
}
```

If you want to manipulate query parameters with a Request Interceptor, always use the Map `exchange.getQueryParameters()` or the method `exchange.addQueryParamter()` and `exchange.addQueryParamter()`. Do not update the query string directly: after Request Interceptors execution, the query string is rebuilt from the query parameters map, see [QueryStringRebuiler](https://github.com/SoftInstigate/restheart-security/blob/master/src/main/java/org/restheart/security/handlers/QueryStringRebuiler.java)

### How to send the response

You just set the status code and the response content using helper classes `ByteArrayResponse` or `JsonResponse`. You don't need to send the response explicitly using low level `HttpServerExchange` methods, since the `ResponseSenderHandler` is in the processing chain and will do it for you.

{: .black-code}
```java
@Override
public void handleRequest(HttpServerExchange exchange) throws Exception {

  JsonResponse response = JsonResponse.wrap(exchange);

  JsonObject resp = new JsonObject();
  resp.appProperty("message", "OK")

  response.writeContent(resp);
  response.setStatusCode(HttpStatus.SC_OK);
}
```