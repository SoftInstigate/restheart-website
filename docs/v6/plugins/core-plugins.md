---
title: Develop Core Plugins
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
    * [Dependency](#Dependency)
    * [@RegisterPlugin annotation](#@register-plugin-annotation)
    * [Plugin Configuration](#plugin-configuration)
    * [Dependency injection](#dependency-injection)
    * [Request and Response Generic Classes](#request-and-response-generic-classes)
* [Services](#services)
* [Interceptors](#interceptors)
* [Initializers](#initializers)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress-v6.html %}


## Services

Depending on the content type, the Service class implements one of the specialized `org.restheart.plugins.Service` interfaces. The following implementation are provided by `restheart-commons`:

- `ByteArrayService`
- `JsonService`
- `BsonService`

The code of example [mongo-status-service](https://github.com/SoftInstigate/restheart/tree/master/examples/mongo-status-service) implementing `BsonService` and using the `MongoClient` obtained via `@InjectMongoClient` follows:

```java
@RegisterPlugin(
        name = "serverstatus",
        description = "returns MongoDB serverStatus",
        enabledByDefault = true,
        defaultURI = "/status")
public class MongoServerStatusService implements BsonService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MongoServerStatusService.class);

    private MongoClient mongoClient;

    private static final BsonDocument COMMAND = document().put("serverStatus", 1);

    @InjectMongoClient
    public void init(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    @Override
    public void handle(BsonRequest request, BsonResponse response) throws Exception {
        if (request.isGet()) {
            var serverStatus = mongoClient.getDatabase("admin").runCommand(COMMAND, BsonDocument.class);

            response.setContent(serverStatus);
            response.setStatusCode(HttpStatus.SC_OK);
            response.setContentTypeAsJson();
        } else {
            // Any other HTTP verb is a bad request
            response.setStatusCode(HttpStatus.SC_BAD_REQUEST);
        }
    }
}
```

The key method is `handle()` that is executed when a request to the service URI hits RESTHeart.

### Create Service with custom generic type

To implement a Service that handles different types of Request and Response, it must implement the base `Service` interface.

The base `Service` interface requires to implement methods to initialize and retrieve the Request and Response objects.

The following example shows how to handle XML content:

```java
@RegisterPlugin(name = "myXmlService",
    description = "example service consuming XML requests",
    enabledByDefault = true,
    defaultURI = "/xml")
public class MyXmlService implements Service<XmlRequest, XmlResponse> {
    @Override
    default Consumer<HttpServerExchange> requestInitializer() {
        return e -> XmlRequest.init(e);
    }

    @Override
    default Consumer<HttpServerExchange> responseInitializer() {
        return e -> XmlResponse.init(e);
    }

    @Override
    default Function<HttpServerExchange, JsonRequest> request() {
        return e -> XmlRequest.of(e);
    }

    @Override
    default Function<HttpServerExchange, JsonResponse> response() {
        return e -> XmlResponse.of(e);
    }
}
```

The example follows a pattern that delegates the actual initialization (in `requestInitializer()` and `responseInitializer()`) and retrieval of the object from the exchange (in `request()` and `response()`) to the concrete class, as follows:

```java
public class XmlRequest extends ServiceRequest<Document> {
    private XmlRequest(HttpServerExchange exchange) {
        super(exchange);
    }

    public static XmlRequest init(HttpServerExchange exchange) {
        var ret = new XmlRequest(exchange);

        try {
            ret.injectContent();
        } catch (Throwable ieo) {
            ret.setInError(true);
        }

        return ret;
    }

    public static XmlRequest of(HttpServerExchange exchange) {
        return of(exchange, XmlRequest.class);
    }

    public void injectContent() throws SAXException, IOException {
        var dBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
        var rawContent = ChannelReader.read(wrapped.getRequestChannel());

        setContent(xdBuilder.parse(rawContent)ml);
    }
}
```

In the constructor a call to `super(exchange)` attaches the object to the `HttpServerExchange`. The object is retrieved using the inherited `of()` method that gets the instance attachment from the `HttpServerExchange`. This is fundamental for two reasons: first the same request and response objects must be shared by the all handlers of the processing chain. Second, this avoid the need to parse the content several times for performance reasons.

{: .bs-callout.bs-callout-info }
Watch [Services](https://www.youtube.com/watch?v=GReteuiMUio&t=680s)

## Interceptors

 Interceptors allow to snoop and modify requests and responses at different
 stages of the request lifecycle as defined by the interceptPoint parameter of
 the annotation `@RegisterPlugin`.

 An interceptor can intercept either proxied requests or requests handled by
 Services.

 An interceptor can intercept requests handled by a Service when its request
 and response types are equal to the ones declared by the Service.

 An interceptor can intercept a proxied request, when its request and response
 types extends BufferedRequest and BufferedResponse.

The following implementation are provided by `restheart-commons`:

- `ByteArrayInterceptor` intercepts requests handled by services implementing `ByteArrayService`
- `JsonInterceptor` intercepts requests handled by services implementing `JsonService`
- `BsonInterceptor` intercepts requests handled by services implementing `BsonService`
- `MongoInterceptor` intercepts requests handled by the MongoService

The last one is particularly useful as it allows intercepting requests to the MongoDb API.

```java
@RegisterPlugin(name = "secretFilter",
    interceptPoint = InterceptPoint.RESPONSE,
    description = "removes the property 'secret' from GET /coll")
public class ReadOnlyPropFilter implements MongoInterceptor {
    @Override
    public void handle(MongoRequest request, MongoResponse response) throws Exception {
        if (response.getContent().isDocument()) {
            response.getContent().asDocument().remove("secret");
        } else if (request.getContent().isArray()) {
            response.getContent().asArray().stream()
                .map(doc -> doc.asDocument())
                .forEach(doc -> doc.remove("secret"));
        }
    }

    @Override
    public boolean resolve(MongoRequest request, MongoResponse response) {
        return request.isGet()
            && response.getContent() != null
            && "coll".equalsIgnoreCase(request.getCollectionName());
    }
}

```

The `handle()` method is invoked only if the `resolve()` method returns true.

{: .bs-callout.bs-callout-info }
Watch [Interceptors](https://www.youtube.com/watch?v=GReteuiMUio&t=986s)

## Initializers

An _Initializer_ allows executing custom logic at startup time.

The Initializer implementation class must extend the `org.restheart.plugins.Initializer` interface:

```java
public interface Initializer extends ConfigurablePlugin {
    public void init();
}
```

With the following code the Initializer hangs restheart startup until the user confirms.

```java
@RegisterPlugin(name = "confirmStartupInitializer",
    description = "hangs restheart startup until the user hits <enter>"
    priority = 100,
    initPoint = InitPoint.BEFORE_STARTUP)
public class confirmStartupInitializer implements Initializer {
    public void init() {
        System.out.println("Hit <enter> to start RESTHeart");
        System.console().readLine();
    }
}
```

{: .bs-callout.bs-callout-info }
Watch [Initializers](https://www.youtube.com/watch?v=GReteuiMUio&t=1274s)

<hr>
