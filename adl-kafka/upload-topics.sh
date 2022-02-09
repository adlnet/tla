#!/bin/bash

docker exec kafka_1 mkdir /tmp/kafka

docker cp ./kafka/create-topics.sh kafka_1:/tmp/kafka/create-topics.sh
docker cp ./topics.txt kafka_1:/tmp/kafka/tla-topics.txt

docker exec kafka_1 bash /tmp/kafka/create-topics.sh
