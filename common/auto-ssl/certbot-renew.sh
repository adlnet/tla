#!/bin/bash

bash ~/tla-demo-2019/adl-ficam/certbot/renew.sh ~/tla-demo-2019/adl-ficam/docker-compose.yml
docker-compose -f ~/tla-demo-2019/adl-ficam/docker-compose.yml restart nginx