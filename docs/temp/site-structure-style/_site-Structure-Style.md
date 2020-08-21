---
title: Documentation site update
genesis: Milestone 1 19/06/2020
---

# Site Review v5 & Project Discussion 

## 1. Final site

Remain in Jekyll/GitHub pages.

## 2. Markdown v HTML

Where possible, remove HTML in favour of markdown equivalent.

## 3. Style Guide

US English

- Reduce word count (TLDR - fix too long didn't read)
- Remove capitalizations where possible (e.g. cloud v Cloud, microservice v Microservice)
- Reduce mix of formats (e.g. italic and bold)
- Apply plain English principles
- Concatenate (you're not you are)
- Standardise common terms
  - e.g. MongoDB (not mongoDB or variants)
  - e.g. microservice (not micro-service)
  - frontend (not front end)
  - RESTful API (then use acronym after first instance REST API)
  - Java (not lower)
  - JSON (not lower)
  - metadata

## 4. Project flow

- Meta applied to markdown files to record edit/spell check
- Document to store style and site decisions as _style-guide.md


## 5. Proposed site structure Docs down



| Main menu | Subsection                         | High-level Page	|    Existing / New Inner Pages                        | Notes |
|----------------|------------------------------------|-----------------------|------------------------------------------------|-------|
| **Introduction** |  |                       | docs/index.md & some of clustering.md | High level overview of what RESTHeart does.  Plus provide cards (as per [Features](https://restheart.org/features)) or sub menu for the following sections and their sub sections: |
| **Cloud**      |                                    |          | clustering.md | Consider similar to MongoDB's site and list all cloud-suitable option. Atlas/DocumentDB/AzureCosmos |
| **Get Started** |                  | Overview | basic data management & basic database management & basic security & basic authentication & basic plugins | High level overview of how RESTHeart does what it does |
|  |  | Quick start | setup.md |  |
|       |                 | Use cases   | Use cases (typical use cases & creative use case?=static-resources.md) | High level overview of why users may choose RESTHeart  |
|                |                 | Setup       | Prerequisites / Options: (Docker v Java(?)/zip ) | single source setup for quick start and tutorials |
|                |                 | Tutorials   | tutorial.md & tutorials.md                                 | Warrants further split to beginner/advanced |
| **Resources**  | Roadmap                            |                       | roadmap.md & upgrade-to-v5.md |  |
|                | Quick Reference | Overview | Intro and links | Feed page for REST data management, database management, customisation (non security), customisation (security), native security |
| |  | Data Management | quick-reference.md mgmt/dbs-collections.md & write-docs.md & read-docs.md & resource-uri.md & aggregations.md &  files.md & csv.md & json-schema-validation.md & mgmt/indexes.md & shard-keys.md & auditing.md & security/user-management.md | (=Content API) + |
| |  | Database Management | change-streams.md & transactions.md & mgmt/relationships.md & etag.md & cors-support.md & representation-format.md & resource-uri.md | (=Management API) |
|                |    | Plugins | plugins/core-plugins.md & plugins/deploy.md & plugins/overview.md & speedup-requests-with-cursor-pools.md & | Link to Security/security-plugins.md                   |
|                |        | Security | security/overview.md & security/authentication.md & security/authorization.md  & security/how-clients-authenticate.md & security/secure-connection-to-mongodb.md & security/tls.md & plugins/security-plugins.md & proxy.md | May be worth have a "native" security v customisable security structure |
|  |  | Specifications | performances.md & monitoring.md & parts of json-schema-validation.md |               |

## 6. Consequence of restructure from Docs down

There need not be any major impact to the pages at the same level as Docs e.g. [Features](https://restheart.org/features) can still act as lead page for the sub pages within Docs. It may be that the sub page link can be improved e.g. the Docker link feeds through to setup, but the final decision may be to have a setup using Docker v setup using Java.

Consider staying fairly agile with regards to the inner pages, maintain as is where possible, break them out into multi pages where it makes sense. This is probably best left as an iterative process. 

Consider creating **see also**... between linked items (e.g. Resources > Quick Reference > Customisation and plugins in Resources > Quick Reference > Security), the "cards" used in Features would suit this.

## 7. Predicted user flow

> Direct expert users path 1a. Resources > Quick Reference OR b. Get Started > Setup > Quick Start
> Direct novice users path 2. Get Started > Overview > Use Cases > Setup > Tutorials

## 8. General notes on user-type

From the point of view of a complete beginner, it gets technical fast. To attract novice users more scaffolding is required. Options include:

- simple how tos for setting up MongoDB (OR linking to relevant sections of their docs. NB consequence would be testing all external links on build)
- simple how tos for setting up RESTHeart (i.e. providing a big picture before the fine details)
- guiding novice to the relevant tutorial/s that exist once knowledge is scaffolded to that stage OR creating additional simplified tutorials
- splitting out a beginners path v advanced path once the documentation is completed


## 9. Single Sourcing (SS)

Single sourcing can be achieved through structuring content e.g. prerequisite page to SS (write-docs.md & read-docs.md & tutorial.md, & files.md all have the same prerequisite e.g. *"assume platform runs on local host with default configuration"*). 

Snippet use is also possible using Jekyll's includes (_includes). Recommend having an _included.md as a scratch pad file to log includes.

### Possible SS whole-page issues that may require includes

Docs > Get Started > Quicks Reference > High level overview of how RESTHeart does what it does may duplicate [landing page](https://restheart.org/)

Docs > Get Started > Quickstart  may duplicate [Get](https://restheart.org/get)


## 10. Edit and proofing required









