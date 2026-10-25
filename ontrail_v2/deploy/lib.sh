# Yhteinen asetusten luku. Käyttö: source "$(dirname "$0")/lib.sh"
set -euo pipefail
DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DEPLOY_DIR/.." && pwd)"
SITE_ENV="${SITE_ENV:-$DEPLOY_DIR/site.env}"
[ -f "$SITE_ENV" ] || { echo "Puuttuu $SITE_ENV (kopioi site.env.example)" >&2; exit 1; }
set -a; source "$SITE_ENV"; set +a
: "${SITE_HOST:?SITE_HOST puuttuu}"
source "$DEPLOY_DIR/server/defaults.sh"
