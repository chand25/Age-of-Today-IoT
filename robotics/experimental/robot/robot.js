//"use strict";

var Cylon = require('cylon');

/*
// log directly to the page if we're in the browser
if (process.browser) {
  var BrowserLogger = require('./browser-logger'),
      logContainer = document.getElementById("log");

  console.log("Setting logger!");
  Cylon.Logger.setup({
    logger: BrowserLogger(logContainer),
    level: 'debug'
  });
}
*/

const EventEmitter = require('events');

// This is for the Possible EventEmitter memory leak detected. 11 connect listeners added.
//Use emitter.setMaxListeners() to increase limit
//Read Node.js Documentation
process.setMaxListeners(process.getMaxListeners() + 1)
//process.setMaxListeners(0);
//emitter.setMaxListeners(0);

Cylon.robot({
  connections: { bluetooth: {adaptor: 'central', uuid: 'khkhkl', module: 'cylon-ble'}},
  devices: {
    battery: { driver: "ble-battery-service" },
    deviceInfo: { driver: "ble-device-information" },
    mip: { driver: "mip" }
  },

work: function(my) {
  let r = (Math.floor(Math.random() * 256));
  let g = (Math.floor(Math.random() * 256));
  let b = (Math.floor(Math.random() * 256));



   my.level();

   after((2).seconds(), function() {
       my.mip.driveDistance(0, 5, 0, 0);
       console.log('Step Forward');
    });

  my.mip.setHeadLED(3, 3, 3, 3);
    after((3).seconds(), function() {
     my.mip.turnLeft(45, 30);
     console.log('Turn to the Left');
    });

    my.mip.setHeadLED(2, 2, 2, 2);

    after((4).seconds(), function() {
    my.mip.driveDistance(0, 5, 2, 45);
    console.log('Side-step Forward');
    });

    my.mip.setHeadLED(1, 1, 1, 1);

    after((5).seconds(), function() {
      my.mip.turnRight(45, 30);
       console.log('Turn to the Right');
    });

     after((6).seconds(), function() {
     my.mip.turnLeft(45, 50);
     console.log('Turn to the Left');
    });

    after((7).seconds(), function() {
    my.mip.driveDistance(0, 5, 2, 45);
    console.log('Side-step Forward');
    });

    after((8).seconds(), function() {
      my.mip.turnRight(45, 50);
       console.log('Turn to the Right');
    });

    after((9).seconds(), function() {
    my.mip.driveDistance(0, 5, 2, 45);
    console.log('Side-step Forward');
    });

    after((10).seconds(), function() {
      my.mip.turnRight(360, 50);
       console.log('All the way around to my Right');
    });

    after((11).seconds(), function() {
      my.mip.turnLeft(360, 50);
       console.log('All the way around to my Left');
    });


    after((12).seconds(), function() {
      my.mip.turnRight(45, 30);
       console.log('Turn to the Right');
    });

     after((13).seconds(), function() {
     my.mip.turnLeft(45, 50);
     console.log('Turn to the Left');
    });

    after((14).seconds(), function() {
    my.mip.driveDistance(0, 5, 2, 45);
    console.log('Side-step Forward');
    });

    after((15).seconds(), function() {
      my.mip.turnRight(360, 50);
       console.log('All the way around to my Right');
    });

    after((16).seconds(), function() {
      my.mip.turnLeft(360, 50);
       console.log('All the way around my Left');
    });

    after((17).seconds(), function() {
      my.mip.turnRight(360, 50);
       console.log('All the way around to my Right');
    });

    after((19).seconds(), function() {
      my.mip.driveDistance(2, 5,0,0);
       console.log('Moonwalk');
    });

    after((22).seconds(), function() {
      my.mip.turnRight(270, 5);
       console.log('Slow turn to face crowd');
    });
//every is a Alias to JavaScript's setInterval() function
  every((2).second(), function() {
    my.mip.flashChestLED(b, r, g);
   });

  every((3).second(), function() {
    my.mip.flashChestLED(g, b, r);
   });

 every((5).second(), function() {
    my.mip.flashChestLED(r, g, b);
   });

 after((30).second(), function() {
       my.level();
     });


   after((35).seconds(), function() {
      console.log("I'm finished my solo. I need a partner. Come join me Sanaa.");
      my.mip.stop;
      Cylon.halt();
    });


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
