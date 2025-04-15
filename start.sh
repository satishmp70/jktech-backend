#!/bin/sh

echo "Waiting for database to be ready..."
npx prisma migrate deploy

echo "Database ready. Starting app..."
node dist/main
