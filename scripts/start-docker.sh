#!/bin/bash

BASE_DIR="$(dirname "$0")"

docker-compose -f "$BASE_DIR/../docker-compose.yml" down
docker-compose -f "$BASE_DIR/../docker-compose.yml" up --build
