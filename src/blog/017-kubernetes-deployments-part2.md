---
cover: https://iili.io/qKvajft.jpg
date: 2026-02-24
description: Deep dive into Rolling Updates, Blue/Green, Canary
  deployments, rollback mechanisms, and production-grade Kubernetes
  configuration.
tags:
- Kubernetes
- Cloud-Native
- DevOps
- CI/CD
title: "Kubernetes Deployments Part 2: Update Strategies &
  Production Practices"
---

# Kubernetes Deployments — Part 2

In [Part 1](/blog/016-kubernetes-deployments-part1), we covered Deployment fundamentals, scaling, and
self-healing.

In Part 2, we go deeper into:

-   Rolling Updates
-   Rollbacks
-   Blue/Green Deployments
-   Canary Deployments
-   Production Best Practices

------------------------------------------------------------------------

# 1 - Rolling Updates

Rolling Updates allow you to update your application **without
downtime**.

Instead of deleting all old Pods at once, Kubernetes:

1.  Creates new Pods with the new version
2.  Gradually terminates old Pods
3.  Maintains availability during the process

![Rolling Update Visualization](https://img-blog.csdnimg.cn/img_convert/cf305f5de011982c1be5fd3ece272724.png)

------------------------------------------------------------------------

## Rolling Update Configuration

``` yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1
    maxSurge: 1
```

### maxUnavailable

Maximum number of Pods that can be unavailable during the update.

### Example

``` yaml
replicas: 4
maxUnavailable: 1
```

Kubernetes guarantees that **at least 3 Pods will always be available**
during the update.

### Why it matters

-   Controls availability\
-   Protects against downtime\
-   Critical for production systems\
-   Important for SLA-based applications

### Production Use Case

For high-availability systems (banking, checkout, auth services):

``` yaml
maxUnavailable: 0
```

This ensures **zero downtime rollout**.

### maxSurge

Maximum extra Pods created above desired replicas.

you can read more about maxsurge and maxunavailable use cases

------------------------------------------------------------------------

## Example: Updating Image Version

``` bash
kubectl set image deployment/web-deployment nginx-container=nginx:1.26
```

Watch the rollout:

``` bash
kubectl rollout status deployment/web-deployment
```

------------------------------------------------------------------------

# 2 - Rollbacks

If something goes wrong, Kubernetes allows instant rollback.

Check rollout history:

``` bash
kubectl rollout history deployment/web-deployment
```

Rollback:

``` bash
kubectl rollout undo deployment/web-deployment
```

This restores the previous ReplicaSet.

------------------------------------------------------------------------

# 3 - Blue/Green Deployment

Blue/Green means:

-   Blue = current version
-   Green = new version
-   Traffic switches only after validation

Instead of updating Pods gradually, you deploy a separate environment.

![Blue Green Diagram](https://docs.rafay.co/learn/gitops/deploy/img/part4/blue-green.jpeg)

### How It Works

1.  Deploy new version (Green)
2.  Test internally
3.  Switch Service selector to Green
4.  Remove Blue after validation

This provides zero-downtime and safe testing.

------------------------------------------------------------------------

# 4 - Canary Deployment

Canary releases send traffic to a small subset of users first.

Example:

-   90% traffic → old version
-   10% traffic → new version

![Canary Deployment Diagram](https://docs.rafay.co/learn/gitops/deploy/img/part5/canary.png)

Canary requires:

-   Multiple Deployments
-   Traffic splitting (Ingress / Service Mesh)

Used when you want gradual risk reduction.

------------------------------------------------------------------------

# 5️ - Production Best Practices

## Always Use Probes

``` yaml
livenessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 10
  periodSeconds: 5

readinessProbe:
  httpGet:
    path: /ready
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 5
```

-   Liveness → restart unhealthy container
-   Readiness → control traffic routing

------------------------------------------------------------------------

## Define Resource Limits

``` yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "256Mi"
```

Prevents noisy neighbor problems.

------------------------------------------------------------------------

## Use Proper Labels & Versioning

Example:

``` yaml
labels:
  app: web
  version: v2
```

Essential for Blue/Green & Canary strategies.

------------------------------------------------------------------------

# What You Learned in Part 2

-   How Rolling Updates maintain availability
-   How to rollback safely
-   When to use Blue/Green
-   When to use Canary
-   Production-ready configuration tips

------------------------------------------------------------------------

In Part 3, we will explore advanced Deployment topics: - Deployment
failure scenarios - HPA integration - Pod disruption budgets - Real
production debugging strategies
