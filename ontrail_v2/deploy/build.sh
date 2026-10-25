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
(cd "$ROOT/apps/web" && { bun install --frozen-lockfile >/dev/null 2>&1 || { echo 'varoitus: bun.lockb ei vastaa package.json:ia; asennetaan ilman lukitusta' >&2; bun install >/dev/null; }; } && VITE_HANKO_URL="${VITE_HANKO_URL:-https://$SITE_HOST/hanko}" VITE_API_URL="${VITE_API_URL:-/api}" bun run build)
mkdir -p "$STAGE/public" && cp -R "$ROOT/apps/web/dist/." "$STAGE/public/"
# Herätyssivu (autostart): staattinen, Workerin tarjoama; sisältää julkisen Turnstile-avaimen
if [ -f "$DEPLOY_DIR/edge/wake.html" ]; then mkdir -p "$STAGE/public/wake-up"; sed "s#__TURNSTILE_SITE_KEY__#${TURNSTILE_SITE_KEY:-}#g" "$DEPLOY_DIR/edge/wake.html" > "$STAGE/public/wake-up/index.html"; fi

echo "== api"
# Monorepon rakenne säilyy (API tuo tyyppejä ja lajit apps/web/src:stä): apps/api + apps/web/src (vain lähteet, ei testejä)
mkdir -p "$STAGE/apps/api" "$STAGE/apps/web" && cp -R "$ROOT/apps/api/src" "$ROOT/apps/api/migrations" "$ROOT/apps/api/package.json" "$ROOT/apps/api/tsconfig.json" "$STAGE/apps/api/"
cp -R "$ROOT/apps/web/src" "$STAGE/apps/web/src"
[ -f "$ROOT/apps/api/bun.lockb" ] && cp "$ROOT/apps/api/bun.lockb" "$STAGE/apps/api/"
[ -f "$ROOT/apps/api/bun.lock" ] && cp "$ROOT/apps/api/bun.lock" "$STAGE/apps/api/"
find "$STAGE/apps" -name '*.test.ts' -o -name '*.test.tsx' | xargs rm -f

echo "== hanko (linux/$GOARCH, ontrail-paikkaukset)"
HK="$(mktemp -d)"; trap 'rm -rf "$STAGE" "$HK"' EXIT
[ -f "$HANKO_SRC/main.go" ] || { echo "Hankon lähdekoodia ei löydy: $HANKO_SRC (aseta HANKO_SRC)" >&2; exit 1; }
rsync -a --exclude .git "$HANKO_SRC/" "$HK/backend/"
bash "$ROOT/infra/hanko/patches/apply.sh" "$HK/backend" >/dev/null
mkdir -p "$STAGE/bin" && (cd "$HK/backend" && CGO_ENABLED=0 GOOS=linux GOARCH="$GOARCH" go build -o "$STAGE/bin/hanko" .)

echo "== palvelinskriptit"
cp -R "$DEPLOY_DIR/server" "$STAGE/server"
cp "$SITE_ENV" "$STAGE/site.env"
[ -d "$DEPLOY_DIR/edge" ] && 
# macOS lisäisi ._*-metatiedostoja (migraatioskripti ajaisi ne SQL:nä): COPYFILE_DISABLE + poissulku
find "$STAGE" -name '._*' -delete
COPYFILE_DISABLE=1 tar --no-xattrs --exclude='._*' -C "$STAGE" -czf "$OUT" .
echo "$OUT" >&3
