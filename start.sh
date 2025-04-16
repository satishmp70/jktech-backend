#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
until nc -z postgres 5432; do
  sleep 1
done

echo "PostgreSQL is up. Running migrations and seed..."
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts

echo "Starting the server..."
npm run start:dev
