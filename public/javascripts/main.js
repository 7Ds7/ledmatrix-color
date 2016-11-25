var forEachNode = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};


var socket = io('http://192.168.0.100:3001');
var connect_grid;

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector('.js-button-test').addEventListener('click', function() {
    console.log('clickityclick');
    console.log(socket);
    socket.emit('pixelpaint', 'the button was clicked');
  });

  socket.on('connect', function(){ console.log('connect on client')});
  socket.on('event', function(data){ console.log('this is event'); console.log(data);});
  socket.on('disconnect', function(){ console.log('disconnect')});
  socket.on('error', function(er) { console.log('ERROReeeee'); console.log(er) });

  socket.on('serveranswer', function(data) {
      console.log('server says hi');
    });

  socket.on('newcomer', function(dt){
    console.log('asd fired on client');
    console.log(dt);
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
});