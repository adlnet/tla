#!/bin/bash
docker exec kafka_1 kafka-topics --list --zookeeper localhost:12181,localhost:22181,localhost:32181
