---
layout: page-notitle
title: Editions
---

<div class="editions-matrix mt-5">
    <div class="comparison">

  <table>
    <thead>
      <tr>
        <th class="tl tl2"></th>
        <th colspan="4" class="qbse">
          <strong>Features</strong>
        </th>
        <th colspan="1" style="border-right: 0; border-top: 0">
        </th>
      </tr>
      <tr>
        <th class="tl"></th>
        <th class="compare-heading p-3">
            <a class="mt-auto" href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>OSS</strong> </a>
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
        <td colspan="4">REST API for admin operations (manage <a href="/docs/mgmt/dbs-collections/" class="text-dark">databases, collections</a>, <a href="/docs/mgmt/indexes/" class="text-dark">indexes</a>, <a href="/docs/mgmt/relationships/" class="text-dark">relationships</a>)</td>
      </tr>
      <tr class="compare-row">
        <td>REST API for admin operations (manage <a href="/docs/mgmt/dbs-collections/" class="text-dark">databases, collections</a>, <a href="/docs/mgmt/indexes/" class="text-dark">indexes</a>, <a href="/docs/mgmt/relationships/" class="text-dark">relationships</a>)</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/read-docs/" class="text-dark">REST API for Create Read Update Delete</a></td>
      </tr>
      <tr>
        <td><a href="/docs/read-docs/" class="text-dark">REST API for Create Read Update Delete</a></td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/write-docs/#bulk-write-requests" class="text-dark">Bulk write operations</a></td>
      </tr>
      <tr class="compare-row">
        <td><a href="/docs/write-docs/#bulk-write-requests" class="text-dark">Bulk write operations</a></td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/aggregations/" class="text-dark">Aggregations and Map-Reduce operations</a></td>
      </tr>
      <tr>
        <td><a href="/docs/aggregations/" class="text-dark">Aggregations and Map-Reduce operations</a></td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Plugins (<a href="https://restheart.org/docs/develop/core-plugins/#services" class="text-dark">Services</a>, <a href="https://restheart.org/docs/develop/core-plugins/#transformers" class="text-dark">Transformers</a>, <a href="https://restheart.org/docs/develop/core-plugins/#checkers" class="text-dark">Checkers</a> and <a href="https://restheart.org/docs/develop/core-plugins/#hooks" class="text-dark">Hooks</a>)</td>
      </tr>
      <tr class="compare-row">
        <td>Plugins (<a href="https://restheart.org/docs/develop/core-plugins/#services" class="text-dark">Services</a>, <a href="https://restheart.org/docs/develop/core-plugins/#transformers" class="text-dark">Transformers</a>, <a href="https://restheart.org/docs/develop/core-plugins/#checkers/" class="text-dark">Checkers</a> and <a href="https://restheart.org/docs/develop/core-plugins/#hooks" class="text-dark">Hooks</a>)</td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/json-schema-validation/" class="text-dark">JSON Schema data validation and enforcement</a></td>
      </tr>
      <tr>
        <td><a href="/docs/json-schema-validation/" class="text-dark">JSON Schema data validation and enforcement</a></td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/csv/" class="text-dark">Bulk data import, uploading CSV files from Excel</a></td>
      </tr>
      <tr class="compare-row">
        <td><a href="/docs/csv/" class="text-dark">Bulk data import, uploading CSV files from Excel</a></td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/transactions/#sessions" class="text-dark">Support for MongoDB sessions</a></td>
      </tr>
      <tr>
        <td><a href="/docs/transactions/#sessions" class="text-dark">Support for MongoDB sessions</a></td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/security/overview/" class="text-dark">Basic Security (authentication and authorization)</a></td>
      </tr>
      <tr class="compare-row">
        <td><a href="/docs/security/overview/" class="text-dark">Basic Security (authentication and authorization)</a></td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/develop/security-plugins/" class="text-dark">Extended IAM with plugins (LDAP, AD, etc)</a></td>
      </tr>
      <tr>
        <td><a href="/docs/develop/security-plugins/" class="text-dark">Extended IAM with plugins (LDAP, AD, etc)</a></td>
        <td><span class="tickblue">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/support" class="text-dark">Support</a></td>
      </tr>
      <tr class="highlighted-row">
        <td><a href="/support" class="highlighted-text">Support</a></td>
        <td>Public, no SLA <a href="/support#free">free support</a></td>
        <td><a class="restheart-red" href="/support">Priority Bugfixing</a></td>
        <td><a class="restheart-red" href="/support">Dedicated</a></td>
        <td><a class="restheart-red" href="/support">Tailored</a></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/faq/#distribute-derivative-work" class="text-dark">Can use in closed source application</a></td>
      </tr>
      <tr>
        <td><a href="/faq/#distribute-derivative-work" class="text-dark">Can use in closed source application</a></td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/security/authentication/#restheart-authenticator" class="text-dark">Identity Manager with users on MongoDB</a></td>
      </tr>
      <tr class="compare-row">
        <td><a href="/docs/security/authentication/#restheart-authenticator" class="text-dark">Identity Manager with users on MongoDB</a></td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/security/authentication/#jwt-authentication" class="text-dark">JWT Authentication</a></td>
      </tr>
      <tr>
        <td><a href="/docs/security/authentication/#jwt-authentication" class="text-dark">JWT Authentication</a></td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/change-streams/" class="text-dark">Change Streams</a></td>
      </tr>
      <tr class="compare-row">
        <td><a href="/docs/change-streams/" class="text-dark">Change Streams</a></td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/transactions/" class="text-dark">Transactions</a></td>
      </tr>
      <tr>
        <td><a href="/docs/transactions/" class="text-dark">Transactions</a></td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="/docs/clustering/" class="text-dark">Clustering</a></td>
      </tr>
      <tr class="compare-row">
        <td><a href="/docs/clustering/" class="text-dark">Clustering</a></td>
        <td></td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4"><a href="https://medium.com/softinstigate-team/how-to-create-a-web-api-for-aws-documentdb-using-restheart-987921df3ced" class="text-dark">Amazon DocumentDB support</a></td>
      </tr>
      <tr>
        <td><a href="https://medium.com/softinstigate-team/how-to-create-a-web-api-for-aws-documentdb-using-restheart-987921df3ced" class="text-dark">Amazon DocumentDB support</a></td>
        <td></td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Azure Cosmos DB support</td>
      </tr>
      <tr class="compare-row">
        <td>Azure Cosmos DB support</td>
        <td></td>
        <td></td>
        <td><span class="restheart-red">✔</span></td>
        <td><span class="restheart-red">✔</span></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Access Manager with DSL permissions on MongoDB</td>
      </tr>
      <tr>
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

<div class="editions-matrix mt-5">
    <div class="comparison">

  <table>
    <thead>
      <tr>
        <th class="tl tl2"></th>
        <th colspan="4" class="qbse">
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
        </th>
        <th class="compare-heading restheart-version p-3">
          <a class="d-block" href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>Platform PE</strong></a>
        </th>
        <th class="compare-heading restheart-version p-3">
          <a class="d-block" href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>Platform EE</strong></a>
        </th>
        <th class="compare-heading restheart-version p-3">
          <a class="d-block" href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}"><strong>Platform OEM</strong></a>
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
        <td colspan="4">Support</td>
      </tr>
      <tr>
        <td>Support</td>
        <td>Community support on Github and Stackoverflow
        <div class="small text-muted">No SLA or commitment</div>
        </td>
        <td>Priority bug fixing only</td>
        <td>Dedicated support</td>
        <td>Dedicated support</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Pricing</td>
      </tr>
      <tr class="compare-row">
        <td>Pricing</td>
        <td>Free</td>
        <td>30-Day Free Trial then USD 499
          <div class="small text-muted">Perpetual license with 1 year of support and upgrade.</div>
          <div class="small text-muted"><a href="/get#licensing-faq">Licensing FAQ</a></div>
        </td>
        <td>Negotiable</td>
        <td>Negotiable</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td colspan="4">Purchase</td>
      </tr>
      <tr>
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
      <tr class="compare-row">
        <td>Obtain</td>
        <td>
          <a href="{{ "/get" | prepend: site.baseurl }}"><button style="1" type="button" class="pl-3 pr-3 btn btn-danger">GET</button></a>
        </td>
        <td>
          <a href="{{ "/get#platform" | prepend: site.baseurl }}"><button style="1" type="button" class="pl-3 pr-3 btn btn-danger">GET</button></a>
        </td>
        <td><a href="mailto:ask@restheart.org?subject=Commercial request about RESTHeart EE">Contact</a></td>
        <td><a href="mailto:ask@restheart.org?subject=Commercial request about RESTHeart OEM">Contact</a></td>
      </tr>
    </tbody>
  </table>

</div>
</div>

{% include roi-calculator.html %}
