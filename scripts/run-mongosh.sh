#!/usr/bin/env bash
# ============================================================================
# University Gate Entry System - mongosh Helper & Runner Script
# ============================================================================
# Simplifies running mongosh commands and scripts locally or inside Docker.
# ============================================================================

set -e

MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"
MONGO_USER="${MONGO_USER:-admin}"
MONGO_PASS="${MONGO_PASS:-adminpassword}"
MONGO_DB="${MONGO_DB:-university_gate_db}"
AUTH_DB="${AUTH_DB:-admin}"

DOCKER_CONTAINER="university-gate-mongo"

print_header() {
  echo "=================================================================="
  echo "🏛️  University Gate Entry System - MongoDB Shell (mongosh)"
  echo "=================================================================="
}

show_help() {
  print_header
  echo "Usage: $0 [OPTION]"
  echo ""
  echo "Options:"
  echo "  (no args)     Open interactive mongosh connected to database"
  echo "  --init        Execute master init script (mongo-init/init.js)"
  echo "  --queries     Execute 10 CA demonstration queries (03-ca-queries.js)"
  echo "  --stats       Show collection counts and database stats"
  echo "  --docker      Open mongosh inside the running Docker container"
  echo "  --help        Display this help message"
  echo ""
  echo "Environment variables available to override:"
  echo "  MONGO_HOST (default: localhost)"
  echo "  MONGO_PORT (default: 27017)"
  echo "  MONGO_USER (default: admin)"
  echo "  MONGO_PASS (default: adminpassword)"
  echo "  MONGO_DB   (default: university_gate_db)"
  echo "=================================================================="
}

check_mongosh_installed() {
  if ! command -v mongosh &> /dev/null; then
    echo "⚠️  'mongosh' CLI not found on local PATH."
    echo "💡 Trying to execute inside Docker container '${DOCKER_CONTAINER}'..."
    return 1
  fi
  return 0
}

is_docker_running() {
  if command -v docker &> /dev/null && docker ps --format '{{.Names}}' | grep -q "^${DOCKER_CONTAINER}$"; then
    return 0
  fi
  return 1
}

# Determine execution mode: local mongosh or docker exec
run_mongosh_command() {
  local target_file="$1"
  local inline_eval="$2"

  local conn_str="mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${AUTH_DB}"

  if check_mongosh_installed; then
    if [ -n "$inline_eval" ]; then
      mongosh "$conn_str" --eval "$inline_eval"
    elif [ -n "$target_file" ]; then
      mongosh "$conn_str" "$target_file"
    else
      mongosh "$conn_str"
    fi
  elif is_docker_running; then
    echo "🐳 Executing in running Docker container: ${DOCKER_CONTAINER}..."
    if [ -n "$inline_eval" ]; then
      docker exec -it "$DOCKER_CONTAINER" mongosh -u "$MONGO_USER" -p "$MONGO_PASS" --authenticationDatabase "$AUTH_DB" "$MONGO_DB" --eval "$inline_eval"
    elif [ -n "$target_file" ]; then
      docker exec -i "$DOCKER_CONTAINER" mongosh -u "$MONGO_USER" -p "$MONGO_PASS" --authenticationDatabase "$AUTH_DB" "$MONGO_DB" < "$target_file"
    else
      docker exec -it "$DOCKER_CONTAINER" mongosh -u "$MONGO_USER" -p "$MONGO_PASS" --authenticationDatabase "$AUTH_DB" "$MONGO_DB"
    fi
  else
    echo "❌ Error: Neither local 'mongosh' nor running Docker container '${DOCKER_CONTAINER}' was found."
    echo ""
    echo "To start MongoDB with Docker Compose:"
    echo "  docker compose up -d mongodb"
    echo ""
    echo "Or start local mongod and install mongosh via brew:"
    echo "  brew install mongosh"
    exit 1
  fi
}

case "$1" in
  --help|-h)
    show_help
    ;;
  --init)
    print_header
    echo "🚀 Running database initialization..."
    run_mongosh_command "mongo-init/init.js" ""
    ;;
  --queries)
    print_header
    echo "📊 Running CA demonstration queries..."
    run_mongosh_command "mongo-init/03-ca-queries.js" ""
    ;;
  --stats)
    print_header
    echo "📈 Fetching database statistics..."
    run_mongosh_command "" "
      const colls = ['students', 'gates', 'gate_entries', 'security_alerts'];
      print('\nDatabase: ' + db.getName());
      colls.forEach(c => {
        print(' - ' + c.padEnd(16) + ' : ' + db[c].countDocuments() + ' documents');
      });
    "
    ;;
  --docker)
    print_header
    echo "🐳 Launching mongosh inside Docker container..."
    docker exec -it "$DOCKER_CONTAINER" mongosh -u "$MONGO_USER" -p "$MONGO_PASS" --authenticationDatabase "$AUTH_DB" "$MONGO_DB"
    ;;
  *)
    print_header
    echo "🔌 Connecting to ${MONGO_DB}..."
    run_mongosh_command "" ""
    ;;
esac
