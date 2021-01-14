const mqtt = require("mqtt");

/**
 * This class handles the interaction with the MQTT broker
 ** Documentation: https://github.com/mqttjs/MQTT.js/
 */
class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = "mqtt://hairdresser.cloudmqtt.com:15427";
    this.username = "jgwvowcq";
    this.password = "e_ERtXdyauht";
    this.message = '';
    this.topic = 'grupp3Topic';
  }
  
  /** Connects the client to the CloudMQTT Broker */
  connectClient() {
    console.log("\nCreating instance of MQTTHandler. . .");
    this.mqttClient = mqtt.connect(this.host, {
      username: this.username,
      password: this.password,
    });

    this.mqttClient.on("connect", function (e) {
      console.log(e);
      console.log('\nConnected to MQTT broker');
    });

    // Subscribes to a specific topic
    this.mqttClient.subscribe(this.topic, function (err, granted) {
      if (!err) {
        console.log(`Subscribed to topic! - ${granted[0].topic}`);
      }
    });

    // Listens to incoming messages
    this.mqttClient.on("message", this.onMessageRecieved.bind(this));
    
    // Emitted after a disconnection.
    this.mqttClient.on("close", () => {
      console.log("\nClient disconnected");
    });
  }

  /** Recieves incoming messages from the Cloud MQTT broker */
  onMessageRecieved(topic, message) {
    console.log("\nNew message recieved:", message.toString())
    this.message = message.toString();
    this.topic = topic
    return true
    //client.end();
  }

  /** Message gets published and uploaded to the broker
      @param {String} msg Message to publish */
  sendMessage(msg) {
    if (this.mqttClient.publish(this.topic, msg)) {
      console.log('\nNew message published.')
    }
  }
}

module.exports = MqttHandler;
