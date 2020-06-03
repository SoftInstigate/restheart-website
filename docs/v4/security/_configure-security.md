---
layout: docs
title: Enable and Configure Security
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
    -   [How to use the default self signed certificate ](#how-to-use-the-default-self-signed-certificate)
    -   [How to use a valid certificate](#how-to-use-a-valid-certificate)
-   [Identity Manager](#identity-manager)
    -   [SimpleFileIdentityManager](#simplefileidentitymanager)
    -   [Global Security Predicates](#global-security-predicates)
    -   [DbIdentityManager](#dbidentitymanager)
-   [Access Manager](#access-manager)
    -   [SimpleAccessManager](#simpleaccessmanager)
    -   [Specify Permission on URI Remapped Resources](#specify-permission-on-uri-remapped-resources)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

In order to enable security, RESTHeart must be executed specifying
a **configuration file** with the appropriate security settings.

The default convention over configuration is to have authentication and
authorization disabled altogether (users are not authenticated and
anyone can do anything).

Once security is enabled, requests undergo the following process:

1.  the client submits a request over SSL providing username and
    password credentials via the basic authentication method
2.  the RESTHeart's Identity Manager (IDM) starts the _authentication_
    of the request it, i.e. it verifies the user identity against the
    provided id and password:
    1.  if the authentication fails, the requests ends with response
        code _401 Unauthorized_;
    2.  if the authentication succeeds, the request continue
3.  the RESTHeart's Access Manager (AM) starts the _authorization_ of
    the request, i.e. it determines if the client is given the
    permission to execute it against the configured security policy:
    1.  if the authorization fails, the requests ends with response
        code *403 Forbidden*
    2.  if the authorization succeeds, the request continue
4.  RESTHeart executes the request interacting with MongoDB and
    eventually returns the response code *200 OK* (this depends on the
    request type and execution result)

![](/images/attachments/13369378/13729831.png?height=400){:
height="400" class="image-center img-responsive"}

The configuration sections to setup are:

1.  **https listener **to enable SSL (if SSL is not enabled otherwise,
    for instance via a reverse proxy)
2.  **idm** to specify the **Identity Manager **(the component
    responsible of authenticating a client, i.e. verifying its identity)
3.  **access-manger** to specify the Access Manager (the component
    responsible of authorizing a request, i.e. determining if the client
    is given the permission to execute it)

The client must send the user id and password credentials via the basic
authentication mechanism.

RESTHeart is stateless: there isn't any authentication session and
credentials must be sent on every request.

Refer to [How Clients authenticate](/docs/v4/security/how-clients-authenticate) for more
information.

The HTTPS listener

**Important!** HTTP is not secure: credentials can be sniffed by a man-in-the-middle
attack. **It is paramount to use HTTPS**

There are many ways of enabling HTTS; for instance you can setup a web
server such as nginx as a reverse proxy in front of RESTHeart or you may
rely on cloud services that provides load balancers that manages SSL for
you (such are Amazon WS or Google Cloud).

In any case, RESTHeart is able to expose directly the HTTS protocol and
this is done configuring the https listener. This is the suggested
configuration for small systems.

The following configuration file except shows the involved options:

```bash
#### listeners
https-listener: true
https-host: 0.0.0.0
https-port: 4443

#### SSL configuration
 
use-embedded-keystore: true

#keystore-file: /path/to/keystore/file
#keystore-password: password
#certpassword: password
```

To enable https configure the https listener using the following
options:

1.  **https-listener** _true_ to enable it
2.  **https-host** the ip where to bind the listener
3.  **https-port** the port where to bind the listener:

A valid SSL certificate must configured in order to enable the https
listener and there are two options:

1.  use the default RESTHeart self signed certificate
2.  use your own certificate

### How to use the default self signed certificate 

The only option to specify to use the default, embedded self signed
certificate is the following:

1.  use-embedded-keystore: true

Using the self-signed certificate guarantees that data is encrypted and
protects from man-in-the-middle attacks. However it leads to issues with
some clients and all browser because it does not guarantees the client
about the server identity. For instance:

1.  with **curl** you need to specify the "--insecure" option or you'll
    get an error message;
2.  with any browser, the user will get warnings about the server
    identity

### How to use a valid certificate

Of course you need to get a valid certificate from a Certificate
Authority; to use it you need to configure you java keystore (refer to
this [post](https://www.digitalocean.com/community/tutorials/java-keytool-essentials-working-with-java-keystores) for
more information) and specify the following RESTHeart options:

1.  **use-embedded-keystore**: false to disable the default self signed
    certificate
2.  **keystore-file** the path of the keystore file
3.  **keystore-password** the keystore password
4.  **certpassword** the certificate password

## Identity Manager

### Configuration

The Identity Manager is responsible of authenticating a client,
verifying its credentials and eventually associating the request with
its username and roles.

If the client credentials are not valid the response will be **HTTP/1.1
401 Unauthorized**

The IDM is pluggable: the actual IDM implementation to use can be
configured. Please refer to [Custom Identity
Manager](/docs/v4/custom-identity-manager) section for more information on how to
develop and configure a custom IDM.

The **idm** section of the yaml configuration file is:

```yml
idm:
    implementation-class: org.restheart.security.impl.SimpleFileIdentityManager
    conf-file: ./etc/security.yml
```

1.  **implementation-class** specifies the java class that implements
    the IDM. You can use one of the implementations shipped
    out-of-the-box or implement your own.
2.  **cont-file** is the path of a yam configuration file that is passed
    to the IDM. **Note**: the path is either absolute or relative to the
    directory of restheart.jar

### SimpleFileIdentityManager

The SimpleFileIdentityManager shipped with RESTHeart (class is
_org.restheart.security.impl.SimpleFileIdentityManager_) authenticates
users defined in a yaml file.

This is how its straightforward conf-file looks like:

```yml
users:
    - userid: admim
      password: changeit
      roles: [admins]
    - userid: user
      password: changeit
      roles: [users]
```

### Global Security Predicates

> Global Security Predicates are applied to all requests.

Global Security Predicates can be defined programmatically as follows:

```java
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
GlobalSecuirtyPredicatesAuthorizer.getGlobalSecurityPredicates().add(securityPredicate);
```

You can use an [Initializer](/docs/v4/initializer) to add Global Security Predicates.

### DbIdentityManager

The DbIdentityManager shipped with RESTHeart (class is
_org.restheart.security.impl.DbIdentityManager_) authenticates users
defined in a MongoDB collection.

To use the DbIdentityManager, set the **idm** section of the yaml
configuration file as follows:

```yml
idm:
    implementation-class: org.restheart.security.impl.DbIdentityManager
    conf-file: ./etc/security.yml
```

This is how the security.yml looks like:

```yml
dbim:
    - db: userbase
      coll: accounts
      prop-name-id: _id
      prop-name-password: password
      prop-name-roles: roles
      bcrypt-hashed-password: false
      create-user: false
      create-user-document: '{"_id": "admin", "password": "secret", "roles": ["admins"]}'
      cache-enabled: false
      cache-size: 1000
      cache-ttl: 60000
      cache-expire-policy: AFTER_WRITE
```

The _db_ and *coll* properties point to the collection with the user documents
(userbase.accounts in this case).

The _prop-_ prefixed properties define which properties of the user document
are used for authentication:

1.  **id**: (string) the property holding the userid
2.  **password**: (string) the property holding the password
3.  **roles**: (array of strings) the property holding the user roles

The _cache-_ prefixed properties control the cache to avoids the IDM actually
executing a MongoDB query for each request.

The property _bcrypt-hashed-password_ defines if the password is hashed using the bcrypt
algorithm. Stating RESTHeart 3.3, write requests to the dbim collection automatically
bcrypt the password property in the request body.

If _create-user_ is set to _true_, RESTHeart check if the _create-user-document_
exits at startup time, creating it eventually. This is useful to initialize a default user. Note
the if _bcrypt-hashed-password_ is set to _true_, the _create-user-document_ password must
be bcryped.

**Note** Starting from RESTHeart v3.3, the _password_ field is always
filtered out from the response and read requests with a filter query parameter involving
the _password_ property are forbidden to avoid snooping passwords.

**Hint** To completely hide the users collection, just specify a underscore prefixed
collection name (e.g. _\_accounts_).
RESTHeart threats collections whose names start with \_ as reserved: they are not
exposed by the API.

If you actually expose it, make sure to:

1.  define an appropriate access policy enforced by the Access Manager
    so that users can only access their own data, (e.g. a user cannot modify other users' passwords)
2.  For RESTHeart versions older than 3.3, filter out the _password_ property from responses with
    a [representation transformer](/docs/v4/request-transformers).

## Access Manager

The Access Manager is responsible of authorizing requests against the
security policy.

If the request is not authorized, i.e. the security policy does not
allow it, the response will be **HTTP/1.1 403 Forbidden**

The Access Manager is pluggable: the actual AM implementation to use can
be configured. Please refer to Custom Access Manager section for more
information on how to develop and configure a custom AM.

The **access-manager** section of the yaml configuration file is:

### Configuration

```text
access-manager:
    implementation-class: org.restheart.security.impl.SimpleAccessManager
    conf-file: ./etc/security.yml
```

1.  **implementation-class** specifies the java class that implements
    the Access Manager. You can specify the default SimpleAccessManager
    or implement your own.
2.  **conf-file** is the path of a yam configuration file that is passed
    to the Access Manager. **Note**: the path is either absolute or
    relative to the directory of restheart.jar

### SimpleAccessManager

The default implementation of the Access Manager shipped with RESTHeart
is called SimpleAccessManager (class is
org.restheart.security.impl.SimpleAccessManager).

This AM enforces the access policy specified in a yaml configuration
file as a set of permissions.

This is how the configuration file looks like:

```bash
permissions:
 - role: admins
   predicate: path-prefix[path="/"]
 - role: $unauthenticated
   predicate: path-prefix[path="/publicdb/"] and method[value="GET"]
 - role: users
   predicate: path-prefix[path="/publicdb/"]
```

Permissions are given to roles and are expressed as request predicates
on http requests. Please refer to [undertow
documentation](https://undertow.io/undertow-docs/undertow-docs-1.3.0/index.html#predicates-attributes-and-handlers) for
more information about predicates.

Assign permission to the special role **\$unauthenticated** to enable
requests on resources without requiring authentication.

#### Specify Permission on URI Remapped Resources

The _mongo-mounts_ configuration option allows to map the URI of the
MongoDB resources.

Starting from RESTHeart version 3.3, the _path_ attribute of permission
are absolute.

Example: With the following configuration, all the collections of the
db *mydb* are given the path prefix _/api_

```yml
mongo-mounts:
    - what: /mydb
      where: /api
```

The collection /mydb/coll is therefore remapped to the URI _/api/coll_
and the predicate to allow GET requests on this collection is:

```yml
permissions:
    - role: $unauthenticated
      predicate: path-prefix[path="/api/coll"] and method[value="GET"]
```

For versions older than 3.3, the rule is:

When the URI of a resource is remapped via mongo-mounts configuration
option, the *path* attribute of permissions must be relative to the
*what *argument of the _mongo-mounts_ option.

Example: With the following configuration, all the collections of the
db *mydb* are given the path prefix _/api_

```yml
mongo-mounts:
    - what: /mydb
      where: /api
```

The collection /mydb/coll is therefore remapped to the URI _/api/coll_
and the predicate to allow GET requests on this collection is:

```yml
permissions:
    - role: $unauthenticated
      predicate: path-prefix[path="/coll"] and method[value="GET"]
```

</div>
