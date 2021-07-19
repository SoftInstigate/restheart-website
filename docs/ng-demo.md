---
title: RESTHeart Angular demo
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [A Simple Web Application](#a-simple-web-application)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{: mt-4}
## A Simple Web Application

This is a very simple [Angular](https://angular.io) Web Application hosted at [ng-demo.restheart.org](https://ng-demo.restheart.org). It shows a table of *message* documents stored in a MongoDB collection and provides a simple form to create a new *message* document.

{: .bs-callout.bs-callout-info}
Click on `Editor` button below and open the code of `service.ts`. You'll see how is easy interacting with the RESTHeart API!

<div id="ng-demo"></div>

<script type="text/javascript">
StackBlitzSDK.embedGithubProject('ng-demo', 'SoftInstigate/restheart-ng-demo', {
  openFile: 'src/app/service.ts',
  view: 'preview',
  width: "100%",
  height: "660px",
  hideNavigation: true,
  forceEmbedLayout: true
});
</script>

{: .bs-callout.bs-callout-info}
Source code is available at `restheart-ng-demo`  official [Github repository](https://github.com/SoftInstigate/restheart-ng-demo)!

For a more complete Angular application that uses exactly the same REST API, please have a look at our [Webchat example](/docs/try).

</div>
