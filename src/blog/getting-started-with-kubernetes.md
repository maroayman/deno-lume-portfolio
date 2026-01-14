---
title: Getting Started with Kubernetes
description: A beginner-friendly introduction to Kubernetes concepts, architecture, and your first deployment
date: 2026-01-10
tags:
  - kubernetes
  - containers
  - devops
readingTime: 8
---

Kubernetes has become the de facto standard for container orchestration. In this guide, we'll explore the fundamentals and get you started with your first cluster.

## What is Kubernetes?

Kubernetes (K8s) is an open-source platform for automating deployment, scaling, and management of containerized applications. Originally developed by Google, it's now maintained by the Cloud Native Computing Foundation (CNCF).

## Core Concepts

### Pods

A **Pod** is the smallest deployable unit in Kubernetes. It represents one or more containers that share storage and network resources.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

### Deployments

Deployments manage the desired state of your Pods. They handle rolling updates, rollbacks, and scaling.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

### Services

Services provide stable networking for Pods. They enable load balancing and service discovery.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## Setting Up a Local Cluster

The easiest way to get started is with **minikube**:

```bash
# Install minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start cluster
minikube start

# Verify
kubectl get nodes
```

## Your First Deployment

Let's deploy a simple nginx application:

```bash
# Create deployment
kubectl create deployment nginx --image=nginx

# Expose it
kubectl expose deployment nginx --port=80 --type=NodePort

# Get the URL
minikube service nginx --url
```

## Key Takeaways

- **Pods** are the basic building blocks
- **Deployments** manage Pod lifecycle and scaling
- **Services** provide stable networking
- Start with minikube for local development
- Use `kubectl` for all cluster operations

## Next Steps

- Explore ConfigMaps and Secrets for configuration
- Learn about Helm for package management
- Set up monitoring with Prometheus and Grafana

Happy orchestrating! 🚀
