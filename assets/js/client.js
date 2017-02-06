'use strict';

/* globals io: False, room: False, Vue: false, vueRoom: false */

// connect to the socket server
var socket = io();

socket.on('connect', function() {
    // Join the room
    socket.emit('join room', room._id);
});

socket.on('disconnect', function() {

    socket.in(room._id).emit('message', 'someone left!');

});

socket.on('message', function(data) {
   console.log('Incoming message:', data);
});

socket.on('info', function(data) {
   console.log('Incoming info:', data);
});

socket.on('update data', function(data) {

    Vue.set(vueRoom, 'participants', data.connected.length-1);

});
