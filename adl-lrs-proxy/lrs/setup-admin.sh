#!/bin/bash

# Bash into the LRS container and run the create_admin fab function
cd /opt/lrs/ADL_LRS
source ../env/bin/activate
python ./manage.py createsuperuser


