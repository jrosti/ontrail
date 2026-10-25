#!/usr/bin/env bash
# Herättää nukkuvan palvelimen UpCloud-rajapinnasta ja odottaa SSH:ta. Ilman UPCLOUD_*-asetuksia ei tee mitään.
set -euo pipefail
[ -n "${UPCLOUD_API_TOKEN:-}" ] && [ -n "${UPCLOUD_SERVER_UUID:-}" ] || { echo "wake-host: ei UpCloud-asetuksia; oletetaan palvelin hereillä."; exit 0; }
api() { curl -fsS --max-time 20 -H "Authorization: Bearer $UPCLOUD_API_TOKEN" -H "Accept: application/json" "$@"; }
url="https://api.upcloud.com/1.3/server/$UPCLOUD_SERVER_UUID"
state="$(api "$url" | python3 -c 'import json,sys; print(json.load(sys.stdin)["server"]["state"])')"
echo "wake-host: tila $state"
[ "$state" = "started" ] || api --max-time 120 -X POST "$url/start" >/dev/null || echo "wake-host: start ei vahvistunut; odotetaan SSH:ta" >&2
host="${SSH_HOST#*@}"; deadline=$(( $(date +%s) + ${WAKE_WAIT_SEC:-300} ))
until (exec 3<>"/dev/tcp/$host/22") 2>/dev/null; do
  [ "$(date +%s)" -lt "$deadline" ] || { echo "wake-host: $host:22 ei vastannut" >&2; exit 1; }
  sleep 5
done
echo "wake-host: SSH vastaa"
