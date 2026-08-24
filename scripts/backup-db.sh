#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
#  Automated PostgreSQL 16 Backup Script with Gzip, Checksum & Retention
# ═══════════════════════════════════════════════════════════════════════════════

set -eo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/enterprise_pos/postgres}"
CONTAINER_NAME="${DB_CONTAINER:-enterprise_pos_postgres_prod}"
DB_NAME="${DB_DATABASE:-enterprise_pos}"
DB_USER="${DB_USERNAME:-postgres}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATE_DAY=$(date +"%d")
DATE_DOW=$(date +"%u") # 1 = Monday, 7 = Sunday
BACKUP_FILE="${BACKUP_DIR}/enterprise_pos_${TIMESTAMP}.sql.gz"
LOG_FILE="${BACKUP_DIR}/backup.log"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}/daily" "${BACKUP_DIR}/weekly" "${BACKUP_DIR}/monthly"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "▶ Starting automated PostgreSQL backup for database: ${DB_NAME}..."

# 1. Execute pg_dump inside Docker container and compress with gzip
if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --no-owner --clean --if-exists | gzip -9 > "$BACKUP_FILE"; then
    log "✔ Backup dump completed successfully: ${BACKUP_FILE}"
else
    log "✖ ERROR: pg_dump execution failed!"
    exit 1
fi

# 2. Generate SHA256 Checksum for data integrity verification
sha256sum "$BACKUP_FILE" > "${BACKUP_FILE}.sha256"
log "✔ SHA256 checksum generated: ${BACKUP_FILE}.sha256"

# 3. Categorize into retention tiers (Daily, Weekly, Monthly)
cp "$BACKUP_FILE" "${BACKUP_DIR}/daily/"
cp "${BACKUP_FILE}.sha256" "${BACKUP_DIR}/daily/"

# On Sundays, save a weekly backup
if [ "$DATE_DOW" -eq 7 ]; then
    log "ℹ Archiving Sunday weekly backup..."
    cp "$BACKUP_FILE" "${BACKUP_DIR}/weekly/"
    cp "${BACKUP_FILE}.sha256" "${BACKUP_DIR}/weekly/"
fi

# On the 1st day of the month, save a monthly backup
if [ "$DATE_DAY" -eq "01" ]; then
    log "ℹ Archiving 1st-of-the-month backup..."
    cp "$BACKUP_FILE" "${BACKUP_DIR}/monthly/"
    cp "${BACKUP_FILE}.sha256" "${BACKUP_DIR}/monthly/"
fi

# 4. Enforce Retention Policy
# Retain 7 daily backups
find "${BACKUP_DIR}/daily" -name "*.sql.gz*" -mtime +7 -exec rm {} \;
# Retain 4 weekly backups (28 days)
find "${BACKUP_DIR}/weekly" -name "*.sql.gz*" -mtime +28 -exec rm {} \;
# Retain 12 monthly backups (365 days)
find "${BACKUP_DIR}/monthly" -name "*.sql.gz*" -mtime +365 -exec rm {} \;

# Clean root raw dumps older than 2 days
find "$BACKUP_DIR" -maxdepth 1 -name "*.sql.gz*" -mtime +2 -exec rm {} \;

log "✔ Backup retention policy applied. Backup process completed successfully!"
