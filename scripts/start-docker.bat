@echo off
SET BASE_DIR=%~dp0

docker-compose -f "%BASE_DIR%..\docker-compose.yml" down
docker-compose -f "%BASE_DIR%..\docker-compose.yml" up --build
pause
