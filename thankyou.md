---
layout: page-notitle
title: Thank you!
permalink: /thankyou
---

{% include docs-head.html %} 

## Order fulfillment

Check your email. We sent you an email confirming the order. 

We will process the order and send you the purchased *license keys* by **the next business day**. 

<div class="jumbotron">
    <i class=" icon-thumbs-up"></i>For help and questions you can contact our <a href="mailto:support@softinstigate.com">support</a>.
    Please take into account that we are at <a href="https://www.timeanddate.com/time/zone/italy/rome" target="_blank">CET timezone</a>
</div>

## License Key Activation

{: .jumbotron }
<i class=" icon-info"></i> The License Key Activation is the technical process by which the Licensee accepts the Terms and Conditions of the License and binds the License Key to the allowed RESTHeart Instances. RESTHeart instances with bound license keys run under the Commercial License and are not affected by AGPL conditions.

The license key activation requires four steps:

- Copy and extract the provided license key archive to the RESTHeart root directory;
- Add the `si-lka.jar` jar file to the java classpath;
- Edit the configuration file to enable the license key activator;
- Execute RESTHeart and activate the license key by accepting it.

## Copy and extract the provided license key archive

Copy the license key tar archive you have been provided by SoftInstigate to the RESTHeart root directory.

```bash
$ cp lickey.tar.gz <rhroot>
```

Where XXX <rhroot> is the RESTHeart root directory.

Extract the package files.

```bash
$ cd <rhroot>
$ tar -xzf lickey.tar.gz
```

This creates the directory `lickey` with the following files:

- comm-license.key
- COMM-LICENSE.txt
- README.md
- si-lka.jar

## Update the classpath

Update the script that runs RESTHeart to add the lickey/si-lka.jar to the java classpath.
Of course you need to adjust the jar and configuration files paths accordingly to your environemnt.

```bash
java -Dfile.encoding=UTF-8 -server -classpath restheart.jar:lickey/si-lka.jar org.restheart.Bootstrapper etc/restheart.yml
```
## Enable the License Activator in the Configuration File

Edit the configuration file and update the Initializer section as follows:

```yml
### Initializer

initializer-class: com.softinstigate.lickeys.CommLicense
```

If you already have a custom initializer, please contact support@softinstigate.com

## Activate the License

Running RESTHeart with the License Activator properly configured will cause the following warning message:

```bash

WARN  o.restheart.custom.RHLicenseVerifier - The commercial license key has not been activated yet.
WARN  o.restheart.custom.RHLicenseVerifier - All requests are temporarily blocked.
INFO  o.restheart.custom.RHLicenseVerifier - Please open your browser at http://<ip-of-restheart>:18080 and activate the license.
INFO  o.restheart.custom.RHLicenseVerifier - The commercial license is available at <rhroot>/lickey/COMM-LICENSE.txt
```

As a result of this error, all requests to RESTHeart are temporarily blocked.

To properly run RESTHeart you must explicitly accept the license:

 - open your browser at `http://<ip-of-restheart>:18080`.
 - read and approve the license

> To approve the license you need to select the two checkboxes and then click the "Activate the License Key" button.

After activating the license, you will find the following messages in RESTHeart's log:

```bash

INFO o.restheart.custom.RHLicenseVerifier - License accepted.
INFO  o.restheart.custom.RHLicenseVerifier - Requests are enabled.
```

After license key activation, starting RESTHeart just logs the following message confirming that the Commercial License is in force:

```
INFO  o.restheart.custom.RHLicenseVerifier - This instance of RESTHeart is licenced under the Terms and Conditions of the Commercial License available at <rhroot>/lickey/COMM-LICENSE.txt
```