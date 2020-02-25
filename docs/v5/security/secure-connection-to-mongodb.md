---
layout: docs
title: Secure connection to MongoDB
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Introduction](#introduction)
* [Enable MongoDB authentication](#enable-mongodb-authentication)
* [Connect to MongoDB over TLS](#connect-to-mongodb-over-tls)
* [Restrict permissions of MongoDB user](#restrict-permissions-of-mongodb-user)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Introduction 

This section provides instructions on how to secure the connection between RESTHeart Platform and MongoDB by enabling the MongoDB authentication, connect the two processes over TLS and restrict the permissions of the MongoDB user used by RESTHeart. 

## Enable MongoDB authentication

This section assumes using MongoDB 3.2 or later. For other versions, the security
configuration is similar but different. Refer to the [MongoDB
documentation](https://docs.mongodb.org/manual/tutorial/enable-authentication/)
for more information.

Start MongoDB with authentication and connect to the MongoDB instance
from a client running on the same system. This access is made possible
by the localhost exception. Again, you might prefer to run the MongoDB
process in background, using the `--fork` parameter.

{: .black-code}
``` bash
$ mongod --fork --syslog --auth
$ mongo
```

In this section we will use the MongoDB superuser
role [root](https://docs.mongodb.org/manual/reference/built-in-roles/#superuser-roles)
that provides access to the all operations and all the resources.

However the best practice is to use a MongoDB user with
restricted access. For instance, it could be restricted to use only a
single DB in read only mode. For more information refer to [MongoDB
authentication with just enough
permissions](#auth-with-jep)section.

Create the *admin* user. The procedure is different depending on MongoDB
version.

{: .black-code}
```javascript
> use admin
> db.createUser({
    user: "admin",
    pwd: "changeit",
    roles:[ "root" ]
})
```

    We need to provide the MongoDB user authentication credentials in the RESTHeart Platform Core configuration file: see docs. 

We’ll use the restheart-platform-core.yml example configuration file that comes with RESTHeart Platform download package (you find it in the etc directory)

{: .black-code}
``` bash
$ vi etc/restheart-platform-core.yml
```

Find and modify the following section providing the user-name, password
and authentication db (the db where the MongoDB user is defined, in our
case ‘admin’).

{: .black-code}
``` yml
mongo-uri: mongodb://admin:changeit@127.0.0.1/?authSource=admin
```

Now start RESTHeart Platform Core specifying the configuration file:

{: .black-code}
``` bash
$ java -jar restheart-platform-core.jar etc/restheart-platform-core.yml -e etc/standalone.properties
```

Test the connection open `http://localhost:8080/roles/admin`

## Connect to MongoDB over TLS

MongoDB clients can use TLS/SSL to encrypt connections to mongod and mongos instances.

To configure RESTHeart Platform for TLS/SSL do as follows:

* create the keystore importing the public certificate used by mongod using keytool (with keytool, the java tool to manage keystores of cryptographic keys)

{: .black-code}
``` bash
$ keytool -importcert -file mongo.cer -alias mongoCert -keystore rhTrustStore

# asks for password, use "changeit"
```

* specify the ssl option in the mongo-uri in the restheart yml configuration file:

{: .black-code}
``` yml
mongo-uri: mongodb://your.mongo-domain.com?ssl=true
```
* start restheart with following options:

{: .black-code}
``` bash
$ java -Dfile.encoding=UTF-8 -server -Djavax.net.ssl.trustStore=rhTrustStore -Djavax.net.ssl.trustStorePassword=changeit -Djavax.security.auth.useSubjectCredsOnly=false -jar restheart-platform-core.jar etc/restheart-platform-core.yml -e etc/standalone.properties
```

## Restrict permissions of MongoDB user

In the previous examples we used a MongoDB user with *root *role for the sake of simplicity. This allows RESTHeart Platform Core to execute any command on any MongoDB resource.

On production environments a strong security isolation is mandatory.

In order to achieve it, the best practice is:

1. use the mongo-mounts configuration option to restrict the resources exposed by RESTHeart Platform Core;
2. use a MongoDB user with just enough permission: *read* or *readWrite* on mounted databases 

The following example, creates a MongoDB user with appropriate roles to expose the databases *restheart.

{: .black-code}
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

</div>