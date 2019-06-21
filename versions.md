---
layout: page-notitle
title: Versions
---

<div class="versions-matrix mt-5">
    <div class="comparison">

  <table>
    <thead>
      <tr>
        <th class="tl tl2"></th>
        <th colspan="3" class="qbse">
          <strong>Features</strong>
        </th>
        <th colspan="1" style="border-right: 0; border-top: 0">
        </th>
      </tr>
      <tr>
        <th class="tl"></th>
        <th class="compare-heading p-3">
          <div class="d-flex flex-column flex-md-row justify-content-center mb-2 w-100">
            <div><a href="https://github.com/SoftInstigate/restheart"><img class="img-fluid mr-md-2" src="/images/octocat.png" width="20"></a></div>
            <a class="mt-auto" href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>OSS</strong> </a>
          </div>
          <a style="font-weight: 100" href="{{ "/faq" | prepend: site.baseurl }}">Letter to OS Users</a>
        </th>
        <th class="compare-heading restheart-version p-3">
          <a href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>Platform PE</strong></a>
        </th>
        <th class="compare-heading restheart-version p-3">
          <a href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>Platform EE</strong></a>
        </th>
        <th class="compare-heading restheart-version p-3">
          <a href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>Platform OEM</strong></a>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td></td>
        <td colspan="4">REST API for admin operations (manage databases, collections, indexes)</td>
      </tr>
      <tr class="compare-row">
        <td>REST API for admin operations (manage databases, collections, indexes)</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">REST API for Create Read Update Delete</td>
      </tr>
      <tr>
        <td>REST API for Create Read Update Delete</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Bulk write operations</td>
      </tr>
      <tr class="compare-row">
        <td>Bulk write operations</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Aggregations and Map-Reduce operations</td>
      </tr>
      <tr>
        <td>Aggregations and Map-Reduce operations</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Plugins (Transformers, Checkers and Hooks)</td>
      </tr>
      <tr class="compare-row">
        <td>Plugins (Transformers, Checkers and Hooks)</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">JSON Schema data validation and enforcement</td>
      </tr>
      <tr>
        <td>JSON Schema data validation and enforcement</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Bulk data import, uploading CSV files from Excel</td>
      </tr>
      <tr class="compare-row">
        <td>Bulk data import, uploading CSV files from Excel</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Support for MongoDB sessions</td>
      </tr>
      <tr>
        <td>Support for MongoDB sessions</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Basic Security (authentication and authorization)</td>
      </tr>
      <tr class="compare-row">
        <td>Basic Security (authentication and authorization)</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Extended IAM with plugins (LDAP, AD, etc)</td>
      </tr>
      <tr>
        <td>Extended IAM with plugins (LDAP, AD, etc)</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Can use in closed source application</td>
      </tr>
      <tr class="compare-row">
        <td>Can use in closed source application</td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Identity Manager with users on MongoDB</td>
      </tr>
      <tr>
        <td>Identity Manager with users on MongoDB</td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">JWT Authentication</td>
      </tr>
      <tr class="compare-row">
        <td>JWT Authentication</td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Change Streams</td>
      </tr>
      <tr>
        <td>Change Streams</td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Transactions</td>
      </tr>
      <tr class="compare-row">
        <td>Transactions</td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Clustering</td>
      </tr>
      <tr>
        <td>Clustering</td>
        <td></td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Access Manager with DSL permissions on MongoDB</td>
      </tr>
      <tr class="compare-row">
        <td>Access Manager with DSL permissions on MongoDB</td>
        <td></td>
        <td></td>
        <td><span class="restheart-red">✔ (v4.1)</span></td>
        <td><span class="restheart-red">✔ (v4.1)</span></td>
      </tr>
    </tbody>
  </table>

</div>
</div>


<div class="versions-matrix mt-5">
    <div class="comparison">

  <table>
    <thead>
      <tr>
        <th class="tl tl2"></th>
        <th colspan="3" class="qbse">
          <strong>Licensing, Pricing, Purchase</strong>
        </th>
        <th colspan="1" style="border-right: 0; border-top: 0">
        </th>
      </tr>
      <tr>
        <th class="tl"></th>
        <th class="compare-heading restheart-version p-3">
          <div class="d-flex flex-column flex-md-row justify-content-center mb-2 w-100">
            <div><a href="https://github.com/SoftInstigate/restheart"><img class="img-fluid mr-md-2" src="/images/octocat.png" width="20"></a></div>
            <a class="mt-auto" href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>OSS</strong> </a>
          </div>
          <a style="font-weight: 100" href="{{ "/faq" | prepend: site.baseurl }}">Letter to OS Users</a>
        </th>
        <th class="compare-heading restheart-version p-3">
          <a class="d-block" href="{{ "faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>Platform PE</strong></a>
        </th>
        <th class="compare-heading restheart-version p-3">
          <a class="d-block" href="{{ "faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>Platform EE</strong></a>
        </th>
        <th class="compare-heading restheart-version p-3">
          <a class="d-block" href="{{ "faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>Platform OEM</strong></a>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td></td>
        <td colspan="4">Type of License</td>
      </tr>
      <tr class="compare-row">
        <td>Type of License</td>
        <td>Open Source AGPL which requires distributing source code</td>
        <td>Standard Commercial with no custom terms</td>
        <td>Enterprise License with custom terms</td>
        <td>Embedded License with custom terms</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Pricing</td>
      </tr>
      <tr>
        <td>Pricing</td>
        <td>Free</td>
        <td>30-Day Free Trial then USD 499 per Deployment Instance per Year. VAT applies for EU customers</td>
        <td>Negotiable</td>
        <td>Negotiable</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Purchase</td>
      </tr>
      <tr class="compare-row">
        <td>Purchase</td>
        <td>n/a</td>
        <td>Online with credit card</td>
        <td>Company Purchase Order</td>
        <td>Company Purchase Order</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Obtain</td>
      </tr>
      <tr>
        <td>Obtain</td>
        <td><a style="font-weight: 100" href="https://github.com/SoftInstigate/restheart">GitHub Repository</a></td>
        <td>
          <a href="{{ "/get" | prepend: site.baseurl }}"><button style="1" type="button" class="pl-3 pr-3 btn btn-danger">GET</button></a>
        </td>
        <td><a href="mailto:info@restheart.org?subject=RESTHeart EE">Contact</a></td>
        <td><a href="mailto:info@restheart.org?subject=RESTHeart OEM">Contact</a></td>
      </tr>
    </tbody>
  </table>

</div>
</div>

{% include roi-calculator.html %}