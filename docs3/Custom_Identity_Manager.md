---
layout: docs
title: Custom Identity Manager
---

* [Introduction](#introduction)
* [Develop](#develop)
    * [The IDM class](#the-idm-class)
    * [Methods to implement](#methods-to-implement)
* [Configuration](#configuration)
* [Add custom classes to the classpath](#add-custom-classes-to-the-classpath)
    * [Using the java classpath option](#using-the-java-classpath-option)
    * [Using the Maven shade plugin](#using-the-maven-shade-plugin)
* [Example](#example)

**/\*\*/ Introduction Develop The IDM class Methods to implement
Configuration Add custom classes to the classpath Using the java
classpath option Using the Maven shade plugin Example**

This section will provide detailed information on how to implement a
custom IDM.

For further help, please refer to the RESTHeart support channels
<http://restheart.org/support.html>

## Introduction

The Identity Manager is responsible of authenticating the users
verifying the credentials provided via the [basic authentication
mechanism](How_Clients_authenticate).

Following the dependency injection approach, the actual IDM
implementation to use is specified in the configuration file.

There are some ready-to-use IDM implementations and custom ones can be
developed.

This section explains how to develop a custom IDM.

If you develop a general purpose IDM please consider contributing to
[RESTHeart project](https://github.com/softinstigate/restheart) using
the github pull request feature.

The steps required to develop and configure an IDM are:

1.  develop the IDM in Java
2.  configure RESTHeart to use the new IDM via its configuration file
3.  add the implementation class(es) to the java classpath

## Develop

### The IDM class

The IDM implementation class must implement the interface
*io.undertow.security.idm.IdentityManager *available from the
*undertow-core* package. 

**maven coordinates of undertow-core package**

``` plain
<dependency>
  <groupId>io.undertow</groupId>
  <artifactId>undertow-core</artifactId>
  <version>1.2.12.Final</version>
</dependency>
```

The IDM is a singleton instance of this class.

Constructor

The constructor must have the following signature:

``` plain
public MyIdentityManager(Map<String, Object> args)
```

The argument *args* maps the idm properties as specified in the
configuration file.

### Methods to implement

The interface *io.undertow.security.idm.IdentityManager* mandates to
implement 3 *verify* methods:

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Modifier and Type</th>
<th>Method and Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>Account</code></td>
<td><code>verify(Account account)</code>
<div class="block">
Verify a previously authenticated account.
</div></td>
</tr>
<tr class="even">
<td><code>Account</code></td>
<td><code>verify(Credential credential)</code>
<div class="block">
Perform verification when all we have is the Credential, in this case the IdentityManager is also responsible for mapping the Credential to an account.
</div></td>
</tr>
<tr class="odd">
<td><code>Account</code></td>
<td><code>verify(String id, Credential credential)</code>
<div class="block">
Verify a supplied <code>Credential</code> against a requested ID.
</div></td>
</tr>
</tbody>
</table>

The actual check occurs in the third *verify* method. They can be
implemented as follows.

``` plain
@Override
public Account verify(Account account) {
     // need to re-verify previously authenticated account? If not, leave as follows.
     return account;
}
 
@Override
public Account verify(Credential credential) {
     // always return null because we use basic authentication and the id is always provided
     return null;
}
 
public Account verify(String id, Credential credential) {
    
    if (credential instanceof PasswordCredential) {
        char[] password = ((PasswordCredential) credential).getPassword();
        
        // here check the id and password
        ....
    } else {
        return null;
    }
}
```

The *Credential* argument is actually an instance
of *io.undertow.security.idm.PasswordCredential*

The *verify* methods should return *null* for invalid credentials or an
instance of *org.restheart.security.impl.SimpleAccount *whose
constructor allows to instantiate an immutable *Account* object that
includes roles as an *Array&lt;Strings&gt; *object.

## Configuration

The IDM is configured in the *idm* section of the yaml configuration
file.

Here you specify the actual IDM implementation to use and any parameters
it needs (for instance, the path of the file where the passwords are
defined or some parameters that control caching).

For example, if the *idm* configuration section is:

``` plain
idm:    
    implementation-class: org.restheart.examples.security.MyIdentityManager
    arg1: 5
    arg2: hey man!
    arg3:
        arg31: 1
        arg32: 2
```

Then:

-   the IDM singleton will be of class *MyIdentityManager*
-   its constructor will be invoked passing a Map argument with 4 keys
    1.  *implementation-class* of class String
    2.  *arg1* of class *Integer*
    3.  *arg2* of class *String*
    4.  *arg3* of class *Map&lt;String, Object&gt;*, having in turn 2
        keys (*arg31* and *arg32*)

## Add custom classes to the classpath

### Using the java classpath option

The custom classes must be added to the java classpath.

In order to achieve this, start RESTHeart with the following command:

``` plain
$ java -server -classpath restheart.jar:custom-classes.jar org.restheart.Bootstrapper restheart.yml
```

### Using the Maven shade plugin

The [maven share
plugin](https://maven.apache.org/plugins/maven-shade-plugin/) provides
the capability to package the artifact in an uber-jar, including its
dependencies and to *shade* - i.e. rename - the packages of some of the
dependencies.

 It allows to create a single jar including any RESTHeart class and your
custom ones. In this case you can start RESTHeart with

``` plain
$ java -server -jar restheart_plus_custom.jar restheart.yml
```

## Example

A project with RESTHeart customization examples is available on github;
find it
at [restheart-customization-examples](https://github.com/SoftInstigate/restheart-customization-examples).

It includes the **ExampleIdentityManager;** this is a simple IDM that
verifies the *password* to be the flipped *userid* string. In case the
user id is 'admin', it also associate the user with the ADMIN role and,
in all other cases, with the 'USER' role.

The implementation class follows:

``` java
package org.restheart.examples.security;

import com.google.common.collect.Sets;
import io.undertow.security.idm.Account;
import io.undertow.security.idm.Credential;
import io.undertow.security.idm.IdentityManager;
import io.undertow.security.idm.PasswordCredential;
import java.util.Map;
import java.util.Set;
import org.restheart.security.impl.SimpleAccount;

/**
 * ExampleIdentityManager verifies the password to be the flipped id string,
 * i.e. id="username" => pwd="emanresu"
 *
 * @author Andrea Di Cesare <andrea@softinstigate.com>
 */
public class ExampleIdentityManager implements IdentityManager {
    public enum ROLE {
        ADMIN, USER
    };

    public ExampleIdentityManager(Map<String, Object> args) {
        // args are ignored
    }

    public static final String ADMIN_ID = "admin";

    private static final Set<String> NORMAL_USER_ROLES;
    private static final Set<String> ADMIN_ROLES;

    static {
        NORMAL_USER_ROLES = Sets.newHashSet(ROLE.USER.toString());
        ADMIN_ROLES = Sets.newHashSet(ROLE.ADMIN.toString());
    }

    @Override
    public Account verify(String id, Credential credential) {
        if (credential instanceof PasswordCredential) {
            char[] password = ((PasswordCredential) credential).getPassword();

            String flippedPassword = new StringBuilder(new String(password))
                    .reverse()
                    .toString();

            if (id.equals(flippedPassword)) {
                if (id.equals(ADMIN_ID)) {
                    return new SimpleAccount(id, password, ADMIN_ROLES);
                } else {
                    return new SimpleAccount(id, password, NORMAL_USER_ROLES);
                }
            }
        }

        return null;
    }

    @Override
    public Account verify(Account account) {
        return account;
    }

    @Override
    public Account verify(Credential credential) {
        // Auto-generated method stub
        return null;
    }
}
```
