var Cylon = require('cylon');
const EventEmitter = require('events').EventEmitter.prototype._maxListeners = 100;
//Leap Motion JavaScript API (leap.js)

process.setMaxListeners(process.getMaxListeners() + 1)

//emitter.setMaxListeners(0);


Cylon.robot({
  connections: {
    mip1: {adaptor: 'central', uuid: 'kjsljdfe7', module: 'cylon-ble'},
    mip2: {adaptor: 'central', uuid: 'kkhkjc3', module: 'cylon-ble'},
    leapmotion: {adaptor: 'leapmotion'}
},
devices: {
    battery: { driver: "ble-battery-service" },
    deviceInfo: { driver: "ble-device-information" },
    mip: { driver: "mip", connection: "mip1", connection: "mip2" },
    //mip2: { driver: "mip", connection: "mip2" },
    leapmotion: {driver: 'leapmotion', connection: 'leapmotion'}
  },

work: function(my) {
  console.log(`'${battery}`)
  let r = (Math.floor(Math.random() * 256));
  let g = (Math.floor(Math.random() * 256));
  let b = (Math.floor(Math.random() * 256));
  my.leapmotion.on('frame', function(frame) {
  if(frame.valid && frame.gestures.length > 0){
         frame.gestures.forEach(function(gesture){
           if(gesture.type == 'swipe'){
             var currentPosition = gesture.position;
             var startPosition = gesture.startPosition;
            console.log(gestures);

             var xDirection = currentPosition[0] - startPosition[0];
             var yDirection = currentPosition[1] - startPosition[1];
             var zDirection = currentPosition[2] - startPosition[2];

//The Math.abs() function returns the absolute value of a number,
//making sure all gestures compute to a absolute value.
              var xAxis = Math.abs(xDirection);
              var yAxis = Math.abs(yDirection);
              var zAxis = Math.abs(zDirection);

             var superiorPosition  = Math.max(xAxis, yAxis, zAxis);

              if(superiorPosition === xAxis){
                if(xDirection < 0){
                  my.mip.turnLeft(90, 5);
                  console.log('I turned LEFT');
                 } else {
                  my.mip.turnRight(90, 5);
                  console.log('I turned RIGHT');
                }
              }

              if(superiorPosition === zAxis){
                   if(zDirection > 0){
                    my.mip.driveBackward(5, 5);
                    console.log('I am doing Moonwalk Roll');
                  } else {
                  my.mip.driveForward(5, 5);
                  console.log('On the road again');
                 }
               }

              if(superiorPosition === yAxis){
                if(yDirection > 0){
                  console.log('All of the Lights r, g, b');
                  every((2).second(), function() {
                  my.mip.flashChestLED(r, g, b);
                  });
                 } else {
                   console.log('Blink eyes to acknowledge stop');
                   my.mip.stop(function() {
                   my.mip.setHeadLED(2, 2, 2, 2);
                 })
               }
             }
           }
         })
       }
     })
    }
  }).start();
