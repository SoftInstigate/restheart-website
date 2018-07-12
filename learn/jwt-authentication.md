---
layout: docs
title: Json Web Token Authentication
---

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 


> Json Web Token Authentication Will be part of RESTHeart 3.3

You can have a preview from the current 3.3.0-SNAPSHOT version, donwload it from [sonatype](https://oss.sonatype.org/content/repositories/snapshots/org/restheart/restheart/3.3.0-SNAPSHOT/)

``` yml
# Jwt Authentication Manager 
# Authentication via Json Web Token https://jwt.io

# algorithm: RSA (RS256 | RS384 |RS512) or HMAC (HS256 | HS384 | HS512)
# key: for RSA the base64 encoded of the public key; for HMAC, the secret key
# base64Encoded: set to true if the jwt token is base64 encoded. optional, default valud: false
# usernameClaim: the claim that holds the username. optional, default value: 'sub' (jwt subject). 
# rolesClaim: the claim that holds the roles as string or array of strings
# issuer: verify the issues (iss claim). optional, default value matches: null (don't check iss)
# audience: verify the audience (aud claim). optional, default value matches: null (don't check aud)

auth-mechanism:
    implementation-class: org.restheart.security.impl.JwtAuthenticationManagerFactory
    algorithm: HS256
    key: secret
    base64Encoded: false
    usernameClaim: sub
    rolesClaim: roles
    issuer: myIssuer
    audience: myAudience
```

</div>