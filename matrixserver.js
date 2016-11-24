var PixelPusher = require('heroic-pixel-pusher');
var util = require('util');

new PixelPusher().on('discover', function(controller) {
    var timer = null;

    // log connection data on initial discovery
    console.log('-----------------------------------');
    console.log('Discovered PixelPusher on network: ');
    console.log(controller.params.pixelpusher);
    console.log('-----------------------------------');

    // capture the update message sent back from the pp controller
    controller.on('update', function() {
        console.log ({
            updatePeriod  : this.params.pixelpusher.updatePeriod,
            deltaSequence : this.params.pixelpusher.deltaSequence,
            powerTotal    : this.params.pixelpusher.powerTotal
        });
    }).on('timeout', function() {
        // be sure to handel the situation when the controller dissappears.
        // this could be due to power cycle or network conditions
        console.log('TIMEOUT : PixelPusher at address [' + controller.params.ipAddress + '] with MAC (' + controller.params.macAddress + ') has timed out. Awaiting re-discovery....');
        if (!!timer) clearInterval(timer);
    });

    //--
    // create a timer of some fps frequency and send the new pixel data
    //--
    //
    console.log('EEEEEE');
    console.log( controller.params.pixelpusher);

    var NUM_STRIPS = controller.params.pixelpusher.numberStrips;

    // aquire the number of pixels we that the controller reports is
    // in each strip. This is set in the pixel.rc file placed on your thumb drive.
    var PIXELS_PER_STRIP = controller.params.pixelpusher.pixelsPerStrip;

    // create a loop that will send commands to the PP to update the strip
    var UPDATE_FREQUENCY_MILLIS = 15;// 15 is just faster than 60 FPS
    var a = true;
    timer = setInterval(function() {
        // create an array to hold the data for all the strips at once
        // loop
        var strips = [];
        for (var stripId = 0; stripId< NUM_STRIPS; stripId ++){
            var s = new PixelPusher.PixelStrip(stripId,PIXELS_PER_STRIP);

            // set a random pixel blue
            //s.getRandomPixel().setColor(0,255,255, 1);
            // console.log(stripId);
            // console.log(s.getRandomPixel());
            // console.log('poop');
            // console.log(s.getPixel(0));
            s.getPixel(10).setColor(255,0,0, 0.1);
            // if ( stripId == 0 ) {
            // var r = (Math.floor(Math.random() * 255) + 1);
            // console.log(r);
            // s.setStripColor(r,r,r,1);
                s.setStripColor((Math.floor(Math.random() * 255) + 1),(Math.floor(Math.random() * 255) + 1)  , (Math.floor(Math.random() * 255) + 1),1);
                s.getPixel((Math.floor(Math.random() * 31) + 1)).setColor((Math.floor(Math.random() * 255) + 1),(Math.floor(Math.random() * 255) + 1)  , (Math.floor(Math.random() * 255) + 1),1);
                s.getPixel((Math.floor(Math.random() * 31) + 1)).setColor(0,0  , 0,1);
                s.getPixel((Math.floor(Math.random() * 31) + 1)).setColor(0,0  , 0,1);
                s.getPixel((Math.floor(Math.random() * 31) + 1)).setColor(0,0  , 0,1);
                s.getPixel((Math.floor(Math.random() * 31) + 1)).setColor(0,0  , 0,1);
                s.getPixel((Math.floor(Math.random() * 31) + 1)).setColor(0,0  , 0,1);
                s.getPixel((Math.floor(Math.random() * 31) + 1)).setColor(0,0  , 0,1);
                s.getPixel((Math.floor(Math.random() * 31) + 1)).setColor(0,0  , 0,1);




                //s.getPixel(0).setColor(255,0,0, 1);
                // s.getPixel(0).setColor(255,0,0, 1);

            // }
            // s.getPixel(stripId).setColor((Math.floor(Math.random() * 255) + 1),(Math.floor(Math.random() * 255) + 1)  , (Math.floor(Math.random() * 255) + 1),1);
            //console.log(s.getStripData());
            // render the strip data into the correct format for sending
            // to the pixel pusher controller
            var renderedStripData = s.getStripData();
            // if ( stripId  == 0 && a == true) {
            //     a = false;
            //     var buffered = [];

            //     renderedStripData.data.forEach(function(line){
            //       buffered.push(!process.stdout.write(util.format(line) + '\n'));
            //     });
            //     console.log(buffered);
            // }
            // add this data to our list of strip data to send
            strips.push(renderedStripData);

        }
        //console.log(strips);
        // inform the controller of the new strip frame
        controller.refresh(strips);


    }, UPDATE_FREQUENCY_MILLIS);

}).on('error', function(err) {
  console.log('PixelPusher Error: ' + err.message);
});

