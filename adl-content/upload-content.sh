#!/bin/bash

echo "Removing current content from container..."
docker exec docker_content rm -rf /usr/src/app/files/content

echo "Copying content to static content container... (this could take awhile)..."
docker cp $1 docker_content:/usr/src/app/files/content

echo "Updating read-access of static content ..."
docker exec docker_content chmod -R 777 /usr/src/app/files/content

echo "... done!"
