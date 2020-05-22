---
layout: docs
title: Development Best Practices
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [RESTHeart Core](#restheart-platform-core)
    -   [Get the MongoClient](#get-the-mongoclient)
    -   [Interact with Request and Response](#interact-with-request-and-response)
    -   [Get user id and roles from restheart-platform-security](#get-user-id-and-roles-from-restheart-platform-security)
    -   [Filter out properties from Request or Response](#filter-out-properties-from-request-or-response)
-   [RESTHeart Security](#restheart-platform-security)
    -   [Interact with the HttpServerExchange object](#interact-with-the-httpserverexchange-object)
    -   [How to send the response](#how-to-send-the-response)
    -   [Forbid write requests containing specific properties to all roles but admin](#forbid-write-requests-containing-specific-properties-to-all-roles-but-admin)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress.html %}

## RESTHeart Core

### Get the MongoClient

```java
// get the MongoClient
MongoClient client = MongoDBClientSingleton.getInstance().getClient();
```

### Interact with Request and Response

The plugins's methods of `restheart-platform-core` accept two arguments that allow to interact (read or modify) the request and the response:

```java

public void handleRequest(HttpServerExchange exchange, RequestContext context) {
  ...
}
```

Both `HttpServerExchange exchange` and `RequestContext context` can be used to read and modify the request and the response.

-   [HttpServerExchange](https://github.com/undertow-io/undertow/blob/master/core/src/main/java/io/undertow/server/HttpServerExchange.java) is the generic, low-level Undertow class to interact with the exchange;
-   [RequestContext](https://github.com/SoftInstigate/restheart/blob/master/core/src/main/java/org/restheart/handlers/RequestContext.java) is the specialized RESTHeart helper class that simplifies the most common operations.

{: .bs-callout.bs-callout-info }
As a general rule, always prefer using `RequestContext`. Only use `HttpServerExchange` for low-level operations not directly supported by `RequestContext`.

As an example, the filter query parameter can be retrieved as follows:

```java
// RequestContext helper method to access the filter query parameter
Deque<String>  filterQParam1 = context.getFilter();

// RequestContext helper method that returns the filter as a BsonDocument
// note that multiple values of the parameters are composed with the $and operator
// ?filter={'a':1}&filter={'b':1} ->  { "$and": [ {'a':1}, {'b':1} ] } 
BsonDocument filters = context.getFiltersDocument();
 filters = context.getFiltersDocument();

// Undertow low-level method to access query paramers
Deque<String> filterQParam2 = exchange.getQueryParameters().get(RequestContext.FILTER_QPARAM_KEY);
```

### Get user id and roles from restheart-platform-security

When the request is authenticated by `restheart-platform-security` the user id and roles are passed to `restheart-platform-core` via the following request headers:

-   `X-Forwarded-Account-Id`
-   `X-Forwarded-Account-Roles`

Note that for unauthenticated request these headers are not set.

```java
var headers =  exchange.getRequestHeaders();

var id = headers.getFirst(HttpString.tryFromString("X-Forwarded-Account-Id"));
var _roles = hse.getRequestHeaders().get(HttpString.tryFromString("X-Forwarded-Account-Roles"));

var roles = new ArrayList<String>();

if (_roles != null) {
    _roles.forEach(role -> roles.add(role));
}

// check if authenticated user has role 'admin'

if (roles.contains("admin")) {
  ...
} else {
  ...
}
```

### Filter out properties from Request or Response

RESTHeart includes the Transformer `filterProperties` that allows to filter out properties from both the Request and the Response.

You might want to:

-   filter out properties from the request body in write requests (`POST`, `PUT` and `PATCH` verbs)
-   filter out properties from the response body in read requests (`GET` verb)

{: .bs-callout.bs-callout-warning }
`filterProperties` can only filter out root properties. Avoid using it to filter nested properties.

{: .bs-callout.bs-callout-warning }
It is difficult to filter out properties from a write request because it can use the dot notation and update operators, so that properties to filter out could be in a complex structure as `{"$set": "sub.secret": true }}`. The suggested way is checking the request using an Interceptor of `restheart-platform-security` to forbid request containing them. See [Forbid write requests containing specific properties to all roles but admin](#forbid-write-requests-containing-specific-properties-to-all-roles-but-admin) for an example.

In the following example, we add the Transformer `filterProperties` to Response to filter out the nested property `secret`, and apply it on read requests on collection `/coll`. We will filter out the property to all users but for `admin`.

In order to enable the Transformer we are going to programmatically apply it defining a [Global Transformer](/docs/v5/plugins/apply/#apply-a-transformer-programmatically) and enable it using an [Initializer](/docs/v5/develop/core-plugins/#initializers)

```java
@RegisterPlugin(
        name = "secretHider",
        priority = 100,
        description = "adds a GlobalTranformer to filter out the property 'secret' "
        + "from the response on 'GET /coll' "
        + "when the user does not have the role 'admin'")
public class SecretHider implements Initializer {
    @Override
    public void init(Map<String, Object> confArgs) {
        // a predicate that resolves GET /coll and !roles.contains("admin")
        var predicate = new RequestContextPredicate() {
            @Override
            public boolean resolve(HttpServerExchange hse, RequestContext context) {
                var _roles = hse.getRequestHeaders()
                        .get(HttpString.tryFromString("X-Forwarded-Account-Roles"));

                var roles = new ArrayList<String>();

                if (_roles != null) {
                    _roles.forEach(role -> roles.add(role));
                }

                return context.isGet()
                        && "coll".equals(context.getCollectionName())
                        && (roles == null || !roles.contains("admin"));
            }
        };

        // Let's use filterTransformer to filter out properties from GET response
        var filterTransformer = new FilterTransformer();

        var filterTransformerArgs = new BsonArray();
        filterTransformerArgs.add(new BsonString("secret"));

        var globalTransformer = new GlobalTransformer(
                filterTransformer,
                predicate,
                TransformerMetadata.PHASE.RESPONSE,
                TransformerMetadata.SCOPE.CHILDREN,
                filterTransformerArgs,
                null); // finally add it to global checker list

        PluginsRegistry.getInstance().getGlobalTransformers().add(globalTransformer);
    }
}
```

## RESTHeart Security

### Interact with the HttpServerExchange object

The helper classes `ByteArrayRequest`, `JsonRequest`, `ByteArrayResponse` and `JsonResponse` are available to make easy interacting the `HttpServerExchange` object. As a general rule, always prefer using the helper classes if the functionality you need is available.

For instance the following code snipped retrieves the request JSON content from the `HttpServerExchange`

```java
HttpServerExchange exchange = ...;

if (Request.isContentTypeJson(exchange)) {
  JsonElement content = JsonRequest.wrap(exchange).readContent();
}
```

If you want to manipulate query parameters with a Request Interceptor, always use the Map `exchange.getQueryParameters()` or the method `exchange.addQueryParamter()` and `exchange.addQueryParamter()`. Do not update the query string directly: after Request Interceptors execution, the query string is rebuilt from the query parameters map, see [QueryStringRebuiler](https://github.com/SoftInstigate/restheart/blob/master/security/src/main/java/org/restheart/security/handlers/QueryStringRebuiler.java)

### How to send the response

You just set the status code and the response content using helper classes `ByteArrayResponse` or `JsonResponse`. You don't need to send the response explicitly using low level `HttpServerExchange` methods, since the `ResponseSenderHandler` is in the processing chain and will do it for you.

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

### Forbid write requests containing specific properties to all roles but _admin_

In the following example, we add a Request Interceptor that forbids write requests to `/coll` when executed by a user that does not have to role _admin_.

In order to enable the Interceptor we are going to programmatically apply it using an [Initializer](/docs/v5/develop/security-plugins/#initializers)

```java
@RegisterPlugin(
        name = "onlyAdminCanWriteSecrets",
        priority = 100,
        description = "adds an Interceptor that forbis write requests "
        + "on 'GET /coll' "
        + "containing the property 'secret' "
        + "to users without the role 'admin'")
public class OnlyAdminCanWriteSecrets implements Initializer {
  @Override
  public void init() {

      PluginsRegistry.getInstance()
              .getRequestInterceptors()
              .add(new RequestInterceptor() {
                  @Override
                  public boolean requiresContent() {
                      return true;
                  }

                  @Override
                  public RequestInterceptor.IPOINT interceptPoint() {
                      return RequestInterceptor.IPOINT.AFTER_AUTH;
                  }

                  @Override
                  public void handleRequest(HttpServerExchange hse) throws Exception {
                      var content = JsonRequest.wrap(hse).readContent();

                      if (keys(content).stream()
                              .anyMatch(k -> "secret".equals(k)
                              || k.endsWith(".secret"))) {
                          var response = ByteArrayResponse.wrap(hse);

                          response.endExchangeWithMessage(HttpStatus.SC_FORBIDDEN, "cannot write secret");
                      };
                  }

                  @Override
                  public boolean resolve(HttpServerExchange hse) {
                      var req = ByteArrayRequest.wrap(hse);

                      return req.isContentTypeJson(hse)
                              && !req.isAccountInRole("admin")
                              && hse.getRequestPath().startsWith("/coll")
                              && (req.isPost() || req.isPatch() || req.isPut());
                  }

                  /**
                   * @return the keys of the JSON
                   */
                  private ArrayList<String> keys(JsonElement val) {
                      var keys = new ArrayList<String>();

                      if (val == null) {
                          return keys;
                      } else if (val.isJsonObject()) {
                          val.getAsJsonObject().keySet().forEach(k -> {
                              keys.add(k);
                              keys.addAll(keys(val.getAsJsonObject().get(k)));
                          });
                      } else if (val.isJsonArray()) {
                          val.getAsJsonArray().forEach(v -> keys.addAll(keys(v)));
                      }

                      return keys;
                  }
              });
  }
}
```

This interceptor is executed (see method `resolve()`):

-   to write requests: `(req.isPost() || req.isPatch() || req.isPut()`
-   that are executed by authenticated users without the role _admin_: `!req.isAccountInRole("admin")`
-   on URI starting with `/coll`: `hse.getRequestPath().startsWith("/coll")`

The interceptor needs the request body (`requiresContent()` returns `true`) and must be executed after authorization and authentication phases (`interceptPoint()` returns `AFTER_AUTH`)

In order to check that the request body does not contain the property `secret`, the helper method `keys()` collects all the JSON keys (name of the properties) in the request, and finally `handleRequest()` checks that those keys don't contain the value `secret` or a key that ends with `.secret` (with restheart keys can use the dot notation).
