#!/usr/bin/env bash
# Julkaisee palvelimelle (ja valinnaisesti Cloudflare-reunaan). Kaikki kohdekohtainen tulee site.env:stä.
#   deploy/deploy.sh                 rakenna, lähetä, (ensimmäisellä kerralla) valmistele palvelin, päivitä ja käynnistä
#   SETUP=1 deploy/deploy.sh         aja palvelimen valmistelu uudelleen (nginx, systemd, tietokannat)
#   EDGE=1 deploy/deploy.sh          julkaise lopuksi myös reuna (EDGE_WORKER, deploy/edge/deploy-edge.sh)
source "$(dirname "$0")/lib.sh"
: "${SSH_HOST:?SSH_HOST puuttuu}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
REL="$(date +%Y%m%d-%H%M%S)"

"$DEPLOY_DIR/wake-host.sh"
PKG="$(OUT="${TMPDIR:-/tmp}/$APP-$REL.tgz" REL="$REL" "$DEPLOY_DIR/build.sh")"

echo "== lähetetään"
scp "${SSH_OPTS[@]}" "$PKG" "$SSH_HOST:/tmp/"
ssh "${SSH_OPTS[@]}" "$SSH_HOST" REL="$REL" PKG="/tmp/$(basename "$PKG")" SETUP="${SETUP:-0}" bash -se <<'REMOTE'
set -euo pipefail
STAGE="$(mktemp -d)"; tar -xzf "$PKG" -C "$STAGE"
set -a; source "$STAGE/site.env"; set +a; source "$STAGE/server/defaults.sh"
if [ "$SETUP" = 1 ] || [ ! -f "$ETC_DIR/env" ]; then
  echo "== valmistellaan palvelin"; bash "$STAGE/server/setup.sh" "$STAGE"
fi
bash "$STAGE/server/release.sh" "$STAGE" "$REL"
rm -rf "$STAGE" "$PKG"
REMOTE
if [ "${EDGE:-0}" = 1 ]; then "$DEPLOY_DIR/edge/deploy-edge.sh"; fi
echo "== valmis: $REL ($SITE_HOST)"
