#!/usr/bin/env bash
# Apply OnTrail-specific patches to the local Hanko backend source.
# Usage: ./apply.sh [path-to-hanko-backend]
set -e

HANKO="${1:-$HOME/work/private/hanko/backend}"

if [ ! -f "$HANKO/main.go" ]; then
  echo "error: cannot find hanko backend at $HANKO"
  echo "usage: $0 /path/to/hanko/backend"
  exit 1
fi

echo "Patching $HANKO …"

# ── Patch 1: dto/profile.go — add `id` field to ProfileData ─────────────────
python3 - "$HANKO/dto/profile.go" <<'PY'
import sys, re

path = sys.argv[1]
src = open(path).read()

# Add ID field after the struct opening if not already present
if '"id"' not in src:
    src = src.replace(
        'type ProfileData struct {\n\tUserID',
        'type ProfileData struct {\n\t// ID mirrors UserID for backward compatibility with clients expecting `id`\n\tID           uuid.UUID                    `json:"id"`\n\tUserID',
    )
    # Populate ID in the constructor
    src = src.replace(
        '\treturn &ProfileData{\n\t\tUserID:',
        '\treturn &ProfileData{\n\t\tID:           user.ID,\n\t\tUserID:',
    )
    open(path, 'w').write(src)
    print("  patched dto/profile.go")
else:
    print("  dto/profile.go already patched, skipping")
PY

# ── Patch 2: handler/user.go — Me() returns ProfileData ─────────────────────
python3 - "$HANKO/handler/user.go" <<'PY'
import sys, re

path = sys.argv[1]
src = open(path).read()

old = '\treturn c.JSON(http.StatusOK, map[string]string{"id": sessionToken.Subject()})'
new = '''\tuser, err := h.persister.GetUserPersister().Get(uuid.FromStringOrNil(sessionToken.Subject()))
\tif err != nil {
\t\treturn fmt.Errorf("failed to get user: %w", err)
\t}

\tif user == nil {
\t\treturn echo.NewHTTPError(http.StatusNotFound).SetInternal(errors.New("user not found"))
\t}

\tdata := dto.ProfileDataFromUserModel(user, h.cfg)
\treturn c.JSON(http.StatusOK, *data)'''

if 'ProfileDataFromUserModel' not in src:
    src = src.replace(old, new)
    open(path, 'w').write(src)
    print("  patched handler/user.go")
else:
    print("  handler/user.go already patched, skipping")
PY

echo "Done. Rebuild with: cd $HANKO && go build -o hanko ."
