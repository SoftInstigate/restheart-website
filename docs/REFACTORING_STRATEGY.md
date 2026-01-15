# RESTHeart v9 Documentation Refactoring Strategy

## Executive Summary

This document outlines a strategy to reorganize the RESTHeart v9 documentation to provide **linear learning paths** while maintaining the current file structure. The approach is pragmatic: **reorganize and improve existing content** rather than rewriting everything from scratch.

---

## Current State Analysis

### Documentation Size & Distribution

**Total Documentation:** ~25,500 lines across 100+ files

**Content Distribution:**
- **MongoDB REST API:** 9,526 lines (37%) - 20 files
- **Cloud/Sophia:** 5,451 lines (21%) - 12 files
- **Security:** 3,985 lines (16%) - 11 files
- **MongoDB GraphQL API:** 3,376 lines (13%) - 11 files
- **Framework/Plugins:** 2,463 lines (10%) - 14 files
- **MongoDB WebSocket API:** 661 lines (3%) - 4 files

### Current Problems

1. **No guided learning path** - Users don't know where to start or what order to read
2. **Navigation is reference-style** - Good for looking things up, bad for learning
3. **Redundant explanations** - Same concepts explained in multiple places
4. **54 YouTube video references** - Outdated and hard to maintain
5. **Unclear framework vs platform distinction** - Confuses new users
6. **Scattered tutorials** - Multiple tutorials with no clear progression

---

## New Vision: Dual Structure

### Keep Reference Structure + Add Learning Paths

**The Solution:**
1. **Keep existing files** - Don't rewrite everything (pragmatic!)
2. **Reorganize navigation** - Group files logically into parts
3. **Add guided learning paths** - Linear sequences through existing content
4. **Improve content** - Edit existing files to:
   - Remove redundancy
   - Remove videos
   - Add cross-references
   - Improve flow within each file
   - Add "Prerequisites" and "Next Steps" sections

### Two Ways to Use the Docs

**1. Learning Mode (Linear)**
- Follow a guided path through selected pages in a specific order
- Each page shows: "Previous → Current → Next"
- Clear progression from beginner to advanced
- "You are here" indicator

**2. Reference Mode (Random Access)**
- Browse by topic in the reorganized navigation
- Jump directly to specific topics
- Use search
- Quick lookups

---

## New Organization Structure

### Navigation: 9 Parts with Subpages

```
docs/v9/
├── index.adoc                          # Landing page with learning paths
│
├── 1-foundations/
│   ├── introduction.adoc               # NEW - What is RESTHeart?
│   ├── quick-start.adoc                # NEW - 5-minute start
│   ├── setup.adoc                      # MOVE from root
│   ├── setup-with-docker.adoc          # MOVE from root
│   ├── core-concepts.adoc              # NEW - Architecture, plugins, lifecycle
│   └── security-fundamentals.adoc      # NEW - Auth basics
│
├── 2-mongodb-rest/
│   ├── index.adoc                      # KEEP - Overview
│   ├── tutorial.adoc                   # KEEP - Getting started
│   ├── read-docs.adoc                  # KEEP
│   ├── write-docs.adoc                 # KEEP
│   ├── aggregations.adoc               # KEEP
│   ├── transactions.adoc               # KEEP
│   ├── files.adoc                      # KEEP
│   ├── indexes.adoc                    # KEEP
│   ├── json-schema-validation.adoc     # KEEP
│   ├── relationships.adoc              # KEEP
│   ├── etag.adoc                       # KEEP
│   ├── caching.adoc                    # KEEP
│   ├── read-write-concerns.adoc        # KEEP
│   ├── dbs-collections.adoc            # KEEP
│   ├── resource-uri.adoc               # KEEP
│   ├── representation-format.adoc      # KEEP
│   ├── csv.adoc                        # KEEP
│   ├── shard-keys.adoc                 # KEEP
│   └── sample-data.adoc                # KEEP
│
├── 3-graphql-websocket/
│   ├── graphql/
│   │   ├── index.adoc                  # MOVE from mongodb-graphql/
│   │   ├── tutorial.adoc               # MOVE from mongodb-graphql/
│   │   ├── getting-started.adoc        # MOVE from mongodb-graphql/
│   │   ├── graphql-apps.adoc           # MOVE from mongodb-graphql/
│   │   ├── schema.adoc                 # MOVE from mongodb-graphql/
│   │   ├── mappings.adoc               # MOVE from mongodb-graphql/
│   │   ├── resolvers.adoc              # MOVE from mongodb-graphql/
│   │   ├── complex-app-example.adoc    # MOVE from mongodb-graphql/
│   │   ├── n-plus-one.adoc             # MOVE from mongodb-graphql/
│   │   └── best-practices.adoc         # MOVE from mongodb-graphql/
│   ├── websocket/
│   │   ├── index.adoc                  # MOVE from mongodb-websocket/
│   │   ├── tutorial.adoc               # MOVE from mongodb-websocket/
│   │   ├── change-streams.adoc         # MOVE from mongodb-websocket/
│   │   └── variables.adoc              # MOVE from mongodb-websocket/
│   └── choosing-api.adoc               # NEW - When to use each API
│
├── 4-security/
│   ├── overview.adoc                   # KEEP - expand with fundamentals
│   ├── tutorial.adoc                   # KEEP - hands-on guide
│   ├── authentication.adoc             # KEEP
│   ├── authorization.adoc              # KEEP
│   ├── user-management.adoc            # KEEP
│   ├── permissions.adoc                # KEEP
│   ├── how-clients-authenticate.adoc   # KEEP
│   ├── tls.adoc                        # KEEP
│   ├── security-hardening.adoc         # KEEP
│   ├── secure-connection-to-mongodb.md # KEEP
│   └── other-security-plugins.adoc     # KEEP
│
├── 5-deployment/
│   ├── configuration.adoc              # MOVE from root
│   ├── default-configuration.adoc      # MOVE from root
│   ├── graalvm.md                      # MOVE from root
│   ├── logging.adoc                    # MOVE from root
│   ├── monitoring.adoc                 # MOVE from root
│   ├── auditing.adoc                   # MOVE from root
│   ├── clustering.md                   # MOVE from root
│   ├── proxy.md                        # MOVE from root
│   └── static-resources.adoc           # MOVE from root
│
├── 6-framework/
│   ├── overview.adoc                   # KEEP from plugins/
│   ├── tutorial.adoc                   # KEEP from plugins/
│   ├── services.adoc                   # KEEP from plugins/
│   ├── interceptors.adoc               # KEEP from plugins/
│   ├── providers.adoc                  # KEEP from plugins/
│   ├── initializers.adoc               # KEEP from plugins/
│   ├── core-plugins.adoc               # KEEP from plugins/
│   ├── core-plugins-js.adoc            # KEEP from plugins/
│   └── deploy.adoc                     # KEEP from plugins/
│
├── 7-security-plugins/
│   ├── overview.adoc                   # NEW - When to extend security
│   ├── authentication-mechanisms.adoc  # MOVE from plugins/
│   ├── authenticators.adoc             # MOVE from plugins/
│   ├── authorizers.adoc                # MOVE from plugins/
│   └── token-managers.adoc             # MOVE from plugins/
│
├── 8-cloud/
│   ├── index.adoc                      # KEEP
│   ├── getting-started.adoc            # KEEP
│   ├── root-user-setup.adoc            # KEEP
│   ├── users-and-permissions.adoc      # KEEP
│   ├── full-stack-example.adoc         # KEEP
│   ├── examples.adoc                   # KEEP
│   ├── sophia/                         # KEEP subdirectory
│   │   ├── index.adoc
│   │   ├── setup.adoc
│   │   ├── user-guide.adoc
│   │   ├── administrator-guide.adoc
│   │   ├── api-documentation.adoc
│   │   └── system-overview.adoc
│   └── webhook/                        # KEEP subdirectory
│       ├── index.adoc
│       ├── getting-started.adoc
│       ├── user-guide.adoc
│       └── tutorials.adoc
│
└── 9-reference/
    ├── faq.adoc                        # MOVE from root
    ├── performances.adoc               # MOVE from root
    ├── upgrade-to-v8.adoc              # MOVE from root
    ├── example-webapps.adoc            # MOVE from root
    ├── blog-posts.md                   # MOVE from root
    └── enterprise-license.md           # MOVE from root
```

**Total files: ~80 files** (down from 100+, after removing videos and test files)

---

## The Learning Paths

### Main Index Page (`index.adoc`)

Create a new landing page that presents learning paths:

```asciidoc
= RESTHeart v9 Documentation

Welcome to RESTHeart v9! This documentation can be used in two ways:

1. **📚 Follow a Learning Path** - Guided, linear sequences for different goals
2. **📖 Browse by Topic** - Jump to specific sections using the navigation menu

== Learning Paths

=== Path 1: MongoDB API User (No Coding Required)

*Goal:* Use RESTHeart to access MongoDB without writing backend code.

*Time:* ~4 hours

1. link:/docs/1-foundations/introduction[What is RESTHeart?] (10 min)
2. link:/docs/1-foundations/quick-start[Quick Start] (15 min)
3. link:/docs/1-foundations/security-fundamentals[Security Fundamentals] (20 min)
4. link:/docs/2-mongodb-rest/tutorial[REST API Tutorial] (30 min)
5. link:/docs/2-mongodb-rest/read-docs[Reading Data] (30 min)
6. link:/docs/2-mongodb-rest/write-docs[Writing Data] (30 min)
7. link:/docs/2-mongodb-rest/aggregations[Aggregations] (20 min)
8. link:/docs/4-security/tutorial[Security Tutorial] (30 min)
9. link:/docs/4-security/user-management[User Management] (20 min)
10. link:/docs/4-security/permissions[Permissions] (30 min)
11. link:/docs/5-deployment/configuration[Configuration] (20 min)

**✓ You're now ready to deploy a production MongoDB API!**

*Next steps:*
- Explore link:/docs/2-mongodb-rest/transactions[Transactions]
- Learn link:/docs/2-mongodb-rest/files[File Storage with GridFS]
- Add link:/docs/2-mongodb-rest/json-schema-validation[Schema Validation]

---

=== Path 2: Plugin Developer

*Goal:* Extend RESTHeart with custom services and interceptors.

*Time:* ~3 hours

1. link:/docs/1-foundations/introduction[What is RESTHeart?] (10 min)
2. link:/docs/1-foundations/quick-start[Quick Start] (15 min)
3. link:/docs/1-foundations/core-concepts[Core Concepts] (30 min)
4. link:/docs/6-framework/overview[Framework Overview] (20 min)
5. link:/docs/6-framework/tutorial[Plugin Tutorial] (45 min)
6. link:/docs/6-framework/services[Developing Services] (30 min)
7. link:/docs/6-framework/interceptors[Developing Interceptors] (20 min)
8. link:/docs/6-framework/providers[Providers & Dependency Injection] (15 min)
9. link:/docs/6-framework/deploy[Deploying Plugins] (20 min)

**✓ You can now build and deploy custom plugins!**

*Next steps:*
- Try link:/docs/6-framework/core-plugins-js[JavaScript Plugins]
- Learn link:/docs/6-framework/initializers[Initializers]
- Explore link:/docs/7-security-plugins/overview[Security Plugin Development]

---

=== Path 3: DevOps / Site Reliability Engineer

*Goal:* Deploy and operate RESTHeart in production.

*Time:* ~2 hours

1. link:/docs/1-foundations/introduction[What is RESTHeart?] (10 min)
2. link:/docs/1-foundations/setup[Installation] (20 min)
3. link:/docs/1-foundations/setup-with-docker[Docker Setup] (20 min)
4. link:/docs/5-deployment/configuration[Configuration] (30 min)
5. link:/docs/4-security/security-hardening[Security Hardening] (20 min)
6. link:/docs/4-security/tls[TLS Configuration] (15 min)
7. link:/docs/5-deployment/logging[Logging] (10 min)
8. link:/docs/5-deployment/monitoring[Monitoring] (15 min)
9. link:/docs/5-deployment/clustering[Clustering & Load Balancing] (20 min)

**✓ You're ready to run RESTHeart in production!**

*Next steps:*
- Optimize with link:/docs/5-deployment/graalvm[GraalVM Native Image]
- Set up link:/docs/5-deployment/auditing[Auditing]
- Configure link:/docs/5-deployment/proxy[Reverse Proxy]

---

=== Path 4: GraphQL Developer

*Goal:* Build GraphQL APIs on top of MongoDB.

*Time:* ~2 hours

1. link:/docs/1-foundations/introduction[What is RESTHeart?] (10 min)
2. link:/docs/1-foundations/quick-start[Quick Start] (15 min)
3. link:/docs/3-graphql-websocket/graphql/tutorial[GraphQL Tutorial] (30 min)
4. link:/docs/3-graphql-websocket/graphql/getting-started[Getting Started] (20 min)
5. link:/docs/3-graphql-websocket/graphql/graphql-apps[GraphQL Apps] (20 min)
6. link:/docs/3-graphql-websocket/graphql/schema[Schema Design] (20 min)
7. link:/docs/3-graphql-websocket/graphql/mappings[Mappings] (20 min)
8. link:/docs/3-graphql-websocket/graphql/resolvers[Resolvers] (20 min)

**✓ You can now build GraphQL APIs with RESTHeart!**

*Next steps:*
- Learn link:/docs/3-graphql-websocket/graphql/n-plus-one[Performance Optimization]
- Study link:/docs/3-graphql-websocket/graphql/complex-app-example[Advanced Example]
- Review link:/docs/3-graphql-websocket/graphql/best-practices[Best Practices]

---

== Browse by Topic

Prefer to explore on your own? Use the navigation menu to browse by topic:

* **Part 1: Foundations** - Introduction, setup, core concepts, security basics
* **Part 2: MongoDB REST API** - Complete REST API guide
* **Part 3: GraphQL & WebSocket** - Alternative APIs
* **Part 4: Security** - Authentication, authorization, user management
* **Part 5: Deployment** - Configuration, Docker, monitoring, clustering
* **Part 6: Framework** - Plugin development
* **Part 7: Security Plugins** - Extending security
* **Part 8: Cloud** - RESTHeart Cloud, Sophia AI, Webhooks
* **Part 9: Reference** - FAQ, performance, examples, resources

== Quick Links

* link:/docs/1-foundations/quick-start[⚡ Quick Start] - Get running in 5 minutes
* link:/docs/9-reference/faq[❓ FAQ] - Common questions
* link:/docs/9-reference/example-webapps[💡 Examples] - Sample applications
* link:/docs/2-mongodb-rest/tutorial[📚 REST Tutorial] - Hands-on REST API guide
* link:/docs/3-graphql-websocket/graphql/tutorial[📚 GraphQL Tutorial] - Hands-on GraphQL guide

== Community & Support

* link:https://github.com/SoftInstigate/restheart[GitHub Repository]
* link:https://github.com/SoftInstigate/restheart/issues[Report Issues]
* link:/docs/9-reference/enterprise-license[Enterprise Support]
```

---

## Navigation Updates

### Updated Sidebar (`_includes/docs-v9-sidebar.html`)

```html
<nav class="docs-sidebar">
  <a href="/docs/" class="home-link">
    <h2>RESTHeart v9</h2>
  </a>
  
  <div class="learning-paths">
    <h3>📚 Learning Paths</h3>
    <ul>
      <li><a href="/docs/#path-1-mongodb-api-user">MongoDB API User</a></li>
      <li><a href="/docs/#path-2-plugin-developer">Plugin Developer</a></li>
      <li><a href="/docs/#path-3-devops">DevOps / SRE</a></li>
      <li><a href="/docs/#path-4-graphql-developer">GraphQL Developer</a></li>
    </ul>
  </div>
  
  <hr>
  
  <div class="part">
    <a data-bs-toggle="collapse" href="#part1" role="button">
      <h3>Part 1: Foundations</h3>
    </a>
    <ul id="part1" class="collapse">
      <li><a href="/docs/1-foundations/introduction">Introduction</a></li>
      <li><a href="/docs/1-foundations/quick-start">Quick Start</a></li>
      <li><a href="/docs/1-foundations/setup">Setup</a></li>
      <li><a href="/docs/1-foundations/setup-with-docker">Docker Setup</a></li>
      <li><a href="/docs/1-foundations/core-concepts">Core Concepts</a></li>
      <li><a href="/docs/1-foundations/security-fundamentals">Security Fundamentals</a></li>
    </ul>
  </div>
  
  <div class="part">
    <a data-bs-toggle="collapse" href="#part2" role="button">
      <h3>Part 2: MongoDB REST API</h3>
    </a>
    <ul id="part2" class="collapse">
      <li><a href="/docs/2-mongodb-rest/">Overview</a></li>
      <li><a href="/docs/2-mongodb-rest/tutorial"><strong>Tutorial</strong></a></li>
      <li><a href="/docs/2-mongodb-rest/read-docs">Reading Data</a></li>
      <li><a href="/docs/2-mongodb-rest/write-docs">Writing Data</a></li>
      <li><a href="/docs/2-mongodb-rest/aggregations">Aggregations</a></li>
      <li><a href="/docs/2-mongodb-rest/transactions">Transactions</a></li>
      <li><a href="/docs/2-mongodb-rest/files">File Storage</a></li>
      <li><a href="/docs/2-mongodb-rest/indexes">Indexes</a></li>
      <li><a href="/docs/2-mongodb-rest/json-schema-validation">Schema Validation</a></li>
      <li><a href="/docs/2-mongodb-rest/relationships">Relationships</a></li>
      <li><a href="/docs/2-mongodb-rest/etag">ETags</a></li>
      <li><a href="/docs/2-mongodb-rest/caching">Caching</a></li>
      <li><a href="/docs/2-mongodb-rest/read-write-concerns">Read/Write Concerns</a></li>
      <li><a href="/docs/2-mongodb-rest/dbs-collections">Databases & Collections</a></li>
      <li><a href="/docs/2-mongodb-rest/resource-uri">Resource URIs</a></li>
      <li><a href="/docs/2-mongodb-rest/representation-format">Response Format</a></li>
      <li><a href="/docs/2-mongodb-rest/csv">CSV Import</a></li>
      <li><a href="/docs/2-mongodb-rest/shard-keys">Shard Keys</a></li>
      <li><a href="/docs/2-mongodb-rest/sample-data">Sample Data</a></li>
    </ul>
  </div>
  
  <div class="part">
    <a data-bs-toggle="collapse" href="#part3" role="button">
      <h3>Part 3: GraphQL & WebSocket</h3>
    </a>
    <ul id="part3" class="collapse">
      <li class="subsection">GraphQL API</li>
      <li><a href="/docs/3-graphql-websocket/graphql/">Overview</a></li>
      <li><a href="/docs/3-graphql-websocket/graphql/tutorial"><strong>Tutorial</strong></a></li>
      <li><a href="/docs/3-graphql-websocket/graphql/getting-started">Getting Started</a></li>
      <li><a href="/docs/3-graphql-websocket/graphql/graphql-apps">GraphQL Apps</a></li>
      <li><a href="/docs/3-graphql-websocket/graphql/schema">Schema Design</a></li>
      <li><a href="/docs/3-graphql-websocket/graphql/mappings">Mappings</a></li>
      <li><a href="/docs/3-graphql-websocket/graphql/resolvers">Resolvers</a></li>
      <li><a href="/docs/3-graphql-websocket/graphql/complex-app-example">Advanced Example</a></li>
      <li><a href="/docs/3-graphql-websocket/graphql/n-plus-one">Performance</a></li>
      <li><a href="/docs/3-graphql-websocket/graphql/best-practices">Best Practices</a></li>
      
      <li class="subsection">WebSocket API</li>
      <li><a href="/docs/3-graphql-websocket/websocket/">Overview</a></li>
      <li><a href="/docs/3-graphql-websocket/websocket/tutorial"><strong>Tutorial</strong></a></li>
      <li><a href="/docs/3-graphql-websocket/websocket/change-streams">Change Streams</a></li>
      <li><a href="/docs/3-graphql-websocket/websocket/variables">Variables</a></li>
      
      <li><a href="/docs/3-graphql-websocket/choosing-api">Choosing an API</a></li>
    </ul>
  </div>
  
  <div class="part">
    <a data-bs-toggle="collapse" href="#part4" role="button">
      <h3>Part 4: Security</h3>
    </a>
    <ul id="part4" class="collapse">
      <li><a href="/docs/4-security/overview">Overview</a></li>
      <li><a href="/docs/4-security/tutorial"><strong>Tutorial</strong></a></li>
      <li><a href="/docs/4-security/authentication">Authentication</a></li>
      <li><a href="/docs/4-security/authorization">Authorization</a></li>
      <li><a href="/docs/4-security/user-management">User Management</a></li>
      <li><a href="/docs/4-security/permissions">Permissions</a></li>
      <li><a href="/docs/4-security/how-clients-authenticate">Client Authentication</a></li>
      <li><a href="/docs/4-security/tls">TLS Configuration</a></li>
      <li><a href="/docs/4-security/security-hardening">Security Hardening</a></li>
      <li><a href="/docs/4-security/secure-connection-to-mongodb">Secure MongoDB Connection</a></li>
      <li><a href="/docs/4-security/other-security-plugins">Other Security Plugins</a></li>
    </ul>
  </div>
  
  <div class="part">
    <a data-bs-toggle="collapse" href="#part5" role="button">
      <h3>Part 5: Configuration & Deployment</h3>
    </a>
    <ul id="part5" class="collapse">
      <li><a href="/docs/5-deployment/configuration">Configuration</a></li>
      <li><a href="/docs/5-deployment/default-configuration">Default Configuration</a></li>
      <li><a href="/docs/5-deployment/graalvm">GraalVM Native</a></li>
      <li><a href="/docs/5-deployment/logging">Logging</a></li>
      <li><a href="/docs/5-deployment/monitoring">Monitoring</a></li>
      <li><a href="/docs/5-deployment/auditing">Auditing</a></li>
      <li><a href="/docs/5-deployment/clustering">Clustering</a></li>
      <li><a href="/docs/5-deployment/proxy">Proxying Requests</a></li>
      <li><a href="/docs/5-deployment/static-resources">Static Resources</a></li>
    </ul>
  </div>
  
  <div class="part">
    <a data-bs-toggle="collapse" href="#part6" role="button">
      <h3>Part 6: Framework</h3>
    </a>
    <ul id="part6" class="collapse">
      <li><a href="/docs/6-framework/overview">Overview</a></li>
      <li><a href="/docs/6-framework/tutorial"><strong>Tutorial</strong></a></li>
      <li><a href="/docs/6-framework/services">Services</a></li>
      <li><a href="/docs/6-framework/interceptors">Interceptors</a></li>
      <li><a href="/docs/6-framework/providers">Providers</a></li>
      <li><a href="/docs/6-framework/initializers">Initializers</a></li>
      <li><a href="/docs/6-framework/core-plugins">Core Plugins</a></li>
      <li><a href="/docs/6-framework/core-plugins-js">JavaScript Plugins</a></li>
      <li><a href="/docs/6-framework/deploy">Deploying Plugins</a></li>
    </ul>
  </div>
  
  <div class="part">
    <a data-bs-toggle="collapse" href="#part7" role="button">
      <h3>Part 7: Security Plugins</h3>
    </a>
    <ul id="part7" class="collapse">
      <li><a href="/docs/7-security-plugins/overview">Overview</a></li>
      <li><a href="/docs/7-security-plugins/authentication-mechanisms">Auth Mechanisms</a></li>
      <li><a href="/docs/7-security-plugins/authenticators">Authenticators</a></li>
      <li><a href="/docs/7-security-plugins/authorizers">Authorizers</a></li>
      <li><a href="/docs/7-security-plugins/token-managers">Token Managers</a></li>
    </ul>
  </div>
  
  <div class="part">
    <a data-bs-toggle="collapse" href="#part8" role="button">
      <h3>Part 8: RESTHeart Cloud</h3>
    </a>
    <ul id="part8" class="collapse">
      <li><a href="/docs/8-cloud/">Overview</a></li>
      <li><a href="/docs/8-cloud/getting-started">Getting Started</a></li>
      <li><a href="/docs/8-cloud/root-user-setup">Root User Setup</a></li>
      <li><a href="/docs/8-cloud/users-and-permissions">Users & Permissions</a></li>
      <li><a href="/docs/8-cloud/full-stack-example">Full-Stack Example</a></li>
      <li><a href="/docs/8-cloud/examples">Examples</a></li>
      
      <li class="subsection">Sophia AI</li>
      <li><a href="/docs/8-cloud/sophia/">Overview</a></li>
      <li><a href="/docs/8-cloud/sophia/setup">Setup</a></li>
      <li><a href="/docs/8-cloud/sophia/user-guide">User Guide</a></li>
      <li><a href="/docs/8-cloud/sophia/administrator-guide">Admin Guide</a></li>
      <li><a href="/docs/8-cloud/sophia/api-documentation">API Docs</a></li>
      
      <li class="subsection">Webhooks</li>
      <li><a href="/docs/8-cloud/webhook/">Overview</a></li>
      <li><a href="/docs/8-cloud/webhook/getting-started">Getting Started</a></li>
      <li><a href="/docs/8-cloud/webhook/user-guide">User Guide</a></li>
      <li><a href="/docs/8-cloud/webhook/tutorials">Tutorials</a></li>
    </ul>
  </div>
  
  <div class="part">
    <a data-bs-toggle="collapse" href="#part9" role="button">
      <h3>Part 9: Reference</h3>
    </a>
    <ul id="part9" class="collapse">
      <li><a href="/docs/9-reference/faq">FAQ</a></li>
      <li><a href="/docs/9-reference/performances">Performance</a></li>
      <li><a href="/docs/9-reference/upgrade-to-v8">Upgrade to v8</a></li>
      <li><a href="/docs/9-reference/example-webapps">Example Apps</a></li>
      <li><a href="/docs/9-reference/blog-posts">Blog Posts</a></li>
      <li><a href="/docs/9-reference/enterprise-license">Enterprise License</a></li>
    </ul>
  </div>
</nav>
```

---

## Content Improvements (Not Rewrites!)

### 1. Add Navigation Helpers to Each Page

Add to the top of each page in a learning path:

```asciidoc
[.learning-path]
****
**Learning Path: MongoDB API User**

← Previous: link:/docs/1-foundations/security-fundamentals[Security Fundamentals] | 
Next: link:/docs/2-mongodb-rest/read-docs[Reading Data] →

You are at step 4 of 11
****
```

### 2. Add Prerequisites Section

Add to the beginning of each file:

```asciidoc
== Prerequisites

Before reading this page, you should be familiar with:

* link:/docs/1-foundations/introduction[What is RESTHeart]
* link:/docs/1-foundations/quick-start[Quick Start] - Have RESTHeart running
* link:/docs/1-foundations/security-fundamentals[Security Fundamentals]
```

### 3. Add "What's Next" Section

Add to the end of each file:

```asciidoc
== What's Next

Now that you understand reading data, you can:

* **Next in learning path:** link:/docs/2-mongodb-rest/write-docs[Writing Data]
* **Explore related topics:**
  - link:/docs/2-mongodb-rest/aggregations[Aggregations]
  - link:/docs/2-mongodb-rest/json-schema-validation[Schema Validation]
  - link:/docs/2-mongodb-rest/relationships[Document Relationships]
```

### 4. Remove YouTube Videos

Find and remove all 54 video references:

```bash
# Files with videos:
docs/v9/setup-with-docker.adoc
docs/v9/logging.adoc
docs/v9/security/permissions.adoc
docs/v9/security/authentication.adoc
docs/v9/security/authorization.adoc
docs/v9/security/how-clients-authenticate.adoc
docs/v9/security/overview.adoc
docs/v9/security/user-management.adoc
docs/v9/security/tutorial.adoc
docs/v9/plugins/services.adoc
docs/v9/plugins/core-plugins.adoc
docs/v9/plugins/interceptors.adoc
docs/v9/plugins/overview.adoc
docs/v9/plugins/initializers.adoc
docs/v9/mongodb-rest/transactions.adoc
docs/v9/video-tutorials.md (DELETE THIS FILE)
```

Remove sections like:
```asciidoc
TIP: Watch link:https://www.youtube.com/watch?v=...
```

### 5. Reduce Redundancy

**Example: Authentication explanation**

Currently explained in:
- security/overview.adoc
- security/authentication.adoc  
- security/how-clients-authenticate.adoc

**New approach:**
- `1-foundations/security-fundamentals.adoc` - Basic explanation (new file)
- `4-security/authentication.adoc` - In-depth explanation (edit to remove redundancy)
- `4-security/how-clients-authenticate.adoc` - Practical guide (reference fundamentals)

### 6. Create New Foundation Files

Create 4 new files in `1-foundations/`:

**introduction.adoc** (~300 lines)
- What is RESTHeart?
- Two faces: Ready-to-use platform + Framework
- Who should use it?
- Architecture overview
- Extract from current index.adoc

**quick-start.adoc** (~200 lines)
- 5-minute Docker quickstart
- Your first request
- Testing with curl
- What's next?
- Extract from setup-with-docker.adoc

**core-concepts.adoc** (~400 lines)
- RESTHeart runtime
- Plugin architecture
- Request lifecycle
- Configuration basics
- Virtual threads
- Extract from plugins/overview.adoc + new content

**security-fundamentals.adoc** (~300 lines)
- Authentication vs Authorization
- How security works in RESTHeart
- The default setup
- Changing admin password
- Making authenticated requests
- Extract from security/overview.adoc

---

## Migration Plan (3-4 Days)

### Day 1: Structure & Cleanup (4-6 hours)
**Morning:**
- ✅ Analyze current structure (DONE)
- Create backup: `git checkout -b v9-docs-backup && git checkout -b v9-docs-refactor`
- Remove all 54 video references across 16 files
- Delete video-tutorials.md

**Afternoon:**
- Create new directory structure (mkdir commands)
- Move all files to new directories using git mv (preserves history)
- Update internal links in moved files (find/replace paths)

### Day 2: New Content & Navigation (6-8 hours)
**Morning:**
- Create new index.adoc with learning paths
- Create 1-foundations/introduction.adoc (extract from index.adoc)
- Create 1-foundations/quick-start.adoc (extract from setup docs)
- Create 1-foundations/core-concepts.adoc (extract from plugins/overview.adoc)
- Create 1-foundations/security-fundamentals.adoc (extract from security/overview.adoc)

**Afternoon:**
- Update sidebar HTML with new 9-part structure
- Add "Prerequisites" and "What's Next" to key tutorial pages (~10 files)
- Add learning path navigation to tutorial pages
- Create 3-graphql-websocket/choosing-api.adoc
- Create 7-security-plugins/overview.adoc

### Day 3: Polish & Testing (4-6 hours)
**Morning:**
- Add navigation helpers to remaining important pages (~20 files)
- Remove redundant content (quick pass through main files)
- Update cross-references

**Afternoon:**
- Test all 4 learning paths (click through each link)
- Verify sidebar navigation works
- Test search still works
- Check broken links
- Quick review of key pages

### Day 4 (Optional): Final Review & Launch (2-3 hours)
- Team review
- Fix any issues found
- Merge to v9 branch
- Update any external links
- Announce changes

---

## Success Metrics

### Quantitative
- **~100 files → ~80 files** (20% reduction)
- **Remove all 54 video references**
- **Add 4 learning paths**
- **Add navigation helpers to ~60 key pages**

### Qualitative
- **Clear learning paths** for different user types
- **Dual-mode documentation** - Learn mode + Reference mode
- **Reduced redundancy** - Each concept explained once, referenced elsewhere
- **Better organization** - Logical grouping into 9 parts
- **Easy to navigate** - Clear sidebar structure

### User Experience
- **New user:** Follow a learning path, reach competency in 2-4 hours
- **Returning user:** Use reference mode, find info in <2 clicks
- **Clear progress:** Know where you are in the learning journey

---

## Next Steps

1. **Review and approve this strategy**
2. **Week 1: Quick wins**
   - Remove all video references (I can do this now!)
   - Create directory structure
   - Move existing files to new locations
3. **Week 2: Start creating foundation files**

Would you like me to:
1. **Start removing video references** right away?
2. **Create the directory structure** and move files?
3. **Draft one of the new foundation files** as an example?

---

**Document Version:** 4.0  
**Date:** 2025-12-30  
**Author:** Documentation Analysis Agent  
**Status:** DRAFT - Reorganize + Learning Paths Approach
