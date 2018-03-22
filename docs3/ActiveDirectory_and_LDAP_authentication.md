---
layout: docs
title: ActiveDirectory and LDAP authentication 
---

* [Introduction](#introduction)
    * [Configuration](#configuration)
    * [Roles and Groups](#roles-and-groups)

## Introduction

A simple implementation of LDAP authentication has been provided and can
be specified in the configuration file.  Written for use in an
environment using Active Directory, it provides basic authentication
against the configured LDAP or AD provider.  

  

Warning

While this implementation has been tested to work in my environment, it
has not been thoroughly scrutinized by any security professional, and I
am not an expert in authentication. If you see improvements that can be
made, please don't hesitate to bring them to our attention.

### Configuration

In restheart.yml, update the idm implementation-class to use
ADIdentityManager:

``` text
idm:    
    implementation-class: org.restheart.security.impl.ADIdentityManager
    conf-file: ./etc/security.yml
```

The conf-file value specifies where additional security configuration
details will be configured.  In this file, you must configure the domain
controller(s) and the principal name suffix(es) to be used in
authentication.

``` text
## Config for AD Identity Manager
adim:
    - domainControllers: ldap://eastdc.example.com, ldap://westdc.example.com
      principalNameSuffixes: corp.example.com, example.com
```

You must specify at least one value for domainControllers, and at least
one value for principalNameSuffixes.  The ADIdentityManager will attempt
to authenticate against each DC using the username and any
principalNameSuffixes until it exhausts all combinations or successfully
authenticates. For the example configuration above and a given username
of "john", the following attempts would be made (in this order):

-   eastdc.example.com : <john@corp.example.com>
-   eastdc.example.com : <john@example.com>
-   westdc.example.com : <john@corp.example.com>
-   westdc.example.com : <john@example.com>

In many cases, only one domain controller or principal name suffix are
needed.  

### Roles and Groups

Once authenticated, the group memberships of the user will be retrieved
and used by the Access Manager to determine authorization of actions on
various collections (see: [Enable and Configure
Security\#SimpleAccessManager](Enable-and-Configure-Security_13369378.html#EnableandConfigureSecurity-SimpleAccessManager)).
 Within the permissions section of security.yml, you must use the group
names from your AD or LDAP system rather than the default examples in
the file.  An example:

``` text
permissions:
# Users with role 'DevOps' can do anything
    - role: DevOps
      predicate: path-prefix[path="/"]
```

  

  
