ADL Kafka Cluster 
==============

This folder contains the scripts to set up a 3/3 SASL-auth Kafka cluster with Docker. Nothing in this project is proprietary and we use the Confluent Docker images for both Zookeeper and Kafka.  The only modifications made are for administrative quality of life.

## What's in the box
Everything necessary to stand up the Kafka cluster, including:
- `docker-compose.yml`: The Compose file we use to stand up:
  - 3 Kafka Brokers
  - 3 Zookeeper nodes
- **Configuration files:**
  - `local.env.example`: Copy this into either `local.env` (if using merged structure) or just `.env`.
  - `topics.txt`: Text file with each TLA topic.  
- **Scripts to maintain the cluster:**
  - `rebuild.sh`: Starts or restarts the cluster
  - `upload-topics.sh`: Creates the Kafka topics (this is necessary as we disable auto-topics)
  - `list-topics.sh`: Lists all topics available in the cluster
- **Others that you hopefully will not need:**
  - `clear-docker.sh`: DELETES ALL Docker images AND containers 
  - `clear-containers.sh`: DELETES ALL Docker containers (saves images)

## Setup
There are a few scripts included to hopefully streamline the process.

### TL;DR Initial Setup
1. `git clone https://github.com/adlnet/tla`
1. `cd tla/adl-kafka`
1. `sudo ./install-reqs.sh`
1. `sudo ./rebuild.sh`
1. `sudo docker logs -f kafka_1`, then wait until the text stops
1. `sudo ./upload-topics.sh`

### TL;DR Restarting
The containers are set up to restart regardless of what killed them, so this should only be necessary when making changes to the cluster.
1. `sudo ./rebuild.sh`

## Topics
Each topic on the cluster exists for a reason, but we also have topics for testing purposes.  By default, there are 3 topics you can use to test out messages and demo producers / consumers: `test-1`, `test-2`, and `test-3`.  

The important topics are outlined below, but it goes without saying: **DO NOT PRODUCE TO THESE TOPIC ON THE LIVE SYSTEM**.

### `learner-xapi`
All statements sent to the LRS will be pushed into this topic by our LRS proxy Kafka producers.  

### `resolve-pending`
Statements with possible MOM conformance that will be evaluated by the resolution broker.

### `resolved-xapi`
xAPI traffic that has been validated as "transactional".

### `authority-xapi`
xAPI traffic that has been validated as "authoritative" -- usually competency assertions.
