---
title: Secure connection to MongoDB
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Introduction](#introduction)
- [Enable MongoDB authentication](#enable-mongodb-authentication)
- [Restrict permissions of MongoDB user](#restrict-permissions-of-mongodb-user)
- [Connect to MongoDB over TLS/SSL](#connect-to-mongodb-over-tlsssl)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

This section provides instructions on how to secure the connection between RESTHeart and MongoDB by enabling the MongoDB authentication, connect the two processes over TLS and restrict the permissions of the MongoDB user used by RESTHeart.

## Enable MongoDB authentication

This section assumes using MongoDB 3.2 or later. For other versions, the security
configuration is similar but different. Refer to the [MongoDB
documentation](https://docs.mongodb.org/manual/tutorial/enable-authentication/)
for more information.

Start MongoDB with authentication and connect to the MongoDB instance
from a client running on the same system. This access is made possible
by the localhost exception. Again, you might prefer to run the MongoDB
process in background, using the `--fork` parameter.

``` bash
$ mongod --fork --syslog --auth
$ mongo
```

In this section we will use the MongoDB superuser
role [root](https://docs.mongodb.org/manual/reference/built-in-roles/#superuser-roles)
that provides access to the all operations and all the resources.

However the best practice is to use a MongoDB user with
restricted access. For instance, it could be restricted to use only a
single DB in read only mode.

Create the *admin* user. The procedure is different depending on MongoDB
version.


```javascript
> use admin
> db.createUser({
    user: "admin",
    pwd: "changeit",
    roles:[ "root" ]
})
```

We need to provide the MongoDB user authentication credentials in the RESTHeart Core configuration file: see docs.

We’ll use the `restheart.yml` configuration file that comes with RESTHeart download package (you find it in the etc directory)


``` bash
$ vi etc/restheart.yml
```

Find and modify the following section providing the user-name, password
and authentication db (the db where the MongoDB user is defined, in our
case ‘admin’).


``` yml
mongo-uri: mongodb://admin:changeit@127.0.0.1/?authSource=admin
```

Now start RESTHeart Core specifying the configuration file:

``` bash
$ java -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

Test the connection open `http://localhost:8080/roles/admin`

## Restrict permissions of MongoDB user

In the previous examples we used a MongoDB user with *root *role for the sake of simplicity. This allows RESTHeart Core to execute any command on any MongoDB resource.

On production environments a strong security isolation is mandatory.

In order to achieve it, the best practice is:

1. use the mongo-mounts configuration option to restrict the resources exposed by RESTHeart Core;
2. use a MongoDB user with just enough permission: *read* or *readWrite* on mounted databases

The following example, creates a MongoDB user with appropriate roles to expose the databases *restheart.


```javascript
> use admin
> db.createUser({user: "restheart",
    pwd: <password>,
    roles: [{role: "readWrite", db: "restheart"},
            {role: "clusterMonitor", db: "admin"}
]})
```

The built-in role `clusterMonitor` is needed to check the replica set status of MongoDB.

To list the databases (i.e. GET /, the root resource) the listDatabases permission is needed. This permission is granted by the
readWriteAnyDatabase role or you can create a custom role.

To allow deleting a database the *dropDatabase* permission is needed.
This permission is granted by the *dbAdmin* role or you can create a
custom role.

## Connect to MongoDB over TLS/SSL

In case MongoDB uses a __public TLS/SSL certificate__ there is nothing to configure omn RESTHeart, except for the proper [Connection String URI Format](https://docs.mongodb.com/manual/reference/connection-string/) on MongoDB's documentation.

To configure RESTHeart for using instead a __private TLS/SSL certificate__ (read [What’s the Difference Between a Public and Private Trust Certificate?](https://www.entrust.com/it/blog/2019/03/difference-between-a-public-and-private-trust-certificate/)) do as follows:

* create the keystore importing the certificate used by `mongod` using `keytool` (with `keytool`, the java tool to manage `keystores` of cryptographic keys)


``` bash
$ keytool -importcert -file mongo.cer -alias mongoCert -keystore rhTrustStore

# asks for password, use "changeit"
```

* specify the ssl option in the `mongo-uri` in the restheart yml configuration file:


``` yml
mongo-uri: mongodb://your.mongo-domain.com?ssl=true
```
* start restheart with following options:


``` bash
$ java -Dfile.encoding=UTF-8 -server -Djavax.net.ssl.trustStore=rhTrustStore -Djavax.net.ssl.trustStorePassword=changeit -Djavax.security.auth.useSubjectCredsOnly=false -jar restheart.jar etc/restheart.yml -e etc/default.properties
```

References on MongoDB docs:
 - [TLS/SSL Configuration for Clients](https://docs.mongodb.com/manual/tutorial/configure-ssl-clients/#tls-ssl-configuration-for-clients)
 - [Standard Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/#standard-connection-string-format)
 - [DNS Seed List Connection Format](https://docs.mongodb.com/manual/reference/connection-string/#dns-seed-list-connection-format)

</div>
