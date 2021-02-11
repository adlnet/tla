#!/bin/bash
export KAFKA_OPTS="-Djava.security.auth.login.config=/tmp/kafka/client.txt"
echo $KAFKA_OPTS

while IFS='' read -r line || [[ -n "$line" ]]; do
    
    echo "Creating topic: $line ..."
    kafka-topics \
        --create \
        --zookeeper localhost:12181,localhost:22181,localhost:32181 \
        --replication-factor 3 \
        --partitions 3 \
        --topic $line

done < "/tmp/kafka/tla-topics.txt"

export KAFKA_OPTS="-Djava.security.auth.login.config=/tmp/kafka/server.txt"
echo $KAFKA_OPTS
