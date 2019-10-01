---
layout: default
---

<section id="top">
    <div class="container text-center header pb-3">
        <img src="{{ 'images/rh_logo_vert.png' | prepend: site.baseurl }}" class="img-responsive" width="198">
        <p class="header__desc">The Content REST API for MongoDB</p>
        <h2 class="header__title">For developers who'd rather spend their time building apps than APIs</h2>
    </div>
</section>

<div class="d-flex w-100 justify-content-center mb-2">
    <div class="card w-100 w-md-50 mr-lg-5 ml-lg-5" style="width: 18rem">
        <h5 class="card-header text-center rh4-card-header"><strong>RESTHeart 4 is out!</strong></h5>
        <img class="mx-auto mt-4 d-block" src="/images/4.png" alt="RESTHeart 4" width="80px">
        <div class="card-body">
            <div class="d-flex justify-content-center">
                <a href="{{ "/get" | prepend: site.baseurl }}" class="btn w-50 mt-2 mr-2 btn-m">GET</a>
                <a href="{{ "/docs/upgrade-to-v4" | prepend: site.baseurl }}" class="btn w-50 mt-2 ml-2 btn-md">UPGRADE</a>
            </div>
        </div>
    </div>
</div>

<div class="jumbotron jumbotron-fluid bg-red text-white text-center mt-5">
    <div class="lead">Join us on our weekly <strong>Happy Hour</strong> video chat about RESTHeart.</div> 
    <a href="{{ "/support" | prepend: site.baseurl }}" class="btn btn-o-white mt-3 btn-m">More info</a>
</div>

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
                <a class="btn btn-o-white" href="/editions">Commercial licenses</a>
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
