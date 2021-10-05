// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const http = require("http")
const WebSocket = require('ws');
const express = require("express");
const kafkaConsumer = require("simple-kafka-consumer");
const keycloak = require("simple-keycloak-adapter");

const config = require("./config");

const APP_PORT = (process.env.APP_PORT || 3000);
const WS_PASSWORD = (process.env.WS_PASSWORD || config.websocket.password);

const app = express();
const server = http.createServer(app);


/**
 * The point of this page is to montior the status of our Kafka cluster.
 * 
 * To that end, our monitoring page will open a socket with this service
 * to relay messages to our page.
 */
const openSockets = []
const wss = new WebSocket.Server({
    path: config.root + "/kafka",
    server,
});

wss.on('connection', function (ws) {

    // Assign to our sockets
    openSockets.push(ws);
    ws.authenticated = false;
    ws.noMessages = true;

    ws.on("message", function (data) {
        if (ws.noMessages && data == WS_PASSWORD) {
            ws.authenticated = true;
            console.log("AUTHENTICATED SOCKET")
        } else if (data != "keep-alive") {
            ws.close();
            console.log("CLOSING: ", data)
        }
        ws.noMessages = false;
    });

    // If the socket is closed, stop sending messages to it
    ws.on("close", function close() {
        let index = openSockets.indexOf(ws);
        openSockets.splice(index, 1);
    });

    // Send an message when they connect here
    ws.send('Connected to Kafka Web Socket Monitor!');
});

setInterval(() => {
    for(let socket of openSockets) {
        if (socket.authenticated)
            socket.send("keep-alive");
    }
}, 5000)

// Broadcast a message to each open socket
//
function broadcast(message) {
    for (let k = 0; k < openSockets.length; k++) {
        if (openSockets[k].authenticated) {
            openSockets[k].send(message);
        }
    }
}

var recentCount = 0;
var throttleCount = 100;
var throttleTimerMS = 500;
var throttleWarned = false;

// Configure this with our environment and config values
kafkaConsumer.configure(config.kafka)

// Set up our consumer to broadcast its traffic to our web sockets
kafkaConsumer.initConsumer((topic, offset, message) => {

    console.log(topic, offset, message.length > 100 ? message.substr(0, 100) + " ..." : message)
    recentCount++;

    if (recentCount >= throttleCount) {
        if (throttleWarned == false) {
            broadcast(`[${message.topic}, # ${offset}, (throttled ${recentCount})]\n"High message rates will be throttled for performance with this page."`)
        }

        throttleWarned = true;
        return;
    }

    broadcast(`[${topic}, # ${offset}]\n${message}\n`)
})

// Limit how many we can receive on a duration
setInterval(function () {
    recentCount = 0;
    throttleWarned = false;
}, throttleTimerMS);

/**
 * Lastly, configure that express instance to serve this page.
 */
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("scripts"));
app.use(express.static("views"));
app.use(config.root, express.static("public"));
app.use(config.root, express.static("scripts"));
app.use(config.root, express.static("views"));

app.use("*", function (req, res, next) {

    if (req.baseUrl.startsWith(config.root) == false)
        res.redirect(config.root + req.url);
    else
        next();
});

// Adding Keycloak middleware
app.use(keycloak.init(config.keycloak, config.root + "/logout", config.root));
app.use(keycloak.protect())

// Main page.
app.get(config.root, function (req, res, next) {
    res.render("index.ejs", {
        password: WS_PASSWORD,
        root: config.root,
        topics: config.topicDetails
    });
});

// Then start the server.
server.listen(APP_PORT, function () {
    console.log("\nKafka Web Socket Example listening on port %s", APP_PORT);
});