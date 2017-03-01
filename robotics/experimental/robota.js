var Cylon = require('cylon');
const EventEmitter = require('events');

// This is for the Possible EventEmitter memory leak detected. 11 connect listeners added.
//Use emitter.setMaxListeners() to increase limit
//Read Node.js Documentation
process.setMaxListeners(process.getMaxListeners() + 1)
//process.setMaxListeners(0);
//emitter.setMaxListeners(0);

Cylon.robot({
  connections: { bluetooth: {adaptor: 'central', uuid: '4bae4737780042b0a665dbb47c6185e7', module: 'cylon-ble'}},
  devices: {
    battery: { driver: "ble-battery-service" },
    deviceInfo: { driver: "ble-device-information" },
    mip: { driver: "mip" }
  },

work: function(my) {
  let r = (Math.floor(Math.random() * 256));
  let g = (Math.floor(Math.random() * 256));
  let b = (Math.floor(Math.random() * 256));

     // my.mip.driveDistance(0, 20, 2, 45);
// my.mip.driveDistance(0, 0, 0, 45);

  after((30).second(), function() {
       my.level();
     });


  my.flashinglights();


   after((35).seconds(), function() {
      console.log("I'm shutting down now.");
      my.mip.stop;
      Cylon.halt();
    });
},

flashinglights: function(my){
      let r = (Math.floor(Math.random() * 256));
      let g = (Math.floor(Math.random() * 256));
      let b = (Math.floor(Math.random() * 256));

        my.mip.flashChestLED(b, r, g, 5, 5);
        my.mip.flashChestLED(g, b, r, 6, 4);
        my.mip.flashChestLED(r, g, b, 5, 6);
    },

solo: function(){
      this.mip.turnLeft(45, 5);
        this.mip.turnLeft(45, 5);
        this.mip.turnLeft(45, 5);
},

display: function(err, data) {
    if (!!err) {
      console.log("Error: ", err);
      return;
    }
      console.log("Data: ", data);
    },

    level: function() {
    this.battery.getBatteryLevel(this.display);
    }


}).start();
