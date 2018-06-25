---
layout: docs
title: Quick Reference
permalink: /learn/quick-reference.html
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
<div id="{{feature.anchor}}" class="section mt-5">
    <h1>{{feature.title}}</h1>
    {% include_relative {{feature.href}} %}
</div>
{% endfor %}