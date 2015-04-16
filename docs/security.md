---
layout: doc-page-md
title: security
permalink: /docs/security.html
menu:
 id: 4
 subid: 3
---

## Introduction
{: .post}

In order to enable security, RESTHeart must be started specifying a configuration file with the appropriate security settings: the default convention over (no) configuration is having authentication and authorization disabled altogether (users are not authenticated and anyone can do anything).
{: .bs-callout.bs-callout-warning}

RESTHeart uses [basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). Credentials must be included one each request via the standard _Authorization_ request header.

With httpie, use the -a option:

{% highlight bash %}
http -a userid:password GET 127.0.0.1:8080/
{% endhighlight %}

With curl, use the --user options

{% highlight bash %}
curl -i --user userid:password -X GET 127.0.0.1:8080/
{% endhighlight %}

In general the _Authorization_ request header has the following format:

 Authorization: Basic base64('userid':'password')

The header's value is the string 'Basic ' plus the base 64 encoding of the string 'userid':'password'. 

The security is set-up by configuring:

* the __Identitiy Manager__ which is responsible of authenticating the users.
* the __Access Manager__ which is responsible of enforcing the authorization policy.

Both the IDM and the AM are pluggable; this means that you can use one of the pre-built implementations or develop your owns.
{: .bs-callout.bs-callout-info}

With stateless basic authentication, user credentials  must be sent over the network on each request. It is mandatory to use only the http**s** listener; with the http listener credentials can be sniffed by a man-in-the-middle attack. Use the http listener only at development time and on trusted environments.
{: .bs-callout.bs-callout-danger}

## Authentication
{: .post}

### Configuration

The Identity Manager is responsible for authentication. It is specified in the configuration file in the following section:

{% highlight yaml %}
idm:    
    implementation-class: org.restheart.security.impl.SimpleFileIdentityManager
    conf-file: ./etc/security.yml
{% endhighlight %}

The __implementation-class__ property specifies the java class that implements it. You can specify one of the implementations shipped out-of-the-box or implement your own. In the latter case you need to implement the interface io.undertow.security.idm.IdentityManager (available in undertow-core).

The __conf-file__ yaml file, is passed to the constructor of the class as a Map<String, Object>.

### SimpleFileIdentityManager

The SimpleFileIdentityManager shipped with RESTHeart called  (class is org.restheart.security.impl.SimpleFileIdentityManager) authenticates users defined in a yaml file.

This is how the conf-file looks like:

{% highlight yaml %}
users:
 - userid: admim
   password: changeit
   roles: [admins]
 - userid: user
   password: changeit
   roles: [users]
 {% endhighlight %}

### DbIdentityManager

The DbIdentityManager shipped with RESTHeart called SimpleAccessManager (class is org.restheart.security.impl.DbIdentityManager) authenticate users defined in a mongodb collection.

This is how the conf-file looks like:

{% highlight yaml %}
dbim:
    - db: userbase
      coll: _accounts
      cache-enabled: false
      cache-size: 1000
      cache-ttl: 60000
      cache-expire-policy: AFTER_WRITE
 {% endhighlight %}

 the db and coll properties point to the collection with the users (userbase._accounts in this case). 
 The other options control the cache that, if enabled, avoids the IDM to actually sends a query for each request.

The collection must have the following fields:

 * _id: the userid 
 * password: a string 
 * roles: an array of strings.

__Note__ the _ prefix to the collection name. RESTHeart threats collections whose names start with _ as reserved: they are not exposed by the API. Otherwise users can easily read passwords and create users. If you want to actually expose it, the other option is to define an appropriate access policy enforced by the Access Manager.
{: .bs-callout.bs-callout-warning}

You might also want to filter out the password field with a [representation transformation](/representation-transformation.html) to never allow users to read it. 
{: .bs-callout.bs-callout-info}

## Authorization
{: .post}

###Configuration

{% highlight yaml %}
access-manager:    
    implementation-class: org.restheart.security.impl.SimpleAccessManager
    conf-file: ./etc/security.yml
{% endhighlight %}

The __implementation-class__ property specifies the java class that implements it. You can specify one of the implementations shipped out-of-the-box or implement your own. In the latter case you need to implement the interface org.restheart.security.AccessManager.

The __conf-file__ yaml file, is passed to the constructor of the class as a Map<String, Object>.

### SimpleAccessManager

There is a single implementation of the Access Manager shipped with RESTHeart called SimpleAccessManager (class is org.restheart.security.impl.SimpleAccessManager).

It is an AM that enforces the access policy specified in a yaml configuration file as a set of permissions.

This is how the configuration file looks like:

{% highlight yaml %}
permissions:
 - role: admins
   predicate: path-prefix[path="/"]
 - role: $unauthenticated
   predicate: path-prefix[path="/publicdb/"] and method[value="GET"]
 - role: users
   predicate: path-prefix[path="/publicdb/"]
{% endhighlight %}

permissions are given to roles and are expressed as request predicates on http requests. Please refer to [undertow documentation](http://undertow.io/documentation/core/predicates-attributes-handlers.html) for more information about predicates.
 
Assign permission to the special role __$unauthenticated__ to enable requests on resources without requiring authentication.
{: .bs-callout.bs-callout-info}

## Authentication Token
{: .post}

If a request is successfully authenticated, an authentication token is generated and included in every subsequent responses. Following requests can either use the password or the auth token.

Auth token information are passed in the following response headers:

{% highlight bash %}
Auth-Token: 6a81d622-5e24-4d9e-adc0-e3f7f2d93ac7
Auth-Token-Location: /_authtokens/user@si.com
Auth-Token-Valid-Until: 2015-04-16T13:28:10.749Z
{% endhighlight %}

__Note__ the URI in the Auth-Token-Location header: the user can GET it to obtain the token information in a HAL representation and DELETE it to invalidate the token. Of course the authenticated user can only request its own tokens (otherwise response code will be 403 Forbidden).

The Authentication Token is a very important feature when you are developing a web application. Since every request needs to include the credentials, you need to store them either in a cookie or (better) in the session storage. In this case, the sign-in form can send a password check request using the actual password; if it succeeds, the auth token can be stored and used.
{: .bs-callout.bs-callout-info}

Pay attention to the authentication token in case of multi-node deployments (horizontal scalability). In this case, you need to either disable it or use a load balancer with the sticky session option or use a distributed auth token cache implementation (not yet available in the current version but you can ask for [support](/support.html)).
{: .bs-callout.bs-callout-danger}

The auth token are controlled by the following configuration options:

{% highlight yaml %}
auth-token-enabled: true
auth-token-ttl: 15 # time to live after last read, in minutes
{% endhighlight %}

## Suggested way to check credentials and obtain user's roles
{: .post}

The default configuration file, pipes in the very useful custom handler GetRoleHandler, that responds at url <code>/_logic/roles/&lt;userid&gt;</code>

When a request, the possible responses are:

* 401 Unauthorized, if no or wrong credentials were passed in the _Authorization_ header 
* 403 Forbidden, if the URL 
* 200 OK, sending back the following document, which includes the roles array:

{% highlight json %}
{
    "_embedded": {}, 
    "_links": {
        "self": {
            "href": "/_logic/roles/user@si.com"
        }
    }, 
    "authenticated": true, 
    "roles": [
        "USER"
    ]
}
{% endhighlight %}

Of course, if the request succeeds, you get back the auth token as well.

It is easy to check the user credentials from a login form with this handler: in case you get back 200, they match and you can store the auth token, otherwise passed credentials are invalid.
{: .bs-callout.bs-callout-info}

## Avoid basic authentication popup in browsers
{: .post}

With basic authentication, browsers can show a awful login popup window and this is not what you usually want.

What happens behind the scene, is that the server sends the _WWW-Authenticate_ response header that actually leads to it. 

You can avoid RESTHeart to actually send this header avoiding the popup login window altogether, either specifying the _No-Auth-Challenge_ request header or using the _noauthchallenge_ query parameter. In this case, RESTHeart will just respond with __401 Unauthorized__ in case of missing or wrong credentials.

This feature together with the authentication token, allows you to implement a form based authentication experience on top of the simple and effective basic authentication mechanism. You can refer to the [blog example application](https://github.com/softinstigate/restheart-blog-example) for an example of such implementation.
{: .bs-callout.bs-callout-info}