#!/usr/bin/env bash
# ============================================================================
# University Gate Entry System - MongoDB Export Helper Script
# ============================================================================
# Exports collections to JSON format for CA submission or reporting.
# ============================================================================

set -e

EXPORT_DIR="${1:-./exports}"
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"
MONGO_USER="${MONGO_USER:-admin}"
MONGO_PASS="${MONGO_PASS:-adminpassword}"
MONGO_DB="${MONGO_DB:-university_gate_db}"
AUTH_DB="${AUTH_DB:-admin}"

mkdir -p "$EXPORT_DIR"

echo "=================================================================="
echo "📦 Exporting MongoDB Collections to $EXPORT_DIR"
echo "=================================================================="

COLLECTIONS=("students" "gates" "gate_entries" "security_alerts")

for COLL in "${COLLECTIONS[@]}"; do
  OUTPUT_FILE="${EXPORT_DIR}/${COLL}.json"
  echo "Exporting ${COLL} -> ${OUTPUT_FILE}..."
  
  if command -v mongoexport &> /dev/null; then
    mongoexport \
      --host="${MONGO_HOST}" \
      --port="${MONGO_PORT}" \
      --username="${MONGO_USER}" \
      --password="${MONGO_PASS}" \
      --authenticationDatabase="${AUTH_DB}" \
      --db="${MONGO_DB}" \
      --collection="${COLL}" \
      --out="${OUTPUT_FILE}" \
      --jsonArray \
      --pretty
  else
    echo "ℹ️  'mongoexport' CLI not found. Using mongosh json export..."
    mongosh "mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${AUTH_DB}" \
      --quiet \
      --eval "JSON.stringify(db['${COLL}'].find().toArray(), null, 2)" > "${OUTPUT_FILE}"
  fi
  echo "✅ ${COLL} exported successfully."
done

echo "=================================================================="
echo "🎉 Export complete. Files available in: ${EXPORT_DIR}"
echo "=================================================================="
