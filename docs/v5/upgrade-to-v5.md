---
title: Upgrade to RESTHeart v5
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Configuration](#configuration)
-   [Plugins](#plugins)
    -   [Simplified plugin deployment](#simplified-plugin-deployment)
    -   [License considerations](#license-considerations)
    -   [Simplified interfaces](#simplified-interfaces)
    -   [Simplified configuration](#simplified-configuration)
    -   [Dependency injection](#dependency-injection)
-   [Transactions](#transactions)
-   [Change Streams](#change-streams)
-   [Security Plugins](#security-plugins)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

RESTHeart v5 is a major refactoring of the internal APIs to simplify the development and deployment experience.

Notable news in v5 are:

1. Adopt the **open core model**: all features of v4 restricted to Enterprise License (transactions, change streams and advanced security plugins) are now open sourced. We still offer [technical support](/support) and the [business friendly License](https://raw.githubusercontent.com/SoftInstigate/restheart/master/COMM-LICENSE.txt) that covers Enterprise requirements.
2. RESTHeart is back a **single unit of deployment**, no more need to run a separate security layer (it's muck like it was RESTHeart v3). Unzip the archive and run it.
3. It's now much easier to extend the API with **plugins** and **interceptors** (see some [examples](https://github.com/SoftInstigate/restheart-examples)). You can build and deploy your own Web Services with few line of code.
4. Promote plain JSON as the primary representation format and demote [HAL](http://stateless.co/hal_specification.html) as a secondary option (HAL might be removed from future releases).

{: .bs-callout.bs-callout-info}
The REST API didn't change! If you haven't developed a plugin you will just need to update the configuration.

## Configuration

The configuration files has been cleaned up simplified.

Since RESTHeart v5 is now a single microservice (v4 was composed by two mircoservices, restheart-core and restheart-security), configuration is now controlled by a single file [restheart.yml](https://raw.githubusercontent.com/SoftInstigate/restheart/master/core/etc/restheart.yml)

## Plugins

### Simplified plugin deployment

Developing a plugins only requires _restheart-commons_. Add the dependency with maven with:

```
<dependency>
    <groupId>org.restheart</groupId>
    <artifactId>restheart-commons</artifactId>
    <version>5.1</version>
</dependency>
```

Once you build your plugin, just copy the jar file to the `/plugins` directory and RESTHeart will automatically add it at startup time.

See some plugins examples at [restheart-examples](https://github.com/softInstigate/restheart-examples) repo.

### License considerations

_restheart-commons_ is licensed under the Apache 2.0 open source license: when you develop a plugin, you don't incur in the limitations of the AGPL.

### Simplified interfaces

All plugins require the `@RegisterPlugin` annotation. This allows RESTHeart to find them in the deployed plugins jar. It also allow defining the properties of plugins.

The methods declared by the plugins interfaces now use parametric Request and Response classes (No more RequestContext). This simplifies the implementation.

For example, the base class of the Service plugin is:

```java
public interface Service<R extends ServiceRequest<?>, S extends ServiceResponse<?>>
        extends HandlingPlugin<R, S>, ConfigurablePlugin {
    /**
     * handle the request
     *
     * @param request
     * @param response
     * @throws Exception
     */
    public void handle(final R request, final S response) throws Exception;

...

}
```

Many specialized interfaces exists. A notable example is JsonService. Implementing the JsonService allows to quickly create a JSON web service. An example follows:

```java
@RegisterPlugin(
        name = "example",
        description = "an example web service",
        enabledByDefault = true,
        defaultURI = "/foo")
public class FooService implements JsonService {
    @Override
    public void handle(JsonRequest request, JsonResponse response) throws Exception {
        response.setContent(new JsonObject("msg","Hello World!"));
    }
}
```

The following plugins exist:

-   **Service** - allows to easily implement a Web Service
-   **Interceptor** - allow to snoop and modify requests and responses at different stages of the request lifecycle as defined by the interceptPoint parameter of the annotation RegisterPlugin.

The following security plugins exist:

-   **AuthMechanism** - allows to handle an authentication schema
-   **Authenticator** - authenticates credentials
-   **Authorizer** - authorize clients according to a security policy
-   **TokenManager** - issues an auth token to authenticated clients. This allows, for instance, a browser to store the less sensitive token instead of the users credentials.

### Simplified configuration

A plugins has a name as defined by the the `@RegisterPlugin` annotation. To define a configuration for a plugin just use its name under the `plugins-args` yml object:

```
plugins-args:
    ping:
        secured: false
        msg: 'Ping!'
```

The plugin consumes the configuration with a method annotated with `@InjectConfiguration`:

```java
@InjectConfiguration
public void init(Map<String, Object> args) throws ConfigurationException {
    this.msg = argValue(args, "msg");
}
```

### Dependency injection

Other dependency injections than `@InjectConfiguration` are:

-   `@InjectPluginsRegistry` - allows a plugin to get the reference of other plugins.
-   `@InjectMongoClient` - injects the `MongoClient` object that has been already initialized and connected to MongoDB by the mongo service.

```java
private PluginsRegistry registry;

@InjectPluginsRegistry
public void init(PluginsRegistry registry) {
    this.registry = registry;
}
```

```java
private MongoClient mclient;

@InjectMongoClient
public void setMongoClient(MongoClient mclient) {
    this.mclient = mclient;
```

## Transactions

Starting v5.1, support for [transactions](/docs/transactions) is available in RESTHeart OSS.

## Change Streams

Starting v5.1, support for [change streams](/docs/change-streams) is available in RESTHeart OSS.

## Security Plugins

Starting v5.1, the following advanced security plugins are available in RESTHeart OSS:

-   **jwtAuthenticationMechanism**: authenticates request with JSON Web Token
-   **mongoRealAuthenticator**: authenticate requests against client credentials stored in MongoDB. It also automatically protects and encrypts passwords
-   **mongoAclAuthorizer**: authorizes requests against ACL stored in MongoDB. It also adds role-based data filtering capability.

</div>
