#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

int trigPin = 5;
int echoPin = 8;
int redLed = 6;
int greenLed = 7;

long duration;
int distance;

bool checkIfON = false;
int beaconStatus = false;

// Set your MAC address and IP address here
byte mac[] = { 0xce, 0xfa, 0x8e, 0x78, 0xfb, 0x9f };
IPAddress ip(192, 168, 0, 12);
 
// Make sure to leave out the http and slashes!
const char* server = "hairdresser.cloudmqtt.com";
 
// Ethernet and MQTT related objects
EthernetClient ethClient;
PubSubClient mqttClient(ethClient);

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(greenLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  
  Serial.begin(9600);
  
  // Start the ethernet connection
  Ethernet.begin(mac, ip);              
  
  // Ethernet takes some time to boot!
  delay(3000);                          
 
  // Set the MQTT server to the server stated above ^
  mqttClient.setServer(server, 15427);  
 
  // Attempt to connect to the server with the ID "myClientID"
  if (mqttClient.connect("grupp3", "jgwvowcq", "e_ERtXdyauht")) {
    Serial.println("Connection has been established, well done");

    // Establish the subscribe event
    mqttClient.setCallback(subscribeReceive);
  } else {
    Serial.println("Looks like the server connection failed...");
  }
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;

  // This is needed at the top of the loop!
  mqttClient.loop();
 
  // Ensure that we are subscribed to the topic "grupp3Topic"
  mqttClient.subscribe("grupp3/lights");

  // if (beacon founded, connected with bluetooth) {
  //  run the code below  
  //} else {
  //  Serial.println("Beacon not connected");
  //}

  /*
  if (distance < 20) {
    if (checkIfON != true) {
      publishMessageON();
      checkIfON = true;
    }
  } else {
    if (checkIfON != false) {
      publishMessageOFF();
      checkIfON = false;
    }
  }
  */

  if (distance < 20) {
    if (beaconStatus) {
      turnON();
    } else {
      turnOFF();
    }
  } else {
    turnOFF();
  }

  // Dont overload the server!
  delay(500);
 
}

void turnON() {
  digitalWrite(greenLed, HIGH);  
  digitalWrite(redLed, LOW);
}

void turnOFF() {
  digitalWrite(redLed, HIGH);
  digitalWrite(greenLed, LOW);
}

/*
void publishMessageON() {
  if (mqttClient.publish("grupp3Topic", "ON")) {
    Serial.println("Publish message success");
  } else {
    Serial.println("Could not send message :(");
  } 
}

void publishMessageOFF() {
  if (mqttClient.publish("grupp3Topic", "OFF")) {
    Serial.println("Publish message success");
  } else {
    Serial.println("Could not send message :(");
  } 
}
*/

void subscribeReceive(char* topic, byte* payload, unsigned int length) {
  // Print the topic
  // Serial.print("Topic: ");
  // Serial.println(topic);
  
  payload[length] = '\0';
  Serial.print("New message: ");
  
  for (int i = 0; i < length; i ++) {  
      String s = String((char*)payload);
      Serial.print(char(payload[i]));
      
      if (s == "ON") {
      beaconStatus = true;
    } else if (s == "OFF") {
      beaconStatus = false;
    }
  }

  // Print a newline
  Serial.println("");
}
