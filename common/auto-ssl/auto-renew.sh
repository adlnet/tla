#!/bin/bash

docker-compose -f $1 run certbot \
	renew --webroot \
	--register-unsafely-without-email \
	--agree-tos \
	--no-random-sleep-on-renew \
	--webroot-path=/data/letsencrypt >> ~/renew.log

docker-compose -f $1 restart nginx