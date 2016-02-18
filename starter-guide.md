---
layout: page-notitle
title: Starter Guide
permalink: /starter-guide.html
features:
- href: features/manage-dbs-collections.html
  anchor: db-coll
  title: DB and Collections
- href: features/documents.html
  title: Documents
  anchor: docs
- href: features/files.html
  title: Files
  anchor: files
- href: features/aggregations.html
  title: Aggregation Operations
  anchor: aggrs
- href: features/validation.html
  title: Validation
  anchor: validation
---

<div style="margin-top: 25px"></div>

{% for feature in page.features %}
<div id="{{feature.anchor}}" class="section">
    <h2><strong>{{feature.title}}</strong></h2>
{% include_relative {{feature.href}} %}
</div>
{% endfor %}