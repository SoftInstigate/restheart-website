---
layout: docs
title: Authorization
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction ](#introduction)
* [RESTHeart Authorizer](#restheart-authorizer)
* [Request Predicates Authorizer](#request-predicates-authorizer)
  
</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

See [Understanding RESTHeart Security](/docs/security/overview#understanding-restheart-security) for an high level view of the RESTHeart security model.

**restheart-security** is built around a __pluggable architecture__. It comes with a strong security implementation but you can easily extend it by implementing plugins.  This section documents the authorizers available out-of-the-box.

RESTHeart by default offers two types of authorizers:

1. RESTHeart Authorizer (commercial editions only).
1. Request Predicates Authorizer (any edition).

However, it's even possible to develop __custom authorizers__. Please refer to [Develop Security Plugins](/docs/develop/security-plugins) for more information.

## RESTHeart Authorizer 

{: .bs-callout.bs-callout-info}
Available since RESTHeart Platform v4.1

<div class="alert alert-info" role="alert">
    <h2 class="alert-heading"><strong>RESTHeart Platform</strong> feature.</h2>
    <hr class="my-2">
    <p>RESTHeart Authorizer is available only on RESTHeart Platform (Professional, Enterprise and OEM editions)</p>
    <p class="small">Confused about editions? Check the <a class="alert-link" href="/editions">editions matrix</a>.</p>
    <a href="/get"><button class="btn trial-btn">Free Trial</button></a>
</div>

*RESTHeart Authorizer* authorizes requests according to the *Access Control List*  defined in a __MongoDB collection__, seamlessly connecting `restheart-platform-security` with `restheart-platform-core`.

{: .bs-callout.bs-callout-info }
RESTHeart Authorizer is robust, battle-tested and suggested for production use.

The configuration allows:

- defining the collection to use to store ACL documents (`acl-uri`).
- enabling the root role (`root-role`): users with root role, can execute any requests, regardless of the permissions set in the ACL.
- controlling the ACL caching.

{: .black-code}
``` yml
authorizers:
    - name: rhAuthorizer
      class: com.restheart.security.plugins.authorizers.RHAuthorizer
      args:
        acl-uri: /acl
        root-role: admin
        cache-enabled: true
        cache-size: 1000
        cache-ttl: 5000
        cache-expire-policy: AFTER_WRITE
```

### Format of an ACL document

An example ACL document follows:

{: .black-code}
``` json
{
  "_id": { "$oid": "5d9485639eab3a852d48a1de" },
  "predicate": "path-prefix[/blog] and (method[GET] or method[POST])",
  "roles": [ "editor" ],
  "priority": 1,
  "readFilter": {"_$or": [ { "author": {"_$eq": "%USER" }}, { "status": {"_$eq": "PUBLISHED" }} ] },
  "writeFilter": { "author": {"_$eq": "%USER" }}
}
```

The properties of the ACL document are:

{: .table.table-responsive }
|property|type|description|
|-|-|
|**predicate**|string|If the [undertow predicate](http://http://undertow.io/undertow-docs/undertow-docs-2.0.0/index.html#textual-representation) resolves the request then the request is authorized. Many examples of predicates can be found in the file [acl.yml](https://github.com/SoftInstigate/restheart/blob/master/security/etc/acl.yml)|
|**roles**|JSON array of strings|The roles that are applied the ACL document. The special role `$unauthenticated` applies to requests that are not authenticated.|
|**priority**|number|A request might fulfill several predicates; an ACL document with higher priority has higher evaluation precedence.|
|**readFilter**|`null` or JSON object|An optional [filter](/docs/read-docs/#filtering) that is added to GET requests when authorized by this ACL document.|
|**writeFilter**|`null` or JSON object|An optional filter that is added to write requests when authorized by this ACL document.|

### Using readFilter and writeFilter

{: .bs-callout.bs-callout-info }
`readFilter` and `writeFilter` allows to partition data by roles.

The example ACL document applies to users with `editor` role. A user with this role can execute the requests `GET /blog` and `POST /blog`. 

 The `readFilter` applies to GET requests. The example ACL document limits the returned `/blog` documents to the ones that were published or that were created by the authenticated user.

 The `writeFilter` applies to write request. The example ACL document allows the requests to only modify the documents that were created by the authenticated user.

{: .bs-callout.bs-callout-warning }
`writeFilter` only limits updates and cannot avoid creating documents that don't match the filter. The properties used in the filter should be set using [Interceptors](/docs/develop/security-plugins/#interceptors) or [Request Transformers](/docs/develop/core-plugins/#transformers).

`readFilter` and `writeFilter` can use the following variables:

{: .table.table-responsive }
|variable|resolved to|example|
|-|-|
|%USER|the string id of the authenticated user|match documents with `author` property equal to the id of the authenticated user `{"author":"%USER"}`|
|%ROLES|the roles array of the authenticated user|match documents with `roles` array property containing any role of the authenticated user `{"roles": {"_$in": %ROLES }`|
|%NOW|the current date as `{"$date": 1570027863000 }`|match documents with `timestamp` date property less than (before) the current date `{"timestamp":{"_$lt": "%NOW"}}`|

## Request Predicates Authorizer

**RequestPredicatesAuthorizer** allows defining roles permissions in a YAML configuration file using the [Undertow predicate language](http://http://undertow.io/undertow-docs/undertow-docs-2.0.0/index.html#textual-representation). 

{: .black-code}
``` yml
authorizers:
    name: requestPredicatesAuthorizer
    class: org.restheart.security.plugins.authorizers.RequestPredicatesAuthorizer
    args:
        conf-file: ./etc/acl.yml
```

The file [acl.yml](https://github.com/SoftInstigate/restheart/blob/master/security/etc/acl.yml) defines the role based permissions. An example follows:

{: .black-code}
``` yml
## configuration file for requestPredicatesAuthorizer
permissions:
    # OPTIONS is always allowed
    - role: $unauthenticated
      predicate: path-prefix[path="/"] and method[value="OPTIONS"]
      
    - role: $unauthenticated
      predicate: path-prefix[path="/echo"] and method[value="GET"]
    
    - role: admin
      predicate: path-prefix[path="/"] and method[value="OPTIONS"]
      
    - role: admin
      predicate: path-prefix[path="/"]
    
    - role: user
      predicate: path-prefix[path="/"] and method[value="OPTIONS"]

    - role: user
      predicate: path-prefix[path="/secho"] and method[value="GET"]

    - role: user
      predicate: path[path="/secho/foo"] and method[value="GET"]

    - role: user
      predicate: (path[path="/echo"] or path[path="/secho"]) and method[value="PUT"]

    # This to check the path-template predicate
    - role: user
      predicate: path-template[value="/secho/{username}"] and equals[%u, "${username}"]

    # This to check the regex predicate
    - role: user
      predicate: regex[pattern="/secho/(.*?)", value="%R", full-match=true] and equals[%u, "${1}"]
```
