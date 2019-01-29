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
            <a href="https://twitter.com/softinstigate" class="twitter-follow-button" data-show-count="false" data-size="large" data-show-screen-name="false">Follow us on Twitter</a>
            <a href="https://twitter.com/share" class="twitter-share-button" data-text="Check out RESTHeart, the open source REST API Server for MongoDB" data-via="softinstigate" data-size="large" data-related="softinstigate" data-hashtags="RESTHeart">Tweet</a>
            <iframe src="https://ghbtns.com/github-btn.html?user=softinstigate&repo=restheart&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160" height="30"></iframe>
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
                    <h4>RESTHeart unlocks <strong>all the features</strong> of MongoDb, including queries, bulk updates, GridFs, Aggregations and many more.</h4>
                    <h4>
                        <strong>No server-side development</strong> is required and you can focus on building your <strong>Web</strong> or <strong>Mobile</strong> applications, saving at least <strong>80%</strong> of usual server-side programming efforts.
                    </h4>
                    <h4>
                        For complex cases, a simple <strong>Java</strong> framework allows to <strong> extend the default API</strong> or create <strong>custom data transformers</strong>.
                    </h4>
                    <h4>
                        RESTHeart provides out-of-the-box <strong>Strong security</strong> with <strong>User Authentication</strong>, <strong>Authorization</strong> and <strong>Caching</strong>.
                    </h4>
                    <h4>
                        <strong>Scalable</strong>, <strong>Lightweight</strong> and
                        <strong>Stateless</strong> Architecture, with full support for MongoDB
                        <strong>Replica Sets</strong> and <strong>Shards</strong>.
                    </h4>
                </section>
            </article>
            <article class="col-lg-4">
                <section class="newsText">
                    <div class="newsText__icon">
                        <svg><use xlink:href="/images/sprite.svg#feather" /></svg>
                    </div>
                    <h2>Content Management</h2>
                    <h4>
                    RESTHeart allows to effectively <strong>manage</strong>, <strong>collect</strong> and <strong>aggregate content</strong> and then deliver it via a <strong>RESTful API</strong>.
                    </h4>
                    <h4>
                    It exposes MongoDB's <strong>flexible document schema</strong> automatically, to create and incorporate user-generated content, such as <strong>images</strong>, <strong>comments</strong>,  <strong>tags</strong>, <strong>geolocalized data</strong> and <strong>videos</strong>.</h4>
                    <h4>
                    Single Page Applications with <strong>Angular</strong>, <strong>React</strong> or <strong>Vue</strong> and <strong>iOS</strong> or <strong>Android</strong> Mobile applications can be built much faster, because you can focus on the User Interface only.
                    </h4>
                    <h4>
                    RESTHeart is a perfect <strong>API provider for <a href="https://jamstack.org">JAMstack</a></strong> Web architectures, where it fits much more naturally that any WordPress customisation.
                    </h4>
                </section>
            </article>
            <article class="col-lg-4">
                <section class="newsText">
                    <div class="newsText__icon">
                        <svg><use xlink:href="/images/sprite.svg#plane" /></svg>
                    </div>
                    <h2>Geospatial Data</h2>
                    <h4>
                    RESTHeart extends <strong>MongoDb's Geospatial support</strong>. It stores and searches <a href="https://en.wikipedia.org/wiki/GeoJSON"><strong>GeoJSON</strong></a> objects with <strong>plain HTTP requests</strong>: no need to write complicated server-side code!
                    </h4>
                    <h4>
                    Commercial editions offer <strong>UI components</strong> to <strong>design geometries</strong> (points, lines, polygons) and make them available to <strong>Google Maps</strong> clients directly as GeoJSON objects.
                    </h4>
                    <h4>
                    RESTHeart handles <a href="https://developers.google.com/transit/gtfs/"><strong>GTFS</strong></a> data, a common format for <strong>public transportation schedules</strong> and associated geographic information.
                    </h4>
                    <h4>
                    Geospatial data can be uploaded to RESTHeart via JSON or <strong>CVS files</strong>: this makes it a perfect <strong>Open Data server</strong>, especially when Geospatial information must be published.</h4>
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
                <h2 class="call-to-action__title">SUPPORTED BY AN ACTIVE COMMUNITY AND PROFESSIONAL SERVICES</h2>
                <p class="call-to-action__desc">Professional Services help you on using the RESTHeart standard API, developing RESTHeart extensions, customizing RESTHeart, priority bug fixing, configuration, best practices, etc...</p>
                <a class="btn btn-o" href="/services">PROFESSIONAL SERVICES</a>
            </div>
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__second">
                <svg class="call-to-action__icon"><use xlink:href="/images/sprite.svg#thumb" /></svg>
                <h2 class="call-to-action__title">AVAILABLE UNDER THE OPEN SOURCE AGPL AND THE COMMERCIAL LICENSE</h2>
                <p class="call-to-action__desc">RESTHeart is distributed under the Open Source GNU AGPL v3. If use of our product under the AGPL v3 does not satisfy your organization’s legal department, a commercial licenses is available.</p>
                <a class="btn btn-o-white" href="/license">Commercial license</a>
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