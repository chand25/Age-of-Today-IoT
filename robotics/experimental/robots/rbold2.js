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

     my.battery.getBatteryLevel(my.display);
      console.log(my.display)
//////worked on 2robots
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


     if (this.battery > 0)
      this.mip.flashChestLED(0,255,0,10,5); //Green


    let r = (Math.floor(Math.random() * 256));
     let g = (Math.floor(Math.random() * 256));
     let b = (Math.floor(Math.random() * 256));
