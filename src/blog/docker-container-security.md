---
title: Docker Container Security Best Practices
description: Essential security practices for building and running Docker containers in production environments
date: 2026-01-02
tags:
  - docker
  - security
  - containers
readingTime: 5
---

Containers are only as secure as how you build and run them. Let's explore essential practices to secure your Docker workloads.

## Building Secure Images

### 1. Use Minimal Base Images

```dockerfile
# ❌ Avoid - Large attack surface
FROM ubuntu:latest

# ✅ Better - Minimal image
FROM alpine:3.19

# ✅ Best - Distroless for production
FROM gcr.io/distroless/static-debian12
```

### 2. Don't Run as Root

```dockerfile
# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set ownership
COPY --chown=appuser:appgroup . /app

# Switch to non-root
USER appuser
```

### 3. Use Multi-Stage Builds

Keep build tools out of production images:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
USER app
CMD ["node", "dist/index.js"]
```

### 4. Pin Image Versions

```dockerfile
# ❌ Never use 'latest'
FROM nginx:latest

# ✅ Pin specific version
FROM nginx:1.25.3-alpine

# ✅ Even better - use digest
FROM nginx@sha256:abc123...
```

### 5. Scan Images for Vulnerabilities

```bash
# Using Trivy
trivy image myapp:latest

# Using Docker Scout
docker scout cves myapp:latest
```

## Runtime Security

### 1. Read-Only Root Filesystem

```yaml
# docker-compose.yml
services:
  app:
    image: myapp:latest
    read_only: true
    tmpfs:
      - /tmp
```

Or with Docker run:

```bash
docker run --read-only --tmpfs /tmp myapp:latest
```

### 2. Drop Capabilities

```yaml
services:
  app:
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE  # Only what's needed
```

### 3. Set Resource Limits

Prevent DoS attacks:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### 4. Use Security Options

```yaml
services:
  app:
    security_opt:
      - no-new-privileges:true
      - seccomp:seccomp-profile.json
```

### 5. Network Isolation

```yaml
networks:
  frontend:
  backend:
    internal: true  # No external access

services:
  web:
    networks:
      - frontend
      - backend
  
  database:
    networks:
      - backend  # Only internal access
```

## Secrets Management

### Never Embed Secrets in Images

```dockerfile
# ❌ NEVER do this
ENV API_KEY=supersecret123

# ❌ Also bad
COPY .env /app/.env
```

### Use Docker Secrets

```yaml
services:
  app:
    secrets:
      - db_password
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    external: true
```

## Security Checklist

| Check | Action |
|-------|--------|
| Base image | Use minimal/distroless |
| User | Non-root |
| Filesystem | Read-only when possible |
| Capabilities | Drop all, add only needed |
| Resources | Set CPU/memory limits |
| Network | Isolate services |
| Secrets | Never in images |
| Updates | Rebuild regularly |
| Scanning | Automated in CI/CD |

## Quick Commands

```bash
# Check image for security issues
docker scout quickview myapp:latest

# Run with security best practices
docker run \
  --read-only \
  --user 1000:1000 \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  --memory 512m \
  --cpus 0.5 \
  myapp:latest
```

## Key Takeaways

- Use minimal base images (Alpine, Distroless)
- Never run containers as root
- Scan images in CI/CD pipeline
- Apply least-privilege at runtime
- Keep secrets out of images

Secure by default! 🔐
