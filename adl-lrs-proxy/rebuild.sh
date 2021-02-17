#!/bin/bash

rm .env
touch .env
cat local.env >> .env
echo "\n" >> .env
cat ../global.env >> .env

# Stop the existing docker containers we made with Compose
docker-compose stop

# Rebuild the containers and detatch from this terminal
docker-compose build
docker-compose up -d
