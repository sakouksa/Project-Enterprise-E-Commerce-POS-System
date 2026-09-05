#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
#  Interactive PostgreSQL 16 Database Restoration Script with Safety Checks
# ═══════════════════════════════════════════════════════════════════════════════

set -eo pipefail

if [ -z "$1" ]; then
    echo "Usage: $0 <path_to_backup_file.sql.gz>"
    echo "Example: $0 /var/backups/khposcommerce/postgres/daily/khposcommerce_20260905.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"
CONTAINER_NAME="${DB_CONTAINER:-enterprise_pos_postgres_prod}"
DB_NAME="${DB_DATABASE:-khposcommerce}"
DB_USER="${DB_USERNAME:-postgres}"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "✖ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "=========================================================================="
echo " ⚠ CAUTION: YOU ARE ABOUT TO RESTORE A PRODUCTION POSTGRESQL DATABASE ⚠"
echo " Target Container: $CONTAINER_NAME"
echo " Target Database:  $DB_NAME"
echo " Backup Source:    $BACKUP_FILE"
echo "=========================================================================="

# Check checksum if exists
if [ -f "${BACKUP_FILE}.sha256" ]; then
    echo "▶ Verifying SHA256 checksum..."
    if sha256sum -c "${BACKUP_FILE}.sha256"; then
        echo "✔ Checksum verification passed!"
    else
        echo "✖ ERROR: Checksum mismatch! Corrupted backup file."
        exit 1
    fi
fi

read -p "Are you absolutely sure you want to overwrite '${DB_NAME}'? Type 'YES RESTORE': " CONFIRM
if [ "$CONFIRM" != "YES RESTORE" ]; then
    echo "Restoration cancelled by operator."
    exit 0
fi

echo "▶ Restoring database from compressed dump..."
gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"

echo "✔ Database restoration completed successfully!"
