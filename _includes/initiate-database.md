The root resource `/` is bound to the `/restheart` database. This database, however, **doesn't exist** until you explicitly create it by issuing a `PUT /` HTTP command.

Example for localhost:

```bash
$ curl --user admin:secret -I -X PUT :8080/
HTTP/1.1 201 OK
```

RESTHeart will start bound on HTTP port `8080`.