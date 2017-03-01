var Cylon = require('cylon');
const EventEmitter = require('events');

process.setMaxListeners(process.getMaxListeners() + 1)
//emitter.setMaxListeners(0);


var bots = {
  Skylar: 'ljkj7',  //uuid
  Sanaa: 'jkljljlj'     //uuid
};

Object.keys(bots).forEach(function(name) {
  var uuid = bots[name];

  Cylon.robot({
    name: name,

    connections:{
      mip: {adaptor: 'central', uuid: `${uuid}`, module: 'cylon-ble'}
    },

    devices: {
       battery: { driver: "ble-battery-service" },
       deviceInfo: { driver: "ble-device-information" },
       mip: {driver: "mip"}
    },



    work: function(my) {
    let r = (Math.floor(Math.random() * 256));
     let g = (Math.floor(Math.random() * 256));
     let b = (Math.floor(Math.random() * 256));

        every((2).second(), function() {
          my.mip.flashChestLED(b, r, g);
         });

        every((3).second(), function() {
          my.mip.flashChestLED(g, b, r);
         });

       every((5).second(), function() {
          my.mip.flashChestLED(r, g, b);
         });
      }
     })
    })
    Cylon.start();
    /*
     let r = (Math.floor(Math.random() * 256));
     let g = (Math.floor(Math.random() * 256));
     let b = (Math.floor(Math.random() * 256));

      my.ready();


      every((20).seconds(), function(){
        my.aged();
      });
    },

    move: function(){
      this.mip.driveDistance(0, 5, Math.floor(Math.random() * 360), 45)
    },

    ready: function(){
      this.age = 0;
      this.life();
      this.move();
    },

    life: function(){

    }


  });
});

Cylon.start();
*/
