---
title: Try RESTHeart Online
layout: docs
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

This example application is developed with [Angular](https://angular.io). The backend is based on RESTHeart's [Change Streams](https://restheart.org/docs/change-streams/) to provide an instant, zero lines of code API for a realtime chat application. In turn, RESTHeart leverages MongoDB's Change Streams to instantly notify clients about database modifications through WebSockets.

<iframe src="https://chat.restheart.org" width="100%" height="600px" title="restheat-ng-demo"></iframe>

{: .bs-callout.bs-callout-info}
The source code is available at `restheart-webchat`  official Github [repository](https://github.com/SoftInstigate/restheart-webchat)! 


## How does it work?

<div style="display: flex; justify-content: center">
<img src="/assets/audio/WEBCHAT-DIAGRAMMA.gif" class="img-fluid">
</div>


## Send a message with curl

Chat messages are sent via POST requests to `https://demo.restheart.org/messages`

Therefore you can also send a message with `curl` with the following request.

<div class="row mt-3">
    <div class="col-lg-3 pt-2">
        <p><strong>Create</strong> a document with <br>
        <code>POST /messages</code></p>
    </div>
    <div class="col-lg-9">
{% highlight bash %}

$ curl -i -H "Content-Type:application/json" -X POST https://demo.restheart.org/messages/ -d '{"from":"you", "message":"RESTHeart rocks!!" }'

HTTP/1.1 201 Created

{% endhighlight %}
    <a href="http://restninja.io/share/1fd808b1f51037c8b2b36d43d6bc315a0325029c/3" class="btn btn-sm float-right" target="_blank">Open on rest ninja</a>
    </div>
</div>

{: .bs-callout.bs-callout-info}
To see another example visit [A simple Angular demo](/docs/ng-demo/)!

</div>
