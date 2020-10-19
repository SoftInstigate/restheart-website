---
title: Auditing
layout: docs
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

-   [Opentracing / zipkin headers support](#opentracing--zipkin-headers-support)
    -   [Configuration](#configuration)

</div>
<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content">

{% include docs-head.html %}

{% include doc-in-progress.html %}

## Opentracing / zipkin headers support

This implements issue [#287](https://github.com/SoftInstigate/restheart/issues/287). It's a very slim implementation that will imho fit most use-cases. Incoming headers are copied to the response. If there are no headers set, we'll generate some and send them back. The `X-B3-TraceId` will be written to the logs (by default inside of the [%thread] marks).

This implementation makes it possible to correlate logged exceptions (in case this happens) with the corresponding request log, even when the thread handling the message is re-used shortly after.

It handles all headers mentioned in https://github.com/openzipkin/b3-propagation, as well as the uber-trace-id header that is used by Jaeger (see https://www.jaegertracing.io/docs/client-libraries/#trace-span-identity) to get broader support.

### Configuration

`metrics-gathering-level`: metrics gathering for which level? OFF => no gathering, ROOT => gathering at root level, DATABASE => at db level, COLLECTION => at collection level
WARNING: use requests-log-level level 2 only for development purposes, it logs user credentials (Authorization and Auth-Token headers).

Example `restheart.yml` fragment:

```
metrics-gathering-level: DATABASE
requests-log-trace-headers:
#  - x-b3-traceid      # vv Zipkin headers, see https://github.com/openzipkin/b3-propagation
#  - x-b3-spanid
#  - x-b3-parentspanid
#  - x-b3-sampled      # ^^
#  - uber-trace-id     # jaeger header, see https://www.jaegertracing.io/docs/client-libraries/#trace-span-identity
#  - traceparent       # vv opencensus.io headers, see https://github.com/w3c/distributed-tracing/blob/master/trace_context/HTTP_HEADER_FORMAT.md
#  - tracestate        # ^^
```

</div>
