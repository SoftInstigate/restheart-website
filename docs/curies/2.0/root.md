---
layout: page-notopnav
title: root
permalink: /curies/2.0/root.html
---

## The Root resource

The Root resource is the API entry point, requests to Root URI allow get the list of existing databases.

The resource URI is <code>/</code>

### Allowed methods

{: .table }
**Method**|**Description**
------|-----------
GET   |Returns the <a href="paging.html">paginated</a> list of the databases

### Useful query parameters

{: .table }
**qparam**|**Description**|**applies to**
---------|--------
[page](paging.html)     | Data page to return (default 1)|GET
[pagesize](paging.html) | Data page size (default 100, maximum 1000; If equals to 0 only returns the db properties)|GET

## Documentation references

* [DB Resource](db.html)
* <a href="https://softinstigate.atlassian.net/wiki/x/SoCM" target="_blank">Reference Sheet</a>
* <a href="https://softinstigate.atlassian.net/wiki/x/ToCM" target="_blank">URI Format</a>