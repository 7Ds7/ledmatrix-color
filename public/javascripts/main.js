var forEachNode = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};


var socket = io('http://localhost:3001');

document.addEventListener("DOMContentLoaded", function() {

  document.querySelector('.js-button-test').addEventListener('click', function() {
    console.log('clickityclick');
    console.log(socket);
    socket.emit('buttonclicked', 'the button was clicked');
  });

  socket.on('connect', function(){ console.log('connect on client')});
  socket.on('event', function(data){ console.log('this is event'); console.log(data);});
  socket.on('disconnect', function(){ console.log('disconnect')});
  socket.on('error', function(er) { console.log('ERROReeeee'); console.log(er) });

  socket.on('serveranswer', function(data) {
      console.log('server says hi');
    });

  socket.on('asd', function(){console.log('asd fired on client');})
});
