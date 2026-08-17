# 🚀 Production Deployment & Infrastructure Guide

## 1. Production Architecture (Docker Swarm / Kubernetes / VPS)

```mermaid
flowchart TD
    DNS[Cloudflare / DNS + SSL] --> Nginx[Nginx Reverse Proxy :443]
    
    subgraph FrontendServices[" Static Assets / SPA "]
        AdminSpa[Admin Dashboard dist/]
        WebSpa[Customer Storefront dist/]
    end

    subgraph BackendServices[" PHP-FPM Application Cluster "]
        PHP1[Laravel App Pod 1]
        PHP2[Laravel App Pod 2]
        QueueWorker[Redis Queue Worker]
        CronWorker[Task Scheduler]
    end

    subgraph StorageCluster[" Persistent Data Cluster "]
        MySQL[(MySQL 8.0 Master)]
        Redis[(Redis 7.0 Cache & Queue)]
        S3[(AWS S3 / MinIO Object Storage)]
    end

    Nginx --> AdminSpa
    Nginx --> WebSpa
    Nginx -->|/api/*| PHP1 & PHP2

    PHP1 & PHP2 --> MySQL
    PHP1 & PHP2 --> Redis
    PHP1 & PHP2 --> S3
    QueueWorker --> Redis
    QueueWorker --> MySQL
```

---

## 2. Docker Compose Deployment Commands

```bash
# 1. Pull latest code & build images
git pull origin main
docker compose build --no-cache

# 2. Start container stack in daemon mode
docker compose up -d

# 3. Execute database migrations
docker compose exec app php artisan migrate --force

# 4. Cache configurations & routes
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache

# 5. Restart background queue worker
docker compose exec app php artisan queue:restart
```
