---
docs_version: 9
title: Monitoring & Metrics
layout: docs
menu: setup
applies_to: restheart
redirect_from:
  - /docs/monitoring
  - /docs/metrics
---

<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">

* [Architecture](#architecture)
* [Configuration](#configuration)
* [Metrics UI](#metrics-ui)
* [Tutorial](#tutorial)
* [Prometheus Endpoint](#prometheus-endpoint)
* [Handling Missing Registries](#handling-missing-metrics-registries)
* [Metric Labels](#metric-labels)
* [Custom Metrics](#custom-metrics-restheart-v9)
* [Disabling Metrics](#disabling-metrics)
* [See Also](#see-also)

</div>

<div markdown="1" class="col-12 col-md-9 col-xl-8 py-md-3 bd-content pt-0">
{% include docs-head.html %}

## Architecture

RESTHeart includes a built-in metrics system that collects HTTP request data and optionally JVM metrics, exposes them in Prometheus format via a REST endpoint, and provides a real-time browser dashboard (v9.5.0+).

```
┌──────────────┐    Prometheus     ┌──────────────────┐     HTML/JS     ┌─────────────────┐
│  RESTHeart   │─── text format ──▶│  GET /metrics    │◀────────────────│  /metrics-ui    │
│  (interceptor│    on demand      │  (MetricsService)│    Chart.js     │  (embedded SPA) │
│   collects)  │                   └──────────────────┘                 └─────────────────┘
└──────────────┘
```

The metrics module has four components:

| Component | Type | Description |
|---|---|---|
| **RequestsMetricsCollector** | Interceptor (`REQUEST_BEFORE_AUTH`) | Records timing and count for every HTTP request, grouped by method + status code + path template |
| **JvmMetricsCollector** | Initializer | Optionally registers JVM memory and GC metrics (disabled by default) |
| **MetricsService** | Service (`GET /metrics`) | Serves aggregated metrics in Prometheus exposition format |
| **Metrics UI** | Embedded static page (v9.5.0+) | Self-contained dashboard at `/metrics-ui` that visualizes metrics in real time |

## Configuration

Metrics configuration is in `restheart.yml` (or overridden via the `RHO` environment variable).

### Metrics Service

```yaml
metrics:
  enabled: true                          # enable/disable the metrics service
  uri: /metrics                          # endpoint path
  missing-registry-status-code: 404      # HTTP status when no registries exist (404 or 200)
```

### Request Metrics Collector

```yaml
requestsMetricsCollector:
  enabled: true
  include: ["/*"]                        # path patterns to track
  exclude: ["/metrics", "/metrics/*"]    # path patterns to skip (avoids feedback loop)
```

Metrics will be gathered for requests that match the path templates specified in the `include` criteria and do not match those listed in the `exclude` criteria.

Note that when using the variable `{tenant}` in the include path templates, the metrics will be tagged with `path_template_param_tenant=<value>`. This tagging does not apply when using wildcards in path templates.

### JVM Metrics Collector

```yaml
jvmMetricsCollector:
  enabled: false   # set to true to expose JVM memory and GC metrics
```

Additionally, RESTHeart captures JVM metrics such as memory usage and garbage collector data.

### Metrics UI (Static Resources)

> **Note**: The embedded Metrics UI dashboard is available starting from RESTHeart v9.5.0.

The dashboard is served as an embedded static resource:

```yaml
static-resources:
  - what: static/metrics
    where: /metrics-ui
    welcome-file: restheart-metrics.html
    embedded: true
```

No additional configuration is needed — the UI is built into the `restheart-metrics` JAR.

## Metrics UI

> **Note**: The Metrics UI is available starting from RESTHeart v9.5.0.

Open `/metrics-ui` in a browser while RESTHeart is running. The dashboard connects to the RESTHeart server and displays real-time metrics.

### Connection

1. Enter the RESTHeart server URL (e.g. `http://localhost:8080`) in the **server** field
2. Provide authentication credentials (default: `admin` / `secret`)
3. Click **connect**

The dashboard auto-discovers available metric registries by calling `GET /metrics`.

### Dashboard Panels

| Panel | Description |
|---|---|
| **KPI Row** | Total requests (since startup), request rate (1-min and 5-min rolling), latency percentiles (p50, p95, p99) |
| **Request Rate Chart** | Time-series line chart of requests/sec per method+status combination |
| **Request Count Chart** | Bar chart of cumulative request counts per method+status |
| **Latency Panels** | Distribution bars showing p50, p75, p95, p98, p99, p999 latency in milliseconds |

### Features

- **Auto-refresh**: Configurable interval (5s, 10s, 15s, 30s, 1m). Enabled by default at 30s.
- **Filter chips**: Click to toggle visibility of specific method+status combinations. Preferences are persisted in `localStorage` per host.
- **Dark theme**: Optimized for monitoring screens and low-light environments.

## Tutorial

Run RESTHeart with metrics enabled and specify a configuration:

```bash
$ docker run --rm -p "8080:8080" -e RHO="/http-listener/host->'0.0.0.0';/mclient/connection-string->'mongodb://host.docker.internal';/ping/uri->'/acme/ping';/requestsMetricsCollector/enabled->true;/jvmMetricsCollector/enabled->true;/requestsMetricsCollector/include->['/{tenant}/*']" softinstigate/restheart
```

With the given `RHO` env variable, the configuration is:

```yaml
ping:
  uri: /acme/ping # change the ping service uri for testing purposes
metrics:
  enabled: true
  uri: /metrics
requestsMetricsCollector:
  enabled: true
  include:
    - /{tenant}/*
  exclude:
    - /metrics
    - /metrics/*
jvmMetricsCollector:
  enabled: true
```

Now, make a few requests to /acme/ping using [httpie](https://httpie.io/).

```bash
$ http -b :8080/acme/ping
{
    "client_ip": "127.0.0.1",
    "host": "localhost:8080",
    "message": "Greetings from RESTHeart!",
    "version": "8.4.0"
}

$ http -b :8080/acme/ping
{
    "client_ip": "127.0.0.1",
    "host": "localhost:8080",
    "message": "Greetings from RESTHeart!",
    "version": "8.4.0"
}

$ http -b :8080/acme/ping
{
    "client_ip": "127.0.0.1",
    "host": "localhost:8080",
    "message": "Greetings from RESTHeart!",
    "version": "8.4.0"
}
```

Now we can ask for available metrics:

```bash
$ http -b -a admin:secret :8080/metrics
[
    "/jvm",
    "/{tenant}/ping"
]
```

Let's get the metrics for requests matching `"/{tenant}/*"`:

```bash
$ http -b -a admin:secret :8080/metrics/{tenant}/\*

(omitting many rows)
http_requests_count{request_method="GET",path_template="/{tenant}/*",response_status_code="200",path_template_param_tenant="acme",} 3.0
```

The response is in prometheus format. The highlighted row is the metrics `http_requests_count` with value `3` and the following tags:

```bash
request_method="GET"
path_template="/{tenant}/*"
response_status_code="200",
path_template_param_tenant="acme"
```

## Prometheus Endpoint

The `/metrics` endpoint returns metrics in Prometheus exposition format. You can scrape it with Prometheus or any compatible tool.

### List Registries

```bash
$ curl -u admin:secret http://localhost:8080/metrics
```

Returns a JSON array of available registries:

```json
["/requests"]
```

If `jvmMetricsCollector` is enabled, you'll also see `/jvm`.

### Get Registry Metrics

```bash
$ curl -u admin:secret http://localhost:8080/metrics/requests
```

Returns Prometheus text format:

```
# HELP requests_total Total number of HTTP requests
# TYPE requests_total counter
requests_total{response_status_code="200",request_method="GET",path_template="/{db}/{coll}"} 142
# HELP requests_rate_1m Request rate (1-minute moving average)
# TYPE requests_rate_1m gauge
requests_rate_1m{response_status_code="200",request_method="GET",path_template="/{db}/{coll}"} 2.35
```

### Prometheus Scrape Config

Define the following prometheus configuration file `prometheus.yml`:

```yaml
global:
  scrape_interval: 5s
  evaluation_interval: 5s

scrape_configs:
  - job_name: 'restheart'
    metrics_path: '/metrics/requests'
    basic_auth:
      username: 'admin'
      password: 'secret'
    static_configs:
      - targets: ['localhost:8080']

  # If you also want JVM metrics:
  - job_name: 'restheart jvm'
    metrics_path: '/metrics/jvm'
    basic_auth:
      username: 'admin'
      password: 'secret'
    static_configs:
      - targets: ['localhost:8080']
```

Run prometheus with:

```bash
$ docker run --rm --name prometheus -p 9090:9090 -v ./prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus --config.file=/etc/prometheus/prometheus.yml
```

Prometheus will start scraping restheart metrics. Note that given the default `exclude` path templates, metrics for prometheus requests are not collected.

Open `localhost:9090` with your browser and check the metrics:

![restheart metrics shown in prometheus](https://github.com/SoftInstigate/restheart/assets/6876503/154b3e6c-bc42-4751-af2d-7e2928746fa4)

## Handling Missing Metrics Registries

> added in RESTHeart v. 8.9.0

By default, RESTHeart returns HTTP 404 when a metrics registry for a requested path does not exist (i.e., no matching traffic has occurred yet). This behavior is compatible with legacy clients that expect a 404 for non-existent metrics.

However, some monitoring tools (such as Prometheus) expect a 200 OK response from metrics endpoints, even if no metrics are available yet. To support this, you can configure RESTHeart to return HTTP 200 with an empty body for missing registries.

To enable Prometheus compatibility, starting from RESTHeart v 8.9.0 you can add the following to your configuration:

```yaml
metrics:
  enabled: true
  uri: /metrics
  missing-registry-status-code: 200   # Return 200 OK with empty body for missing registries
```

> **Note**: If `missing-registry-status-code` is not set, RESTHeart will return 404 by default.

Summary of behaviors:

- `missing-registry-status-code: 404` (default): Returns 404 for missing registries (legacy clients)
- `missing-registry-status-code: 200`: Returns 200 OK with empty body (Prometheus-friendly)

## Metric Labels

HTTP request metrics include the following labels:

| Label | Description | Example |
|---|---|---|
| `request_method` | HTTP method | `GET`, `POST`, `PUT`, `DELETE` |
| `response_status_code` | HTTP status code | `200`, `404`, `500` |
| `path_template` | Matched path template | `/{db}/{coll}`, `/{db}/{coll}/{id}` |

### Custom Labels

The `org.restheart.metrics.Metrics.attachMetricLabels(Request<?> request, List<MetricLabel> labels)` method provides the capability to include custom labels in the metrics that are being collected.

For example, the `GraphQLService` utilizes this method to include the `query` label in the metrics, which corresponds to the name of the executed GraphQL query.

Plugins can also attach custom labels using the `Metrics` API:

```java
Metrics.addMetricLabel(request, "tenant", "acme-corp");
```

These labels will appear in the `/metrics` output and in the Metrics UI filter panel.

## Custom Metrics (RESTHeart v9)

RESTHeart v9 introduces a programmatic API for registering and collecting custom application-specific metrics. This allows you to track business metrics, performance indicators, and domain-specific measurements alongside the built-in HTTP and JVM metrics.

Custom metrics are automatically exposed alongside built-in metrics at `/metrics` in Prometheus format.

### Supported Metric Types

RESTHeart supports four standard Prometheus metric types:

| Type | Description | Use Case |
|---|---|---|
| **Counter** | Monotonically increasing value (can only go up) | Request counts, error counts, orders processed |
| **Gauge** | Value that can increase or decrease | Active connections, queue size, temperature |
| **Histogram** | Samples observations and counts them in configurable buckets | Request durations, response sizes |
| **Summary** | Similar to histogram, with configurable quantiles | Request latencies, SLA measurements |

### Registering Custom Metrics

Custom metrics must be registered during application startup using an Initializer plugin.

#### Example: Counter Metric

```java
@RegisterPlugin(
    name = "customMetricsInit",
    description = "Registers custom metrics",
    enabledByDefault = true)
public class CustomMetricsInitializer implements Initializer {
    @Override
    public void init() {
        // Register a counter with labels
        Metrics.registerCounter(
            "custom_requests_total",
            "Total number of custom requests",
            "endpoint",  // Label names
            "method"
        );
    }
}
```

#### Example: Gauge Metric

```java
@RegisterPlugin(
    name = "cacheMetricsInit",
    description = "Registers cache size gauge",
    enabledByDefault = true)
public class CacheMetricsInitializer implements Initializer {

    private final CacheService cacheService;

    @Inject("cacheService")
    public CacheMetricsInitializer(CacheService cacheService) {
        this.cacheService = cacheService;
    }

    @Override
    public void init() {
        // Register a gauge with a supplier function
        Metrics.registerGauge(
            "cache_size",
            "Current cache size",
            () -> cacheService.getCacheSize()
        );
    }
}
```

#### Example: Histogram Metric

```java
@Override
public void init() {
    // Register a histogram with custom buckets
    Metrics.registerHistogram(
        "order_value_dollars",
        "Distribution of order values in USD",
        new double[]{10, 50, 100, 500, 1000, 5000}  // Bucket boundaries
    );
}
```

#### Example: Summary Metric

```java
@Override
public void init() {
    // Register a summary with quantiles
    Metrics.registerSummary(
        "api_latency_seconds",
        "API request latency",
        0.5, 0.9, 0.99  // 50th, 90th, 99th percentiles
    );
}
```

### Updating Custom Metrics

Once registered, you can update metrics from Services or Interceptors during request handling.

#### Updating Counters

```java
@RegisterPlugin(
    name = "orderService",
    description = "Order processing service")
public class OrderService implements JsonService {

    @Override
    public void handle(JsonRequest req, JsonResponse res) {
        // Process order...

        // Increment counter with labels
        Metrics.counter("custom_requests_total")
            .labels("orders", req.getMethod().toString())
            .inc();

        if (orderSuccessful) {
            Metrics.counter("orders_processed_total").inc();
        }
    }
}
```

#### Updating Gauges

```java
// Increment gauge
Metrics.gauge("active_connections").inc();

// Decrement gauge
Metrics.gauge("active_connections").dec();

// Set to specific value
Metrics.gauge("queue_size").set(42);
```

#### Recording Histogram/Summary Values

```java
@Override
public void handle(JsonRequest req, JsonResponse res) {
    long startTime = System.nanoTime();

    // Process request...

    long duration = System.nanoTime() - startTime;

    // Record observation in histogram
    Metrics.histogram("request_duration_seconds")
        .observe(duration / 1_000_000_000.0);

    // Record observation in summary
    Metrics.summary("api_latency_seconds")
        .observe(duration / 1_000_000_000.0);
}
```

### Complete Example: Business Metrics

This example shows how to track business metrics for an e-commerce application:

```java
@RegisterPlugin(
    name = "businessMetricsInit",
    description = "Registers business metrics",
    enabledByDefault = true)
public class BusinessMetricsInitializer implements Initializer {
    @Override
    public void init() {
        // Order metrics
        Metrics.registerCounter(
            "orders_total",
            "Total number of orders",
            "status"  // pending, completed, failed
        );

        Metrics.registerHistogram(
            "order_value_dollars",
            "Order value distribution",
            new double[]{10, 50, 100, 500, 1000}
        );

        // Cart metrics
        Metrics.registerGauge(
            "active_carts",
            "Number of active shopping carts"
        );

        // Performance metrics
        Metrics.registerSummary(
            "checkout_duration_seconds",
            "Time to complete checkout",
            0.5, 0.95, 0.99
        );
    }
}
```

Using the metrics:

```java
@RegisterPlugin(name = "orderService")
public class OrderService implements JsonService {

    @Override
    public void handle(JsonRequest req, JsonResponse res) {
        var order = req.getContent();
        double orderValue = order.get("total").asDouble();

        long startTime = System.nanoTime();

        try {
            // Process order...
            processOrder(order);

            // Track successful order
            Metrics.counter("orders_total")
                .labels("completed")
                .inc();

            Metrics.histogram("order_value_dollars")
                .observe(orderValue);

        } catch (Exception e) {
            // Track failed order
            Metrics.counter("orders_total")
                .labels("failed")
                .inc();
        } finally {
            // Track checkout duration
            long duration = System.nanoTime() - startTime;
            Metrics.summary("checkout_duration_seconds")
                .observe(duration / 1_000_000_000.0);
        }
    }
}
```

### Querying Custom Metrics

Custom metrics are exposed at the same `/metrics` endpoint as built-in metrics:

```bash
# Get all metrics
$ http -a admin:secret :8080/metrics

# Custom metrics appear in the list
[
    "/jvm",
    "/{tenant}/ping",
    "/custom"  # Your custom metrics
]

# Query custom metrics
$ http -a admin:secret :8080/metrics/custom

# TYPE orders_total counter
orders_total{status="completed",} 1523.0
orders_total{status="failed",} 12.0

# TYPE order_value_dollars histogram
order_value_dollars_bucket{le="10.0",} 45.0
order_value_dollars_bucket{le="50.0",} 234.0
order_value_dollars_bucket{le="100.0",} 456.0
order_value_dollars_sum 45678.90
order_value_dollars_count 789.0

# TYPE active_carts gauge
active_carts 42.0

# TYPE checkout_duration_seconds summary
checkout_duration_seconds{quantile="0.5",} 0.234
checkout_duration_seconds{quantile="0.95",} 1.456
checkout_duration_seconds{quantile="0.99",} 2.789
checkout_duration_seconds_sum 1234.567
checkout_duration_seconds_count 789.0
```

## Disabling Metrics

To disable the metrics system entirely:

```yaml
metrics:
  enabled: false

requestsMetricsCollector:
  enabled: false

jvmMetricsCollector:
  enabled: false
```

Or via the `RHO` environment variable:

```bash
RHO='/metrics/enabled->false;/requestsMetricsCollector/enabled->false'
```

## Workers Watchdog

> **Note**: Available from RESTHeart v9.9.

The workers watchdog writes a full thread dump to the log when RESTHeart stops serving requests, and can terminate the process so that its orchestrator starts a new one.

### Why it exists

A blocking request — almost every request — runs on a virtual thread, and virtual threads run on a few *carrier* threads: as many as the container has CPUs. If the carriers stay occupied, no virtual thread gets to run. Every blocking request then waits forever, while `/ping`, which is served on the I/O thread, keeps answering: to a load balancer the node looks healthy.

Finding out why needs a thread dump taken at that moment, and the RESTHeart images are distroless: there is no shell to run `jcmd` from. The watchdog takes the dump from inside the process and puts it where it can be read, in the log.

### Configuration

```yaml
workersWatchdog:
  enabled: false
  interval-seconds: 10
  threshold-seconds: 30
  halt-after-seconds: 0
  notify-email: null
```

| Option | Default | What it does |
|---|---|---|
| `enabled` | `false` | Turns the watchdog on. |
| `interval-seconds` | `10` | How often an empty task is handed to the executor of blocking requests. |
| `threshold-seconds` | `30` | How long that task may wait to start before the thread dump is logged. |
| `halt-after-seconds` | `0` | How long it may wait before the process halts; `0` never. Never shorter than `threshold-seconds`. |
| `notify-email` | `null` | An address to mail the report to as well, once per stall. Needs the `emails` provider configured. |

The watchdog runs on its own platform thread, so it keeps working when the carriers are stuck.

### What the log shows

Once per episode, at `ERROR`:

```
ERROR Blocking requests are not being served: a task handed to the request executor 6s ago has not started. Thread dump follows.
```

followed by every thread, virtual threads included, in the format of `jcmd <pid> Thread.dump_to_file`. When the executor serves again the watchdog logs `Blocking requests are served again, after <n>s` at `WARN`, and a later stall is reported anew.

To read the dump, look for two things:

- the carrier threads, `ForkJoinPool-1-worker-<n>`, all `RUNNABLE` and running a continuation: they are occupied;
- the virtual threads named `RH VRT WRK ⚙` that are `RUNNABLE` **with a stack**: they are the ones holding the carriers, and their stack names the code that does it.

```
#85 "RH VRT WRK ⚙" virtual RUNNABLE
    at com.example.MyService.handle(MyService.java:16)
    at org.restheart.handlers.ServiceWrapper.handleRequest(PipelinedWrappingHandler.java:277)
    ...
```

A virtual thread that is `RUNNABLE` with no stack is a request waiting for a carrier.

### The alarm mail

With `notify-email` set, the report also goes by mail to that address, through the `emails` provider — the same SMTP settings RESTHeart uses for account emails. The subject names the host; the body says whether and when the process will halt, and carries the dump. It is sent from a thread of its own and never through the executor that is stuck, so it goes out while no request can. If the provider is not configured, the watchdog says so at startup and logs only.

### Halting

A process whose carriers are stuck does not recover by itself. With `halt-after-seconds` above zero, if the executor has still not served that long after the task was handed over, the watchdog logs why and terminates the process with exit status `70`, so that ECS, Kubernetes or systemd starts a new one. The dump is always written first, and the alarm mail, which left with the dump, is given up to another 60 seconds to go out.

It halts rather than exits: an orderly exit waits for the requests in flight, which will never complete, and part of the shutdown itself runs on virtual threads, which have no carrier left. The process would hang while stopping.

Leave it at `0` where a debugger is attached: a request stopped at a breakpoint keeps its carrier, and after `halt-after-seconds` the process would be terminated.

## See Also

- [Static Resources](../static-resources) — How RESTHeart serves static files
- [Custom Metrics Example](https://github.com/SoftInstigate/restheart/tree/master/examples/custom-metrics-example) — Full working plugin with custom metrics
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/) — Setting up Prometheus scraping

</div>
