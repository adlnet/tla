#!/bin/bash

python3 ./content-puller/download-content.py
rm -rf ./content
7z x ./content.zip -ocontent

chmod -R 777 ./content
