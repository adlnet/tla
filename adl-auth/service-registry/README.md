# Service Registry
Simple service to serve as a single point of information (and failure)

This is a NodeJS application that will accept:
1. POST requests to associate a given service with an IP.
1. GET requests to return a JSON payload with each service mapped to its IP.

## Setup
As this service uses async / await, NodeJS version 7.6+ is required.  

Once NodeJS is installed, open a console from the root folder (the one with app.js in it) and run:
1. `npm install`
1. `node app.js`
1. Navigate to `http://localhost:8085` to confirm that it's running.

## Using the Service Registry
The service itself has interactive documentation, but I will add the same information here at some point.
