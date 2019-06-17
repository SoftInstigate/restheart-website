---
layout: page-notitle
title: Why RESTHeart
---
{: .mt-5}
# Why RESTHeart?

{: .mt-5}
In 2014 we had long realized that both application servers and frameworks force people to invest a lot of time in their configuration and maintenance, comparing to what is usually invested in the implementation of actual functionalities.

For these reasons, at SoftInstigate we started developing an open-source product called **RESTHeart**, in order to investigate more rational ways to build applications. It was born as a summer experiment and it became an increasingly focused and robust product in the following years.

{: .pt-3}
## What RESTHeart actually does, in a minute

RESTHeart is a standalone server-side application which connects to **MongoDB** database and immediately exposes all of MongoDB’s capabilities through a complete REST API, which allows to read and write JSON messages and binary data via HTTP.

> Developers don’t need to write a single line of backend code to serve data and content to Mobile Apps and Angular, React, Vue or other Single Page Application frameworks.

<img src="/images/restheart-what-is-it.svg" width="70%" height="auto" class="mx-auto d-block img-responsive" />

RESTHeart provides a strong security module for authentication, authorization, and data caching. It allows to effectively manage content and its metadata, such as images, tags, categories, geo-localized data, audios and videos, allowing to access them through a clean REST API.

> In most scenarios RESTHeart can be the perfect server-side backend for Mobile and Web applications, so that frontend developers can focus on building User Interfaces.

{: .pt-3}
## A bit of history: the death of SOAP Web Services

While we started developing our product, the industry was already abandoning Web Services based on SOAP + XML to move towards simpler and decidedly Web-oriented models, namely REST + JSON via HTTP protocol.

This was also caused by the growing success of JavaScript to write “Single Page” (SPA) Web applications. The most representative example of this model, demonstrating what was possible on the Web with an advanced use of Asynchronous JavaScript and XML (AJAX) technologies, was probably the first Google Mail product.

The affirmation of Apps for mobile devices, either Apple or Android, also greatly shifted the request for processing capacity from the server to the client, making some complexities typical of traditional Application Servers (and related XML-based technologies) superfluous.

{: .pt-3}
## The collapse of SOA

Service Oriented Architecture (SOA) promised to revolutionize the relationship between the business and the technological world. The goal of SOA was to conceptually break down the application domain into “business services” with a direct functional meaning, providing tools that would allow even non-technical people to orchestrate these services “easily”.

Especially during the decade from 2000–2010 the mainstream software industry translated this idea into a number of platforms like EAI, ESB, BPM, SOA and Web Services. The WS-* family of specifications and Simple Object Access Protocol (SOAP) were established. XML was rampant and ubiquitous.

Most of these initiatives, however, collapsed under their own weight and SOA was declared “officially dead” in 2009 by an article of Anne Thomas Manes, Chief Researcher at Burton Group and one of the main SOA proponents:

> But perhaps that’s the challenge: The acronym got in the way. People forgot what SOA stands for. They were too wrapped up in silly technology debates (eg, “what’s the best ESB?” Or “WS- * vs. REST”), and they missed the important stuff: architecture and services.
> […]
> The demise of SOA is tragic for the IT industry. Organizations desperately need to make architectural improvements to their application portfolios. Service orientation is a prerequisite for rapid data integration and business processes; it enables situational development models, such as mashups; and it’s the foundational architecture for SaaS and cloud computing.

{: .pt-3}
## The REST architectural style becomes pervasive

Long before the final collapse of SOA, disappointed developers all over the world were already looking for paradigms to solve day-to-day programming problems more effectively. A simpler and more pragmatic architectural style was already emerging: the so-called Representational State Transfer (REST).

REST is a complex word but a relatively simple idea: it’s based on the concept of resource (more or less “an entity with a static Web address”) and the exchange of messages via HTTP, natively interpretable by Javascript clients running on Web browsers or mobile apps. The exchange of messages via HTTP verbs like GET, PUT, POST, DELETE alters the state of resources: they create, update, read or delete them.

> REST is the structural essence of the Web and fits perfectly in a world where the Web and Internet technologies have become pervasive.

{: .pt-3}
## The rise of NoSQL databases

Experience taught us that a high percentage of code was written and rewritten to always do the same things: reading, writing, searching and displaying data via HTTP protocol.

Modern Web and Mobile apps usually require structured data mixed with unstructured data. Managing documents and multimedia content requires a higher level of flexibility than what’s provided by traditional relational databases: it can’t be effectively framed in tabular schemas. Every developer knows the pain of having to just add a column to a database table.

Meanwhile, we observed the rise of more pragmatic development models and non-relational databases adopting the NoSQL paradigm, whose main exponent was MongoDB, which is a document-oriented, schema-less database.

MongoDB is a lightweight and extremely fast product capable of managing JSON documents natively, although lacking in some “enterprise” features previously considered indispensable, but which in the modern Web applications field were no longer essential.

> What really mattered to developers was that JSON objects on the client could eventually travel to and from the database as they were, without any transformation.

{: .pt-3}
## Microservices and JAMStack becoming popular

From the point of view of software design and deployment, we observed the contemporary rise of new architectural models that the Cloud had enabled, such as **Microservices** and **JAMstack**, which rationalize further the capabilities of continuous deployment of working software, at a fraction of the previous costs.

RESTHeart was intentionally designed from the very beginning to be fully stateless and embeddable into a Microservices architecture, providing data and content to other services. Actually, most organizations these days deploy RESTHeart via **Docker containers**, in ECS or Kubernetes clusters.

JAMstack means “Modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup”. RESTHeart, since its inception, has been the perfect fit for this architectural model. Developers can write static HTML + JavaScript which leverage RESTHeart for managing dynamic data in a very decoupled way.

This leads to extremely robust Web sites, as HTML pages are not dynamically generated from databases but they are plain static files which can be distributed via Content Delivery Networks like CloudFront or Cloudflare.

{: .pt-3}
## Conclusions

Taking into account these facts, trends, and ideas, we created and continue to tune our main product, RESTHeart, which meets our needs for simplicity and effectiveness, is natively Docker-ready, easily deployable in any Cloud or on-premises and is enabling us not to reinvent the wheel every time we develop an application, allowing us to build over solid foundations