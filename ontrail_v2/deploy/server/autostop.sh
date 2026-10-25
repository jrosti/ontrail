#!/usr/bin/env bash
# Sammuttaa palvelimen, kun sovellus (ja mahdolliset muut rekisteröidyt, $PEERS_FILE) ilmoittavat olevansa joutilaita.
# Kytkin: $ETC_DIR/autostop sisältää "enabled". Ei sammuta: kytkin pois, julkaisu kesken (lukko < 30 min), sovellus ei vastaa.
# APP tulee systemd-yksiköstä (Environment=APP=…); muut asetukset /etc/$APP/site.env + defaults.sh.
set -euo pipefail
APP="${APP:?APP puuttuu}"
set -a; source "/etc/$APP/site.env"; set +a; source "/etc/$APP/defaults.sh"
LOCK="/run/$APP-deploy.lock"
[ "$(cat "$ETC_DIR/autostop" 2>/dev/null || true)" = "enabled" ] || exit 0
if [ -e "$LOCK" ] && [ $(( $(date +%s) - $(stat -c %Y "$LOCK") )) -lt 1800 ]; then exit 0; fi
is_idle() { curl -fsS --max-time 5 "$1" | python3 -c 'import json,sys; sys.exit(0 if json.load(sys.stdin).get("idle") is True else 1)'; }
is_idle "http://127.0.0.1:$API_PORT/api/idle" || exit 0
logger -t "$APP-autostop" "joutilas; sammutetaan"
systemctl poweroff
