---
layout: default 
---
<section id="top">
    <div class="container text-center header">
        <img src="{{ 'images/rh_logo_vert.png' | prepend: site.baseurl }}" class="img-responsive" width="256">
        <p class="header__desc">The REST API Server for MongoDB</p>
        <h2 class="header__title">Build applications faster, zero coding required!</h2>
        <a href="/docs/tutorial" class="btn btn-md">Quickstart</a>
        <a href="https://github.com/SoftInstigate/restheart/" class="btn btn-md">Source code</a>
        <p>
            <img height="27" class="align-top rounded" alt="Docker Pulls" src="https://img.shields.io/docker/pulls/softinstigate/restheart.svg?style=for-the-badge">
            <img height="27" class="align-top rounded" alt="GitHub All Releases" src="https://img.shields.io/github/downloads/softinstigate/restheart/total.svg?style=for-the-badge">   
            <!-- <a href="https://twitter.com/softinstigate" class="twitter-follow-button" data-show-count="false" data-size="large" data-show-screen-name="false">Follow us on Twitter</a>
            <a href="https://twitter.com/share" class="twitter-share-button" data-text="Check out RESTHeart, the open source REST API Server for MongoDB" data-via="softinstigate" data-size="large" data-related="softinstigate" data-hashtags="RESTHeart">Tweet</a> -->
        </p>
    </div>
</section>

<section id="usecases" class="slice bg-light">
    <div class="container-fluid">
        <h1 class="text-center">Use Cases</h1>
    </div>

    {% include use-cases.html %}
</section>

<section id="call-to-action" class="call-to-action">
    <div class="container">
        <div class="row">
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__first">
                <svg class="call-to-action__icon"><use xlink:href="/images/sprite.svg#lamp" /></svg>
                <h2 class="call-to-action__title">SUPPORTED BY THE COMMUNITY OR BY OUR PROFESSIONAL SERVICES</h2>
                <p class="call-to-action__desc">Our Professional Services can help you building RESTful APIs, data models, query optimizations, customizations and extensions, bug fixing, on cloud and on premises deployments, security and HA configurations.</p>
                <a class="btn btn-o" href="/services">PROFESSIONAL SERVICES</a>
            </div>
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__second">
                <svg class="call-to-action__icon"><use xlink:href="/images/sprite.svg#thumb" /></svg>
                <h2 class="call-to-action__title">AVAILABLE UNDER OPEN SOURCE OR COMMERCIAL LICENSES</h2>
                <p class="call-to-action__desc">RESTHeart is distributed under the Open Source GNU AGPL v3 license. If the usage of our product under the AGPL does not satisfy your organization’s legal requirements, business-friendly commercial licenses are also available.</p>
                <a class="btn btn-o-white" href="/versions">Commercial licenses</a>
            </div>
        </div>
        <div class="row">
            <div id="customers" class="container-fluid my-2">
                <h2 class="text-center">
                    Trusted by Startups and Corporations
                </h2>
                <div class="customer-logos">
                    <div class="slide my-2"><img src="/images/customers/ng-logo.png"></div>
                    <div class="slide my-2"><img src="/images/customers/aci-infomobility.png"></div>
                    <div class="slide my-2"><img src="/images/customers/unisys.png"></div>
                    <div class="slide my-2"><img src="/images/customers/croqqer-logo.png"></div>
                    <div class="slide my-2"><img src="/images/customers/radiotraffic.png"></div>
                    <div class="slide my-2"><img src="/images/customers/nativa.png"></div>
                    <div class="slide my-2"><img src="/images/customers/conquest.png"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<section id="examples" class="bg-white">
    <div class="container-fluid">
        <h1>&nbsp;</h1>
    </div>
{% include examples.html %}
</section>

<section class="chart" id="chart">

{% include docker_pull_chart.html %}

</section>