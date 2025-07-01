---
title: Configure TLS
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [The HTTPS listener](#the-https-listener)
-   [Use the test self signed certificate ](#use-the-test-self-signed-certificate)
-   [Use a valid certificate](#use-a-valid-certificate)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content pt-0">

{% include docs-head.html %}

## Introduction 

This section provides instructions on how to enable Transport Layer Security so that requests can be served over the HTTPS protocol.

{:.alert.alert-danger}
HTTP is not secure: credentials can be sniffed by a man-in-the-middle attack. **It is paramount to use HTTPS**

## The HTTPS listener

There are many ways of enabling HTTS; for instance you can setup a web server such as nginx as a reverse proxy in front of RESTHeart or you may rely on cloud services that provides load balancers that manages SSL for you (such are Amazon WS or Google Cloud).

In any case, restheart-security and restheart-core are both able to expose directly the HTTS protocol and this is done configuring the https listener. This is the suggested configuration for small systems.

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

To enable https configure the https listener using the following options:

1.  **https-listener** _true_ to enable it
2.  **https-host** the ip where to bind the listener
3.  **https-port** the port where to bind the listener:

A SSL certificate must configured in order to enable the https listener and there are two options:

1.  for development and testing purposes, use the test self signed certificate
2.  for production, use a valid certificate

## Use the test self signed certificate 

{:.alert.alert-danger}
The test self signed certificate is provided only for testing purposes. Using it is not **secure**.

The only option to specify to use the default, embedded self signed certificate is the following:

```yml
use-embedded-keystore: true
```

Using the self-signed certificate leads to issues with some clients and all browser because it does not guarantees the client about the server identity. For instance:

1.  with **curl** you need to specify the "--insecure" option or you'll get an error message;
2.  with any browser, the user will get warnings about the server identity

## Use a valid certificate

You need to get a valid certificate from a Certificate Authority and install it to the java keystore.

Follow this <a target="_blank" href="https://www.digitalocean.com/community/tutorials/java-keytool-essentials-working-with-java-keystores">tutorial</a> to add the certificate to the java keystore.

Once the certificate has been added, you can configure it as follows:

```yml
use-embedded-keystore: false

keystore-file: /path/to/keystore/file
keystore-password: he keystore password
certpassword: the certificate password
```
