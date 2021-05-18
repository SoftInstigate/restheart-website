---
title: User Management
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Introduction](#introduction)
-   [User document](#user-document)
-   [Get existing users](#get-existing-users)
-   [Create a user](#create-a-user)
-   [Update a user](#update-a-user)
-   [Delete a user](#delete-a-user)
-   [Create an ACL document](#create-an-acl-document)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

## Introduction

This section provides instructions on how to create, update and delete users with [mongoRealAuthenticator](/docs/security/authentication/#mongo-realm-authenticator).

It also shows how to manage permissions with [mongoAclAuthorizer](/docs/security/authorization/#mongo-acl-authorizer).

{: .bs-callout.bs-callout-info}
**mongoRealAuthenticator** uses the collection `/users` by default.

### Before running the example requests

The following examples assume RESTHeart running on the localhost with the default configuration: the database _restheart_ is bound to `/` and the user _admin_ exists with default password _secret_.

## User document

With the default configuration, a user is represented as follows:

```json
{
    "_id": "username",
    "roles": [ "list", "of", "roles" ],
    "password": "secret"
}
```

{: .bs-callout.bs-callout-info}
**mongoRealAuthenticatorr** can be configured to use different properties for the username, roles an password. Check [mongoRealAuthenticator](/docs/security/authentication/#mongo-realm-authenticator) for more information.

## Get existing users

{% include code-header.html type="Request"
    link="http://restninja.io/share/b6876216ee3fb0999f7c5178e42a7978f6cc3c4c/0"
%}

```http
GET /users HTTP/1.1
```

{% include code-header.html type="Response" %}

```json
[
  {
    "_id": "admin",
    "roles": [
      "admin"
    ],
    "_etag": {
      "$oid": "5d2edb155883c050065d6a8a"
    }
  }
]
```

{: .bs-callout.bs-callout-info}
The password is always hidden on GET requests.

{: .bs-callout.bs-callout-warning}
For security reasons, it not possbile to use the `filter` query parameter on the password field; the following request is forbidden and will cause an error: `GET /users?filter={"password":{"$regex":"^a.*"}}`

## Create a user

{% include code-header.html type="Request"
    link="http://restninja.io/share/38c1eb85a21213dd39192ccd474789f4abdbd6bc/0"
%}

```http
POST /users HTTP/1.1

{
    "_id": "foo",
    "roles": [ "user" ],
    "password": "secret"
}
```

{: .bs-callout.bs-callout-info}
The password is automatically encrypted by RESTHeart.

## Update a user

{% include code-header.html type="Request"
    link="http://restninja.io/share/3e541e5b4f1ce82ae255b8f6746d49f5faed9778/0"
%}

```http
PATCH /users/foo HTTP/1.1

{
    "password": "betterSecret"
}
```

## Delete a user

{% include code-header.html type="Request"
    link="http://restninja.io/share/ae4858bc59f5ac755f03dc8858220e0a470a3779/0"
%}

```http
DELETE /users/foo HTTP/1.1
```

## Create an ACL document

{% include code-header.html type="Request"
    link="http://restninja.io/share/5ee142fbb84071261e56fc7f1904af6430b0495f/0"
%}

```http
POST /acl HTTP/1.1

{
  "predicate": "path-prefix[/inventory] and method[GET]",
  "roles": [ "user" ],
  "priority": 1,
  "readFilter": null,
  "writeFilter": null
}
```

{: .bs-callout.bs-callout-info }
If the /acl collection has not been created before and you get 404 Not Found, create if first with:

{% include code-header.html type="Request"
    link="http://restninja.io/share/eff74b1879d09706d2d9a7bdaafb649a4415c9a2/0"
%}

```http
PUT /acl HTTP/1.1
```

{: .bs-callout.bs-callout-info }
Watch [Managing users with practical examples](https://www.youtube.com/watch?v=QVk0aboHayM&t=1828s)
