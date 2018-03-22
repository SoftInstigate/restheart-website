---
layout: docs
title: Release Management
---

The project has one “master” where all the new code is committed
(unreleased versions) while released versions are tagged on `master` and
then maintained in their own branches (named `1.0.x`, `1.1.x`, `1.2.x`,
….).

## Process

1.  As soon as a minor release is finalized (e.g we released 2`.0.0`) we
    tag it on `master`
2.  Then we create the related support branch, in this case named
    2`.0.x`, with version set to 2`.0.1-SNAPSHOT`. Hotfixes for
    2`.0.x` will go here.
3.  The master branch is then where 2`.1.x` new minor release
    development begins, and the POM version is set at 2`.1.0-SNAPSHOT`
4.  When 2`.1.0` is final, the process starts again from point \#1.

Releases and their version numbers will strictly follow a [Semantic
Versioning](http://semver.org/) policy.

Rif: <http://www.softinstigate.com/blog/2015/10/08/better-branching-model/>
