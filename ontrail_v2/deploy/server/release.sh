#!/usr/bin/env bash
# Asentaa puretun paketin uudeksi julkaisuksi ja käynnistää palvelut (root). Käyttö: release.sh <purettu paketti> <julkaisun tunniste>
set -euo pipefail
STAGE="${1:?}"; REL="${2:?}"
set -a; source "$STAGE/site.env"; set +a; source "$STAGE/server/defaults.sh"
LOCK="/run/$APP-deploy.lock"; touch "$LOCK"; trap 'rm -f "$LOCK"' EXIT   # autostop ei sammuta kesken julkaisun
D="$APP_DIR/releases/$REL"; mkdir -p "$D"
cp -R "$STAGE/public" "$STAGE/apps" "$STAGE/bin" "$D/"
( cd "$D/apps/api" && { [ -f bun.lockb ] || [ -f bun.lock ]; } && bun install --production --frozen-lockfile || bun install --production ) >/dev/null
chown -R "$APP:$APP" "$D"
ln -sfn "$D" "$APP_DIR/current"
systemctl restart "$APP-hanko" "$APP-api"
for i in $(seq 1 40); do curl -fsS "http://127.0.0.1:$API_PORT/api/health" >/dev/null 2>&1 && break || sleep 1; done
curl -fsS "http://127.0.0.1:$API_PORT/api/health" && echo " <- API vastaa"
curl -fsS "http://127.0.0.1:$HANKO_PORT/.well-known/jwks.json" >/dev/null && echo "Hanko vastaa"
ls -1dt "$APP_DIR"/releases/* | tail -n +4 | xargs -r rm -rf   # säilytä 3 viimeisintä
