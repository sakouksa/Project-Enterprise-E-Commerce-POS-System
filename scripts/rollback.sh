#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
#  Emergency Production Rollback Script for KHPosCommerce System
# ═══════════════════════════════════════════════════════════════════════════════

set -eo pipefail

COMPOSE_FILE="docker-compose.prod.yml"
BACKEND_CONTAINER="enterprise_pos_backend_prod"

log() {
    echo "=========================================================================="
    echo " [ROLLBACK $(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "=========================================================================="
}

if [ -z "$1" ]; then
    echo "Usage: $0 <git_commit_hash_or_tag>"
    echo "Example: $0 v1.0.4"
    exit 1
fi

TARGET_COMMIT="$1"

log "Step 1: Checking out target commit/tag: ${TARGET_COMMIT}..."
git checkout "$TARGET_COMMIT"

log "Step 2: Rebuilding & Restarting Containers..."
docker compose -f "$COMPOSE_FILE" build --parallel
docker compose -f "$COMPOSE_FILE" up -d

log "Step 3: Re-caching Laravel Configuration & Routes..."
docker exec "$BACKEND_CONTAINER" php /var/www/artisan optimize:clear
docker exec "$BACKEND_CONTAINER" php /var/www/artisan config:cache
docker exec "$BACKEND_CONTAINER" php /var/www/artisan route:cache
docker exec "$BACKEND_CONTAINER" php /var/www/artisan view:cache
docker exec "$BACKEND_CONTAINER" php /var/www/artisan queue:restart

log "✔ Rollback completed successfully to commit ${TARGET_COMMIT}!"
