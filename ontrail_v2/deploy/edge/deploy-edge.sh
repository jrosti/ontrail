#!/usr/bin/env bash
# Julkaisee Cloudflare-Workerin (staattinen käyttöliittymä + välitys + herätys). Asetukset site.env:stä:
#   EDGE_WORKER (Workerin nimi), SITE_HOST (reitti), ORIGIN_HOST (alkupää; oltava eri kuin SITE_HOST, proxattu DNS-tietue),
#   TURNSTILE_SITE_KEY (herätyssivulle), LIMITER_ID (Rate Limiting -nimiavaruus, oletus hajautettu SITE_HOST:sta).
# Edellyttää rakennettua web-pakettia: deploy/build.sh tuottaa web/-kansion; ASSETS_DIR osoittaa sinne (oletus apps/web/dist).
source "$(dirname "$0")/../lib.sh"
: "${EDGE_WORKER:?EDGE_WORKER puuttuu site.env:stä}"
[ "$ORIGIN_HOST" != "$SITE_HOST" ] || { echo "ORIGIN_HOST pitää olla eri kuin SITE_HOST, kun reuna on käytössä" >&2; exit 1; }
EDGE_DIR="$DEPLOY_DIR/edge"
ASSETS_DIR="${ASSETS_DIR:-$ROOT/apps/web/dist}"   # sama rakennettu käyttöliittymä kuin palvelimella
[ -d "$ASSETS_DIR" ] || { echo "Puuttuu $ASSETS_DIR (aja web-build)" >&2; exit 1; }
# Herätyssivu mukaan staattisiin tiedostoihin (Turnstile-avain täytetään)
mkdir -p "$ASSETS_DIR/wake-up"; sed "s#__TURNSTILE_SITE_KEY__#${TURNSTILE_SITE_KEY:-}#g" "$EDGE_DIR/wake.html" > "$ASSETS_DIR/wake-up/index.html"
LIMITER_ID="${LIMITER_ID:-$(( 4000 + $(printf '%s' "$SITE_HOST" | cksum | cut -d' ' -f1) % 5000 ))}"
sed -e "s#__WORKER__#$EDGE_WORKER#g" -e "s#__ASSETS_DIR__#$ASSETS_DIR#g" -e "s#__ORIGIN_URL__#https://$ORIGIN_HOST#g" -e "s#__SITE_HOST__#$SITE_HOST#g" -e "s#__LIMITER_ID__#$LIMITER_ID#g" \
  "$EDGE_DIR/wrangler.template.jsonc" > "$EDGE_DIR/wrangler.generated.jsonc"
cd "$EDGE_DIR" && { [ -d node_modules ] || npm install --no-audit --no-fund; }
npx wrangler deploy -c wrangler.generated.jsonc
