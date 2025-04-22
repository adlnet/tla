#!/bin/bash

set -e  # Exit on any error

# Wait for Postgres to be ready
/bin/wait-for-postgres.sh

# Move to the LRS directory
cd /opt/lrs/ADL_LRS

# Create log directory
mkdir -p /opt/lrs/logs

# Create and set up the Python 3 virtual environment
python3 -m venv /opt/lrs/env
source /opt/lrs/env/bin/activate
pip3 install --upgrade pip || { echo "Failed to upgrade pip"; exit 1; }
pip3 install -r requirements.txt || { echo "Failed to install requirements"; exit 1; }

# Install uwsgi inside the virtual environment
echo "Installing uWSGI..."
pip3 install uwsgi || { echo "Failed to install uwsgi"; exit 1; }

# Manually run setup steps
echo "Creating log directories..."
mkdir -p /opt/lrs/logs/celery
mkdir -p /opt/lrs/logs/supervisord
mkdir -p /opt/lrs/logs/uwsgi
mkdir -p /opt/lrs/logs/nginx

echo "Creating media directories..."
mkdir -p /opt/lrs/ADL_LRS/static
mkdir -p /opt/lrs/ADL_LRS/static/agent_profile
mkdir -p /opt/lrs/ADL_LRS/static/activity_profile
mkdir -p /opt/lrs/ADL_LRS/static/activity_state
mkdir -p /opt/lrs/ADL_LRS/static/attachment_payloads

echo "Running Django migrations..."
./manage.py createcachetable || { echo "Failed to create cache table"; exit 1; }
./manage.py migrate || { echo "Failed to run initial migrations"; exit 1; }
./manage.py makemigrations adl_lrs lrs oauth_provider || { echo "Failed to make migrations"; exit 1; }
./manage.py migrate || { echo "Failed to run migrations"; exit 1; }

echo "Creating admin user..."
python3 manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'password')" || { echo "Failed to create admin user"; exit 1; }

# Deactivate the virtual environment
deactivate

# Make everything here readable
echo "Changing file permissions ..."
chmod -R 777 /opt/lrs
chmod -R 777 /etc/uwsgi/vassals
chmod -R 777 /lib/systemd/system
echo "... file permissions set!  Starting container."

# Start uwsgi
/opt/lrs/env/bin/uwsgi --emperor /etc/uwsgi/vassals || { echo "Failed to start uWSGI"; exit 1; }
