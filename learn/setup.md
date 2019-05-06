---
layout: docs
title: Setup

---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Manual installation](#manual-installation)
  - [Install Java and MongoDB](#install-java-and-mongodb)
  - [Install RESTHeart](#install-restheart)
  - [Start MongoDB](#start-mongodb)
  - [Run RESTHeart](#run-restheart)
  - [Enable MongoDB authentication](#enable-mongodb-authentication)
    - [Connect RESTHeart to MongoDB over TLS/SSL](#connect-restheart-to-mongodb-over-tlsssl)
    - [MongoDB authentication with just enough permissions](#mongodb-authentication-with-just-enough-permissions)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

### Run with Docker

Please refer to [How to run RESTHeart with Docker](/learn/docker).

## Manual installation

This section is about installing and configuring RESTHeart directly on a VM or on _"bare metal"_, without Docker.

If you don’t have them already, download the following packages:

* [Java 8](https://jdk.java.net/8/)
* [MongoDB](https://www.mongodb.org/downloads)
* [RESTHeart](https://github.com/softinstigate/restheart)

Most of the work must be done using a command line interface.

RESTHeart works with Java versions from 8 to 11.

### Install Java and MongoDB

Install [Java
8](https://jdk.java.net/8/) and [MongoDB](https://docs.mongodb.org/manual/installation/) following
the instructions for your specific operating system and make sure that
their binaries are actually executable (so they are in your PATH env
variable).

To check Java and MongoDB, you should execute the following commands and
you should get *something* like the below (output might vary depending
on Java, your OS and MongoDB versions):

```bash
$ java -version
java version "1.8.0_151"
Java(TM) SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)

$ mongod --version
db version v4.0.4
```

RESTHeart has been tested with MongoDB from version 2.4 to 4.0. More recently, integration tests are executed against versions 3.6 and 4.0.

### Install RESTHeart

To *install* RESTHeart download the latest stable release package from [github](https://github.com/SoftInstigate/RESTHeart/releases) and just extract its the content in the desired directory.

You are interested in three files:

* `restheart.jar`
* `etc/restheart.yml` &lt;- an example configuration file
* `etc/default.properties`

### Start MongoDB

In pursuit of simplicity we are first going to start MongoDB without
enabling authentication. We’ll see later how to enable it.

You can just start MongoDB by running the `mongod` command from a shell
prompt. It is configured by default to use the `/data/db`folder, which
must exist already or you have to create it beforehand. If you do not
want to use the default data directory (i.e., `/data/db`), specify the
path to the data directory using
the `--dbpath` option: `mongod --dbpath <path to data directory>`. You
might prefer to run the MongoDB process in background, using
the `--fork` parameter: `mongod --fork --syslog`:

```text
$ mongod --fork --syslog
about to fork child process, waiting until server is ready for connections.
forked process: 11471
child process started successfully, parent exiting

# By default MongoDB starts listening for connections on 127.0.0.1:27017.
```

### Run RESTHeart

As a quick-start, RESTHeart can be run without any external configuration file, only with its own internal default values. That tries connecting to a MongoDB instance running on the `localhost:27017` mongo-uri:

```bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar

18:51:31.346 [main] WARN  org.restheart.Bootstrapper - No configuration file provided, starting with default values!
18:51:31.435 [main] INFO  org.restheart.Bootstrapper - Starting RESTHeart
  {
    "Version": "3.7.0-SNAPSHOT",
    "Instance-Name": "default",
    "Configuration": "null",
    "Environment": "null",
    "Build-Time": "2019-01-22T17:39:01Z"
  }
18:51:31.439 [main] INFO  org.restheart.Bootstrapper - Logging to file /var/folders/pk/56szmnfn5zlfxh2x6tkd5wqw0000gn/T/restheart.log with level INFO
18:51:31.439 [main] INFO  org.restheart.Bootstrapper - Logging to console with level INFO
18:51:31.819 [main] INFO  org.restheart.Bootstrapper - MongoDB connection pool initialized
18:51:31.819 [main] INFO  org.restheart.Bootstrapper - MongoDB version 3.6.7
18:51:31.819 [main] WARN  org.restheart.Bootstrapper - MongoDB is a standalone instance, use a replica set in production
18:51:31.819 [main] WARN  org.restheart.Bootstrapper - ***** No Identity Manager specified. Authentication disabled.
18:51:31.819 [main] WARN  org.restheart.Bootstrapper - ***** No access manager specified. users can do anything.
18:51:31.819 [main] INFO  org.restheart.Bootstrapper - Authentication Mechanism io.undertow.security.impl.BasicAuthenticationMechanism enabled
18:51:31.819 [main] INFO  org.restheart.Bootstrapper - Token based authentication enabled with token TTL 15 minutes
18:51:31.824 [main] INFO  org.restheart.Bootstrapper - HTTPS listener bound at 0.0.0.0:4443
18:51:31.824 [main] INFO  org.restheart.Bootstrapper - HTTP listener bound at 0.0.0.0:8080
18:51:31.825 [main] INFO  org.restheart.Bootstrapper - Local cache for db and collection properties enabled with TTL 1000 msecs
18:51:31.826 [main] INFO  org.restheart.Bootstrapper - Local cache for schema stores not enabled
18:51:31.961 [main] INFO  org.restheart.Bootstrapper - URL / bound to MongoDB resource *
18:51:32.047 [main] INFO  org.restheart.Bootstrapper - Embedded static resources browser extracted in /var/folders/pk/56szmnfn5zlfxh2x6tkd5wqw0000gn/T/restheart-7196941146163994258
18:51:32.055 [main] INFO  org.restheart.Bootstrapper - URL /browser bound to static resources /var/folders/pk/56szmnfn5zlfxh2x6tkd5wqw0000gn/T/restheart-7196941146163994258. Access Manager: false
18:51:32.076 [main] INFO  org.restheart.Bootstrapper - Allow unescaped characters in URL: true
18:51:32.244 [main] INFO  org.restheart.Bootstrapper - Pid file /var/folders/pk/56szmnfn5zlfxh2x6tkd5wqw0000gn/T/restheart-0.pid
18:51:32.244 [main] INFO  org.restheart.Bootstrapper - RESTHeart started
```

This default configuration is fine for MongoDB running on localhost, on default port and without any authentication.

Configuration options can be specified passing a configuration
file and configuration properties as arguments.

``` bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar restheart.yml --envFile default.properties
```

The configuration file path is either absolute or relative to the restheart.jar file location.

The configuration file can specify any option that will overwrite the
default value: this way it is not required to specify all the possible
options in the configuration file following a *convention over
configuration* approach.

For more information about the configuration file format refer to [Default
Configuration File](/learn/configuration-file) section.

On Linux, OSX and Solaris you can run RESTHeart as a [daemon
process](https://en.wikipedia.org/wiki/Daemon_(computing)): 

``` bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar restheart.yml --envFile default.properties --fork
```

Note that this will force the console logging and the file logging to be
turned off and on respectively, regardless the specified log
configuration options.

We’ll now use the embedded [HAL browser](https://github.com/mikekelly/hal-browser) to check that everything is fine. The HAL browser allows you to surf the DATA API with your regular Web browser.

To see the HAL user interface, now open your browser
at: [`http://127.0.0.1:8080/browser`](http://127.0.0.1:8080/browser)

### Enable MongoDB authentication

This section assumes using MongoDB 3.2 or later. For other versions, the security
configuration is similar but different. Refer to the [MongoDB
documentation](https://docs.mongodb.org/manual/tutorial/enable-authentication/)
for more information.

Start MongoDB with authentication and connect to the MongoDB instance
from a client running on the same system. This access is made possible
by the localhost exception. Again, you might prefer to run the MongoDB
process in background, using the `--fork` parameter.

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

```javascript
> use admin
> db.createUser({
    user: "admin",
    pwd: "changeit",
    roles:[ "root" ]
})
```

    We need to provide the MongoDB user authentication credentials in the RESTHeart configuration file: see docs. 

We’ll use the restheart.yml example configuration file that comes with
RESTHeart download package (you find it in the etc directory)

``` bash
$ vi etc/restheart.yml
```

Find and modify the following section providing the user-name, password
and authentication db (the db where the MongoDB user is defined, in our
case ‘admin’).

``` yml
    mongo-uri: mongodb://admin:changeit@127.0.0.1/?authSource=admin
```

Now start RESTHeart specifying the configuration file:

``` bash
$ java -Dfile.encoding=UTF-8 -server -jar restheart.jar etc/restheart.yml
```

Test the connection opening the HAL browser at `http://127.0.0.1:8080/browser`.

Note that the example configuration file `etc/restheart.yml` also
enables the RESTHeart security. Opening the HAL browser page, you’ll be
asked to authenticate. You can use of one of the credentials defined
in `etc/security.yml` file (try username = ‘a’ and password = ‘a’).

#### Connect RESTHeart to MongoDB over TLS/SSL

MongoDB clients can use TLS/SSL to encrypt connections to mongod and
mongos instances.

To configure RESTHeart for TLS/SSL do as follows:

* create the keystore importing the public certificate used by mongod using keytool (with keytool, the java tool to manage keystores of cryptographic keys)

``` bash
$ keytool -importcert -file mongo.cer -alias mongoCert -keystore rhTrustStore

# asks for password, use "changeit"
```

* specify the ssl option in the mongo-uri in the restheart yml configuration file:

``` yml
    mongo-uri: mongodb://your.mongo-domain.com?ssl=true
```
* start restheart with following options:

``` bash
$ java -Dfile.encoding=UTF-8 -server -Djavax.net.ssl.trustStore=rhTrustStore -Djavax.net.ssl.trustStorePassword=changeit -Djavax.security.auth.useSubjectCredsOnly=false -jar restheart.jar restheart.yml
```

#### MongoDB authentication with just enough permissions

In the previous examples we used a MongoDB user with *root *role for the
sake of simplicity. This allows RESTHeart to execute any command on any
MongoDB resource.

On production environments a strong security isolation is mandatory.

In order to achieve it, the best practice is:

1. use the mongo-mounts configuration option to restrict the resources exposed by RESTHeart;
2. use a MongoDB user with just enough roles: *read* or *readWrite* on mounted databases 

The following example, creates a MongoDB user with appropriate roles to expose the databases *db1*, *db2* and *db3* in read only mode.

```javascript
> use admin
> db.createUser({user: "mongousr",
    pwd: "secret",
    roles: [{role: "readWrite", db: "db1"},
            {role: "readWrite", db: "db2"},
            {role: "read", db: "db3"}
]})
```

To list the databases (i.e. GET /, the root resource) the listDatabases
permission is needed. This permission is granted by the
readWriteAnyDatabase role or you can create a custom role.

To allow deleting a database the *dropDatabase* permission is needed.
This permission is granted by the *dbAdmin* role or you can create a
custom role.

</div>
