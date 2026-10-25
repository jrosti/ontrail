#!/usr/bin/env bash
# Rakentaa julkaisupaketin paikallisesti: web (Vite), API (lähde + migraatiot), ontrail-paikattu Hanko (linux/amd64), palvelinskriptit.
# Tulos: $OUT (oletus /tmp/$APP-<REL>.tgz). Käyttö: deploy/build.sh   (kutsutaan myös deploy.sh:sta)
source "$(dirname "$0")/lib.sh"
exec 3>&1 1>&2   # lokit stderriin, vain paketin polku stdoutiin
REL="${REL:-$(date +%Y%m%d-%H%M%S)}"
OUT="${OUT:-${TMPDIR:-/tmp}/$APP-$REL.tgz}"
STAGE="$(mktemp -d)"; trap 'rm -rf "$STAGE"' EXIT
GOARCH="${GOARCH:-amd64}"

echo "== web"
(cd "$ROOT/apps/web" && bun install --frozen-lockfile >/dev/null && VITE_HANKO_URL="${VITE_HANKO_URL:-https://$SITE_HOST/hanko}" VITE_API_URL="${VITE_API_URL:-/api}" bun run build)
mkdir -p "$STAGE/web" && cp -R "$ROOT/apps/web/dist/." "$STAGE/web/"
# Herätyssivu (autostart): staattinen, Workerin tarjoama; sisältää julkisen Turnstile-avaimen
if [ -f "$DEPLOY_DIR/edge/wake.html" ]; then sed "s#__TURNSTILE_SITE_KEY__#${TURNSTILE_SITE_KEY:-}#g" "$DEPLOY_DIR/edge/wake.html" > "$STAGE/web/wake.html"; fi

echo "== api"
mkdir -p "$STAGE/api" && cp -R "$ROOT/apps/api/src" "$ROOT/apps/api/migrations" "$ROOT/apps/api/package.json" "$ROOT/apps/api/tsconfig.json" "$STAGE/api/"
[ -f "$ROOT/apps/api/bun.lockb" ] && cp "$ROOT/apps/api/bun.lockb" "$STAGE/api/"
[ -f "$ROOT/apps/api/bun.lock" ] && cp "$ROOT/apps/api/bun.lock" "$STAGE/api/"
find "$STAGE/api/src" -name '*.test.ts' -delete

echo "== hanko (linux/$GOARCH, ontrail-paikkaukset)"
HK="$(mktemp -d)"; trap 'rm -rf "$STAGE" "$HK"' EXIT
[ -f "$HANKO_SRC/main.go" ] || { echo "Hankon lähdekoodia ei löydy: $HANKO_SRC (aseta HANKO_SRC)" >&2; exit 1; }
rsync -a --exclude .git "$HANKO_SRC/" "$HK/backend/"
bash "$ROOT/infra/hanko/patches/apply.sh" "$HK/backend" >/dev/null
mkdir -p "$STAGE/bin" && (cd "$HK/backend" && CGO_ENABLED=0 GOOS=linux GOARCH="$GOARCH" go build -o "$STAGE/bin/hanko" .)

echo "== palvelinskriptit"
cp -R "$DEPLOY_DIR/server" "$STAGE/server"
cp "$SITE_ENV" "$STAGE/site.env"
[ -d "$DEPLOY_DIR/edge" ] && cp "$DEPLOY_DIR/edge/wake.html" "$STAGE/" 2>/dev/null || true
tar -C "$STAGE" -czf "$OUT" .
echo "$OUT" >&3
