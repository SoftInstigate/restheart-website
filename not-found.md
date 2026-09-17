---
title: Not Found
layout: page
sitemap: false
---

{: .text-center }
## This is not the page you are looking for

<p class="text-center" id="missing-path"></p>

<p class="text-center">Look for it in the <a href="/docs">documentation</a>, or ask Sophia, the chat button in the corner.
Building an app rather than running RESTHeart yourself? <a href="https://cloud.restheart.com/docs/getting-started?utm_source=restheart.org&utm_medium=404&utm_content=not-found">RESTHeart Cloud</a> has it hosted.</p>

<script>
  // The 404 page sends the missing path here, so it can be reported: in
  // Plausible it shows up as the "404" goal, with the path as a property.
  (function () {
    var from = new URLSearchParams(window.location.search).get('from');
    if (!from) return;
    var el = document.getElementById('missing-path');
    if (el) el.textContent = 'Nothing lives at ' + from;
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    window.plausible('404', { props: { path: from } });
  })();
</script>
<div class="mb-5">&nbsp;</div>
<div class="mb-5">&nbsp;</div>
<div class="mb-5">&nbsp;</div>
<div class="mb-5">&nbsp;</div>
