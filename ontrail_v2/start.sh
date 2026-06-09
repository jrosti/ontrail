#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
HANKO_SRC="${HANKO_SRC:-$HOME/work/private/hanko/backend}"
HANKO_BIN="$ROOT/infra/hanko/hanko"
HANKO_CONFIG="$ROOT/infra/hanko/config.yaml"
INFRA_DIR="$ROOT/infra"

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

# ── 4. Start Hanko ────────────────────────────────────────────────────────────
green "Starting Hanko …"
"$HANKO_BIN" --config "$HANKO_CONFIG" serve all &
HANKO_PID=$!
wait_tcp localhost 8000 "Hanko"

# ── 5. Start mock API ─────────────────────────────────────────────────────────
green "Starting mock API …"
cd "$ROOT/apps/mock"
bun run src/server.ts &
MOCK_PID=$!

# ── 6. Start Vite frontend ────────────────────────────────────────────────────
green "Starting frontend …"
cd "$ROOT/apps/web"
bun run dev &
WEB_PID=$!

# ── 7. URLs ───────────────────────────────────────────────────────────────────
echo ""
echo "  ┌────────────────────────────────────────────────┐"
echo "  │  Frontend    →  http://localhost:5173           │"
echo "  │  Mock API    →  http://localhost:3001/api       │"
echo "  │  Hanko pub   →  http://localhost:8000           │"
echo "  │  Hanko admin →  http://localhost:8001           │"
echo "  │  MailSlurper →  http://localhost:8080 (smtp:2525)│"
echo "  │  Postgres    →  localhost:5432                  │"
echo "  └────────────────────────────────────────────────┘"
echo ""
dim "Press Ctrl-C to stop all services"
echo ""

trap '
  echo ""
  echo "  Stopping …"
  kill $HANKO_PID $MOCK_PID $WEB_PID 2>/dev/null
  docker-compose -f "$INFRA_DIR/docker-compose.yml" stop
  echo "  Done."
' INT TERM

wait
