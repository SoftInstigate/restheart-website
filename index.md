---
layout: default 
---
<div class="container text-center header">
    <img src="{{ " images/rh_logo_vert.png " | prepend: site.baseurl }}" class="img-responsive" width="256">
    <p class="header__desc">The Web API for MongoDB</p>
    <h2 class="header__title">Build applications faster, zero coding required!</h2>

    <a href="/learn/tutorial" class="btn btn-lg">Quickstart</a>
    <p>
        <a href="https://twitter.com/softinstigate" class="twitter-follow-button" data-show-count="false" data-size="large" data-show-screen-name="false">Follow us on Twitter</a>
        <a href="https://twitter.com/share" class="twitter-share-button" data-text="Check out RESTHeart, the open source Web API Server for MongoDB" data-via="softinstigate" data-size="large" data-related="softinstigate" data-hashtags="RESTHeart">Tweet</a>
        <iframe src="https://ghbtns.com/github-btn.html?user=softinstigate&repo=restheart&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160" height="30"></iframe>
    </p>
</div>

<section class="slice bg-light" id="what">
    <div class="container-fluid slice__features">
        <div class="row">
            <div class="col-sm-6 text-center mb-3">
                <h3 class="pt-3">
                    Supported by
                    an active Community and <a href="/services">
                    Professional Services</a>
                </h3>
            </div>
            <div class="col-sm-6 text-center  mb-3">
                <h3 class="pt-3">
                    Available under the Open Source AGPL and the
                    <a href="/license">Commercial License</a>
                </h3>
            </div>
            <article class="col-lg-3">
                <section class="newsText">
                    <div class="newsText__icon">
                        <svg><use xlink:href=" ../../../images/sprite.svg#mongodb" /></svg>
                    </div>
                    <h2>MongoDB</h2>
                    <h4>RESTHeart is the
                        <strong>
                            <a href="https://docs.mongodb.com/ecosystem/tools/http-interfaces/#restheart-java" target="_blank">leading Web API</a>
                        </strong> for
                        <strong>MongoDB</strong>.
                    </h4>
                    <h4>
                        <strong>Just run it</strong> to open your MongoDb to the Web.
                    </h4>
                    <h4>
                        The API unlocks all the features of MongoDb, including 
                        <strong>queries</strong>,
                        <strong>bulk updates</strong>,
                        <strong>GridFs</strong>,
                        <strong>aggregations</strong>,
                        <strong>replica sets</strong>,
                        <strong>sharding</strong> and more...
                    </h4>
                </section>
            </article>
            <article class="col-lg-3">
                <section class="newsText">
                    <div class="newsText__icon">
                        <svg><use xlink:href="../../../images/sprite.svg#plane" /></svg>
                    </div>
                    <h2>Fast Dev</h2>
                    <h4>
                        <strong>No server side development</strong> is required and you can <strong>focus on building you application</strong>.
                    </h4>
                    <h4>
                        For complex cases, a simple and modern framework allows <strong>extending the API</strong>.
                    </h4>
                    <h4>
                        RESTHeart provides out-of-the-box <strong>User Authentication</strong> and <strong>Authorization</strong>
                    </h4>
                    <h4>
                        The <strong>Docker Container</strong> is available to get it up and running in minutes.
                    </h4>
                </section>
            </article>
            <article class="col-lg-3">
                <section class="newsText">
                    <div class="newsText__icon">
                        <svg><use xlink:href="../../../images/sprite.svg#feather" /></svg>
                    </div>
                    <h2>Fast &amp; Light</h2>
                    <h4>
                        <strong>High throughput</strong> check the
                        <a href="https://restheart.org/learn/performances">performance tests</a>.
                    </h4>
                    <h4>
                        <strong>Lightweight</strong> ~15Mb footprint, low RAM usage, starts instantly.
                    </h4>
                    <h4>
                        <strong>Horizontally Scalable</strong> with
                        <strong>Stateless Architecture</strong> and full support for MongoDB
                        <strong>replica sets and shards</strong>.
                    </h4>
                    <h4>
                        <strong>&#181;Service</strong>: it does one thing and it does it well.
                    </h4>
                </section>
            </article>
            <article class="col-lg-3">
                <section class="newsText">
                    <div class="newsText__icon">
                        <svg><use xlink:href="../../../images/sprite.svg#torch" /></svg>
                    </div>
                    <h2>Prod</h2>
                    <h4>
                        High quality
                        <strong>Documentation</strong> and active development
                        <strong>Community</strong>.
                    </h4>
                    <h4>
                        <a href="/services">
                            <strong>Professional Services</strong>
                        </a>
                        are available from SoftInstigate, the company behind RESTHeart.
                    </h4>
                    <h4>
                        For the Enterprise, the
                        <a href="/license">
                            <strong>Commercial License</strong>
                        </a> 
                        overcomes the conditions of the AGPL.
                    </h4>
                </section>
            </article>
        </div>
    </div>
</section>

{% comment %}
Remove the comment tags to include the file
{% include examples.html %}
{% endcomment %}

<section class="call-to-action">
    <div class="container">
        <div class="row">
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__first">
                <svg class="call-to-action__icon"><use xlink:href="../../../images/sprite.svg#lamp" /></svg>
                <h2 class="call-to-action__title">SUPPORTED BY AN ACTIVE COMMUNITY AND PROFESSIONAL SERVICES</h2>
                <p class="call-to-action__desc">Professional Services help you on using the RESTHeart standard API, developing RESTHeart extensions, customizing RESTHeart, priority bug fixing, configuration, best practices, etc...</p>
                <a class="btn btn-o" href="/services">PROFESSIONAL SERVICES</a>
            </div>
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__second">
                <svg class="call-to-action__icon"><use xlink:href="../../../images/sprite.svg#thumb" /></svg>
                <h2 class="call-to-action__title">AVAILABLE UNDER THE OPEN SOURCE AGPL AND THE COMMERCIAL LICENSE</h2>
                <p class="call-to-action__desc">RESTHeart is distributed under the Open Source GNU AGPL v3. If use of our product under the AGPL v3 does not satisfy your organization’s legal department, a commercial licenses is available.</p>
                <a class="btn btn-o-white" href="/license#commercial-license">Commercial license</a>
            </div>
        </div>
    </div>
</section>

<section class="chart" id="chart">

{% include docker_pull_chart.html %}

</section>