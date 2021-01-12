const express = require("express");
const bodyParser = require("body-parser")
const MqttHandler = require("./src/MqttHandler");
const BeaconScanner = require("node-beacon-scanner");

const app = express();
const port = process.env.PORT || 8080;

// Creates a new instance of the BeaconScanner class
const scanner = new BeaconScanner();

// Creates a new instance of the MqttHandler class
let client = new MqttHandler();
console.log(client);
client.connectClient();

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Message to send back with MQTT
// variable message is set to false ("do not turn the lamp on")
var message = false

// Trigged when the scanner finds our iBeacon
scanner.onadvertisement = (ad) => {
  if (ad.iBeacon.uuid == "D617BE7A-798B-4898-BF22-A3DFF2AEC6AA") {
    scanner.stopScan()
    console.log('Found your iBaecon!')
    message = true
  }
};

// Receives all messages from the subscribed topic
app.get("/api/messages", (req, res) => {
  res.status(200).send({
    msg: client.message,
    topic: client.topic
  });
  res.end();

  // Scan to find our iBeacon
  scanner.startScan()

  // Sending message after 1 sec of searching.
  setTimeout(() => {
    scanner.stopScan()
    console.log("Sending message: " + message)
    // SEND VARIABLE "message" WITH MQTT here...
  }, 1000);
})

// Uploads a new message to the subscribed topic
app.post('/api/send', (req, res) => {
  let msgText = req.body.messageText
  client.message = msgText
  client.topic = client.topic
  
  // Sends new message to broker | https://api.cloudmqtt.com/console/82662878/websocket
  client.sendMessage(msgText);
  res.redirect(`http://localhost:${port}`);
})

// Starts the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});