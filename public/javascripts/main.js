var forEachNode = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};


var socket = io('http://'+window.location.hostname+':3001');
var connect_grid;

document.addEventListener("DOMContentLoaded", function() {
  // document.querySelector('.js-button-test').addEventListener('click', function() {
  //   console.log('clickityclick');
  //   console.log(socket);
  //   socket.emit('pixelpaint', 'the button was clicked');
  // });

  socket.on('connect', function(){ console.log('connect on client')});
  socket.on('event', function(data){ console.log('this is event'); console.log(data);});

  socket.on('error', function(er) { console.log('ERROReeeee'); console.log(er) });

  socket.on('serveranswer', function(data) {
      console.log('server says hi');
    });

  socket.on('newcomer', function(dt){
    console.log('initiating newcomer grid');
    //console.log(dt);
    connect_grid = dt;
  });

  socket.on('single', function(dt) {
    console.log('single');
    console.log(dt);
    var $ls = document.querySelector('ledmatrix-app').$.LedGrid.$.Container.querySelector('led-state[row="'+dt.row+'"][pos="'+dt.pos+'"]');

    $ls.setAttribute('alpha', dt.rgba.a);
    $ls.setAttribute('rgbobj', '{ "r": '+dt.rgba.r+', "g": '+dt.rgba.g+', "b": '+dt.rgba.b+' }' );
    console.log($ls);
    console.log($ls.rgbobj);
  });

  socket.on('disconnect', function() {
    console.log('disconnect');
    document.querySelector('.modal').classList.remove('u-hide');
  });

  // socket.io.on('connect_error', function(err) {
  // // handle server error here
  // console.log('Error connecting to server');
  // });

});