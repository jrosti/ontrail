#!/usr/bin/env bash
# Palvelimen valmistelu (root, idempotentti; deploy.sh ajaa ensimmäisellä kerralla): Bun, käyttäjä, Postgres-kannat, asetustiedostot,
# systemd-yksiköt, nginx-vhost ja autostop. Salaisuudet generoidaan tänne eivätkä kulje repossa.
set -euo pipefail
STAGE="${1:?käyttö: setup.sh <purettu paketti>}"
set -a; source "$STAGE/site.env"; set +a; source "$STAGE/server/defaults.sh"
export DEBIAN_FRONTEND=noninteractive
UNIT_API="$APP-api"; UNIT_HANKO="$APP-hanko"

command -v nginx >/dev/null && command -v psql >/dev/null && command -v unzip >/dev/null || { apt-get update -qq; apt-get install -y -qq ca-certificates curl unzip nginx postgresql python3 openssl; }
[ -f "$SSL_CERT" ] && [ -f "$SSL_KEY" ] || { echo "Puuttuu TLS-sertifikaatti $SSL_CERT / $SSL_KEY (asenna ensin; ks. deploy/README.md)" >&2; exit 1; }

# ── Bun (pinnattu versio, tarkistussumma GitHub-julkaisun SHASUMS256.txt:stä) ──
if ! command -v bun >/dev/null || [ "$(bun --version)" != "$BUN_VERSION" ]; then
  arch="$(uname -m)"; [ "$arch" = aarch64 ] && ba=aarch64 || ba=x64
  base="https://github.com/oven-sh/bun/releases/download/bun-v$BUN_VERSION"; T="$(mktemp -d)"
  curl -fsSL -o "$T/bun.zip" "$base/bun-linux-$ba.zip"; curl -fsSL -o "$T/SHASUMS256.txt" "$base/SHASUMS256.txt"
  want="$(grep "bun-linux-$ba.zip\$" "$T/SHASUMS256.txt" | awk '{print $1}')"; got="$(sha256sum "$T/bun.zip" | awk '{print $1}')"
  [ -n "$want" ] && [ "$want" = "$got" ] || { echo "Bunin tarkistussumma ei täsmää" >&2; exit 1; }
  unzip -q -o "$T/bun.zip" -d "$T" && install -m 0755 "$T/bun-linux-$ba/bun" /usr/local/bin/bun; rm -rf "$T"
fi

# ── käyttäjä ja hakemistot ──
id "$APP" >/dev/null 2>&1 || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin "$APP"
install -d -o "$APP" -g "$APP" -m 0750 "$APP_DIR" "$APP_DIR/releases"
install -d -m 0750 -o root -g "$APP" "$ETC_DIR"
install -m 0644 "$STAGE/site.env" "$ETC_DIR/site.env"; install -m 0644 "$STAGE/server/defaults.sh" "$ETC_DIR/defaults.sh"

# ── Postgres: yksi rooli, kaksi kantaa (sovellus, Hanko). Salasana luodaan kerran. ──
if [ ! -f "$ETC_DIR/env" ]; then
  pw="$(openssl rand -hex 24)"
  sudo -u postgres psql -v ON_ERROR_STOP=1 -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || sudo -u postgres psql -v ON_ERROR_STOP=1 -c "CREATE ROLE \"$DB_USER\" LOGIN PASSWORD '$pw'" >/dev/null
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER ROLE \"$DB_USER\" PASSWORD '$pw'" >/dev/null
  for db in "$DB_NAME" "$HANKO_DB_NAME"; do
    sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$db'" | grep -q 1 || sudo -u postgres createdb -O "$DB_USER" "$db"
  done
  umask 077
  cat > "$ETC_DIR/env" <<ENV
PORT=$API_PORT
DATABASE_URL=postgres://$DB_USER:$pw@127.0.0.1:5432/$DB_NAME
HANKO_URL=http://127.0.0.1:$HANKO_PORT
IDLE_GRACE_MS=$IDLE_GRACE_MS
ENV
  echo "HANKO_DATABASE_URL=postgres://$DB_USER:$pw@127.0.0.1:5432/$HANKO_DB_NAME" > "$ETC_DIR/.hanko-db"
  chown root:"$APP" "$ETC_DIR/env"; chmod 0640 "$ETC_DIR/env"; chmod 0600 "$ETC_DIR/.hanko-db"
fi

# ── Hanko-asetukset (kerran; muutokset käsin tiedostoon $ETC_DIR/hanko.yaml) ──
if [ ! -f "$ETC_DIR/hanko.yaml" ]; then
  umask 077
  source "$ETC_DIR/.hanko-db"
  smtp=""
  if [ -n "${SMTP_FROM_CONF:-}" ] && [ -f "$SMTP_FROM_CONF" ]; then
    # Kopioidaan toisen Hanko-asetuksen email_delivery-lohko (salasanoja ei näytetä eikä kirjoiteta lokiin)
    smtp="$(awk '/^email_delivery:/{f=1;print;next} /^[A-Za-z_]+:/{f=0} f' "$SMTP_FROM_CONF" | sed -E "s/^(\s*from_name:).*/\1 ${SMTP_FROM_NAME:-OnTrail}/")"
  elif [ -n "${SMTP_HOST:-}" ]; then
    smtp="email_delivery:
  enabled: true
  smtp:
    host: $SMTP_HOST
    port: \"${SMTP_PORT:-587}\"
    user: ${SMTP_USER:-}
    password: ${SMTP_PASSWORD:-}
  from_address: ${SMTP_FROM_ADDRESS:?SMTP_FROM_ADDRESS puuttuu}
  from_name: ${SMTP_FROM_NAME:-OnTrail}"
  else echo "Sähköpostiasetus puuttuu: aseta SMTP_FROM_CONF tai SMTP_HOST (ks. site.env.example)" >&2; exit 1; fi
  cat > "$ETC_DIR/hanko.yaml" <<YAML
database:
  url: '$HANKO_DATABASE_URL'
  dialect: postgres
$smtp
secrets:
  keys:
    - '$(openssl rand -hex 32)'
service:
  name: OnTrail Auth
email:
  enabled: true
  optional: false
  acquire_on_registration: true
  acquire_on_login: false
  use_as_login_identifier: true
  use_for_authentication: true
  require_verification: true
  passcode_ttl: 300
passkey:
  enabled: true
  optional: true
  acquire_on_registration: always
  acquire_on_login: always
  user_verification: preferred
webauthn:
  relying_party:
    id: $SITE_HOST
    display_name: OnTrail
    origins:
      - "https://$SITE_HOST"
  timeout: 60000
mfa:
  enabled: true
  optional: true
  totp:
    enabled: true
  security_keys:
    enabled: true
    optional: true
    user_verification: preferred
password:
  enabled: false
username:
  enabled: true
  optional: true
  acquire_on_registration: true
  acquire_on_login: false
  use_as_login_identifier: false
  min_length: 2
  max_length: 32
session:
  lifespan: "720h"
  enable_auth_token_header: true
  cookie:
    secure: true
    same_site: "lax"
server:
  public:
    address: "127.0.0.1:$HANKO_PORT"
    cors:
      allow_origins:
        - "https://$SITE_HOST"
      allow_credentials: true
  admin:
    address: "127.0.0.1:$HANKO_ADMIN_PORT"
account:
  allow_signup: true
  allow_deletion: true
YAML
  chown root:"$APP" "$ETC_DIR/hanko.yaml"; chmod 0640 "$ETC_DIR/hanko.yaml"
fi

# ── systemd ──
cat > "/etc/systemd/system/$UNIT_HANKO.service" <<UNIT
[Unit]
Description=$APP: Hanko (kirjautuminen)
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
User=$APP
Group=$APP
ExecStartPre=$APP_DIR/current/bin/hanko --config $ETC_DIR/hanko.yaml migrate up
ExecStart=$APP_DIR/current/bin/hanko --config $ETC_DIR/hanko.yaml serve all
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true

[Install]
WantedBy=multi-user.target
UNIT
cat > "/etc/systemd/system/$UNIT_API.service" <<UNIT
[Unit]
Description=$APP: API (Bun)
After=network-online.target postgresql.service $UNIT_HANKO.service
Wants=network-online.target

[Service]
User=$APP
Group=$APP
WorkingDirectory=$APP_DIR/current/api
EnvironmentFile=$ETC_DIR/env
ExecStartPre=/usr/local/bin/bun src/db/migrate.ts
ExecStart=/usr/local/bin/bun src/server.ts
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload; systemctl enable "$UNIT_HANKO" "$UNIT_API" >/dev/null

# ── nginx ──
cat > "/etc/nginx/sites-available/$APP" <<NGINX
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name $ORIGIN_HOST;
    ssl_certificate $SSL_CERT;
    ssl_certificate_key $SSL_KEY;
    client_max_body_size 20m;

    location /hanko/ {
        proxy_pass http://127.0.0.1:$HANKO_PORT/;
        proxy_set_header Host $SITE_HOST;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host $SITE_HOST;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_buffering off;          # SSE (seuranta livenä)
        proxy_read_timeout 1h;
    }
    location / {
        root $APP_DIR/current/web;
        try_files \$uri /index.html;
    }
}
$( [ "$ORIGIN_HOST" = "$SITE_HOST" ] && printf 'server { listen 80; server_name %s; return 301 https://$host$request_uri; }\n' "$SITE_HOST" )
NGINX
ln -sfn "/etc/nginx/sites-available/$APP" "/etc/nginx/sites-enabled/$APP"
nginx -t && systemctl enable --now nginx >/dev/null && systemctl reload nginx

# ── autostop: 1 = oma ajastin, peers = toisen sovelluksen ajastin kysyy myös tämän tilaa ──
case "$AUTOSTOP" in
  1)
    install -m 0755 "$STAGE/server/autostop.sh" "/usr/local/sbin/$APP-autostop"
    cat > "/etc/systemd/system/$APP-autostop.service" <<UNIT
[Unit]
Description=$APP: joutilaisuuden sammutus

[Service]
Type=oneshot
Environment=APP=$APP
ExecStart=/usr/local/sbin/$APP-autostop
UNIT
    cat > "/etc/systemd/system/$APP-autostop.timer" <<UNIT
[Unit]
Description=$APP: joutilaisuuden tarkistus

[Timer]
OnBootSec=10min
OnUnitActiveSec=1min

[Install]
WantedBy=timers.target
UNIT
    systemctl daemon-reload; systemctl enable --now "$APP-autostop.timer" >/dev/null
    echo "autostop asennettu; kytkin pois. Ota käyttöön kun herätys on kokeiltu: echo enabled > $ETC_DIR/autostop" ;;
  peers)
    PEERS_FILE="${PEERS_FILE:-/etc/punakyna/idle-peers}"; url="http://127.0.0.1:$API_PORT/api/idle"
    touch "$PEERS_FILE"; grep -qxF "$url" "$PEERS_FILE" || echo "$url" >> "$PEERS_FILE"
    echo "autostop: $url rekisteröity tiedostoon $PEERS_FILE" ;;
esac
echo "setup OK"
