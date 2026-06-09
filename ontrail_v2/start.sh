#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
HANKO_SRC="${HANKO_SRC:-$HOME/work/private/hanko/backend}"
HANKO_BIN="$ROOT/infra/hanko/hanko"
HANKO_CONFIG="$ROOT/infra/hanko/config.yaml"
INFRA_DIR="$ROOT/infra"
API_DIR="$ROOT/apps/api"
WEB_DIR="$ROOT/apps/web"
HANKO_PID=""
API_PID=""
WEB_PID=""

# ── helpers ──────────────────────────────────────────────────────────────────
green() { printf '\033[32m  %s\033[0m\n' "$*"; }
dim()   { printf '\033[2m  %s\033[0m\n'  "$*"; }

wait_tcp() {
  local host=$1 port=$2 label=$3 n=0
  printf "  waiting for %s" "$label"
  until nc -z "$host" "$port" 2>/dev/null; do
    sleep 0.5; printf '.'; n=$((n+1))
    if [ $n -gt 60 ]; then echo " timeout"; exit 1; fi
  done
  echo " ready"
}

require_port_free() {
  local port=$1 label=$2
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "  ERROR: $label port $port is already in use."
    lsof -nP -iTCP:"$port" -sTCP:LISTEN
    exit 1
  fi
}

cleanup() {
  echo ""
  echo "  Stopping …"
  [ -n "$HANKO_PID" ] && kill "$HANKO_PID" 2>/dev/null || true
  [ -n "$API_PID" ] && kill "$API_PID" 2>/dev/null || true
  [ -n "$WEB_PID" ] && kill "$WEB_PID" 2>/dev/null || true
  docker-compose -f "$INFRA_DIR/docker-compose.yml" stop
  echo "  Done."
}

trap cleanup INT TERM

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║  OnTrail v2 — starting               ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# ── 1. Start Docker infra (Postgres + MailSlurper) ────────────────────────────
green "Starting Docker infra …"
docker-compose -f "$INFRA_DIR/docker-compose.yml" up -d
wait_tcp localhost 5432  "Postgres"
wait_tcp localhost 2525  "MailSlurper"

green "Ensuring OnTrail database exists …"
if [ -z "$(docker-compose -f "$INFRA_DIR/docker-compose.yml" exec -T postgresd psql -U hanko -d postgres -tAc "select 1 from pg_database where datname = 'ontrail'")" ]; then
  docker-compose -f "$INFRA_DIR/docker-compose.yml" exec -T postgresd createdb -U hanko -O hanko ontrail
fi

# ── 2. Apply patches and build Hanko binary ───────────────────────────────────
if [ ! -f "$HANKO_SRC/main.go" ]; then
  echo "  ERROR: Hanko source not found at $HANKO_SRC"
  echo "  Set HANKO_SRC=/path/to/hanko/backend and re-run."
  exit 1
fi

green "Applying OnTrail patches to Hanko …"
bash "$INFRA_DIR/hanko/patches/apply.sh" "$HANKO_SRC"

NEEDS_BUILD=false
if [ ! -f "$HANKO_BIN" ]; then
  NEEDS_BUILD=true
elif [ "$HANKO_SRC/main.go" -nt "$HANKO_BIN" ] || \
     [ "$HANKO_SRC/handler/user.go" -nt "$HANKO_BIN" ] || \
     [ "$HANKO_SRC/dto/profile.go" -nt "$HANKO_BIN" ]; then
  NEEDS_BUILD=true
fi

if [ "$NEEDS_BUILD" = true ]; then
  green "Building Hanko …"
  (cd "$HANKO_SRC" && go build -o "$HANKO_BIN" . 2>&1)
  green "Hanko built → $HANKO_BIN"
else
  dim "Hanko binary up-to-date, skipping build"
fi

# ── 3. Run Hanko migrations ───────────────────────────────────────────────────
green "Running Hanko DB migrations …"
"$HANKO_BIN" --config "$HANKO_CONFIG" migrate up

# ── 4. Run OnTrail API migrations ─────────────────────────────────────────────
green "Running OnTrail API migrations …"
(cd "$API_DIR" && bun run db:migrate)

# ── 5. Start Hanko ────────────────────────────────────────────────────────────
require_port_free 8000 "Hanko public"
require_port_free 8001 "Hanko admin"
green "Starting Hanko …"
"$HANKO_BIN" --config "$HANKO_CONFIG" serve all &
HANKO_PID=$!
wait_tcp localhost 8000 "Hanko"
wait_tcp localhost 8001 "Hanko admin"

# ── 6. Start OnTrail API ──────────────────────────────────────────────────────
require_port_free 3002 "OnTrail API"
green "Starting OnTrail API …"
cd "$API_DIR"
bun run start &
API_PID=$!
wait_tcp localhost 3002 "OnTrail API"

# ── 7. Start Vite frontend ────────────────────────────────────────────────────
require_port_free 5173 "Frontend"
green "Starting frontend …"
cd "$WEB_DIR"
bun run dev &
WEB_PID=$!

# ── 8. URLs ───────────────────────────────────────────────────────────────────
echo ""
echo "  ┌────────────────────────────────────────────────┐"
echo "  │  Frontend    →  http://localhost:5173           │"
echo "  │  API         →  http://localhost:3002/api       │"
echo "  │  Hanko pub   →  http://localhost:8000           │"
echo "  │  Hanko admin →  http://localhost:8001           │"
echo "  │  MailSlurper →  http://localhost:9080 (smtp:2525)│"
echo "  │  Postgres    →  localhost:5432                  │"
echo "  └────────────────────────────────────────────────┘"
echo ""
dim "Press Ctrl-C to stop all services"
echo ""

wait
