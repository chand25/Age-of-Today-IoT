var Cylon = require('cylon');
const EventEmitter = require('events');

process.setMaxListeners(process.getMaxListeners() + 1)
//emitter.setMaxListeners(0);


Cylon.robot({
  connections: {
    mip1: {adaptor: 'central', uuid: '4bahje7', module: 'cylon-ble'},
    mip2: {adaptor: 'central', uuid: 'lkjjjl8975adce0jkhhc3', module: 'cylon-ble'}
},
devices: {
    battery: { driver: "ble-battery-service" },
    deviceInfo: { driver: "ble-device-information" },
    mip: { driver: "mip", connection: "mip1", connection: "mip2" }
  },

work: function(my) {
  let r = (Math.floor(Math.random() * 256));
  let g = (Math.floor(Math.random() * 256));
  let b = (Math.floor(Math.random() * 256));

     // my.mip.driveDistance(0, 20, 2, 45);
// my.mip.driveDistance(0, 0, 0, 45);

  every((2).second(), function() {
    my.mip.flashChestLED(b, r, g);
   });

  every((3).second(), function() {
    my.mip.flashChestLED(g, b, r);
   });

 every((5).second(), function() {
    my.mip.flashChestLED(r, g, b);
   });

after((2).seconds(), function() {
       my.mip.turnLeft(45, 5);
    });

/*
 every((2).second(), function() {
    my.mip2.flashChestLED(b, r, g);
   });

  every((3).second(), function() {
    my.mip2.flashChestLED(g, b, r);
   });

 every((5).second(), function() {
    my.mip2.flashChestLED(r, g, b);
   });

after((2).seconds(), function() {
       my.mip2.turnLeft(45, 5);
    });
*/
  process.setMaxListeners(process.getMaxListeners() + 1);
}

}).start();
