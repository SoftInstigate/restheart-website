---
title: Upgrade to RESTHeart v7
layout: docs
---

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

RESTHeart v7 introduces many news features, improvements and changes.
This page summarizes the new features and provide guidance on upgrading from previous versions.

## Summary

### Core

|Feature|Motivation||
|-|-|-|
|New Dependency Injection mechanism and new plugin type Provider|Streamline dependencies managment|✅|
|Blocking and Non Blocking Services|Support async and reactive coding style|✅|
|Default configuration|Start restheart with just `java -jar restheart.jar`|✅|
|New way to override configuration with env vars|Make it easy changing a few options via env var. This, together with the *Default configuration*, make writing configuration file useless|✅|
|Add `-c` and `-t` cmd options to print the effective and template configuration respectively|Make easy creating a configuration file and snooping the effective configuration after overrides and parameters substitutions|✅|
|Java 17|Java 17 is super cool and LTS, let's use it|✅|
|New configuration file format|simplify configuration.|✅|
|Wildcard Interceptor|Allow to intercept any request|✅|
|New `InterceptPoint.REQUEST_BEFORE_EXCHANGE_INIT`|Support use cases where the request content must be transformed, e.g. from XML to JSON|✅|
|Simplify CORS headers management|Maker easier customizing CORS headers|✅|
|Support HTTP2|HTTP2 is supported by Undertow and so should be by RESTHeart|✅|
|Automatic reflection configuration of plugins for native images|Simplify building native images |✅|
|Automatic configuration for `io-threads` and `worker-threads`|Simplify performance tuning|✅|

### MongoService

|Feature|Motivation||
|-|-|-|
|PATCH document to accept update operators expr also with `?writeMode=insert`|Currently `PATCH /coll/doc?wm=insert` (with writeMode=insert) does not allow using update operators|✅|
|Allow to specify `ReadConcern`, `WriteConcern` and `ReadPreference` at request level|Extend MongoDB API coverage|✅|
|MongoService to use mongo-driver-sync|MongoService currently uses the mongo-driver-legacy while the suggested driver is mongo-driver-sync|✅|
|New caching mechanism|Improve Performance for `GET /coll` requests|✅|

### GraphQLService

|Feature|Motivation||
|-|-|-|
|GraphQL Field to Aggregation Mapping|Allow using the powerful MongoDB aggregation framework in GraphQL apps|✅|
|Move GraphQLRequest to restheart-commons|Allow to intercept requests to GraphQL endpoints|✅|

### New Plugins

|Feature|Motivation||
|-|-|-|
|New provider to init and inject the `MongoClient`|Remove dependency to the MongoService for plugins that use `@Inject("mclient")` and `@Inject("mclient-reactive")`|✅|

### Security

|Feature|Motivation||
|-|-|-|
|Avoid weak password|Weak password are dangerous, must avoid user to use a weak one|✅|
|Brute force password cracking attacks detection|Allow to detect brute force attacks trying to crack user password |✅|
|Add JWT Token Manager|issues and verifies auth tokens in a cluster compatible way|✅|

## Details

### New Dependency Injection mechanism and new plugin type Provider

The annotations `@InjectMongoClient`, `@InjectConfiguration` and `@InjectPluginRegistry` are removed in favor of the generic DI annotations `@Inject` and `@OnInit`

`@Inject` works together with the new plugin type `Provider`, as in the following example:

Given the following `Provider`:

```
@RegisterPlugin(name="hello-world-message“, description="a dummy provider")
class MyProvider implements Provider<String> {
    @Override
    public String get(PluginRecord<?> caller) {
        return "Hello World!";
    }
}
```

We can inject it into a Plugin with `@Inject`

```
@RegisterPlugin(name = "greetings", description = "just another Hello World")
public class GreeterService implements JsonService {
    @Inject("hello-world-message")
    private String message;

    @OnInit
    public void init() {
        // called after all @Inject fields are resolved
    }

    @Override
    public void handle(JsonRequest req, JsonResponse res) {
        switch(req.getMethod()) {
            case GET -> res.setContent(object().put("message", message));
            case OPTIONS -> handleOptions(req);
            default -> res.setStatusCode(HttpStatus.SC_METHOD_NOT_ALLOWED);
        }
    }
}
```

### Blocking and Non Blocking Services

In RESTHeart v6 all services are executed on a Multi-threading concurrency model: when a request comes, it is dispatched and executed by a working thread obtained from a pool (whose size is defined by the configuration parameter  `worker-threads`, by default 16).

The concurrency model performs well for CPU bound and blocking operations.

An example of blocking operation is a MongoDB operation executed with the `mongodb-driver-sync`.

It is today accepted that, in case non blocking operations, the *Event Loop* concurrency model can perform better than the *Multi-threading* model.

RESTHeart v7 allows to specify the concurrency model as follows:

```java
@RegisterPlugin(
    name = "foo", 
    description = "just an example service", 
    blocking = false)  // <= default true for backward compatibility
public class MyPlugin implements JsonService {
...
}
```

With `blocking = false` the execution of the service is not dispatched to a working thread and executed by the io-thread, thus avoiding the overhead of the thread handling and switching. 

Undertow allows to execute an handler in the io-thread, without closing the exchange on return, as follows:

```java
exchange.dispatch(SameThreadExecutor.INSTANCE, () -> exchange.getResponseSender().send("Hello World!"));
```

### Default configuration

RESTheart v6 requires a configuration file. The configuration file can be parametrized, and parameters can be specified with an additional properties file, eg.

```
$ java -jar restheart etc/restheart.yml -e etc/default.properties
```

In RESTHeart v7 the configuration file is optional, if omitted [default values](https://github.com/SoftInstigate/restheart/blob/master/core/src/main/resources/restheart-default-config.yml) are applied.

So RESTHeart v7 can be started with

```
$ java -jar restheart.jar
```

## New way to override configuration options with environment variables

RESTHeart v6 allows to override a configuration options with an environment variable only if the parameters is a primitive type.

Taking into account the following configuration snipped:

```yml
mongo-uri: mongodb://127.0.0.1
mongo-mounts:
  - what: restheart
    where: /
```

The env var `RH_MONGO_URI` overrides the parameter `mongo-uri`. 
The parameters `mongo-mounts`, not being of a primitive type, cannot be ovverriden. 

RESTHeart v7 introduces a new way to override variables via the environment variable `RHO`.

An example is

```bash
$ RHO='/mongo-uri->"mongodb://127.0.0.1";/mongo-mounts[1]/where->"/api"' java -jar restheart.jar
```

or even

```bash
$ RHO='/mongo-uri->"mongodb://127.0.0.1";/mongo-mounts[1]->{"where: "/api", "what": "mydb"}' java -jar restheart.jar
```

### Java 17

RESTHeart v7 requires Java 17.

Note that Java 17 is a LTS released.

### New configuration file format

Since v5, in RESTHeart *everything is a plugin* but still the configuration file resembles the old times where RESTHeart was just an API for MongoDB.

We propose to have the yml configuration to pass parameters to plugins via its name. This is somehow already possibile under the section `plugins-args`, but still there are some parameters (especially for the MongoService) that have their own section. 

For instance until v6 we have

```yml
mongo-uri: mongodb://127.0.0.1

mongo-mounts:
  - what: restheart
    where: /

auth-mechanisms:
  tokenBasicAuthMechanism:
    enabled: true

plugins-args:
  mongo:
    uri: /
  ping:
    enabled: true
    msg: Greetings from RESTHeart!
```

RESTHeart v7 configuration will be something like:

```yml
mongo:
  uri: /
  mongo-uri:  mongodb://127.0.0.1
  mongo-mounts:
     - what: restheart
       where: /

ping:
  enabled: true
  msg: Greetings from RESTHeart!

basicAuthMechanism:
    enabled: true
    authenticator: fileRealmAuthenticator
```

Check the draft configuration format at https://github.com/SoftInstigate/restheart/blob/master/core/src/main/resources/restheart-v7-config.yml

### Wildcard Interceptor

In RESTHeart v6 an Interceptor can intercept a request only if the handling service uses the very same `Request` and `Response` class implementations so, as an example, an Interceptor that implements `JsonInterceptor` can intercept requests to services that implements the interfaces `JsonService`, both using the classes `JsonRequest` and `JsonResponse`.

RESTHeart v7 will feature the `WildcardInterceptor` interface that allows to intercept any request/response.

### New `InterceptPoint.BEFORE_EXCHANGE_INIT`

RESTHeart v7 will also add the new `InterceptPoint.BEFORE_EXCHANGE_INIT `

A use case for this will be a client sending a POST with an XML payload to the `MongoService` (that obviously handles only BSON payloads in the form of `MongoRequest` and `MongoResponse` classes). A `WildcardInterceptor`, intercepting the request at `InterceptPoint.BEFORE_REQUEST_INITIALIZATION` is able to transform the XML to BSON transparently to the `MongoService`

### Simplify CORS headers management

`Service` interface extends the following interface

```java
public interface CORSHeaders {
   

        /**
        * @return the values of the Access-Control-Expose-Headers
        *//
        default String accessControlExposeHeaders() {
           // return the defaults headers
        }

        /**
        * @return the values of the Access-Control-Allow-Credentials
        *//
        default String accessControlAllowCredentials() {
           // return the defaults headers
        }

        /**
        * @return the values of the Access-Control-Allow-Origin
        *//
        default String accessControlAllowOrigin() {
           // return the defaults headers
        }

        /**
        * @return the values of the Access-Control-Allow-Methods
        *//
        default String accessControlAllowMethods() {
           // return the defaults headers
        }
    }
```

RESTHeart uses those methods to return the CORS headers. Overriding the methods allow to set or add custom CORS headers.

### Support HTTP2

See [Undertow HTTP listener](https://undertow.io/undertow-docs/undertow-docs-2.1.0/index.html#http-listener)

### Automatic reflection configuration of plugins for native images

Building native images requires defining the `reflect-config.json` configuration file. See [Native image reflection configuration for Java plugins](https://restheart.org/docs/plugins/deploy#native-image-reflection-configuration-for-java-plugins)](https://restheart.org/docs/plugins/deploy#native-image-reflection-configuration-for-java-plugins).

Following what is described at [Configuration with Features](https://www.graalvm.org/22.2/reference-manual/native-image/dynamic-features/Reflection/#configuration-with-features), it is possibile to automate this task and streamline the development of plugins to bundle in restheart native.

### Automatic configuration for `io-threads` and `worker-threads`

`io-threads` and `worker-threads` are key configuration parameters for performance.

RESTHeart v7 allows to auto detect suggested values that depend on number of available cores, as follows:

```
  # Number of I/O threads created for non-blocking tasks. Suggested value: core*8.
  # if <= 0, use the number of cores.
  io-threads: 0

  # Number of threads created for blocking tasks (such as ones involving db access). Suggested value: core*8
  # if < 0, use the number of cores * 8. With 0 working threads, blocking services won't work.
  worker-threads: -1
```

### PATCH document to accept update operators expr also with `?writeMode=insert`

Currently `PATCH /coll/doc?wm=insert` (with writeMode=insert) does not allow using update operators

The following table summarizes the write operations on request method and write mode

| wm     | method | URI         | write operation                 |  wrop argument         |
|-|-|-|-|-|
| insert | POST   | /coll       | insertOne                       | document               |
| insert | PUT    | /coll/docid | insertOne                       | document               |
| insert | PATCH  | /coll/docid | findOneAndUpdate(upsert:true)*  | update operator expr   |
 | update | POST   | /coll       | findOneAndReplace(upsert:false) | document               |
 | update | PUT    | /coll/docid | findOneAndReplace(upsert:false) | document               |
 | update | PATCH  | /coll/docid | findOneAndUpdate(upsert:false)  | update operator expr   |
| upsert | POST   | /coll       | findOneAndReplace(upsert:true)  | document               |
| upsert | PUT    | /coll/docid | findOneAndReplace(upsert:true)  | document               |
| upsert | PATCH  | /coll/docid | findOneAndUpdate(upsert:true)   | update operator expr   |


*) uses a find condition that won't match any existing document, making sure the operation is an insert

### Allow to specify `ReadConcern`, `WriteConcern` and `ReadPreference` at request level

Extend MongoDB write API coverage with support for the following query parameters:

```
POST /coll?weadConcern=majority
```

```
GET /coll?readConcern=majority&readPreference=primary
```

### MongoService to use mongo-driver-sync

Refactor the `MongoService` to use `mongodb-driver-sync`.

### New caching mechanism

Reuse the MongoDB cursor batch data to speedup `GET /coll` requests 

### GraphQL Field to Aggregation Mapping

In RESTHeart v6, the GraphQL application definition allows two types of [field mapping](https://restheart.org/docs/graphql/#mappings)

- Field to Field mapping
- Field to Query mapping

RESTHeart v7 adds a new mapping: *Field to Aggregation* mapping.

As the name suggests, a GraphQL type can have a field that maps to an aggregation. An example would be a numeric field that is a count of some data executed via an aggregation. 

### Move `GraphQLRequest` to restheart-commons

Currently the `Request` implementation used by the `GraphQLService` in incapsulated in the `graphql` module. 

RESTHeart v7 moves it to `restheart-commons`. This allows implementing an Interceptors that can intercept requests handled by GraphQL services.

### New Provider to init and inject the `MongoClient`

In RESTHeart v6, the singleton object `MongoClient` is initialized by the `MongoService`.

Many other plugins uses the `MongoClient` via the `@Inject("mclient")` annotation. This forces a dependency to the `MongoService`.

An example is the authenticator `MongoRealmAuthenticator` that handles the user base in a MongoDB collection. Currently it cannot be used when the `MongoService` is disabled.

RESTHeart v7 moves the `MongoClient` handling logic to its own plugin, allowing to seamlessly use MongoDB even in use cases where the MongoDB REST API is not required.

### Security

### Avoid weak password

Using weak password is dangerous. RESTHeart v7 uses the password strength estimator [zxcvbn4j](https://github.com/nulab/zxcvbn4j) to check user password handled by MongoRealmAuthenticator and reject user document upserts containing a weak password.

To enable it, two options are added in the configuration of the `mongoRealmAuthenticator`: `enforce-minimum-password-strenght` and `minimum-password-strength`

```
authenticators:
  mongoRealmAuthenticator:
    enabled: true
    users-db: restheart
    users-collection: users
    prop-id: _id
    prop-password: password
    json-path-roles: $.roles
    bcrypt-hashed-password: true
    bcrypt-complexity: 12
    enforce-minimum-password-strenght: false
    # Integer from 0 to 4
    # 0 Weak        （guesses < 3^10）
    # 1 Fair        （guesses < 6^10）
    # 2 Good        （guesses < 8^10）
    # 3 Strong      （guesses < 10^10）
    # 4 Very strong （guesses >= 10^10）
    minimum-password-strength: 3
    create-user: true
    create-user-document: '{"_id": "admin", "password": "$2a$12$lZiMMNJ6pkyg4uq/I1cF5uxzUbU25aXHtg7W7sD2ED7DG1wzUoo6u", "roles": ["admin"]}'
    # create-user-document.password must be hashed when bcrypt-hashed-password=true
    # default password is 'secret'
    # see https://bcrypt-generator.com but replace initial '$2y' with '$2a'
    cache-enabled: false
    cache-size: 1000
    cache-ttl: 60000
    cache-expire-policy: AFTER_WRITE
```

### Brute force password cracking attacks detection

RESTHeart v7 allows to detect when the number of requests with failed authentication overcome a given threshold in a given period.
When this happens, any authentication attempts will be rejected anyway with status code 429 TOO MANY REQUESTS for n seconds, lowering the effectiveness of brute force attacks. 

### JWT Token Manager

An implementation of [Token Manger](https://restheart.org/docs/plugins/security-plugins/#token-managers) that  issues and verifies auth tokens in a cluster compatible way.

Each token can be verified by any node of the cluster regardless which one actually issued it (as long as they share the same `secret`)


#### Configuration

```
token-manager:
  jwtTokenManager:
    key: secret
    enabled: true
    ttl: 15
    srv-uri: /tokens
    issuer: restheart.com
```

Note: All nodes must share the same configuration

#### Renew the token

The query parameter `renew-auth-token` forces the token to be renewed.

Generating a new token is a cryptographic operation, 
and it can have a significant performance overhead. 
It is responsibility of the client to renew the token using this query parameter
when it is going to expiry somehow soon.

</div>