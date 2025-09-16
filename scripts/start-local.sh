#!/bin/bash

BASE_DIR="$(dirname "$0")"

echo "Starting local backend and frontend (database in Docker only)"

# Start database
docker-compose -f "$BASE_DIR/../docker-compose.yml" up -d postgres

# Wait for database
until docker exec fullstack-interview-postgres pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "Database is ready!"

# Start backend
npm install
npm run start:local &

# Start frontend
cd "$BASE_DIR/../front-end"
npm install
npm start &
cd "$BASE_DIR"

echo "Application is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8082"
echo "Database: localhost:5434"

wait
