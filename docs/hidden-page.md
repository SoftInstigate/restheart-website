---
title: Hidden page
layout: docs
---

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 




```
GET /pippo HTTP/1.1
```

## Parsing log message



```
[main] WARN  org.restheart.Configuration - >>> Overriding parameter 'mongo-uri' with environment value 'MONGO_URI=mongodb://127.0.0.1'
```

## Parsing yml


```
## configuration file for requestPredicatesAuthorizer
permissions:
    # OPTIONS is always allowed
    - role: $unauthenticated
      predicate: path-prefix[path="/"] and method[value="OPTIONS"]
      
    - role: $unauthenticated
      predicate: path-prefix[path="/echo"] and method[value="GET"]
    
    - role: admin
      predicate: path-prefix[path="/"] and method[value="OPTIONS"]
      
    - role: admin
      predicate: path-prefix[path="/"]
    
    - role: user
      predicate: path-prefix[path="/"] and method[value="OPTIONS"]

    - role: user
      predicate: path-prefix[path="/secho"] and method[value="GET"]

    - role: user
      predicate: path[path="/secho/foo"] and method[value="GET"]

    - role: user
      predicate: (path[path="/echo"] or path[path="/secho"]) and method[value="PUT"]

    # This to check the path-template predicate
    - role: user
      predicate: path-template[value="/secho/{username}"] and equals[%u, "${username}"]

    # This to check the regex predicate
    - role: user
      predicate: regex[pattern="/secho/(.*?)", value="%R", full-match=true] and equals[%u, "${1}"]
```

## Richieste HTTP: separare body e request/response


{% include code-header.html 
    type="Request" 
    link="http://restninja.io/share/2f4fa18afdfd17aa5b1ce0af0e99316015d905a4/0"
%}


``` http
POST /inventory HTTP/1.1
```


``` http
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 384
Content-Type: application/hal+json
Date: Mon, 08 Jul 2019 12:56:14 GMT
ETag: 5d233840dd860b259a3bad45
X-Powered-By: restheart.org
```


``` json
[
   { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
   { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
   { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
   { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
   { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]

```


### invece di 


```
POST /inventory HTTP/1.1

[
   { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
   { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
   { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
   { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
   { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]

```

### oppure 


``` http
POST /inventory HTTP/1.1

[
   { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
   { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
   { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
   { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
   { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]

```


## Se solo headers non fare il parsing con http ma con properties 
### (senza la prima riga di REQUEST/RESPONSE non viene fatto il parsing degli headers)


``` http
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Auth-Token: 1o6j8dt1f5y6jlu05t0blw2q4g280cgdv8253ilqhyoskoi5de
Auth-Token-Location: /tokens/admin
Auth-Token-Valid-Until: 2019-07-04T09:26:41.654633Z
Connection: keep-alive
Content-Length: 0
Content-Type: application/json
Date: Thu, 04 Jul 2019 09:11:41 GMT
ETag: 5d1dc2cd0951267987cf8ab2
X-Powered-By: restheart.org
```


``` properties
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Expose-Headers: Location, ETag, X-Powered-By
Auth-Token: 1o6j8dt1f5y6jlu05t0blw2q4g280cgdv8253ilqhyoskoi5de
Auth-Token-Location: /tokens/admin
Auth-Token-Valid-Until: 2019-07-04T09:26:41.654633Z
Connection: keep-alive
Content-Length: 0
Content-Type: application/json
Date: Thu, 04 Jul 2019 09:11:41 GMT
ETag: 5d1dc2cd0951267987cf8ab2
X-Powered-By: restheart.org
```

</div>


