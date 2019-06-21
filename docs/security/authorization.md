---
layout: docs
title: Authorization
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction ](#introduction)
* [Request Predicates Authorizer](#request-predicates-authorizer)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction

See [Understanding RESTHeart Security](/docs/security/overview#understanding-restheart-security) for an high level view of the RESTHeart security model.

**restheart-security** is built around a __pluggable architecture__. It comes with a strong security implementation but you can easily extend it by implementing plugins.  This section documents the authorizers available out-of-the-box. You can also develop your own authorizers. Refer to [Develop Security Plugins](/docs/develop/security-plugins) section for more information.

## Authorizers

### Request Predicates Authorizer

**RequestPredicatesAuthorizer** allows defining roles permissions in a yml configuration file using the [Undertows predicate language](http://undertow.io/undertow-docs/undertow-docs-2.0.0/index.html#textual-representation). 

``` yml
authorizers:
    name: requestPredicatesAuthorizer
    class: org.restheart.security.plugins.authorizers.RequestPredicatesAuthorizer
    args:
        conf-file: ./etc/acl.yml
```

The file [acl.yml](https://github.com/SoftInstigate/restheart-security/blob/master/etc/acl.yml) defines the role based permissions. An example follows:

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