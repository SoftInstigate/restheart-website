---
layout: docs
title: Apply Plugins
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction ](#introduction)
* [Apply a Transformer via metadata](#apply-a-transformer-via-metadata)
* [Apply a Transformer programmatically](#apply-a-transformer-programmatically)
* [Apply a Checker via metadata](#apply-a-checker-via-metadata)
* [Apply a Checker programmatically](#apply-a-checker-programmatically)
* [Apply an Hook via metadata](#apply-an-hook-via-metadata)
* [Apply an Hook programmatically](#apply-an-hook-programmatically)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction 

Transformers, Checkers and Hooks can be applied to any request.

In RESTHeart, not only documents but also dbs and collections 
(and files buckets, schema stores, etc.) have properties. 
Some properties are metadata, i.e. have a special meaning
for RESTheart that controls its behavior.

You can use special metadata to apply plugins. Transformers and Checkers can also be applied programmatically.

## Apply a Transformer via metadata

The metadata *rts* allows to declare transformers.
*  a transformer declared in the *rts* db property, 
gets executed to any requests that involves the db 
and its children resources 
(collections, documents, file buckets, schema stores, etc.).
* a transformer declared in the *rts* collection property,
gets executed to any requests that involves the collection 
and its documents.

{: .black-code}
``` json
{"name":<name>, "phase":<phase>, "scope":<scope>, "args":<args>}
```

<table class="table table-responsive">
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
<td><p>The name of the transformer</p></td>
<td>Yes</td>
</tr>
<tr class="even">
<td><code>phase</code></td>
<td><p>specifies to transform either the request or the response.</p>
    <p>Valid values are <code>REQUEST</code> or <code>RESPONSE</code></p></td>
<td>Yes</td>
</tr>
<tr class="odd">
<td><code>scope</code></td>
<td>
<p>Only applicable to RESPONSE transformers; with <code>"scope": "THIS"</code> the transformer is executed once on the whole response, with <code>"scope":"CHILDREN"</code> it is executed once per embedded document.</p>
</td>
<td>When <code>"phase": "RESPONSE"</code></td>
</tr>
<tr class="even">
<td><code>args</code></td>
<td>arguments to be passed to the transformer.</td>
<td>No</td>
</tr>
</tbody>
</table>

## Apply a Transformer programmatically

Global Transformers can be defined programmatically instantiating `GlobalTransformer` objects:

{: .black-code}
``` java
    /**
     *
     * @param transformer
     * @param phase
     * @param scope
     * @param predicate transformer is applied only to requests that resolve
     * the predicate
     * @param args
     * @param confArgs
     */
    public GlobalTransformer(Transformer transformer,
            RequestContextPredicate predicate,
            RequestTransformer.PHASE phase,
            RequestTransformer.SCOPE scope,
            BsonValue args,
            BsonValue confArgs) {
        this.transformer = transformer;
        this.predicate = predicate;
        this.phase = phase;
        this.scope = scope;
        this.args = args;
        this.confArgs = confArgs;
    }
```

and adding them to the list `TransformerHandler.getGlobalTransformers()`

{: .black-code}
``` java
// a predicate that resolves GET /db/coll
RequestContextPredicate predicate = new RequestContextPredicate() {
            @Override
            public boolean resolve(HttpServerExchange hse, RequestContext context) {
                return context.isDb() && context.isGet();
            }
        };

// Let's use the predefined FilterTransformer to filter out properties from GET response
Transformer transformer = new FilterTransformer();

// FilterTransformer requires an array of properties to filter out as argument
BsonArray args = new BsonArray();
args.add(new BsonString("propToFilterOut"));

// if the checker requires configuration arguments, define them here
BsonDocument confArgs = null;

GlobalTransformer globalTransformer = new GlobalTransformer(
                transformer, 
                predicate,
                TransformerMetadata.PHASE.RESPONSE, 
                TransformerMetadata.SCOPE.CHILDREN, 
                args, 
                confArgs)

// finally add it to global checker list
TransformerHandler.getGlobalTransformers().add(globalTransformer);
```

You can use an [Initializer](/docs/develop/core-plugins#initializers) to add Global Checkers and Global Transformers. An example can is [AddBodyToWriteResponsesInitializer](https://github.com/SoftInstigate/restheart/blob/master/core/src/main/java/org/restheart/plugins/initializers/AddBodyToWriteResponsesInitializer.java)

Note that `AddBodyToWriteResponsesInitializer` is not enabled by default. To enabled it add `enabled=true` to its [configuration](/docs/develop/core-plugins/#configuration).

## Apply a Checker via metadata

The collection metadata property `checkers` allows to declare checkers
to be applied to write requests.

*checkers* is an array of *`checker`* objects. A *checker* object has
the following format:

{: .black-code}
```
{ "name": <checker_name>,"args": <arguments>, "skipNotSupported": <boolean> }
```

<table class="table table-responsive">
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
<td><code>skipNotSupported</code></td>
<td><p>if true, skip the checking if this checker does not support the request (Checker.doesSupportRequests())</p></td>
<td>no</td>
</tr>
</tbody>
</table>

## Apply a Checker programmatically

Global Checkers can be defined programmatically instantiating `GlobalChecker` objects:

{: .black-code}
``` java
    /**
     * 
     * @param checker
     * @param predicate checker is applied only to requests that resolve
     * the predicate
     * @param skipNotSupported
     * @param args
     * @param confArgs 
     */
public GlobalChecker(Checker checker,
            RequestContextPredicate predicate,
            boolean skipNotSupported,
            BsonValue args,
            BsonValue confArgs)
```

and adding them to the list `CheckerHandler.getGlobalCheckers()`

{: .black-code}
``` java
// a predicate that resolves POST /db/coll and PUT /db/coll/docid requests
RequestContextPredicate predicate = new RequestContextPredicate() {
        @Override
        public boolean resolve(HttpServerExchange hse, RequestContext context) {
            return (context.isPost() && context.isCollection())
            || (context.isPut() && context.isDocument());
        }
    };

// Let's use the predefined ContentSizeChecker to limit write requests size
Checker checker = new ContentSizeChecker(); 

// ContentSizeChecker requires argument max, use 1024 Kbyte
BsonDocument args = new BsonDocument("max", new BsonInt32(1024*1024));

// if the checker requires configuration arguments, define them here
BsonDocument confArgs = null;

GlobalChecker globalChecker = new GlobalChecker(checker, predicate, true, args, confArgs);

// finally add it to global checker list
CheckerHandler.getGlobalCheckers().add(globalChecker);
```

You can use an [Initializer](/docs/develop/core-plugins#initializers) to add Global Checkers.

## Apply an Hook via metadata

The collection metadata property `hooks` allows to declare the hooks to
be applied to the requests involving the collection and its documents.

`hooks` is an array of objects with the following format:

{: .black-code}
``` json
{ "name": <hook_name>, "args": <arguments> }
```

<table class="table table-responsive">
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
<td><p>name of the hook as defined in the configuration file.</p></td>
<td>Yes</td>
</tr>
<tr class="even">
<td><code>args</code></td>
<td>arguments to be passed to the hook.</td>
<td>No</td>
</tr>
</tbody>
</table>

## Apply an Hook programmatically

Global Hooks can be defined programmatically instantiating `GlobalHook` objects:

{: .black-code}
``` java
    /**
     * 
     * @param hook
     * @param predicate hook is applied only to requests that resolve
     * the predicate
     * @param args
     * @param confArgs 
     */
    public GlobalHook(Hook hook,
            RequestContextPredicate predicate,
            BsonValue args,
            BsonValue confArgs) {
        this.hook = hook;
        this.predicate = predicate;
        this.args = args;
        this.confArgs = confArgs;
    }
```

and adding them to the list `HookHandler.getGlobalHooks()`

{: .black-code}
``` java
// a predicate that always resolve
RequestContextPredicate predicate = new RequestContextPredicate() {
        @Override
        public boolean resolve(HttpServerExchange hse, RequestContext context) {
            return true;
        }
    };

// Let's use the predefined SnooperHook that logs old and new write requests 
Hook snooperHook = new SnooperHook(); 

// if the hook requires configuration arguments, define them here
BsonDocument args = null;

// if the hook requires configuration arguments, define them here
BsonDocument confArgs = null;

GlobalHook globalHook = new GlobalHook(hook, predicate, args, confArgs);

// finally add it to global hooks list
HookHandler.getGlobalHooks().add(globalHook);
```

You can use an [Initializer](/docs/develop/core-plugins#initializers) to add Global Hook.