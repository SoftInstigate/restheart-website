---
layout: default
title: Frequently Asked Questions
---
<div class="container-fluid imgHover">
    <div class="row flex-xl-nowrap">

<div markdown="1" class="d-none d-lg-block col-lg-3 order-first faq-toc">

* [OS vs Professional Edition](#os-vs-pe)
* [What is the license?](#license)
* [What is a License Key?](#license-key)
* [What is a RESTHeart instance?](#rh-instance)
* [What is the License Key Activation process?](#license-key-activation)
* [What is a Derivative Work?](#derivative-work)
* [Derivative Work distribution](#distribute-derivative-work)
* [*Disclose source* AGPL condition over Commercial License](#commercial-license-overcome-disclose-source)
* [Is RESTHeart fully open source?](#letter-to-os-users)
* [What about educational institutions and non-profit organization?](#non-profit-customers)

</div>
<div markdown="1" class="col-12 col-lg-7 py-md-3 bf-content">

{% include docs-head.html %} 

<div class="anchor-offset" id="os-vs-pe">
</div>

{: .mt-3 .alert .alert-info}
I’m not sure which version of RESTHeart to get — the open source version or the professional edition version. What are the basic differences?

If you are a student or researcher and plan to use RESTHeart for study, research or in-house development (not a commercial deployment) and are comfortable with the AGPL Open Source license regime governing the RESTHeart open source version then the open source version is likely to be best for you.

However, if you are a commercial developer and plan to deploy a project for a client and aren’t comfortable with the AGPL Open Source License (i.e. need a commercial license) or if one of the following features/attributes is important to you, then you probably should consider getting the professional edition version (PE version) of the RESTHeart Platform:

1. **Multi-documented transactions:** MongoDB doesn’t currently support multi-documented transactions but the PE version of the RESTHeart Platform through its REST API does.

2. **Change streams:** the PE version of the RESTHeart Platform supports web sockets and allows for a persistent connection with MongoDB which enables real-time data transfer including live streaming of data. The open source version of RESTHeart does not. 

3. **Security:** even though the open source version of RESTHeart does have some basic authentication and security features, the security feature set of the PE version of the RESTHeart Platform including automatic encryption of passwords can help you with your compliance with the GDPR laws of Europe and its module architecture enables agnostic support of other security platforms. 

4. **Documentation:** the documentation for the open source version is available on Github and only covers the limited feature set of the open source version. The documentation for all features of all commercial editions of the RESTHeart Platform is available on the RESTHeart website and covers the advanced feature set of the RESTHeart Platform.

5. **Extensibility:** while the open source version of RESTHeart is extensible, the PE version of the RESTHeart Platform is more elegantly architected for greater ease of extensibility.

6. **Clustering** Enterprise and OEM Editions implements a native clustering machanism, and they come with support for this deployment option.

7. **Priority bug fixes:** the support team for RESTHeart prioritizes support/bug fixes for those with paid editions. Users of the PE version of the RESTHeart Platform will get their bugs fixed with higher priority and those with the open source version will get attention for bug fixes – just at a lower level of speed and priority.


<div class="anchor-offset" id="license">
</div>

{: .alert.alert-info.mt-4}
What is the license?

See [COMM-LICENSE](https://github.com/SoftInstigate/restheart/blob/master/COMM-LICENSE.txt) in the root of the RESTHeart repo.


<div class="anchor-offset" id="license-key">
</div>

{: #license-key .alert.alert-info.mt-4}
What is a License Key?

A *License Key* is a verifiable file, cryptographically signed by the Licensor, containing additional information on the License (including but not limited to those that specifies how many RESTHeart instances the Licensee is allowed to execute and how) that can purchased by the Licensee in order to acquire the rights to use RESTHeart.


<div class="anchor-offset" id="rh-instance">
</div>

{: .alert.alert-info.mt-4}
What is a RESTHeart instance?

A *RESTHeart instance* is any installation of RESTHeart and Derivative Works of RESTHeart capable of being executed as a single process in a production execution environment regardless the used technology, including but not limited to bare metal servers, virtual machines or containers. Installations made for testing or development purposes don’t constitute RESTHeart instances.


<div class="anchor-offset" id="license-key-activation">
</div>

{: .alert.alert-info.mt-4}
What is the License Key Activation process?

The License Key Activation is the technical process by which the Licensee accepts the Terms and Conditions of the License and binds the License Key to a RESTHeart Instance. RESTHeart instances with activated license keys run under the Commercial License and are not affected by AGPL restrictions.


<div class="anchor-offset" id="derivative-work">
</div>

{: .alert.alert-info.mt-4}
What is a Derivative Work?

A Derivative Work is the work or software that could be created by the Licensee, based upon the RESTHeart or modifications thereof, including but not limited to any modification of RESTHeart and any software that links or embeds RESTHeart. 

**Important**: A Software that interacts with RESTHeart only via its REST API is not considered as a Derivative Work.


<div class="anchor-offset" id="distribute-derivative-work">
</div>

{: .alert.alert-info.mt-4}
Can I distribute a Derivative Work with my own License?

With the Commercial License you can distribute your Derivative Work under your Terms and Conditions. This is also true if you distribute your Software as a Service.

You can buy as many license keys as the instance you need to distribute or even have an OEM license. In the latter case the License Key is not bound to RESTHeart instances and can only be used together with your product.


<div class="anchor-offset" id="commercial-license-overcome-disclose-source">
</div>

{: .alert.alert-info.mt-4}
Does the Commercial License overcome the *Disclose Source* AGPL condition?

Yes, With the Commercial License you don't have to make the Source Code available when distributing your Derivative Work. 


<div class="anchor-offset" id="letter-to-os-users">
</div>

{: .alert.alert-info.mt-4}
Is RESTHeart fully open source?

Yes, RESTHeart is and will always be open source software. RESTHeart is distributed under the GNU Affero General Public License, which is

 _"a free, copyleft license for software and other kinds of works, specifically designed to ensure cooperation with the community in the case of network server software."_

 So the AGPL is a dedicated GPL extension, valid also in the case of software used on network servers: 

_"The GNU Affero General Public License is designed specifically to ensure that, in such cases, the modified source code becomes available to the community. It requires the operator of a network server to provide the source code of the modified version running there to the users of that server. Therefore, public use of a modified version, on a publicly accessible server, gives the public access to the source code of the modified version."_

There are [editions](/editions) of RESTHeart that are distributed under a commercial license. The reason is to offer additional, paid-only features which, usually, interests a minority of users, to help financing the development of this project.

<div class="anchor-offset" id="non-profit-customers">
</div>

{: .alert.alert-info.mt-4}
Educational institutions and non-profit organizations 

Educational institutions and non-profit organizations are often asked to do a lot with only a small budget. We are happy to help you on this case, please contact us to assess your situation. 

This mean we can assist in using the open source version of the product more effectively, or provide discounts for the commercial editions, if that's what you need.

<div class="mb-5">&nbsp;</div>
</div>