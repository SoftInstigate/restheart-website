---
layout: page-notitle
title: Quick Start
permalink: /quick-start.html
features:
- href: features/dbs-collections.html
  title: DB and Collections  
  anchor: db-coll
- href: features/documents.html
  title: Documents
  anchor: docs
- href: features/files.html
  title: Files
  anchor: files
---

{% for feature in page.features %}
<div id="{{feature.anchor}}" class="section" style="margin-top: 25px">
    <h1>{{feature.title}}</h1>
    {% include_relative {{feature.href}} %}
</div>
{% endfor %}