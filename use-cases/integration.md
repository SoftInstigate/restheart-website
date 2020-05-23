---
layout: article
title: 'Use Case: Integration'
---

# Significant Integration Cost Savings Using RESTHeart

{: .text-justify .mt-5 .mb-5}
RESTHeart is a standalone micro-service which connects to MongoDB database (and MongoDB compatible databases) and immediately exposes all of MongoDB’s capabilities through a complete REST API, which allows to read and write JSON documents and binary data via HTTP.

{: .text-justify .mt-5 .mb-5}
In most scenarios, developers don’t need to write a single line of integration code to involve MongoDB in Integration Processes because the Integration Middleware can interact with the RESTHeart API using simple HTTP Connectors.

{: .text-justify .mt-5 .mb-5}
Not only the Integration processes can be simplified by using simple HTTP requests but it can also leverage the extended functionalities of MongoDB handled by RESTHeart such as transactions, Bulk updates, update operators and the dot notation, Change Streams, just to name few.

{: .text-justify .mt-5 .mb-5}
In the following example, an integration flow run by **MuleSoft Anypoint** integrates **Salesforce** with **MongoDB** using HTTP Requests to the **RESTHeart** API.

<img src="/images/restheart-integration.svg" width="80%" height="auto" class="mx-auto d-block img-responsive" />

{: .text-justify .mt-5 .mb-5}
RESTHeart can be extended via _plugins_
to implement additional Web Services and transform data to best fulfill the integration needs. Hooks can also be easily defined to trigger integration events.

{: .text-justify .mt-5 .mb-5}
RESTHeart provides a strong security module for authentication and authorization to put data access under control and threat protection at every layer.

{: .text-justify .mt-5 .mb-5}
For a detailed description of setting up an API to MongoDB using RESTHeart see [Building Instant RESTFul API’s with MongoDB and RESTHeart](../../docs/setup).

{: .text-justify .mt-5 .mb-5}
For a detailed description of setting up an API to Amazon’s DocumentDB using RESTHeart see [How to Create a Web API for AWS DocumentDB (using RESTHeart)](https://medium.com/softinstigate-team/how-to-create-a-web-api-for-aws-documentdb-using-restheart-987921df3ced).
