---
layout: docs
title: Metrics on Requests
---

* [Introduction](#introduction)
* [Formats](#formats)
    * [using restheart rep query parameter](#using-restheart-rep-query-parameter)
    * [using HTTP content negoatiation](#using-http-content-negoatiation)
* [Configuration options](#configuration-options)
* [Reading data](#reading-data)
* [Examples](#examples)


## Introduction

Gathering metrics about your production (and staging) environments can
give you valuable knowledge about your infrastructure. Not only do
metrics allow to define service level objectives, knowing their values
open up possibilities to both monitor these values, and tackle problems
as well - maybe even automatically.

The metrics endpoints included in restheart use [Dropwizard
metrics](http://metrics.dropwizard.io) under the hood. The measured
values include counts, call rates, as well as timings of the calls and
their distributions.

## Formats

The current implementation supports both the [Prometheus
format](https://prometheus.io/docs/instrumenting/exposition_formats/)
(which is popular in kubernetes environments), as well as the [classical
JSON
format](https://github.com/iZettle/dropwizard-metrics/blob/master/metrics-json/src/main/java/io/dropwizard/metrics/json/MetricsModule.java) generated
by dopwizard metrics. The prometheus format is the default one, but you
can explicitly request one of the formats:

### using restheart `rep` query parameter

Simply add a query parameter `rep` to your request to the metrics
endpoint. Use `PJ` or `PLAIN_JSON` to request the dropwizard JSON
format, or omit the parameter to get prometheus.

### using HTTP content negoatiation

You can also use the `Accept` header. `application/json` will select the
dropwizard format. `text/plain` (or, if you want to be more specific:
`text/plain; version=0.0.4`) will select the prometheus format.

If you supply both query parameter and the `Accept` header, the query
parameter wins.

## Configuration options

By default, restheart will only gather high-level metrics that apply to
all databases and collections. To gather more detailed and fine-grained
metrics (with the cost of more memory usage), you can enable additional
collection on a per-database or per-collection level.

Use config value `metrics-gathering-level`, possible values are

-   `OFF`
-   ROOT (default)
-   `DATABASE`
-   `COLLECTION`

These configuration options are consecutive, e.g. COLLECTION contains
DATABASE.

## Reading data

| Endpoint                            | Purpose                                                       |
|-------------------------------------|---------------------------------------------------------------|
| `/_metrics`                         | for generic over-all values.                                  |
| `/$DBNAME/_metrics`                 | for values tied to this specific database.                    |
| `/$DBNAME/$COLLECTIONNAME/_metrics` | for values tied to this specific collection of this database. |

If metrics are not configured to be collected at the given level, the
endpoint will return `404 NOT FOUND`. Each upper level contains all the
information from the deeper levels, aggregated.

## Examples

Note the structure of the response fields: the field names are related
to the type of the query (e.g. `METRICS`, `DATABASE`, `COLLECTION`,
`DOCUMENT`) and can also include the response code (none, grouped by
first digit, full). The examples are calls to the root `/_metrics` after
a few calls to an empty database (thus the 404s).

**Prometheus example response**  Expand source

``` plain
http_response_timers_METRICS_count{method="GET",code="2xx"} 13 1510039263986
http_response_timers_METRICS_max{method="GET",code="2xx"} 101.0 1510039263986
http_response_timers_METRICS_mean{method="GET",code="2xx"} 13.66447895963094 1510039263986
http_response_timers_METRICS_min{method="GET",code="2xx"} 4.0 1510039263986
http_response_timers_METRICS_p50{method="GET",code="2xx"} 18.0 1510039263986
http_response_timers_METRICS_p75{method="GET",code="2xx"} 18.0 1510039263986
http_response_timers_METRICS_p95{method="GET",code="2xx"} 18.0 1510039263986
http_response_timers_METRICS_p98{method="GET",code="2xx"} 18.0 1510039263986
http_response_timers_METRICS_p99{method="GET",code="2xx"} 18.0 1510039263986
http_response_timers_METRICS_p999{method="GET",code="2xx"} 18.0 1510039263986
http_response_timers_METRICS_stddev{method="GET",code="2xx"} 5.779944201589175 1510039263986
http_response_timers_METRICS_m15_rate{method="GET",code="2xx"} 0.11197540667244438 1510039263986
http_response_timers_METRICS_m1_rate{method="GET",code="2xx"} 0.02346856889987903 1510039263986
http_response_timers_METRICS_m5_rate{method="GET",code="2xx"} 0.040980329912974914 1510039263986
http_response_timers_METRICS_mean_rate{method="GET",code="2xx"} 0.021582478380531817 1510039263986
http_response_timers_METRICS_duration_units{method="GET",code="2xx"} milliseconds 1510039263986
http_response_timers_METRICS_rate_units{method="GET",code="2xx"} calls/second 1510039263986

http_response_timers_METRICS_count{method="GET",code="200"} 13 1510039263986
http_response_timers_METRICS_max{method="GET",code="200"} 101.0 1510039263986
http_response_timers_METRICS_mean{method="GET",code="200"} 13.66447895963094 1510039263986
http_response_timers_METRICS_min{method="GET",code="200"} 4.0 1510039263986
http_response_timers_METRICS_p50{method="GET",code="200"} 18.0 1510039263986
http_response_timers_METRICS_p75{method="GET",code="200"} 18.0 1510039263986
http_response_timers_METRICS_p95{method="GET",code="200"} 18.0 1510039263986
http_response_timers_METRICS_p98{method="GET",code="200"} 18.0 1510039263986
http_response_timers_METRICS_p99{method="GET",code="200"} 18.0 1510039263986
http_response_timers_METRICS_p999{method="GET",code="200"} 18.0 1510039263986
http_response_timers_METRICS_stddev{method="GET",code="200"} 5.779944201589175 1510039263986
http_response_timers_METRICS_m15_rate{method="GET",code="200"} 0.11197540667244438 1510039263986
http_response_timers_METRICS_m1_rate{method="GET",code="200"} 0.02346856889987903 1510039263986
http_response_timers_METRICS_m5_rate{method="GET",code="200"} 0.040980329912974914 1510039263986
http_response_timers_METRICS_mean_rate{method="GET",code="200"} 0.021582482412705724 1510039263986
http_response_timers_METRICS_duration_units{method="GET",code="200"} milliseconds 1510039263986
http_response_timers_METRICS_rate_units{method="GET",code="200"} calls/second 1510039263986

http_response_timers_DOCUMENT_count{method="GET",code="404"} 1 1510039263986
http_response_timers_DOCUMENT_max{method="GET",code="404"} 12.0 1510039263986
http_response_timers_DOCUMENT_mean{method="GET",code="404"} 12.0 1510039263986
http_response_timers_DOCUMENT_min{method="GET",code="404"} 12.0 1510039263986
http_response_timers_DOCUMENT_p50{method="GET",code="404"} 12.0 1510039263986
http_response_timers_DOCUMENT_p75{method="GET",code="404"} 12.0 1510039263986
http_response_timers_DOCUMENT_p95{method="GET",code="404"} 12.0 1510039263986
http_response_timers_DOCUMENT_p98{method="GET",code="404"} 12.0 1510039263986
http_response_timers_DOCUMENT_p99{method="GET",code="404"} 12.0 1510039263986
http_response_timers_DOCUMENT_p999{method="GET",code="404"} 12.0 1510039263986
http_response_timers_DOCUMENT_stddev{method="GET",code="404"} 0.0 1510039263986
http_response_timers_DOCUMENT_m15_rate{method="GET",code="404"} 0.1902458849001428 1510039263986
http_response_timers_DOCUMENT_m1_rate{method="GET",code="404"} 0.09447331054820299 1510039263986
http_response_timers_DOCUMENT_m5_rate{method="GET",code="404"} 0.17214159528501158 1510039263986
http_response_timers_DOCUMENT_mean_rate{method="GET",code="404"} 0.019699054561810325 1510039263986
http_response_timers_DOCUMENT_duration_units{method="GET",code="404"} milliseconds 1510039263986
http_response_timers_DOCUMENT_rate_units{method="GET",code="404"} calls/second 1510039263986

http_response_timers_DOCUMENT_count{method="GET",code="4xx"} 1 1510039263986
http_response_timers_DOCUMENT_max{method="GET",code="4xx"} 12.0 1510039263986
http_response_timers_DOCUMENT_mean{method="GET",code="4xx"} 12.0 1510039263986
http_response_timers_DOCUMENT_min{method="GET",code="4xx"} 12.0 1510039263986
http_response_timers_DOCUMENT_p50{method="GET",code="4xx"} 12.0 1510039263986
http_response_timers_DOCUMENT_p75{method="GET",code="4xx"} 12.0 1510039263986
http_response_timers_DOCUMENT_p95{method="GET",code="4xx"} 12.0 1510039263986
http_response_timers_DOCUMENT_p98{method="GET",code="4xx"} 12.0 1510039263986
http_response_timers_DOCUMENT_p99{method="GET",code="4xx"} 12.0 1510039263986
http_response_timers_DOCUMENT_p999{method="GET",code="4xx"} 12.0 1510039263986
http_response_timers_DOCUMENT_stddev{method="GET",code="4xx"} 0.0 1510039263986
http_response_timers_DOCUMENT_m15_rate{method="GET",code="4xx"} 0.1902458849001428 1510039263986
http_response_timers_DOCUMENT_m1_rate{method="GET",code="4xx"} 0.09447331054820299 1510039263986
http_response_timers_DOCUMENT_m5_rate{method="GET",code="4xx"} 0.17214159528501158 1510039263986
http_response_timers_DOCUMENT_mean_rate{method="GET",code="4xx"} 0.019699076069657512 1510039263986
http_response_timers_DOCUMENT_duration_units{method="GET",code="4xx"} milliseconds 1510039263986
http_response_timers_DOCUMENT_rate_units{method="GET",code="4xx"} calls/second 1510039263986

http_response_timers_METRICS_count{method="GET"} 13 1510039263986
http_response_timers_METRICS_max{method="GET"} 101.0 1510039263986
http_response_timers_METRICS_mean{method="GET"} 13.66447895963094 1510039263986
http_response_timers_METRICS_min{method="GET"} 4.0 1510039263986
http_response_timers_METRICS_p50{method="GET"} 18.0 1510039263986
http_response_timers_METRICS_p75{method="GET"} 18.0 1510039263986
http_response_timers_METRICS_p95{method="GET"} 18.0 1510039263986
http_response_timers_METRICS_p98{method="GET"} 18.0 1510039263986
http_response_timers_METRICS_p99{method="GET"} 18.0 1510039263986
http_response_timers_METRICS_p999{method="GET"} 18.0 1510039263986
http_response_timers_METRICS_stddev{method="GET"} 5.779944201589175 1510039263986
http_response_timers_METRICS_m15_rate{method="GET"} 0.11197540667244438 1510039263986
http_response_timers_METRICS_m1_rate{method="GET"} 0.02346856889987903 1510039263986
http_response_timers_METRICS_m5_rate{method="GET"} 0.040980329912974914 1510039263986
http_response_timers_METRICS_mean_rate{method="GET"} 0.021582442655335453 1510039263986
http_response_timers_METRICS_duration_units{method="GET"} milliseconds 1510039263986
http_response_timers_METRICS_rate_units{method="GET"} calls/second 1510039263986

http_response_timers_DB_count{method="GET",code="4xx"} 2 1510039263986
http_response_timers_DB_max{method="GET",code="4xx"} 10.0 1510039263986
http_response_timers_DB_mean{method="GET",code="4xx"} 8.97000899676118 1510039263986
http_response_timers_DB_min{method="GET",code="4xx"} 8.0 1510039263986
http_response_timers_DB_p50{method="GET",code="4xx"} 8.0 1510039263986
http_response_timers_DB_p75{method="GET",code="4xx"} 10.0 1510039263986
http_response_timers_DB_p95{method="GET",code="4xx"} 10.0 1510039263986
http_response_timers_DB_p98{method="GET",code="4xx"} 10.0 1510039263986
http_response_timers_DB_p99{method="GET",code="4xx"} 10.0 1510039263986
http_response_timers_DB_p999{method="GET",code="4xx"} 10.0 1510039263986
http_response_timers_DB_stddev{method="GET",code="4xx"} 0.99955016868826 1510039263986
http_response_timers_DB_m15_rate{method="GET",code="4xx"} 0.23206560286490113 1510039263986
http_response_timers_DB_m1_rate{method="GET",code="4xx"} 1.1358519356130308E-4 1510039263986
http_response_timers_DB_m5_rate{method="GET",code="4xx"} 0.07811102513427433 1510039263986
http_response_timers_DB_mean_rate{method="GET",code="4xx"} 0.004003171495603914 1510039263986
http_response_timers_DB_duration_units{method="GET",code="4xx"} milliseconds 1510039263986
http_response_timers_DB_rate_units{method="GET",code="4xx"} calls/second 1510039263986

http_response_timers_COLLECTION_count{method="GET",code="404"} 2 1510039263986
http_response_timers_COLLECTION_max{method="GET",code="404"} 22.0 1510039263986
http_response_timers_COLLECTION_mean{method="GET",code="404"} 15.965442805585523 1510039263986
http_response_timers_COLLECTION_min{method="GET",code="404"} 11.0 1510039263986
http_response_timers_COLLECTION_p50{method="GET",code="404"} 11.0 1510039263986
http_response_timers_COLLECTION_p75{method="GET",code="404"} 22.0 1510039263986
http_response_timers_COLLECTION_p95{method="GET",code="404"} 22.0 1510039263986
http_response_timers_COLLECTION_p98{method="GET",code="404"} 22.0 1510039263986
http_response_timers_COLLECTION_p99{method="GET",code="404"} 22.0 1510039263986
http_response_timers_COLLECTION_p999{method="GET",code="404"} 22.0 1510039263986
http_response_timers_COLLECTION_stddev{method="GET",code="404"} 5.473960961305782 1510039263986
http_response_timers_COLLECTION_m15_rate{method="GET",code="404"} 0.11603638270096507 1510039263986
http_response_timers_COLLECTION_m1_rate{method="GET",code="404"} 5.718721810339868E-5 1510039263986
http_response_timers_COLLECTION_m5_rate{method="GET",code="404"} 0.03906636157175893 1510039263986
http_response_timers_COLLECTION_mean_rate{method="GET",code="404"} 0.0039626643164382205 1510039263986
http_response_timers_COLLECTION_duration_units{method="GET",code="404"} milliseconds 1510039263986
http_response_timers_COLLECTION_rate_units{method="GET",code="404"} calls/second 1510039263986

http_response_timers_DB_count{method="GET"} 2 1510039263986
http_response_timers_DB_max{method="GET"} 10.0 1510039263986
http_response_timers_DB_mean{method="GET"} 8.97000899676118 1510039263986
http_response_timers_DB_min{method="GET"} 8.0 1510039263986
http_response_timers_DB_p50{method="GET"} 8.0 1510039263986
http_response_timers_DB_p75{method="GET"} 10.0 1510039263986
http_response_timers_DB_p95{method="GET"} 10.0 1510039263986
http_response_timers_DB_p98{method="GET"} 10.0 1510039263986
http_response_timers_DB_p99{method="GET"} 10.0 1510039263986
http_response_timers_DB_p999{method="GET"} 10.0 1510039263986
http_response_timers_DB_stddev{method="GET"} 0.99955016868826 1510039263986
http_response_timers_DB_m15_rate{method="GET"} 0.23206560286490113 1510039263986
http_response_timers_DB_m1_rate{method="GET"} 1.1358519356130308E-4 1510039263986
http_response_timers_DB_m5_rate{method="GET"} 0.07811102513427433 1510039263986
http_response_timers_DB_mean_rate{method="GET"} 0.004003171129199612 1510039263986
http_response_timers_DB_duration_units{method="GET"} milliseconds 1510039263986
http_response_timers_DB_rate_units{method="GET"} calls/second 1510039263986

http_response_timers_DB_count{method="GET",code="404"} 2 1510039263986
http_response_timers_DB_max{method="GET",code="404"} 10.0 1510039263986
http_response_timers_DB_mean{method="GET",code="404"} 8.97000899676118 1510039263986
http_response_timers_DB_min{method="GET",code="404"} 8.0 1510039263986
http_response_timers_DB_p50{method="GET",code="404"} 8.0 1510039263986
http_response_timers_DB_p75{method="GET",code="404"} 10.0 1510039263986
http_response_timers_DB_p95{method="GET",code="404"} 10.0 1510039263986
http_response_timers_DB_p98{method="GET",code="404"} 10.0 1510039263986
http_response_timers_DB_p99{method="GET",code="404"} 10.0 1510039263986
http_response_timers_DB_p999{method="GET",code="404"} 10.0 1510039263986
http_response_timers_DB_stddev{method="GET",code="404"} 0.99955016868826 1510039263986
http_response_timers_DB_m15_rate{method="GET",code="404"} 0.23206560286490113 1510039263986
http_response_timers_DB_m1_rate{method="GET",code="404"} 1.1358519356130308E-4 1510039263986
http_response_timers_DB_m5_rate{method="GET",code="404"} 0.07811102513427433 1510039263986
http_response_timers_DB_mean_rate{method="GET",code="404"} 0.0040031714981198984 1510039263986
http_response_timers_DB_duration_units{method="GET",code="404"} milliseconds 1510039263986
http_response_timers_DB_rate_units{method="GET",code="404"} calls/second 1510039263986

http_response_timers_COLLECTION_count{method="GET",code="4xx"} 2 1510039263986
http_response_timers_COLLECTION_max{method="GET",code="4xx"} 22.0 1510039263986
http_response_timers_COLLECTION_mean{method="GET",code="4xx"} 15.965442805585523 1510039263986
http_response_timers_COLLECTION_min{method="GET",code="4xx"} 11.0 1510039263986
http_response_timers_COLLECTION_p50{method="GET",code="4xx"} 11.0 1510039263986
http_response_timers_COLLECTION_p75{method="GET",code="4xx"} 22.0 1510039263986
http_response_timers_COLLECTION_p95{method="GET",code="4xx"} 22.0 1510039263986
http_response_timers_COLLECTION_p98{method="GET",code="4xx"} 22.0 1510039263986
http_response_timers_COLLECTION_p99{method="GET",code="4xx"} 22.0 1510039263986
http_response_timers_COLLECTION_p999{method="GET",code="4xx"} 22.0 1510039263986
http_response_timers_COLLECTION_stddev{method="GET",code="4xx"} 5.473960961305782 1510039263986
http_response_timers_COLLECTION_m15_rate{method="GET",code="4xx"} 0.11603638270096507 1510039263986
http_response_timers_COLLECTION_m1_rate{method="GET",code="4xx"} 5.718721810339868E-5 1510039263986
http_response_timers_COLLECTION_m5_rate{method="GET",code="4xx"} 0.03906636157175893 1510039263986
http_response_timers_COLLECTION_mean_rate{method="GET",code="4xx"} 0.003962664528990094 1510039263986
http_response_timers_COLLECTION_duration_units{method="GET",code="4xx"} milliseconds 1510039263986
http_response_timers_COLLECTION_rate_units{method="GET",code="4xx"} calls/second 1510039263986

http_response_timers_COLLECTION_count{method="GET"} 2 1510039263986
http_response_timers_COLLECTION_max{method="GET"} 22.0 1510039263986
http_response_timers_COLLECTION_mean{method="GET"} 15.965442805585523 1510039263986
http_response_timers_COLLECTION_min{method="GET"} 11.0 1510039263986
http_response_timers_COLLECTION_p50{method="GET"} 11.0 1510039263986
http_response_timers_COLLECTION_p75{method="GET"} 22.0 1510039263986
http_response_timers_COLLECTION_p95{method="GET"} 22.0 1510039263986
http_response_timers_COLLECTION_p98{method="GET"} 22.0 1510039263986
http_response_timers_COLLECTION_p99{method="GET"} 22.0 1510039263986
http_response_timers_COLLECTION_p999{method="GET"} 22.0 1510039263986
http_response_timers_COLLECTION_stddev{method="GET"} 5.473960961305782 1510039263986
http_response_timers_COLLECTION_m15_rate{method="GET"} 0.11603638270096507 1510039263986
http_response_timers_COLLECTION_m1_rate{method="GET"} 5.718721810339868E-5 1510039263986
http_response_timers_COLLECTION_m5_rate{method="GET"} 0.03906636157175893 1510039263986
http_response_timers_COLLECTION_mean_rate{method="GET"} 0.003962663999950156 1510039263986
http_response_timers_COLLECTION_duration_units{method="GET"} milliseconds 1510039263986
http_response_timers_COLLECTION_rate_units{method="GET"} calls/second 1510039263986

http_response_timers_DOCUMENT_count{method="GET"} 1 1510039263986
http_response_timers_DOCUMENT_max{method="GET"} 12.0 1510039263986
http_response_timers_DOCUMENT_mean{method="GET"} 12.0 1510039263986
http_response_timers_DOCUMENT_min{method="GET"} 12.0 1510039263986
http_response_timers_DOCUMENT_p50{method="GET"} 12.0 1510039263986
http_response_timers_DOCUMENT_p75{method="GET"} 12.0 1510039263986
http_response_timers_DOCUMENT_p95{method="GET"} 12.0 1510039263986
http_response_timers_DOCUMENT_p98{method="GET"} 12.0 1510039263986
http_response_timers_DOCUMENT_p99{method="GET"} 12.0 1510039263986
http_response_timers_DOCUMENT_p999{method="GET"} 12.0 1510039263986
http_response_timers_DOCUMENT_stddev{method="GET"} 0.0 1510039263986
http_response_timers_DOCUMENT_m15_rate{method="GET"} 0.1902458849001428 1510039263986
http_response_timers_DOCUMENT_m1_rate{method="GET"} 0.09447331054820299 1510039263986
http_response_timers_DOCUMENT_m5_rate{method="GET"} 0.17214159528501158 1510039263986
http_response_timers_DOCUMENT_mean_rate{method="GET"} 0.019699022734163196 1510039263986
http_response_timers_DOCUMENT_duration_units{method="GET"} milliseconds 1510039263986
http_response_timers_DOCUMENT_rate_units{method="GET"} calls/second 1510039263986

```

**JSON example response**  Expand source

``` json
{
  "version": "3.0.0",
  "gauges": {},
  "counters": {},
  "histograms": {},
  "meters": {},
  "timers": {
    "METRICS.GET.2xx": {
      "count": 11,
      "max": 101,
      "mean": 15.944381818716298,
      "min": 4,
      "p50": 14,
      "p75": 18,
      "p95": 18,
      "p98": 18,
      "p99": 21,
      "p999": 101,
      "stddev": 5.052944160882624,
      "m15_rate": 0.1154439183453834,
      "m1_rate": 0.0011557077668897736,
      "m5_rate": 0.04047387926642257,
      "mean_rate": 0.019742700780046633,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "METRICS.GET.200": {
      "count": 11,
      "max": 101,
      "mean": 15.944381818716298,
      "min": 4,
      "p50": 14,
      "p75": 18,
      "p95": 18,
      "p98": 18,
      "p99": 21,
      "p999": 101,
      "stddev": 5.052944160882624,
      "m15_rate": 0.1154439183453834,
      "m1_rate": 0.0011557077668897736,
      "m5_rate": 0.04047387926642257,
      "mean_rate": 0.019742702972526945,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "DOCUMENT.GET.404": {
      "count": 1,
      "max": 12,
      "mean": 12,
      "min": 12,
      "p50": 12,
      "p75": 12,
      "p95": 12,
      "p98": 12,
      "p99": 12,
      "p999": 12,
      "stddev": 0,
      "m15_rate": 0.2,
      "m1_rate": 0.2,
      "m5_rate": 0.2,
      "mean_rate": 0.17884100839774422,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "DOCUMENT.GET.4xx": {
      "count": 1,
      "max": 12,
      "mean": 12,
      "min": 12,
      "p50": 12,
      "p75": 12,
      "p95": 12,
      "p98": 12,
      "p99": 12,
      "p999": 12,
      "stddev": 0,
      "m15_rate": 0.2,
      "m1_rate": 0.2,
      "m5_rate": 0.2,
      "mean_rate": 0.17884385317337576,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "METRICS.GET": {
      "count": 11,
      "max": 101,
      "mean": 15.944381818716298,
      "min": 4,
      "p50": 14,
      "p75": 18,
      "p95": 18,
      "p98": 18,
      "p99": 21,
      "p999": 101,
      "stddev": 5.052944160882624,
      "m15_rate": 0.1154439183453834,
      "m1_rate": 0.0011557077668897736,
      "m5_rate": 0.04047387926642257,
      "mean_rate": 0.019742660741986995,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "DB.GET.4xx": {
      "count": 2,
      "max": 10,
      "mean": 8.97000899676118,
      "min": 8,
      "p50": 8,
      "p75": 10,
      "p95": 10,
      "p98": 10,
      "p99": 10,
      "p999": 10,
      "stddev": 0.99955016868826,
      "m15_rate": 0.24396386075494766,
      "m1_rate": 0.0002404598566562324,
      "m5_rate": 0.0907520637356095,
      "mean_rate": 0.004401101980577996,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "COLLECTION.GET.404": {
      "count": 2,
      "max": 22,
      "mean": 15.965442805585523,
      "min": 11,
      "p50": 11,
      "p75": 22,
      "p95": 22,
      "p98": 22,
      "p99": 22,
      "p999": 22,
      "stddev": 5.473960961305782,
      "m15_rate": 0.12198569526155147,
      "m1_rate": 0.00012106534167492762,
      "m5_rate": 0.04538863661287383,
      "mean_rate": 0.004352188986310938,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "DB.GET": {
      "count": 2,
      "max": 10,
      "mean": 8.97000899676118,
      "min": 8,
      "p50": 8,
      "p75": 10,
      "p95": 10,
      "p98": 10,
      "p99": 10,
      "p999": 10,
      "stddev": 0.99955016868826,
      "m15_rate": 0.24396386075494766,
      "m1_rate": 0.0002404598566562324,
      "m5_rate": 0.0907520637356095,
      "mean_rate": 0.004401100970351595,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "DB.GET.404": {
      "count": 2,
      "max": 10,
      "mean": 8.97000899676118,
      "min": 8,
      "p50": 8,
      "p75": 10,
      "p95": 10,
      "p98": 10,
      "p99": 10,
      "p999": 10,
      "stddev": 0.99955016868826,
      "m15_rate": 0.24396386075494766,
      "m1_rate": 0.0002404598566562324,
      "m5_rate": 0.0907520637356095,
      "mean_rate": 0.004401101777845054,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "COLLECTION.GET.4xx": {
      "count": 2,
      "max": 22,
      "mean": 15.965442805585523,
      "min": 11,
      "p50": 11,
      "p75": 22,
      "p95": 22,
      "p98": 22,
      "p99": 22,
      "p999": 22,
      "stddev": 5.473960961305782,
      "m15_rate": 0.12198569526155147,
      "m1_rate": 0.00012106534167492762,
      "m5_rate": 0.04538863661287383,
      "mean_rate": 0.004352189636138756,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "COLLECTION.GET": {
      "count": 2,
      "max": 22,
      "mean": 15.965442805585523,
      "min": 11,
      "p50": 11,
      "p75": 22,
      "p95": 22,
      "p98": 22,
      "p99": 22,
      "p999": 22,
      "stddev": 5.473960961305782,
      "m15_rate": 0.12198569526155147,
      "m1_rate": 0.00012106534167492762,
      "m5_rate": 0.04538863661287383,
      "mean_rate": 0.004352188004333907,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    },
    "DOCUMENT.GET": {
      "count": 1,
      "max": 12,
      "mean": 12,
      "min": 12,
      "p50": 12,
      "p75": 12,
      "p95": 12,
      "p98": 12,
      "p99": 12,
      "p999": 12,
      "stddev": 0,
      "m15_rate": 0.2,
      "m1_rate": 0.2,
      "m5_rate": 0.2,
      "mean_rate": 0.1788374724008199,
      "duration_units": "milliseconds",
      "rate_units": "calls/second"
    }
  }
}
```
