## xAPI Kafka Viewer
Simple WebSocket-based xAPI viewer for a Kafka cluster.

This repo is just the service without any additional deployment guidance, but does contain a Dockerfile to streamline that.

![Example Image](https://i.imgur.com/hqKFAyg.png)

## Setup
Setup is pretty straightforward, as it's just a basic NodeJS Express app.

### tl;dr:
- `git clone https://github.com/vbhayden/kafka-xapi-viewer`
- `cd kafka-xapi-viewer`
- `cp config.example.js config.js`
- Populate the `config.js` file (see comments in-file and/or notes below)
- `npm install`
- `node app.js`

### Setting the Config Values
The example config file is commented to help with settings things up, but it's not too bad.  Mainly, you'll need to specify two things:
- The Kafka brokers to use
- The Kafka topics to monitor

Additionally, the Kafka adapter supports plaintext SASL auth (also commented), but this isn't a requirement.
