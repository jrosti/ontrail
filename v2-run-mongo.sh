#!/usr/bin/env bash
# Run the 2016-era MongoDB (3.2) used by ontrail in a Docker container.
# Data is persisted on the host under ~/ontrailmongo (mounted at /data/db).
# Listens on localhost:27017, matching the hard-coded default in src/ontrail/mongodb.clj.
set -euo pipefail

NAME=ontrailmongo
IMAGE=mongo:3.2
DATA_DIR="$HOME/ontrailmongo"
PORT=27017

mkdir -p "$DATA_DIR"

# If a container with this name already exists, just (re)start it.
if docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
  echo "Container '$NAME' already exists; starting it..."
  docker start "$NAME"
else
  echo "Creating and starting '$NAME' from $IMAGE..."
  docker run -d \
    --platform linux/amd64 \
    --name "$NAME" \
    -p "$PORT:27017" \
    -v "$DATA_DIR:/data/db" \
    "$IMAGE"
fi

echo
docker ps --filter "name=$NAME" --format '{{.Names}}  {{.Status}}  {{.Ports}}'
echo "MongoDB available at localhost:$PORT  (data: $DATA_DIR)"
echo "Shell: docker exec -it $NAME mongo ontrail"
