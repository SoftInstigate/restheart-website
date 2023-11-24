---
layout: default
stars-bounce: true
---

<section id="top" class="black-background text-center pt-2 pb-2">
    <div class="mt-0 mb-4">
        <h1 class="pt-4 top-1 text-break"><strong>REST</strong>Heart</h1>
        <h2 class="my-0 top-2 mx-2 mx-md-5 mb-2 highlightcolor lh-1_4">
        Open Source Low-code API development framework
        <div class="top-6 text-break white mt-2">Featuring ready-to-go Security and MongoDB API</div>
        </h2>
        <a href="/docs/setup" class="btn btn-o-white ml-1 mt-4 my-0 btn-md">Download</a>
        <a href="/docs" class="btn btn-o-white ml-1 mt-4 my-0 btn-md">Read the Docs</a>
        <a href="/docs/try" class="btn btn-o-white ml-1 mt-4 my-0 btn-md">Try Online</a>
        <a href="https://calendly.com/restheart/restheart-demo" class="btn btn-o-white ml-1 mt-4 my-0 btn-md" target="blank">Book a meeting!</a>
        <div class="col-12 mt-4">
                <a class="btn btn-lg mr-3" title="Slack" href="https://join.slack.com/t/restheart/shared_invite/zt-1olrhtoq8-5DdYLBWYDonFGEALhmgSXQ" target="blank"> <i style="font-size:18px" class="icon-chat"></i>Join us on Slack</a>
        </div>
    </div>
</section>

<section id="features-content" class="pb-2 mt-5">
    <div class="containe-fluid">
        <h2 class="text-center color-primary font-weight-bold mb-5">Key points about RESTHeart</h2>
        <div class="d-flex flex-wrap justify-content-around gap-3 text-center">
            <div  class="zoom card newsText mw-keypoint black-background align-self-center text-primary  font-weight-bold">RESTHeart is a framework for building HTTP microservices that aims to empower developers with intuitive APIs out of the box.</div>
            <div class="zoom card newsText mw-keypoint align-self-center text-primary font-weight-bold">It is built for developers, with a focus on simplicity, speed and ease of use. The programming model uses simple building blocks like Services, Providers, Interceptors and Initializers.</div>
            <div class="zoom card newsText mw-keypoint align-self-center text-primary font-weight-bold">It has a modular architecture where core functionality is provided by restheart-core, and additional features are implemented as plugins.</div>
            <div class="zoom card newsText mw-keypoint align-self-center text-primary font-weight-bold">It provides features commonly needed by applications like authentication/authorization and data management through MongoDB integration.</div>
            <div class="zoom card newsText mw-keypoint align-self-center text-primary font-weight-bold">The MongoDB plugin exposes the full database capabilities through REST, GraphQL and websockets with no backend code required. This cuts development time significantly.</div>
            <div class="zoom card newsText mw-keypoint align-self-center text-primary font-weight-bold">Performance is a priority with support for huge throughput, horizontal scaling, and GraalVM for better performance in containers.</div>
            <div class="zoom card newsText mw-keypoint align-self-center text-primary font-weight-bold">It is designed for microservices deployment in Docker/Kubernetes and can run as a standalone JAR, native binary or Docker image.</div>
            <div class="zoom card newsText mw-keypoint align-self-center text-primary font-weight-bold">It supports Java, Kotlin, JavaScript and TypeScript. Hello World examples are very simple to implement in any of these languages.</div>
            <div class="zoom card newsText mw-keypoint align-self-center text-primary font-weight-bold">It has an AGPL open source license as well as a commercial enterprise license for production use cases.</div>
        </div>
    </div>
</section>

<div class="container text-center mt-0 mw-800 px-0">
    <img src="/images/restheart.gif" class="img-fluid"/>
</div>

<section id="article-at-aws-blog" class="call-to-action black-background">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12 call-to-action__item call-to-action__first text-center">
                <h2 class="text-lightcyan mb-2">
                    <a href="https://aws.amazon.com/it/blogs/apn/application-modernization-with-mongodb-atlas-on-aws/" target="_blank">Featured on <strong>AWS Blog</strong></a>
                </h2>
                <p class="highlightcolor"><i>RESTHeart API for MongoDB simplifies development and frees you to focus on delivering great user experiences</i></p>
                <a href="https://aws.amazon.com/it/blogs/apn/application-modernization-with-mongodb-atlas-on-aws/" target="_blank" class="btn btn-o-white">READ THE POST</a>
            </div>
        </div>
        <div class="row mb-1 text-center mb-3">
            <div class="col-md-12 text-center">
                <a href="/assets/Brochure - RESTHeart 6.pdf" target="_blank" class="btn">Donwload the PDF fact sheet</a>
                <a href="/assets/RESTHeart 6 - Overview.pdf" target="_blank" class="btn mt-3 mt-md-0 ml-md-3 mx-auto">Donwload the Product presentation</a>
            </div>
        </div>
    </div>
</section>

<!-- just to make anchor link go to the right height -->
<div id="features" class="pb-4"></div>

<section id="features-content" class="text-center pb-2 mt-5">
    <div class="container">
        <h2 class="text-center color-primary font-weight-bold">RESTHeart Features</h2>
        {% include features.md %}
    </div>
</section>

<div class="container mt-5">
    <h2 class="text-center color-primary font-weight-bold">The Data API</h2>
</div>

<section id="examples" class="slice my-0 pb-0">
    {% include examples.html %}
</section>

<div class="container mt-5">
    <h2 class="text-center color-primary m-0 mb-2 font-weight-bold">Example Code</h2>
</div>

<section id="examples-plugins" class="slice">
    {% include examples_plugins.html %}
</section>

<section class="chart mt-3 pb-0" id="chart">
    {% include docker_pull_chart.html %}
</section>

<section id="article-at-mongodb" class="call-to-action black-background">
    <div class="container-fluid">
        <div class="row mb-1">
            <div class="col-md-12 call-to-action__item call-to-action__first text-center">
                <h2 class="text-lightcyan mb-2">
                    <a href="https://github.com/sponsors/SoftInstigate" target="_blank">Become a sponsor</a>
                </h2>
                <p class="highlightcolor">You can support the development of RESTHeart via GitHub Sponsor program and receive public acknowledgment of your help.</p>
                <a href="https://github.com/sponsors/SoftInstigate" target="_blank" class="btn btn-o-white">Go and see available sponsor tiers</a>
            </div>
        </div>
    </div>
</section>