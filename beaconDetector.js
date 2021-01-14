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
                console.log("Beacon connected 1")
            } else {
                console.log("Beacon disconnected 2")
            }
        } else {
            if (latestFound != found) {
                if (found == true) {
                    console.log("Beacon connected 3")
                } else {
                    console.log("Beacon disconnected 4")
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