---
layout: docs
title: Setup
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Run with Docker](#run-with-docker)
- [Run manually](#run-manually)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

## Download RESTHeart Platform

Download the RESTHeart Platform at <a href="http://restheart.org/get" target="_blank">http://restheart.org/get</a>

Choose the free **RESTHeart Platform 30 days Trial** and fill the form providing a valid email address. You will receive and email from our online reseller Paddle.com with the download link and a Trial License Key.

Clicking on the download link in the email, you get the RESTHeart Platform zip package `restheart-platform-<version>.zip`

Unzip it to get the following directory. 

``` plain
├── Dockerfile-core
├── Dockerfile-security
├── docker-compose.yml
├── etc/
│   ├── acl.yml
│   ├── config.properties
│   ├── restheart-platform-core.yml
│   ├── restheart-platform-security.yml
│   └── users.yml
├── lickey/
│   └── COMM-LICENSE.txt
├── restheart-platform-core.jar
└── restheart-platform-security.jar
```

### Open Source Version
You can also use the Open Source version. 

{: .text-muted }
Confused on which version to choose? Check our <a href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}">FAQs</a> to learn more about the main differences between versions.

{: .bs-callout.bs-callout-info}
For setup instructions of the OS version, please refer to README files in the github repositories.

## Run with Docker

> Docker is the best way to run RESTHeart Platform

### Requirements

- Docker v1.13 and later

### Run RESTHeart Platform

Start the RESTHeart Platform stack comprising restheart-platform-core, restheart-platform-security and MongoDB configured as a Replica Set, executing the following command:

``` bash
$ docker-compose up -d
```

### Accept License

At the first run, you must accept the license.

Open <a href="http://localhost:8080/license" target="_blank">http://localhost:8080/license</a>

You need to add the license key, copying it from the email received from our online reseller Paddle.com and pasting it in the *License Key* field:

<img src="/images/license-form-add-key.png" width="50%" height="auto" class="img-responsive">

The following screenshot shows the email with the License Key.

<img src="/images/paddle-email.png" width="50%" height="auto" class="img-responsive">

In this case, the license key to paste is:

``` plain
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJsaWNlbnNlZSI6IlhYWCIsImxpY2Vuc29yIjoiU29mdEluc3RpZ2F0ZSBTcmwsIEl0YWx5IiwiYWRkaXRpb25hbENvbmRpdGlvbnMiOiJUaGlzIGxpY2Vuc2Uga2V5IGNhbiBvbmx5IGJlIHVzZWQgZm9yIGRldmVsb3BtZW50IHB1cnBvc2VzIiwiaXNzIjoiU29mdEluc3RpZ2F0ZSBTcmwsIEl0YWx5IiwiY29uY3VycmVudCI6ZmFsc2UsIm1heE1hY2hpbmVzIjoxLCJsaWNlbnNlSGFzaCI6ImM1ZWQ4MDczZTYxMzFiZDU0ZTI0MTEyNjE1OGI5NGQ3MTI3OGU5YmIyZjU4NGFkNzMzZDllYjBiNWM4MzNhYzYiLCJ0eXBlIjoiVHJpYWwgbGljZW5zZSIsInN1YnNjcmlwdGlvblBlcmlvZCI6ImZyb20gMDYvMTAvMjAxOSB0byAwNy8xMC8yMDE5IiwiZmxvYXRpbmciOmZhbHNlLCJleHAiOjE1NjI3MTY4MDAsImlhdCI6MTU2MDEyNDgwMCwianRpIjoiZDZlOTE2ZTItZDJkMy00ZjRkLWIxN2MtZjA0MDA2NDJlZTQ2In0.jiK-gCTho5O66v8FpKKebiSltas39jKgm9OmBnG1fBM-6kYBQQ7dX79cvhY6R3Ea3hVyrDc0URoHLSfjlUB3gcFqBcDrltYtPhHa27HmEfVdhqK6Itu2hbth-J-A1xpWNRjmIeUzPoGYR58QA10F4Zh0rrSLE1Zh4sXWXrX7vvlKxSirg7x48MEV0SeGNehxuQMjKwgsKQinwvq5PlkNQHx72mOgeUrhpNrQwFYmcAC8XnzliQ8cAJGX9ql3IhxHtTIfkPi3nE49wewiQWHe_kDRJJDSJsrk99FN2YjUQ-mqjpLdZCI4iyNhw0Z-iOkT1BGhTNL6SVaMrU0XiQ
```

{: .bs-callout.bs-callout-warning}
The shown license key is not valid being expired. You need to get a fresh license as described above. 

Once the license key has been added, you can accept it by checking the two checkboxes and clicking on "Activate the License Key" button.

<img src="/images/license-form-accept.png" width="70%" height="auto" class="img-responsive">

### Check that it is running

Open <a href="http://localhost:8080/roles/admin" target="_blank">http://localhost:8080/roles/admin</a>

Insert the default admin credentials, which are:

    username: admin
    password: secret

You should then see the following json in your browser:

```json
{"authenticated":true,"roles":["admin"]}
```

### Troubleshooting

To view the logs of the services of the RESTHeart Platform stack:

``` bash
$ docker logs restheart-platform-core
```

``` bash
$ docker logs restheart-platform-security
```

``` bash
$ docker logs restheart-platform-mongodb
```

## Run manually

### Requirements

- Java 11 and later
- MongoDB

{: .bs-callout.bs-callout-info }
**Change Streams** require MongoDB v3.6 and later configured as replica set, **Transactions** require MongoDB v4.0 and later configured as replica set.

### Run MongoDB as a Replica Set

This section describes how to run MongoDB standalone configured as a Replica Set.

{: .bs-callout.bs-callout-info }
Refer to the [MongoDB documentation](https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/) for more information.

**Start MongoDb** passing the `replSet` option.

```
$ mongodb --fork --syslog --replSet foo 
```

At the first run, the replica set must be initiated.

Connect to MongoDB using the mongo shell:

```
$ mongo
```

And initiate the replica set as follows:

```
> rs.initiate()
```

### Start RESTHeart Core

``` bash
$ java -jar restheart-platform-core.jar etc/restheart-platform-core.yml -e etc/default.properties
```

### Start RESTHeart Security

``` bash
$ java -jar restheart-platform-security.jar etc/restheart-platform-security.yml
```

### Accept License

At the first run, you must accept the license as described [above](#accept-license).

</div>
