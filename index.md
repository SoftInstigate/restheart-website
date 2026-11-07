---
layout: default
stars-bounce: true
inter: true
title: A backend for web, mobile and AI apps
excerpt: RESTHeart puts an API on your MongoDB data and handles what every app needs around it, sign-up and login, permissions per document, changes pushed to clients and an MCP server for AI agents. Use it hosted on Ulabase, or run it yourself with Docker.
---

<!-- The home page: a definition, then the two ways to use RESTHeart, Ulabase first. Styles in css/main.scss, "Home page". -->
<div class="home">

  <section class="home-hero">
    <div class="home-hero__title">
      <p class="home-eyebrow">Open source · MongoDB-native</p>
      <h1>A backend for web, mobile and AI apps</h1>
    </div>
    <p class="home-hero__lede">RESTHeart puts an API on your MongoDB data and handles what every app needs around it: sign-up and login, permissions per document, changes pushed to clients, an MCP server for AI agents.</p>
  </section>

  <section class="home-ways" aria-label="Two ways to use RESTHeart">

    <!-- the anchor of the starter apps that used to be on this page, still linked from the docs -->
    <div class="home-card home-card--ulabase" id="starter-apps-content">
      <div class="home-card__top">
        <p class="home-eyebrow home-eyebrow--ulabase">Hosted</p>
        <span class="home-badge">Recommended</span>
      </div>
      <h2>Use it on Ulabase</h2>
      <p class="home-card__text">Ulabase runs RESTHeart for you. You create a backend from the browser, and sign-up, payments and the MCP server are already switched on. The Free plan needs no card.</p>
      <ol class="home-steps">
        <li><span>1</span>Create a free service</li>
        <li><span>2</span>Clone a starter for React, Angular or Vue</li>
        <li><span>3</span>Point it at your service and run it</li>
      </ol>
      <div class="home-card__actions">
        <a class="home-btn home-btn--ulabase" href="https://ulabase.com/auth/signup?utm_source=restheart.org&utm_medium=home&utm_content=home">Create a free service</a>
        <a class="home-link home-link--ulabase" href="https://ulabase.com/blog/ulabase-kit-starter-apps?utm_source=restheart.org&utm_medium=home&utm_content=home">Starter apps</a>
      </div>
    </div>

    <div class="home-card" id="run">
      <p class="home-eyebrow">Self-hosted</p>
      <h2>Run it locally</h2>
      <p class="home-card__text">Open source, with Docker. The compose file starts RESTHeart and MongoDB, and the API answers on port 8080.</p>
      <pre class="home-code"><span class="home-code__c"># start RESTHeart and MongoDB</span>
curl -O https://raw.githubusercontent.com/\
SoftInstigate/restheart/master/docker-compose.yml
docker compose up

<span class="home-code__c"># your first collection</span>
curl -X PUT localhost:8080/inventory -u admin:secret</pre>
      <div class="home-card__actions">
        <a class="home-btn home-btn--outline" href="/docs/foundations/quick-start">Quick Start</a>
        <a class="home-link" href="/docs/foundations/setup">Other ways to install</a>
      </div>
    </div>
  </section>

  <!-- the anchor of the old features section, still the target of /features -->
  <section class="home-what" id="features" aria-label="What it does">
    <div>
      <h3>Data APIs</h3>
      <p>REST, GraphQL, WebSocket and SSE on MongoDB.</p>
    </div>
    <div>
      <h3>Users and permissions</h3>
      <p>Sign-up, teams, API keys, rules per document.</p>
    </div>
    <div>
      <h3>AI agents</h3>
      <p>An MCP server on your data. Vector search.</p>
    </div>
    <div>
      <h3>Plugins</h3>
      <p>Java, Kotlin, JavaScript or TypeScript.</p>
    </div>
  </section>

</div>
