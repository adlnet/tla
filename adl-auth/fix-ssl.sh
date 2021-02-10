#!/bin/bash

export PGPASSWORD=5UBO1cOQJAvXZXZi3vgYu43T0DaMnLfB

# Tell the user what to do
echo "ENTER THE FOLLOWING COMMANDS EXACTLY:";
echo ""
echo "update REALM set ssl_required = 'NONE' where id = 'master';";
echo "\q"
echo ""

# Once this are up, we need to remove ssl-required from the master realm
docker exec -it docker_postgres psql -U root keycloak

# Once that's done, restart keycloak
docker-compose stop
docker-compose up -d
