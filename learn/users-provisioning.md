---
layout: docs
title: Users provisioning how-to
---

* [Introduction ](#introduction)
* [Steps](#steps)
    * [1. Configure RESTHeart to use the DbIdentityManager](#1-configure-restheart-to-use-thedbidentitymanager)
    * [2. Configure the mandatory security.yml file](#2-configure-the-mandatorysecurityyml-file)
    * [3. Create the Javascript file](#3-create-the-javascript-file)
    * [4. Create all the users via mongo shell](#4-create-all-the-users-via-mongo-shell)
    * [5. Check the database and collection](#5-check-the-database-and-collection)
    * [6. Start RESTHeart](#6-start-restheart)
    * [7. Check the admin's roles](#7-check-the-admins-roles)
    * [8. Replace the temporary password](#8-replace-the-temporary-password)
    * [9. GET the final document](#9-get-the-final-document)
    * [10. Create another user](#10-create-another-user)
    * [11. Check the new user](#11-check-the-new-user)

## Introduction 

RESTHeart offers a couple of options for authenticating users:

1.  The `SimpleFileIdentityManager` authenticates users defined in the
    default yaml **configuration file**.
2.  The `DbIdentityManager` authenticates users defined in a **MongoDB
    collection**.

Option \# 1 is static, as the configuration file is read at startup and
can't be changed. In real applications it's often mandatory to switch to
option \# 2 and manage users dynamically into the database. However, if
RESTheart is started with the `DbIdentityManager` configuration then it
needs at least one user already present in the database or it aborts
immediately. The way to achieve this is to seed the database in advance,
provisioning the very first administrative user in the right MongoDB
collection so that RESTHeart can start-up properly.

## Steps

### 1. Configure RESTHeart to use the `DbIdentityManager`

Edit the usual `restheart.yml` file (below is a fragment):

**restheart.yml (fragment)**

``` text
...
idm:
    implementation-class: org.restheart.security.impl.DbIdentityManager
    conf-file: ./etc/security.yml
access-manager:
    implementation-class: org.restheart.security.impl.SimpleAccessManager
    conf-file: ./etc/security.yml
...
```

### 2. Configure the mandatory `security.yml` file

Create some roles as needed. In this case users will be stored under the
"`users`" collection of the "`auth`" database, but names are arbitrary.

**security.yml**

``` bash
## RESTHeart example security configuration file.
---
## Configuration for db based Identity Manager
dbim:
    - db: auth
      coll: users
      cache-enabled: false
      cache-size: 1000
      cache-ttl: 60000
      cache-expire-policy: AFTER_WRITE
 
# Users with role 'ADMIN' can do anything
permissions:
    - role: ADMIN
      predicate: path-prefix[path="/"]
    - role: OPERATOR
      predicate: path-prefix[path="/myapp"]
    - role: USER
      predicate: path-prefix[path="/myapp"]

# Not authenticated user can only GET any resource under the /public URI
    - role: $unauthenticated
      predicate: path-prefix[path="/public"] and method[value="GET"]
```

### 3. Create the Javascript file

This is necessary to insert the administrative user into MongoDB. Let's
call it "admin"

The first line tells MongoDB to use the same database name as it was
configured in the `dbim` section of the above configuration file, in
this case the db is called "auth":

``` plain
dbim:
    - db: auth
...
```

Start the mongo shell and insert the administrative user by hand or edit
a file if you want to create multiple users at ht e same time:

**users.js**

``` bash
use auth; 
db.users.insert({ _id: "admin", password: "temp", roles: ['ADMIN'] });
...
```

Pay attention to the `roles` array in the above Javascript statement:
its content must exactly match the role names in the `permissions`
section of the yaml configuration file or it won't work.

### 4. Create all the users via mongo shell

In this example MongoDB runs at IP 192.168.99.100 (it's a Docker
container). You might want to replace the address with `localhost` or
whatever.

The command below creates the `auth` database and the `admin` user in
one shot.

``` text
$ mongo 192.168.99.100:27017/auth users.js
MongoDB shell version: 3.0.7
connecting to: 192.168.99.100:27017/auth
```

### 5. Check the database and collection

For example with the following two shell commands it's possible to check
database names and list the users collection of the auth database:

``` bash
$ mongo --host 192.168.99.100 --eval "printjson(db.adminCommand('listDatabases'))"
{
    "databases" : [
        {
            "name" : "auth",
            "sizeOnDisk" : 65536,
            "empty" : false
        },
        {
            "name" : "local",
            "sizeOnDisk" : 32768,
            "empty" : false
        }
    ],
    "totalSize" : 98304,
    "ok" : 1
}
 
$ mongo auth --host 192.168.99.100 --eval "db.users.find();"
MongoDB shell version: 3.2.1

connecting to: auth

{ "_id" : "admin", "password" : "temp", "roles" : [ "ADMIN" ] }
...
```

### 6. Start RESTHeart

Start RESTHeart as you would usually do. Logs must be clean, like below:

``` text
16:31:10.242 [main] INFO  org.restheart.Bootstrapper - Starting RESTHeart
16:31:10.255 [main] INFO  org.restheart.Bootstrapper - version 1.1.3
16:31:10.270 [main] INFO  org.restheart.Bootstrapper - Logging to console with level INFO
16:31:10.580 [main] INFO  org.restheart.Bootstrapper - MongoDB connection pool initialized
16:31:10.580 [main] INFO  org.restheart.Bootstrapper - MongoDB version 3.2.0
16:31:10.856 [main] INFO  org.restheart.Bootstrapper - Token based authentication enabled with token TTL 15 minutes
16:31:11.130 [main] INFO  org.restheart.Bootstrapper - HTTPS listener bound at 0.0.0.0:4443
16:31:11.134 [main] INFO  org.restheart.Bootstrapper - HTTP listener bound at 0.0.0.0:8080
16:31:11.138 [main] INFO  org.restheart.Bootstrapper - Local cache for db and collection properties enabled
16:31:11.203 [main] INFO  org.restheart.Bootstrapper - URL / bound to MongoDB resource *
16:31:11.372 [main] INFO  org.restheart.Bootstrapper - Embedded static resources browser extracted in /tmp/restheart-5012079845495337850
16:31:11.395 [main] INFO  org.restheart.Bootstrapper - URL /browser bound to static resources browser. access manager: false
16:31:11.398 [main] INFO  org.restheart.Bootstrapper - URL /_logic/ping bound to application logic handler org.restheart.handlers.applicationlogic.PingHandler. access manager: false
16:31:11.402 [main] INFO  org.restheart.Bootstrapper - URL /_logic/roles bound to application logic handler org.restheart.handlers.applicationlogic.GetRoleHandler. access manager: false
16:31:11.727 [main] INFO  org.restheart.Bootstrapper - Pid file /var/run/restheart--1441246088.pid
16:31:11.731 [main] INFO  org.restheart.Bootstrapper - RESTHeart started
```

### 7. Check the admin's roles

For example with the [httpie](http://httpie.org) client, get
the `/_logic/roles/admin` resource which shows user's roles

``` bash
$ http -a admin:temp 192.168.99.100/_logic/roles/admin
 
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Auth-Token: ee46be56-fdd1-48e6-afa2-934f114ab882
Auth-Token-Location: /_authtokens/admin
Auth-Token-Valid-Until: 2016-01-07T16:49:29.194Z
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 108
Content-Type: application/hal+json
Date: Thu, 07 Jan 2016 16:34:29 GMT
X-Powered-By: restheart.org
{
    "_links": {
        "self": {
            "href": "/_logic/roles/admin"
        }
    }, 
    "authenticated": true, 
    "roles": [
        "ADMIN"
    ]
}
```

### 8. Replace the temporary password

The "temp" password in the users.js file is really temporary, just set a
better one. Say for example "12345", which is actually not much better,
but it's an example :)

``` bash
$ http -a admin:temp -j PATCH 192.168.99.100/auth/users/admin password=12345

HTTP/1.1 409 Conflict
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Auth-Token: ee46be56-fdd1-48e6-afa2-934f114ab882
Auth-Token-Location: /_authtokens/admin
Auth-Token-Valid-Until: 2016-01-07T16:52:57.209Z
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 167
Content-Type: application/hal+json
Date: Thu, 07 Jan 2016 16:37:57 GMT
ETag: 568e9465c9e77c000646e830
X-Powered-By: restheart.org
{
    "_links": {
        "self": {
            "href": "/auth/users/admin"
        }
    }, 
    "http status code": 409, 
    "http status description": "Conflict", 
    "message": "The document's ETag must be provided using the 'If-Match' header"
}
```

### 9. GET the final document

Don't forget to authenticate now using the **new password**! Check that
the output is similar to below and you have a proper ETag ("\_etag" key)

``` bash
$ http -a admin:12345 192.168.99.100/auth/users/admin

HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Auth-Token: df20de0a-f9ba-40dc-a659-86031f501509
Auth-Token-Location: /_authtokens/admin
Auth-Token-Valid-Until: 2016-01-07T18:18:18.526Z
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 154
Content-Type: application/hal+json
Date: Thu, 07 Jan 2016 18:03:18 GMT
ETag: 568e9465c9e77c000646e830
X-Powered-By: restheart.org
{
    "_etag": {
        "$oid": "568e9465c9e77c000646e830"
    }, 
    "_id": "admin", 
    "_links": {
        "curies": [], 
        "self": {
            "href": "/auth/users/admin"
        }
    }, 
    "password": "12345", 
    "roles": [
        "ADMIN"
    ]
}
```

### 10. Create another user

Now RESTHeart is ready to be fully managed by the `admin` user. For
example, to add more users for the DbIdentityManager it's enough to use
the following API call.

Let's create a new user with id "johnsmith", password "Qer432" and role
"USER"

``` plain
$ http -a admin:12345 -j POST 192.168.99.100/auth/users _id="johnsmith" password="Qer432" roles:='["USER"]'

HTTP/1.1 201 Created
...
```

### 11. Check the new user

Get the `/auth/users/johnsmith` resource

``` bash
$ http -a admin:temp 192.168.99.100/auth/users/johnsmith

HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location, X-Powered-By
Auth-Token: df20de0a-f9ba-40dc-a659-86031f501509
Auth-Token-Location: /_authtokens/admin
Auth-Token-Valid-Until: 2016-01-07T18:32:43.687Z
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 160
Content-Type: application/hal+json
Date: Thu, 07 Jan 2016 18:17:43 GMT
ETag: 568eab70c9e77c000646e831
X-Powered-By: restheart.org
{
    "_etag": {
        "$oid": "568eab70c9e77c000646e831"
    }, 
    "_id": "johnsmith", 
    "_links": {
        "curies": [], 
        "self": {
            "href": "/auth/users/johnsmith"
        }
    }, 
    "password": "Qer432", 
    "roles": [
        "USER"
    ]
}
```

 

 

 

 

 

 

 

 

 
