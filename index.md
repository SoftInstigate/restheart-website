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
        <h5 class="card-header text-center rh4-card-header"><strong>RESTHeart 4.1 is out!</strong></h5>
        <!-- http://avtanski.net/projects/lcd/ -->
        <img class="mx-auto mt-4 d-block" src="/images/4.1.png" alt="RESTHeart 4.1">
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

<section id="trusted-by">
    <div class="row">
        <div id="customers" class="container-fluid my-2">
            <h2 class="text-center restheart-red">
                Trusted by Startups and Corporations
            </h2>
            <div class="customer-logos">
                <div class="slide my-2"><img src="/images/customers/ng-logo.png"></div>
                <div class="slide my-2"><img src="/images/customers/aci-infomobility.png"></div>
                <div class="slide my-2"><img src="/images/customers/unisys.png"></div>
                <div class="slide my-2"><img src="/images/customers/e-spirit.png"></div>
                <div class="slide my-2"><img src="/images/customers/autoinrete.png"></div>
                <div class="slide my-2"><img src="/images/customers/croqqer-logo.png"></div>
                <div class="slide my-2"><img src="/images/customers/radiotraffic.png"></div>
                <div class="slide my-2"><img src="/images/customers/nativa.png"></div>
                <div class="slide my-2"><img src="/images/customers/conquest.png"></div>
            </div>
        </div>
    </div>
</section>

<section id="call-to-action" class="call-to-action">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__first">
                <svg class="call-to-action__icon"><use xlink:href="/images/sprite.svg#lamp" /></svg>
                <h2 class="call-to-action__title">Fully Supported</h2>
                <p class="call-to-action__desc">Our dedicated support connects you with the engineers that develops RESTHeart to seamlessly run RESTHeart Platform in production environments while RESTHeart OSS is supported by our active community on public channels like github and stackoverflow.</p>
                <a class="btn btn-o" href="/support">SUPPORT</a>
            </div>
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__second">
                <svg class="call-to-action__icon"><use xlink:href="/images/sprite.svg#thumb" /></svg>
                <h2 class="call-to-action__title">RESTHeart OSS and RESTHeart Platform</h2>
                <p class="call-to-action__desc"><strong>RESTHeart OSS</strong> is distributed under the Open Source GNU AGPL v3 license and <strong>RESTHeart Platform</strong> is shipped with additional enterprise grade features and is available under a business-friendly commercial license.</p>
                <a class="btn btn-o-white" href="/editions">EDITIONS</a>
            </div>
        </div>
    </div>
</section>

<section id="usecases" class="slice bg-white">
    <div class="container">
        <h1 class="text-center restheart-red">Use Cases</h1>
        {% include use-cases.html %}
    </div>
</section>

<section id="examples" class="slice bg-white">
    <div class="container-fluid">
        <h1 class="text-center restheart-red">Run anywhere</h1>
    </div>
    {% include examples.html %}
</section>

<section class="chart" id="chart">

{% include docker_pull_chart.html %}

</section>
