---
layout: default
---

<section id="top">
    <section class="my-0">
        <div class="pt-4 ml-3 ml-md-5 text-7vh text-lightcyan text-break"><strong>REST</strong>HEART</div>
        <div class="mt-2 ml-3 ml-md-5 text-2_5vh text-lightcyan text-break">NoCoding and NoSQL Platform</div>
        <div class="mt-2 ml-3 ml-md-5 text-2vh text-lightcyan text-break">for MongoDB</div>
    </section>
</section>

<section class="cd-intro mt-5 mb-0">
    <h1 class="cd-headline d-block justify-content-center letters type">
        <span class="cd-words-wrapper waiting restheart-red">
            <b class="is-visible">REST microservice for MongoDB</b>
            <b>NoCoding, it is ready-to-use!</b>
            <b>Supports all features of MongoDB</b>
            <b>Handle data for Mobile Apps</b>
            <b>Develop Web Services</b>
            <b>Publish Content to the Web</b>
            <b>Handle users and permissions</b>
            <b>Available as binary package and Docker image</b>
            <b>Put data access under control</b>
            <b>Stream real-time data with WebSockets</b>
            <b>Integrate with MongoDB</b>
            <b>Notify clients with Hooks</b>
            <b>Create Open Data solutions</b>            
            <b>Threat protection at every layer</b>
        </span>
    </h1>
    <div class="header__desc restheart-red">For developers with deadlines!</div>
    <div class="d-flex justify-content-center">
        <a href="#usecases" class="btn ml-1 mt-3 btn-md">LEARN
            MORE</a>
    </div>
</section>

<div class="d-flex w-100 justify-content-center mt-5 mb-2">
    <div class="card w-100 w-md-50 mr-lg-5 ml-lg-5" style="width: 18rem">
        <h5 class="card-header text-center rh4-card-header"><strong>Latest version</strong></h5>
        <!-- http://avtanski.net/projects/lcd/ -->
        <img class="mx-auto mt-4 d-block img-responsive" src="/images/4.1.png" alt="RESTHeart 4.1">
        <div class="card-body">
            <div class="d-flex justify-content-center">
                <a href="{{ "/get" | prepend: site.baseurl }}"
                    class="btn w-50 mt-2 ml-2 btn-md">Download</a>
            </div>
        </div>
    </div>
</div>

<div class="jumbotron jumbotron-fluid bg-red text-white text-center mt-5">
    <div class="lead">Join us on our weekly <strong>Happy Hour</strong> video chat about RESTHeart.</div>
    <a href="{{ "/support" | prepend: site.baseurl }}" class="btn btn-o-white mt-3 btn-m">More info</a>
</div>

<section id="trusted-by">
    <div class="row mx-0">
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
                <svg class="call-to-action__icon">
                    <use xlink:href="/images/sprite.svg#lamp" /></svg>
                <h2 class="call-to-action__title">Fully Supported</h2>
                <p class="call-to-action__desc">Our dedicated support connects you with the engineers that develop
                    RESTHeart to seamlessly run production environments. RESTHeart OSS is supported by our active
                    community on public channels like github and stackoverflow.</p>
                <a class="btn btn-o" href="/support">SUPPORT</a>
            </div>
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__second">
                <svg class="call-to-action__icon">
                    <use xlink:href="/images/sprite.svg#thumb" /></svg>
                <h2 class="call-to-action__title">RESTHeart OSS and RESTHeart Platform</h2>
                <p class="call-to-action__desc"><strong>RESTHeart OSS</strong> is distributed under the Open Source GNU
                    AGPL v3 license. <strong>RESTHeart Platform</strong> is shipped with additional enterprise grade
                    features under a business-friendly commercial license.</p>
                <a class="btn btn-o-white" href="/editions">EDITIONS</a>
            </div>
        </div>
    </div>
</section>

<div class="anchor-offset" id="usecases">
</div>
<section id="usecases" class="slice bg-white">
    <div class="container">
        <h1 class="text-center restheart-red">Use Cases</h1>
        {% include use-cases.html %}
    </div>
</section>

<section id="examples" class="slice bg-white">
    <div class="container-fluid">
        <h1 class="text-center restheart-red">Runs anywhere</h1>
    </div>
    {% include examples.html %}
</section>

<section class="chart" id="chart">

    {% include docker_pull_chart.html %}

</section>

<link rel="stylesheet" href="assets/animated-headline/css/style.css"> <!-- Resource style -->
<script src="assets/animated-headline/js/modernizr.js"></script> <!-- Modernizr -->
<script src="assets/animated-headline/js/main.js"></script>