---
title: Json Web Token Authentication
layout: docs
---

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 


Json Web Token (JWT) Authentication is available starting from RESTHeart 3.3.

To enable it, you have to add the following configuration fragment to the `restheart.yml` file, editing below parameters accordingly to your needs. 

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