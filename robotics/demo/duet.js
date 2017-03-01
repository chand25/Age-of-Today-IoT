var Cylon = require('cylon');
const EventEmitter = require('events');

// This is for the Possible EventEmitter memory leak detected. 11 connect listeners added.
//Use emitter.setMaxListeners() to increase limit
//Read Node.js Documentation

process.setMaxListeners(process.getMaxListeners() + 1)
//emitter.setMaxListeners(0);


var bots = {
  Skylar: 'kkhhlsdahlks',  //uuid input a reall uuid this is a placeholder
  Sanaa: 'khhlsdsjadljs;'     //uuid
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
      //this.mip.driveDistance(0, 5, Math.floor(Math.random() * 360), 45)
      this.mip.driveDistance(0, 5, 2, 45)
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
      this.mip.turnRight(360, 50);
      console.log('All the way around to my Right');
      this.mip.turnLeft(360, 50);
      console.log('All the way around to my Left');
      this.mip.turnRight(360, 50);
      console.log('All the way around to my Right');
      this.mip.turnLeft(360, 50);
      console.log('All the way around to my Left');
      this.mip.driveDistance(2, 5,0,0);
       console.log('Moonwalk');
      //this.mip.driveDistance(0, 5, 2, 45);
      //console.log('Side-step Forward');
      /*this.mip.turnRight(45, 50);
      console.log('All the way around to my Right');
      this.mip.turnLeft(45, 50);
      console.log('All the way around to my Right');
      this.mip.turnRight(45, 50);
      console.log('All the way around to my Left');
      this.mip.turnLeft(45, 50);
      console.log('All the way around to my Left');
*/

      /*
      console.log('Freeze');
      this.mip.turnRight(360, 50);
      console.log('All the way around to my Right');
      this.mip.turnLeft(360, 50);
      console.log('All the way around my Left');
      this.mip.turnRight(360, 50);
      console.log('All the way around to my Right');
      this.mip.driveDistance(2, 5,0,0);
       console.log('Moonwalk');
       this.mip.turnRight(270, 5);
       console.log('Slow turn to face crowd');

       */
},


   birth: function() {
      this.age += 1;

      let batterylvl = this.level();

        if (this.age < 10){
        console.log(`Happy Birthday to You, ${this.name}.`)
        console.log(`You are ${this.age}.`);
          this.alive = true;
          this.dance();
       }else{
        this.death();
      }

       if(this.alive){
        console.log(`Happy Birthday to You, ${this.name}.`)
        console.log(`You are ${this.age}.`);
        }
     }
   });
});

Cylon.start();
