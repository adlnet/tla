#!/bin/bash

# $1 = Name of the import container.
# $2 = Name of the CSV file to import.
# $3 = Name of the collection in MongoDB to import to.

# Copy CSV into Node app container.
docker cp $2 $1:/usr/src/app/$2

# Execute import script.
docker exec $1 node import.js $2 $3