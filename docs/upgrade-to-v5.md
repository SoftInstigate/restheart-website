---
layout: docs
title: Upgrade to RESTHeart v5
---

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress.html %}

RESTHeart v5 is a major refactoring of the internal APIs. With this version we focused on these things:

1. RESTHeart is back a **single unit of deployment**, no more need to run a separate security layer (it's muck like it was RESTHeart v3). Unzip the archive and run it.
2. It's now much easier to extend the API with **plugins** and **interceptors** (see some [examples](https://github.com/SoftInstigate/restheart-examples)). You can build and deploy your own Web Services with few line of code.
3. Promote plain JSON as the primary representation format and demote [HAL](http://stateless.co/hal_specification.html) as a secondary option (most developers just want to use their own format).

</div>
