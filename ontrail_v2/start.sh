#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  OnTrail v2 — dev mode"
echo "  Mock API  →  http://localhost:3001/api"
echo "  Frontend  →  http://localhost:5173"
echo ""

# Start mock API
cd "$ROOT/apps/mock"
bun run src/server.ts &
API_PID=$!

# Start Vite frontend
cd "$ROOT/apps/web"
bun run dev &
WEB_PID=$!

trap "kill $API_PID $WEB_PID 2>/dev/null; echo 'stopped.'" INT TERM
wait
