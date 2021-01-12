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
  mqttClient.subscribe("grupp3Topic");

  // if (beacon founded, connected with bluetooth) {
  //  run the code below  
  //} else {
  //  Serial.println("Beacon not connected");
  //}
  
  if (distance < 20) {
    if (checkIfON != true) {
      publishMessageON();
      checkIfON = true;
      digitalWrite(greenLed, HIGH);
      digitalWrite(redLed, LOW);
    }
  } else {
    if (checkIfON != false) {
      publishMessageOFF();
      checkIfON = false;
      digitalWrite(greenLed, LOW);
      digitalWrite(redLed, HIGH);
    }
  }
 
  // Dont overload the server!
  delay(4000);

  Serial.println(distance);

  //if (distance > 20) {
  //  digitalWrite(greenLed, HIGH);  
  //  digitalWrite(redLed, LOW);
  //} else {
  //  digitalWrite(redLed, HIGH);
  //  digitalWrite(greenLed, LOW);
  //}
 
}

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
