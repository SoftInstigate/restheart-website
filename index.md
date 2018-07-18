---
layout: default 
---
<div class="container text-center header">
    <img src="{{ " images/rh_logo_vert.png " | prepend: site.baseurl }}" class="img-responsive" width="256">
    <p class="header__desc">The Web API for MongoDB</p>
    <h2 class="header__title">RESTHeart connects to MongoDB and opens data to the Web via a simple RESTful API.</h2>

    <a href="/learn/tutorial" class="btn btn-lg">Quickstart</a>
    <p>
        <a href="https://twitter.com/softinstigate" class="twitter-follow-button" data-show-count="false" data-size="large" data-show-screen-name="false">Follow us on Twitter</a>
        <a href="https://twitter.com/share" class="twitter-share-button" data-text="Check out RESTHeart, the open source Web API Server for MongoDB" data-via="softinstigate" data-size="large" data-related="softinstigate" data-hashtags="RESTHeart">Tweet</a>
        <iframe src="https://ghbtns.com/github-btn.html?user=softinstigate&repo=restheart&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160" height="30"></iframe>
    </p>
</div>

<section class="slice" id="what">
    <div class="container-fluid slice__features">
        <div class="row">
            <div class="col-sm-6 text-center mb-3">
                <h3>
                    Supported by
                    an active Community and <a href="/services">
                    Professional Services</a>
                </h3>
            </div>
            <div class="col-sm-6 text-center  mb-3">
                <h3>
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
                            <a href="https://docs.mongodb.org/ecosystem/tools/http-interfaces/" target="_blank">leading Web API</a>
                        </strong> for
                        <strong>MongoDB</strong>. It has been tested with MongoDB from release 2.6 to 3.6</h4>
                    <h4>
                        <strong>Just start it</strong> and the REST API is ready to use, opening the
                        <strong>data</strong> to the Web.</h4>
                    <h4>
                        <strong>Web</strong> and
                        <strong>Mobile applications</strong> can directly use the database via REST HTTP API calls.</h4>
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
                        <a href="https://softinstigate.atlassian.net/wiki/display/RH/Performances">performance tests</a>.
                    </h4>
                    <h4>
                        <strong>Lightweight</strong> ~10Mb footprint, low RAM usage, starts in ~1 sec.
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
                        <svg><use xlink:href="../../../images/sprite.svg#plane" /></svg>
                    </div>
                    <h2>Rapid Dev</h2>
                    <h4>
                        <strong>No server side development is required</strong> in most of the cases for your web and mobile applications.
                    </h4>
                    <h4>
                        The
                        <strong>Setup</strong> is simple with convention over configuration approach;
                        <strong>Docker Container</strong> and
                        <strong>Vagrant Box</strong> are available.
                    </h4>
                    <h4>
                        <strong>Access Control</strong> and
                        <strong>Schema Check</strong> are provided out of the box.
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
                        <strong>Production ready</strong>.
                    </h4>
                    <h4>
                        High quality
                        <strong>Documentation</strong> and active development
                        <strong>community</strong>.
                    </h4>
                    <h4>
                        <a href="/services">
                            <strong>Professional Services</strong>
                        </a> are available from SoftInstigate, the company behind RESTHeart.
                    </h4>
                    <h4>
                        <a href="/license">
                            <strong>A Commercial License</strong>
                        </a> is available to overcome the conditions of the AGPL.
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
                <p class="call-to-action__desc">Lorem ipsum dolor sit ament consecutor adisciplit lorem sine qua non ipse diz sum dolor sit ament consecutor adisciplit lorem sine qua non ipse diz sum dolor sit ament consecutor adisciplit lorem sine qua non ipse diz</p>
                <a class="btn btn-o" href="#">PROFESSIONAL SERVICES</a>
            </div>
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__second">
                <svg class="call-to-action__icon"><use xlink:href="../../../images/sprite.svg#thumb" /></svg>
                <h2 class="call-to-action__title">AVAILABLE UNDER THE OPEN SOURCE AGPL AND THE COMMERCIAL LICENSE</h2>
                <p class="call-to-action__desc">Lorem ipsum dolor sit ament consecutor adisciplit lorem sine qua non ipse diz sum dolor sit ament consecutor adisciplit lorem sine qua non ipse diz sum dolor sit ament consecutor adisciplit lorem sine qua non ipse diz</p>
                <a class="btn btn-o-white" href="#">Commercial license</a>
            </div>
        </div>
    </div>
</section>

<section class="chart" id="chart">

{% include docker_pull_chart.html %}

</section>