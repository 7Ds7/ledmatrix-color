var express = require('express');
var router = express.Router();

var server = require('http').createServer(express);
var io = require('socket.io')(server);
var PixelPusher = require('heroic-pixel-pusher');

server.listen(3001);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Led Color' });
});

io.on('connection', function(client) {
  console.log('####### NEW USER #######') ;
  console.log('Users Connected ' + io.engine.clientsCount);


  client.on('disconnect', function(){ console.log('####### DISCONNECTED #######');console.log('Users Connected ' + io.engine.clientsCount); });

  client.on('pixelpaint', function(dt) {
    console.log('pixelpaint');
    console.log(dt);
    // console.log(typeof dt);
    // console.log(dt.row);
    // console.log(dt.pos);
    // console.log(dt.alpha);

    grid_state[dt.row][dt.pos] = {
      on: dt.state,
      rgba: {
        r: dt.rgbobj.r,
        g: dt.rgbobj.g,
        b: dt.rgbobj.b,
        a: dt.alpha
      }
    }



    client.broadcast.emit('single', { row: dt.row, pos: dt.pos, rgba: {
        r: dt.rgbobj.r,
        g: dt.rgbobj.g,
        b: dt.rgbobj.b,
        a: dt.alpha
      }});
    //io.emit('serveranswer', 'asd');
  });

  io.emit('an event sent to all connected clients');
  io.emit('newcomer', grid_state);
});

var current_color;

var grid_state = [];

function constructGrid() {
  for (var col = 0; col< 32; col++ ) {
    grid_state[col] = [];
    for (var row = 0; row< 32; row++ ) {
      grid_state[col][row] = [];
      var strp = {
        on: false,
        rgba: {r: 0, g: 0, b: 0, a: 0}
      };
      grid_state[col][row] = strp;
    }


  }
};
constructGrid();


var pp = new PixelPusher();
pp.on('discover', function(controller) {
    var timer = null;

    // log connection data on initial discovery
    console.log('-----------------------------------');
    console.log('Discovered PixelPusher on network: ');
    console.log(controller.params.pixelpusher);
    console.log('-----------------------------------');

    // capture the update message sent back from the pp controller
    controller.on('update', function() {
        // console.log ({
        //     updatePeriod  : this.params.pixelpusher.updatePeriod,
        //     deltaSequence : this.params.pixelpusher.deltaSequence,
        //     powerTotal    : this.params.pixelpusher.powerTotal
        // });
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
    console.log('--Pixel Pass--');
    //console.log( controller.params.pixelpusher);

    var NUM_STRIPS = controller.params.pixelpusher.numberStrips;

    // aquire the number of pixels we that the controller reports is
    // in each strip. This is set in the pixel.rc file placed on your thumb drive.
    var PIXELS_PER_STRIP = controller.params.pixelpusher.pixelsPerStrip;

    // create a loop that will send commands to the PP to update the strip
    var UPDATE_FREQUENCY_MILLIS = 15;// 15 is just faster than 60 FPS

    timer = setInterval(function() {
        // create an array to hold the data for all the strips at once
         var strips = [];
        for (var stripId = 0; stripId< NUM_STRIPS; stripId ++){
            var s = new PixelPusher.PixelStrip(stripId,PIXELS_PER_STRIP);

            for (var pxId = 0; pxId< NUM_STRIPS; pxId++) {
              if( grid_state[stripId][pxId] && grid_state[stripId][pxId].on == true ) {
                s.getPixel(pxId).setColor(
                  grid_state[stripId][pxId].rgba.r,
                  grid_state[stripId][pxId].rgba.g,
                  grid_state[stripId][pxId].rgba.b,
                  grid_state[stripId][pxId].rgba.a
                  );
              }
            }


            // s.getPixel(1).setColor(10,0, 143,1);
            // s.getPixel(2).setColor(10,0, 143,0.15);
            // s.getPixel(20).setColor(100,200,100,0.5);
            // if ( stripId === 15 ) {
            //   s.getPixel(15).setColor(200,100,50,1);
            // }


          var renderedStripData = s.getStripData();

          strips.push(renderedStripData);

        // debugger
        //console.log(strips);
        // inform the controller of the new strip frame

      }

      controller.refresh(strips);


    }, UPDATE_FREQUENCY_MILLIS);

}).on('error', function(err) {
  console.log('PixelPusher Error: ' + err.message);
});


module.exports = router;