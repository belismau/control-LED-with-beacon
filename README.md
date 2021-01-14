# Control LED with beacon

Turn on/off LED lights with **Arduino** if beacon is in range using **MQTT** messaging protocol.

This project is tested on a **Raspberry Pi 4**.

## Installation

```$ git clone https://github.com/belismau/control-LED-with-beacon```

```$ cd control-LED-with-beacon```

Download dependencies (**body-parser, express and mqtt**):

```$ npm install``` 

Install **bluetooth-hci-socket**:

```$ cd ~```
```$ git clone https://github.com/noble/node-bluetooth-hci-socket```
```$ cd node-bluetooth-hci-socket```
```$ npm install```

Install and test **noble**:

```$ cd ~```
```$ git clone https://github.com/noble/noble```
```$ cd noble```
```$ npm install```
```$ cd examples/```
```$ sudo node advertisement-discovery.js```

Install **node-beacon-scanner**:

```$ npm install node-beacon-scanner```

## Run

```$ sudo node index.js```

You will find the web application on **localhost:8080** or **localhost:5000** depending on the port.