---
layout: default
stars-bounce: true
---
{% include run-restheart-seriously-banner.html %}

<section id="top" class="text-center pt-2 pb-2">
    <div class="mt-0 mb-4">
        <img width="120" class="bg-whites p-3 rounded" src="/images/restheart logo.svg">
        <h1 class="my-1 top-1 text-break"><strong>REST</strong>Heart Framework</h1>
        <p class="top-6 text-break white mt-2 mx-4">
            ✅&nbsp;Instant REST, GraphQL and Websockets APIs for <strong>MongoDB</strong>.
            ✅&nbsp;Declarative Security, no code required.
            ✅&nbsp;Implement your Backend in minutes.
        </p>
        <div class="hero-cta-container mx-2 py-5 px-5" style="border-radius: 15px; background-color: rgba(248, 168, 57, 0.05);">
          <div class="row gx-4 mx-4 align-items-stretch">
            <div class="col-md-6 mb-5 mb-md-0 d-flex">
              <div class="cta-card">
                <a href="https://cloud.restheart.com/signup" class="btn btn-primary font-weight-bold btn-lg text-black">
                  <span class="cta-emoji">🚀</span> Try RESTHeart Cloud
                </a>
                <div class="cta-description mt-4 white">
                    Start building instantly • Scale to production when ready • No Installation Required!
                </div>
              </div>
            </div>
            <div class="col-md-6 d-flex">
              <div class="cta-card">
                <a href="/docs/sophia" class="btn btn-primary font-weight-bold btn-lg text-black">
                  <span class="cta-emoji">💬</span> Chat with Sophia AI
                </a>
                <div class="cta-description mt-4 white">
                    Get instant answers about RESTHeart • No need to read through all the docs!
                </div>
              </div>
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
