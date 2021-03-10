#!/bin/bash

echo "" >> ~/renew.log
date >> ~/renew.log
echo "Checking $1 for SSL renewals ..." >> ~/renew.log
echo "

docker-compose -f $1/docker-compose.yml run certbot \
	renew --webroot \
	--register-unsafely-without-email \
	--agree-tos \
	--no-random-sleep-on-renew \
	--webroot-path=/data/letsencrypt >> ~/renew.log

docker-compose -f $1/docker-compose.yml restart nginx

echo "----------------------------------" >> ~/renew.log
