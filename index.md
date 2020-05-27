---
layout: default
---

<section id="top">
    <section class="my-0">
        <div class="pt-4 ml-3 ml-md-5 top-1 text-lightcyan text-break"><strong>REST</strong>HEART</div>
        <h2 class="mt-2 ml-3 ml-md-5 top-2 text-lightcyan text-break">REST API for MongoDB</h2>
        <h5 class="mt-2 ml-3 ml-md-5 top-2 text-break text-mark" style="color:orange"><i>For developers with deadlines</i></h5>
    </section>
</section>

<section id="call-to-action" class="call-to-action">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__first">
                <h2 class="call-to-action__title">What it does</h2>
                <p>RESTHeart connects to <strong>MongoDB</strong> and allows to access the database via a complete set of <strong>REST APIs</strong>.</p>
                <ul class="">
                    <li>Automatic data persistence via MongoDB.</li>
                    <li>Full REST API with JSON.</li>
                    <li>Applicative authentication and authorization.</li>
                </ul>
                <a href="{{ "/docs" | prepend: site.baseurl }}" class="btn bg-info ml-1 mt-3 my-0 btn-md">LEARN MORE</a>
            </div>
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__first">
                <h2 class="call-to-action__title">What it is</h2>
                <p>RESTHeart is a modern backend for Web and Mobile apps, designed to radically simplify server-side development and deployment.</p>
                <ul class="">
                    <li>Ready-to-run stateless Microservice.</li>
                    <li>Distributable as a Docker container.</li>
                    <li>Easily deployable both on Cloud and on-premises.</li>
                </ul>
                <a href="{{ "/get" | prepend: site.baseurl }}" class="btn bg-primary ml-1 mt-3 btn-md">DOWNLOAD</a>
            </div>
        </div>
    </div>
</section>

<section class="cd-intro mt-0 mb-2">
    <h1 class="cd-headline d-block justify-content-center letters type">
        <span class="cd-words-wrapper waiting restheart-red">
            <b class="is-visible">REST microservice for MongoDB</b>
            <b>Ready-to-use, no server-side coding</b>
            <b>Supports all features of MongoDB</b>
            <b>Data API for Mobile Apps</b>
            <b>Develop REST Web Services</b>
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
</section>

<section id="examples" class="slice bg-white">
    {% include examples.html %}
</section>

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

<section class="chart mt-3" id="chart">

    {% include docker_pull_chart.html %}

</section>

<div class="jumbotron bg-white text-white text-center mt-3 mb-0 py-4">
    <a href="https://mongodbworld2020.sched.com/event/b2Hz">
        <img src="/images/MDB-Live-Speaker-Badge-Horizontal.png" class="img-responsive"/>
    </a>
</div>

<link rel="stylesheet" href="assets/animated-headline/css/style.css"> <!-- Resource style -->
<script src="assets/animated-headline/js/modernizr.js"></script> <!-- Modernizr -->
<script src="assets/animated-headline/js/main.js"></script>
