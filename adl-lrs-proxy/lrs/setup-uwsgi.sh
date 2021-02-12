#!/bin/bash

echo "Creating uWSGI directories"
mkdir /etc/uwsgi
mkdir /etc/uwsgi/vassals

echo "Copying uWSGI config files into system"
cp /var/lrs/uwsgi/lrs_uwsgi.ini /etc/uwsgi/vassals/lrs_uwsgi.ini
cp /var/lrs/uwsgi/lrs.service /lib/systemd/system/lrs.service

echo "Changing read/write for parent directory"
chown -R ubuntu:www-data /var/lrs
chmod -R 774 /var/lrs

echo "Starting LRS service"
systemctl daemon-reload
systemctl start lrs
