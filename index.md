---
layout: default
stars-bounce: true
title: The Open Source Backend for MongoDB
excerpt: RESTHeart is the open source backend for MongoDB. It gives you instant REST, GraphQL and WebSocket APIs on your data, built-in authentication and authorization, and a plugin framework for Java, Kotlin, JavaScript and TypeScript — no backend boilerplate. Run it for free with Docker, or use the managed RESTHeart Cloud service. Plus Sophia, the AI assistant with a native MCP server.
---

<section id="top" class="pt-4 pb-2">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6 hero-copy">
                <div class="hero-brand">
                    <img width="80" class="bg-whites p-2 rounded" src="/images/restheart logo.svg" alt="RESTHeart logo">
                    <h1 class="my-0 ml-3 top-1 text-break"><strong>REST</strong>Heart</h1>
                </div>
                <h2 class="text-break mt-3" style="font-size: 1.6rem; font-weight: 400; line-height: 1.4; color: var(--primarycolor);">
                    The <strong style="font-weight: 600;">Open Source Backend</strong> for MongoDB.
                </h2>
                <div class="hero-checklist mt-3">
                    <p class="text-break white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f8a839" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Instant REST, GraphQL and WebSocket APIs. No backend code.
                    </p>
                    <p class="text-break white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f8a839" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Built-in authentication and authorization. Declarative, zero boilerplate.
                    </p>
                    <p class="text-break white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f8a839" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Need custom logic? Extend it in Java, Kotlin, JavaScript or TypeScript.
                    </p>
                    <p class="text-break white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f8a839" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Plus <a href="#mcp">Sophia</a>, the AI assistant: chat with the docs or vibe code via MCP.
                    </p>
                </div>
                <div class="hero-buttons mt-4">
                    <a href="https://cloud.restheart.com/signup" class="btn btn-primary font-weight-bold btn-lg text-black">
                        <span class="cta-emoji">🚀</span> Try RESTHeart Cloud
                    </a>
                    <a href="/docs/setup" class="btn btn-o-white btn-lg">
                        <span class="cta-emoji">⬇️</span> Run it Free
                    </a>
                </div>
                <p class="white mt-3 mb-0" style="font-size: 0.9rem; opacity: 0.8;">Fully managed, no installation required • Or run it yourself — free and open source</p>
            </div>
            <div class="col-lg-6 mt-5 mt-lg-0">
                <div class="hero-terminal">
                    <p class="white mb-1"><strong>Run RESTHeart with MongoDB:</strong></p>
{% highlight bash %}
curl -O https://raw.githubusercontent.com/\
SoftInstigate/restheart/master/docker-compose.yml
docker compose up
{% endhighlight %}
                    <p class="white mt-3 mb-1"><strong>Your MongoDB, instantly an API:</strong></p>
{% highlight bash %}
# read, write and query documents — no backend code
curl -X POST localhost:8080/inventory \
  -d '{"item":"card", "qty":15}'
curl localhost:8080/inventory
{% endhighlight %}
                    <p class="mt-2 mb-0"><a href="/docs/setup">More ways to run it →</a></p>
                </div>
            </div>
        </div>
        <div class="text-center mt-5">
            <h3 class="font-weight-bold highlightcolor mb-1">Get Started</h3>
            <a href="/docs/mongodb-rest/tutorial" class="btn btn-o-white ml-1 mt-2 my-0 btn-md">MongoDB REST API Tutorial</a>
            <a href="/docs/mongodb-graphql/tutorial" class="btn btn-o-white ml-1 mt-2 my-0 btn-md">MongoDB GraphQL API Tutorial</a>
            <a href="/docs/plugins/tutorial" class="btn btn-o-white ml-1 mt-2 my-0 btn-md">Framework Tutorial</a>
            <a href="/docs/security/tutorial" class="btn btn-o-white ml-1 mt-2 my-0 btn-md">Auth Tutorial</a>
            <p class="white mt-2 mb-0" style="font-size: 0.9rem; opacity: 0.8;">Setup instructions included in each tutorial</p>
        </div>
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

<!-- just to make anchor link go to the right height -->
<div id="mcp" class="pb-4"></div>

<section id="mcp-content" class="text-center pb-2 mt-5">
    <div class="container">
        <h2 class="text-center color-primary font-weight-bold">Vibe Coding with RESTHeart</h2>
        <p class="mt-3 mb-4">RESTHeart comes with <strong>Sophia</strong>, its AI assistant. Two ways to use it:</p>
        <div class="row mt-4">
            <div class="col-lg-5 offset-lg-1 mb-4 mb-lg-0 d-flex">
                <div class="hero-terminal w-100 d-flex flex-column justify-content-center text-center">
                    <h3 class="feature-title mb-2">💬 Just ask</h3>
                    <p class="mb-3">Chat with Sophia in your browser and get instant answers about RESTHeart. No setup needed.</p>
                    <p class="mb-0">Sophia is available via the chat button on every page.</p>
                </div>
            </div>
            <div class="col-lg-5 d-flex">
                <div class="hero-terminal w-100">
                    <h3 class="feature-title mb-2">⚡ Vibe code in your editor</h3>
                    <p class="mb-2">Connect Claude Code, Cursor or VS Code to the RESTHeart MCP server: your AI answers questions, writes working code and configures your backend.</p>
{% highlight bash %}
claude mcp add --transport http sophia-restheart \
  https://api.bysophia.ai/mcp/restheart
{% endhighlight %}
                    <p class="mt-2 mb-0"><a href="/docs/cloud/sophia/mcp">Setup for Claude Desktop, VS Code, Zed and more →</a></p>
                </div>
            </div>
        </div>
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
