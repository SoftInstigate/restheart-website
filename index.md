---
layout: default
stars-bounce: true
---
{% include run-restheart-seriously-banner.html %}

<section id="top" class="text-center pt-2 pb-2">
    <div class="mt-0 mb-4">
        <img width="160" src="/images/RESTHeart-logo.png">
        <h1 class="mt-1 top-1 text-break"><strong>REST</strong>Heart</h1>
        <h2 class="my-0 top-2 mx-2 mx-md-5 mb-2 highlightcolor lh-1_4">
        Virtual Threads Powered API Framework
        </h2>
        <p class="top-6 text-break white mt-2 mx-4">
            ✅&nbsp;Instant REST, GraphQL and Websockets APIs for <strong>MongoDB</strong>.
            ✅&nbsp;Declarative Security, no code required.
            ✅&nbsp;Implement your Backend in minutes.
        </p>
        <div>
            <h3 class="font-weight-bold highlightcolor mt-3 text-center">Ask Sophia AI about RESTHeart</h3>
            <iframe id="sophiaFrame" src="https://sophia.restheart.com?h=auto" style="border: none; width: 100%"></iframe>
        </div>
        <h3 class="font-weight-bold highlightcolor mt-5">Run this docker command to start <span class="small text-muted mt-0">(go to <a href="/docs/setup">Setup</a> for more installation options)</span></h3>
        <div class="container">
            <div class="listingblock my-0">
                <div class="content">
<pre class="rouge highlight text-center">
<code data-lang="bash"><span class="nv">$ </span>docker pull softinstigate/restheart && curl https://raw.githubusercontent.com/SoftInstigate/restheart/master/docker-compose.yml <span class="nt">--output</span> docker-compose.yml <span class="o">&amp;&amp;</span> docker compose up --attach restheart</code>
</pre>
                </div>
            </div>
        </div>
        <h3 class="font-weight-bold highlightcolor mt-3">Then check the tutorials</h3>
        <a href="/docs/mongodb-rest/tutorial" class="btn btn-o-white ml-1 mt-2 my-0 btn-md">MongoDB REST API Tutorial</a>
        <a href="/docs/mongodb-graphql/tutorial" class="btn btn-o-white ml-1 mt-2 my-0 btn-md">MongoDB GraphQL API Tutorial</a>
        <a href="/docs/plugins/tutorial" class="btn btn-o-white ml-1 mt-2 my-0 btn-md">Framework Tutorial</a>
        <a href="/docs/security/tutorial" class="btn btn-o-white ml-1 mt-2 my-0 btn-md">Auth Tutorial</a>
    </div>
</section>

<!-- scroll to bottom of sophia iframe chat when it resizes -->
<script>
  var preventScroll = 0; // trick to avoid scrolling on first load
  document.addEventListener("DOMContentLoaded", () => preventScroll = 0);
  iframeResize({
    license: 'GPLv3',
    waitForLoad: true,
    onResized: ({ iframe, height, width, type }) => {
      if (document.readyState === 'complete') {
        if (preventScroll > 3) {
          const offset = iframe.offsetTop;
          const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
          window.scrollTo({top: height+offset-vh, left: 0, behavior: 'smooth'});
        } else {
          preventScroll++;
        }
      }
    }
  }, '#sophiaFrame' );
</script>

<!-- <section id="article-at-aws-blog" class="call-to-action black-background">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12 call-to-action__item call-to-action__first text-center">
                <h2 class="text-lightcyan mb-2">
                    <a href="https://aws.amazon.com/it/blogs/apn/application-modernization-with-mongodb-atlas-on-aws/" target="_blank">Featured on <strong>AWS Blog</strong></a>
                </h2>
                <p class="highlightcolor"><i>The RESTHeart API for MongoDB simplifies development and frees you to focus on delivering a great users experience</i></p>
                <a href="https://aws.amazon.com/it/blogs/apn/application-modernization-with-mongodb-atlas-on-aws/" target="_blank" class="btn btn-o-white">READ THE POST</a>
            </div>
        </div>
        <div class="row mb-1 text-center mb-3">
            <div class="col-md-12 text-center">
                <a href="/assets/Brochure - RESTHeart.pdf" target="_blank" class="btn">Download the PDF fact sheet</a>
                <a href="/assets/RESTHeart 6 - Overview.pdf" target="_blank" class="btn mt-3 mt-md-0 ml-md-3 mx-auto">Download the Product presentation</a>
            </div>
        </div>
    </div>
</section> -->

<!-- just to make anchor link go to the right height -->
<div id="features" class="pb-4"></div>

<section id="features-content" class="text-center pb-2 mt-5">
    <div class="container">
        <h2 class="text-center color-primary font-weight-bold">RESTHeart Features</h2>
        {% include features.md %}
    </div>
</section>

<div class="container mt-5">
    <h2 class="text-center color-primary font-weight-bold">Data API</h2>
</div>

<section id="examples" class="slice my-0 pb-0">
    {% include examples.html %}
</section>

<div class="container mt-5">
    <h2 class="text-center color-primary m-0 mb-2 font-weight-bold">Polyglot Framework</h2>
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