---
layout: docs
title: Initializer
---

> Initializer Will be part of RESTHeart 3.3

You can have a preview from the current 3.3.0-SNAPSHOT version, donwload it from [sonatype](https://oss.sonatype.org/content/repositories/snapshots/org/restheart/restheart/3.3.0-SNAPSHOT/)

An initializer is a class with the method `init()` that is invoked at RESTHeart startup.

It can be used to perform initialization code. For instance, it can programmatically add _Transformers_ and _Checkers_ and init the db.

The Initializer class can be specified in the configuration file

``` yml
### Initializer

# A custom initializer implmenting the org.restheart.init.Initializer interface
# Can be used to inizialize data or add global transformers, checkers or security predicates
# See org.restheart.init.TestInitializer for a simple example

initializer-class: org.restheart.init.TestInitializer
```

For an example look at [org.restheart.init.TestInitializer](https://github.com/SoftInstigate/restheart/blob/master/src/main/java/org/restheart/init/TestInitializer.java)

The class must implement the `Initializer` inferface

``` java
package org.restheart.init;

public interface Initializer {
    public void init();
}
```
## Best practices

### Get the MongoClient

``` java
// get the MongoClient
MongoClient client = MongoDBClientSingleton.getInstance().getClient();
```

### Add global tranformers (applied to all requests)

``` java
// transform the request
RequestTransformerHandler.getGlobalTransformers().add(tranformer);

// transform the response
ResponseTransformerHandler.getGlobalTransformers().add(tranformer);
```

### Add global checker (applied to all requests) ###

``` java
// check the request
CheckerHandler.getGlobalCheckers().add(checker);
```

### Add global security predicate

``` java
// allow users with role "ADMIN" to GET /
RequestContextPredicate securityPredicate = new RequestContextPredicate() {
            @Override
            public boolean resolve(HttpServerExchange hse, RequestContext context) {
                return context.isRoot()
                        && context.isGet()
                        && context.getAuthenticatedAccount() != null
                        && context.getAuthenticatedAccount().getRoles().contains("ADMIN");
            }
        }

// add the global predicate
AccessManagerHandler.getGlobalSecurityPredicates().add(securityPredicate);
```

