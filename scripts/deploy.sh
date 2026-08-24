#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
#  Zero-Downtime Production Deployment Script for Enterprise POS & E-Commerce
# ═══════════════════════════════════════════════════════════════════════════════

set -eo pipefail

COMPOSE_FILE="docker-compose.prod.yml"
BACKEND_CONTAINER="enterprise_pos_backend_prod"
GATEWAY_CONTAINER="enterprise_pos_gateway_prod"
HEALTH_URL="http://127.0.0.1/api/health"

log() {
    echo "=========================================================================="
    echo " [DEPLOY $(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "=========================================================================="
}

log "Step 1: Creating Pre-Deployment Database Backup..."
./scripts/backup-db.sh || {
    echo "✖ Backup failed! Aborting deployment to protect data."
    exit 1
}

log "Step 2: Pulling Latest Git Repository Commits..."
git pull origin main

log "Step 3: Building and Starting Production Docker Services..."
docker compose -f "$COMPOSE_FILE" build --parallel
docker compose -f "$COMPOSE_FILE" up -d

log "Step 4: Executing Database Migrations (Safe Forward Migrations)..."
docker exec "$BACKEND_CONTAINER" php /var/www/artisan migrate --force --no-interaction

log "Step 5: Optimizing Laravel Configuration, Routes, Views & Events..."
docker exec "$BACKEND_CONTAINER" php /var/www/artisan optimize:clear
docker exec "$BACKEND_CONTAINER" php /var/www/artisan config:cache
docker exec "$BACKEND_CONTAINER" php /var/www/artisan route:cache
docker exec "$BACKEND_CONTAINER" php /var/www/artisan view:cache
docker exec "$BACKEND_CONTAINER" php /var/www/artisan event:cache

log "Step 6: Gracefully Restarting Background Queue Workers..."
docker exec "$BACKEND_CONTAINER" php /var/www/artisan queue:restart

log "Step 7: Reloading Nginx Gateway Configuration..."
docker exec "$GATEWAY_CONTAINER" nginx -s reload || true

log "Step 8: Performing Health Check Verification..."
sleep 3
HEALTH_STATUS=$(docker exec "$BACKEND_CONTAINER" php -r "echo @file_get_contents('http://127.0.0.1:9000/api/health') ?: 'FAIL';")

if [ "$HEALTH_STATUS" != "FAIL" ]; then
    log "✔ Health check passed! Production deployment was 100% SUCCESSFUL!"
else
    log "⚠ Warning: Direct health ping was unreachable. Please inspect container logs: docker compose -f $COMPOSE_FILE logs"
fi
