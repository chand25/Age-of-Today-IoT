var Cylon = require('cylon');
const EventEmitter = require('events');

// This is for the Possible EventEmitter memory leak detected. 11 connect listeners added.
//Use emitter.setMaxListeners() to increase limit
//Read Node.js Documentation

process.setMaxListeners(process.getMaxListeners() + 1)
//emitter.setMaxListeners(0);


var bots = {
  Skylar: 'lkl;k7',  //uuid
  Sanaa: '497517fc3'     //uuid
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
      my.ready();

      every((3).seconds(), function() {
        if (my.alive) {
          my.move();
          my.continue();
        }
      });

      every((20).seconds(), function(){
        my.birth();
      });
    },

// helper functions incorporated in workk
    move: function(){
      this.mip.driveDistance(0, 5, Math.floor(Math.random() * 360), 45)
    },

    ready: function(){
      this.age = 0;
      this.continue();
      this.move();
    },

    continue: function(){
     this.alive = true;
     this.mip.flashChestLED(0,255,0,10,5); //Green
    },

    display: function(err, data) {
    if (!!err) {
      console.log("Error: ", err);
      return;
    }
      console.log("Data: ", data);
    },

    death: function() {
      this.alive = false;
      this.mip.flashChestLED(255,0,0,10,5); //Red
      this.mip.stop();
    },

    level: function() {
    this.battery.getBatteryLevel(this.display);
    },

    dance: function() {
      let r = (Math.floor(Math.random() * 256));
      let g = (Math.floor(Math.random() * 256));
      let b = (Math.floor(Math.random() * 256));

        this.mip.flashChestLED(b, 0, r, 5, 5);
        this.mip.flashChestLED(r, 0, g, 6, 4);
        this.mip.flashChestLED(g, 0, b, 5, 6);
        this.mip.flashChestLED(r, 0, b, 5, 5);
        this.mip.turnLeft(45, 5);
        this.mip.turnLeft(45, 5);
        this.mip.turnLeft(45, 5);
    },



   birth: function() {
      this.age += 1;

      let batterylvl = this.level();


      if(this.alive){
        console.log(`Happy Birthday to You, ${this.name}.`)
        console.log(`You are ${this.age}.`);
        this.dance();
        }

        if (this.age < 10){
          this.alive = true;
          this.dance();
       }else{
        this.death();
       }
     }
   });
});

Cylon.start();
