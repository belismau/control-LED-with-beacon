const express = require("express");
const bodyParser = require("body-parser")
const MqttHandler = require("./src/MqttHandler");

const app = express();
const port = process.env.PORT || 8080;

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
