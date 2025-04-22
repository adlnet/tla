#!/bin/bash

# Wait for Postgres to be ready
until pg_isready -h postgres -p 5432 -U lrs_owner; do
  echo "Waiting for Postgres to be ready..."
  sleep 1
done
echo "Postgres is ready!"
