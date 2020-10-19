---
title: Shard Keys
layout: docs
---

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %} 


> The shard key determines the distribution of the collection’s documents among a cluster’s shards.

When a shared collection has shard key different than _id or a compound shard key, the `shardkey` query parameter must be used.

Example: if the shard key is `X` 

``` plain
GET /db/coll/5ac9f95563445900062144aa?shardkey={"X":1}
```

</div>