@echo off
SET BASE_DIR=%~dp0

echo Starting local backend and frontend (database in Docker only)

docker-compose -f "%BASE_DIR%..\docker-compose.yml" up -d postgres

:wait_for_db
docker exec fullstack-interview-postgres pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 1 >nul
    goto wait_for_db
)

echo Database is ready!

start "Backend" cmd /c "npm install && npm run start:local"

cd "%BASE_DIR%..\front-end"
start "Frontend" cmd /c "npm install && npm start"
cd "%BASE_DIR%"

echo Application is running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8082
echo Database: localhost:5434
pause
