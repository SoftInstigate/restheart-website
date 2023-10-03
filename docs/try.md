---
title: Try RESTHeart Online
layout: docs
menu: overview
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

- [RESTHeart Webchat](#restheart-webchat)
- [How does it work?](#how-does-it-work)
- [Send a message with curl](#send-a-message-with-curl)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{: mt-4}
## RESTHeart Webchat

This example application is developed with [Angular](https://angular.io). The backend is based on RESTHeart's [Change Streams](https://restheart.org/docs/mongodb-websocket) to provide an instant, zero lines of code API for a realtime chat application. In turn, RESTHeart leverages MongoDB's Change Streams to instantly notify clients about database modifications through WebSockets.

Below there's the demo app (full web app available at [chat.restheart.org](https://chat.restheart.org)), choose a nickname to start:

<iframe src="https://chat.restheart.org" width="100%" height="600px" title="restheat-ng-demo"></iframe>

{: .bs-callout.bs-callout-info}
The source code is available at `restheart-webchat`  official Github [repository](https://github.com/SoftInstigate/restheart-webchat)! 


## How does it work?

<div style="display: flex; justify-content: center">
<img src="/images/webchat-diagram.gif" class="img-fluid">
</div>


## Send a message with curl

Chat messages are sent via POST requests to `https://demo.restheart.org/messages`

Therefore you can also send a message with `curl` with the following request or <a href="http://restninja.io/share/1fd808b1f51037c8b2b36d43d6bc315a0325029c/3" class="btn btn-sm" target="_blank">execute it on restninja</a>

```bash
$ curl -i -H "Content-Type:application/json" -X POST https://demo.restheart.org/messages/ -d '{"from":"you", "message":"RESTHeart rocks!!" }'

HTTP/1.1 201 Created
```

{: .bs-callout.bs-callout-info .mt-5}
To see another example visit [A simple Angular demo](/docs/ng-demo/)!

</div>
