---
title: Enterprise License
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [Requirements](#requirements)
- [The activation process](#the-activation-process)
- [Silent acceptance](#silent-acceptance)
- [Specify the license key directory](#specify-the-license-key-directory)
- [Docker](#docker)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 

The [Enterprise License](https://github.com/SoftInstigate/restheart/blob/master/COMM-LICENSE.txt) comes into effect by executing the License Key Activation process.

{: .bs-callout .bs-callout-info }
For more information about the Enterprise License and Support please refer to the [support](/support) page.

To activate the license key, you need to download and install the **License Key Activator Plugin**.

As long as this process is not completed, the terms and conditions of the Affero General Public License are in force.

## Requirements
The License Key Activator Plugin requires RESTHeart version 5.0 and later.

If you use a previous version you should upgrade; for more information please contact `support@softinstigate.com`

## The activation process

The license key activation requires three steps:

1. Download, extract and copy the license key activator plugin to the RESTHeart plugins directory;
2. Copy and extract the provided license key archive to the RESTHeart plugin directory;
3. Execute RESTHeart and accept the license agreement.

### Download, extract and copy the license key activator plugin

Download the license activator plugins from `https://download.restheart.com/si-lka-<version>.zip`.
 
Where `<version>` is the version of RESTHeart you are using.

For instance, if you are using RESTHeart v5.1.3 the download URL is `https://download.restheart.com/si-lka-5.1.3.zip`

{: .bs-callout .bs-callout-info }
If the activator plugin for your version of RESTHeart is missing (you get error *404 Not Found*), please email us at support@softinstigate.com and we will upload it.
 
Once downloaded, extract the zip package and copy the contained plugin jar file into the plugins directory:

```bash
$ unzip si-lka-<version>.zip
$ cp si-lka-<version>/si-lka.jar <rhroot>/plugins
```

Where `<rhroot>` is the RESTHeart root directory.

### Copy and extract the provided license key archive

Copy the license key tar archive you have been provided by SoftInstigate to the RESTHeart plugins directory.

```bash
$ cp lickey.tar.gz <rhroot>/plugins
```

Where `<rhroot>` is the RESTHeart root directory.

Extract the package files.

```bash
$ cd <rhroot>/plugins
$ tar -xzf lickey.tar.gz 
```

This creates the directory `lickey` with the following files:

- comm-license.key
- COMM-LICENSE.txt

### Accept the License Agreement

Running RESTHeart will cause the following warning message:

```bash
*-------------------------------------------------------------------*
|                                                                   |
| The License Agreement has not yet been accepted.                  |
|                                                                   |
| Please open your browser at http://localhost:8080/license and     |
| accept the license to continue.                                   |
|                                                                   |
| The HTTP listener is bound to localhost: accept the license from  |
| a browser running on the same host or edit the configuration.     |
|                                                                   |
| More information at                                               |
| https://restheart.org/docs/enterprise-license                   |
|                                                                   |
*-------------------------------------------------------------------*
```

To properly run RESTHeart you must explicitly accept the license:

 - open your browser at `http://<ip-of-restheart>:8080/license`.
 - read and approve the license

> To accept the License Agreement you need to select the two checkboxes and then click the "Activate the License Key" button.

![Accept License](/images/accept-license.png){: class="mx-auto d-block img-fluid"}

When done, you will find the following message in RESTHeart's log:

```
 11:20:16.445 [XNIO-1 task-2] INFO  com.restheart.CommLicense - License Agreement accepted.
```

Once the License Agreement has been accepted, at startup RESTHeart just logs the following message confirming the Enterprise License is in force:

```
*-------------------------------------------------------------------*
|                                                                   |
| This instance of RESTHeart is licenced under the Terms and        |
| Conditions of the Enterprise License Agreement.                   |
|                                                                   |
*-------------------------------------------------------------------*
```

## Silent acceptance

You can also accept the License Agreement with the system property `ACCEPT_LICENSE_AGREEMENT`

```
java -DACCEPT_LICENSE_AGREEMENT=true -jar restheart.jar
```

## Specify the license key directory

The default directory that contains the license key is `/plugins/lickey` next to the file `si-lka.jar`:

```
- restheart.jar
- plugins
    - lickey
        - comm-license.key
        - COMM-LICENSE.txt
```

You can set a different directory with the system property `lk-dir`:

```
java -Dlk-dir=/etc/rh-lickey -jar restheart.jar
```

## Docker

If you use Docker to run RESTHeart, you need to mount the `lickey` directory.

Add the following option to the `docker run` command:

```bash
-v ~/plugins/lickey:/opt/restheart/plugins/lickey/
```

</div>