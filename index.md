---
layout: default 
---
<section id="top">
    <div class="container text-center header">
        <img src="{{ 'images/rh_logo_vert.png' | prepend: site.baseurl }}" class="img-responsive" width="256">
        <p class="header__desc">The REST API Server for MongoDB</p>
        <h2 class="header__title">Build applications faster, zero coding required!</h2>
        <a href="/learn/tutorial" class="btn btn-md">Quickstart</a>
        <a href="https://github.com/SoftInstigate/restheart/" class="btn btn-md">Source code</a>
        <p>
            <img height="28" class="align-top rounded" alt="Docker Pulls" src="https://img.shields.io/docker/pulls/softinstigate/restheart.svg?style=flat-square">
            <a href="https://twitter.com/softinstigate" class="twitter-follow-button" data-show-count="false" data-size="large" data-show-screen-name="false">Follow us on Twitter</a>
            <a href="https://twitter.com/share" class="twitter-share-button" data-text="Check out RESTHeart, the open source REST API Server for MongoDB" data-via="softinstigate" data-size="large" data-related="softinstigate" data-hashtags="RESTHeart">Tweet</a>
        </p>
    </div>
</section>

<section id="usecases" class="slice bg-light">
    <div class="container-fluid">
        <h1 class="text-center">Use Cases</h1>
    </div>
    <div class="container-fluid slice__features">
        <div class="row">
            <article class="col-lg-4">
                <section class="newsText">
                    <div class="newsText__icon">
                        <svg><use xlink:href=" /images/sprite.svg#mongodb" /></svg>
                    </div>
                    <h2>REST API for MongoDB</h2>
                    <h3>RESTHeart unlocks <strong>all the features</strong> of MongoDb via HTTP. Queries, Bulk Updates, GridFs, Aggregations, Map-reduce functions, Replica Sets, Shards, Indexing and many more are accessible via a simple <strong>RESTful API</strong>.</h3>
                    <h3>
                        <strong>No server-side development</strong> is required so you can focus on building your <strong>Web</strong> or <strong>Mobile apps</strong> or <strong>Enterprise Integration System</strong>, as all the <strong>database</strong> logic is available out of the box.
                    </h3>
                    <h3>
                        RESTHeart also provides strong <strong>API & Web Security</strong> models for <strong>User Authentication</strong>, <strong>Authorization</strong> and <strong>Caching</strong>.
                    </h3>
                </section>
            </article>
            <article class="col-lg-4">
                <section class="newsText">
                    <div class="newsText__icon">
                        <svg><use xlink:href="/images/sprite.svg#feather" /></svg>
                    </div>
                    <h2>Content Management</h2>
                    <h3>
                    RESTHeart allows to effectively manage and aggregate content and its metadata, such as <strong>images</strong>, <strong>comments</strong>, <strong>tags</strong>, <strong>categories</strong>, <strong>geolocalized data</strong>, <strong>audios</strong> and <strong>videos</strong>, delivering it via a solid <strong>REST API</strong>.
                    </h3>
                    <h3>
                    You can build Single Page Applications with <strong>Angular</strong>, <strong>React</strong>, <strong>Vue</strong> frameworks and <strong>iOS</strong> and <strong>Android</strong> Mobile apps much effectively, because you can focus on creating <strong>beautiful</strong> User Interfaces for your users.
                    </h3>
                    <h3>
                    RESTHeart is a perfect <strong>API provider for <a href="https://jamstack.org">JAMstack</a></strong> Web architectures, where it fits much more naturally that any WordPress customization.
                    </h3>
                </section>
            </article>
            <article class="col-lg-4">
                <section class="newsText">
                    <div class="newsText__icon">
                        <svg><use xlink:href="/images/sprite.svg#plane" /></svg>
                    </div>
                    <h2>Open Data and IoT</h2>
                    <h3>RESTHeart is a perfect fit for <strong>Open Data</strong> and <strong> Internet of Things</strong> solutions.
                    Data can be uploaded to RESTHeart via <strong>JSON</strong> calls or <strong>CVS</strong> files and made immediately available through the <strong>REST API</strong>.
                    </h3>
                    <h3>
                    RESTHeart also leverages <strong>MongoDb's Geospatial support</strong> and stores <a href="https://en.wikipedia.org/wiki/GeoJSON"><strong>GeoJSON</strong></a> objects without the need to write complicated server-side code: <strong>geometries</strong> are then available to clients such as <strong>Google Maps</strong> via its API.
                    </h3>
                    <h3>
                    RESTHeart also handles the <a href="https://developers.google.com/transit/gtfs/"><strong>GTFS</strong></a> format for <strong>public transportation schedules</strong> thanks to a <a href="mailto:info@softinstigate.com?subject=GTFS%20plugin%20Inquiry">commercial plugin</a>.
                    </h3>
                </section>
            </article>
        </div>
    </div>
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
                <a class="btn btn-o-white" href="/license">Commercial licenses</a>
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

<section id="licenses">
    <div class="container mt-1 mb-5">
        <h1 class="text-center">Licenses</h1>
        {% include licenses-table.html %}
    </div>
</section>

<section class="chart" id="chart">

{% include docker_pull_chart.html %}

</section>