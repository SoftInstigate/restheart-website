---
layout: doc-page-md
title: RESTHeart Concepts
permalink: /docs/concepts.html
menu:
 id: 4
toc:
 - href: /docs/resource-types.html
   title: Resource Types
 - href: /docs/piping-resources.html
   title: Piping in resources
 - href: /docs/resource-uri.html
   title: Resource URI
 - href: /docs/resource-representation-format.html
   title: Resource Representation Format
 - href: /docs/authentication.html
   title: Authentication
 - href: /docs/etag.html
   title: ETag
 - href: /docs/request-execution-optimization.html
   title: Request Execution Optimization
 - href: /docs/relationships.html
   title: Relationships
 - href: /docs/representation-transformation.html
   title: Representation Transformation
 - href: /docs/schema-check.html
   title: Schema Check
---

{% for item in page.toc %}

## [{{item.title}}]({{item.href}})

{% endfor %}