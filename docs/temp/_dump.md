Parking for items I don't think we need



## Docker log file

You should see something similar to the following logs:

```
...
restheart    |  09:50:46.619 [main] INFO  o.r.mongodb.db.MongoClientSingleton - Connecting to MongoDB...
restheart-mongo | 2020-04-26T09:50:46.633+0000 I  NETWORK  [listener] connection accepted from 172.19.0.3:42898 #2 (2 connections now open)
restheart-mongo | 2020-04-26T09:50:46.635+0000 I  NETWORK  [conn2] received client metadata from 172.19.0.3:42898 conn2: { driver: { name: "mongo-java-driver|legacy", version: "3.11.2" }, os: { type: "Linux", name: "Linux", architecture: "amd64", version: "4.19.76-linuxkit" }, platform: "Java/Debian/11.0.6+10-post-Debian-1bpo91" }
restheart-mongo | 2020-04-26T09:50:46.636+0000 I  SHARDING [conn2] Marking collection admin.system.users as collection version: <unsharded>
restheart-mongo | 2020-04-26T09:50:46.870+0000 I  ACCESS   [conn2] Successfully authenticated as principal restheart on admin from client 172.19.0.3:42898
restheart    |  09:50:46.892 [main] INFO  o.r.mongodb.db.MongoClientSingleton - MongoDB version 4.2.1
restheart    |  09:50:46.893 [main] WARN  o.r.mongodb.db.MongoClientSingleton - MongoDB is a standalone instance.
restheart    |  09:50:47.156 [main] INFO  org.restheart.mongodb.MongoService - URI / bound to MongoDB resource /restheart
restheart    |  09:50:47.482 [main] INFO  org.restheart.Bootstrapper - HTTP listener bound at 0.0.0.0:8080
restheart    |  09:50:47.483 [main] DEBUG org.restheart.Bootstrapper - Content buffers maximun size is 16777216 bytes
restheart    |  09:50:47.498 [main] INFO  org.restheart.Bootstrapper - URI / bound to service mongo, secured: true
restheart    |  09:50:47.501 [main] INFO  org.restheart.Bootstrapper - URI /ic bound to service cacheInvalidator, secured: false
restheart    |  09:50:47.502 [main] INFO  org.restheart.Bootstrapper - URI /csv bound to service csvLoader, secured: false
restheart    |  09:50:47.503 [main] INFO  org.restheart.Bootstrapper - URI /roles bound to service roles, secured: true
restheart    |  09:50:47.504 [main] INFO  org.restheart.Bootstrapper - URI /ping bound to service ping, secured: false
restheart    |  09:50:47.506 [main] INFO  org.restheart.Bootstrapper - URI /tokens bound to service rndTokenService, secured: false
restheart    |  09:50:47.506 [main] DEBUG org.restheart.Bootstrapper - No proxies specified
restheart    |  09:50:47.515 [main] DEBUG org.restheart.Bootstrapper - Allow unescaped characters in URL: true
restheart    |  09:50:47.771 [main] INFO  org.restheart.Bootstrapper - Pid file /var/run/restheart-security--1411126229.pid
restheart    |  09:50:47.773 [main] INFO  org.restheart.Bootstrapper - RESTHeart started
```


