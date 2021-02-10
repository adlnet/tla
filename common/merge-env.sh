#!/bin/bash

rm .env
touch .env
cat local.env >> .env
echo "" >> .env
cat ../global.env >> .env