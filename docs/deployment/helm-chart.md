---
layout: docs
title: Helm Chart
position: 11
---

# Helm Chart

RESTHeart provides a Helm chart for Kubernetes deployment. The chart deploys RESTHeart as a Deployment with configurable replicas, probes, security contexts, autoscaling, ingress, network policies, and more.

## Quick Start

```bash
helm install my-restheart oci://ghcr.io/softinstigate/restheart --version 0.3.0
```

Create a `my-values.yaml` with at least the MongoDB connection:

```yaml
restHeartConfiguration:
  mongo-uri: "mongodb://mongo:27017"
```

Then:

```bash
helm install my-restheart oci://ghcr.io/softinstigate/restheart \
  --version 0.3.0 \
  -f my-values.yaml
```

## Features

- RESTHeart application config via `restHeartConfiguration` (maps to `restheart.yml`)
- Secure defaults (non-root, read-only root filesystem)
- Configurable liveness, readiness, and startup probes
- Lifecycle hooks with graceful shutdown
- Optional init container to wait for MongoDB
- Horizontal Pod Autoscaler, Pod Disruption Budget
- Ingress with TLS support
- Network Policy
- Sidecar containers and extra volumes
- External config via pre-existing Secret

## Documentation

Full documentation is maintained in the repository:

- **[Chart README](https://github.com/SoftInstigate/restheart/blob/master/chart/README.md)** — Installation, configuration reference, and examples
- **[RESTHeart Configuration Reference](https://github.com/SoftInstigate/restheart/blob/master/chart/RESTHEART-CONFIG.md)** — All `restHeartConfiguration` options
- **[Helm Chart Guide](https://github.com/SoftInstigate/restheart/blob/master/docs/helm-chart.md)** — Architecture, features, testing, and publishing
