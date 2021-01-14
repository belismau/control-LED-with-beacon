const express = require("express");
const bodyParser = require("body-parser")
const MqttHandler = require("./src/MqttHandler");

const app = express();
const port = 5000;

// Creates a new instance of the MqttHandler class
let client = new MqttHandler();
console.log(client);
client.connectClient();

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Receives all messages from the subscribed topic
app.get("/api/messages", (req, res) => {
  res.status(200).send({
    msg: client.message,
    topic: client.topic
  });
  res.end();
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

// Beacon Scanner

const BeaconScanner = require("node-beacon-scanner");
const scanner = new BeaconScanner();

var found = false
var latestFound;
var firstTime = true;

function start() {
    found = false
    scanner.startScan()
    setTimeout(() => {
        scanner.stopScan()

        if (firstTime == true) {
            if (found == true) {
              console.log("Beacon connected")
              client.sendMessage("ON");
            } else {
              console.log("Beacon disconnected")
              client.sendMessage("OFF");
            }
        } else {
            if (latestFound != found) {
                if (found == true) {
                  console.log("Beacon connected")
                  client.sendMessage("ON");
                } else {
                  console.log("Beacon disconnected")
                  client.sendMessage("OFF");
                }
            }
        }

        //console.log(found)
    
        latestFound = found
        firstTime = false
    }, 1000);
}

scanner.onadvertisement = (ad) => {
    if (ad.iBeacon.uuid == "D617BE7A-798B-4898-BF22-A3DFF2AEC6AA") {
        found = true
    }
}

setInterval(() => {
    start()
}, 2000);