#!/bin/bash

# Stop the existing docker containers we made with Compose
# THIS WILL REMOVE THESE CONTAINERS, ALSO DELETING ANY SAVED POSTGRES DATA
docker-compose stop
docker-compose rm

# Rebuild the containers and detatch from this terminal
docker-compose build
docker-compose up -d
