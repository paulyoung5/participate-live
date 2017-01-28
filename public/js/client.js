'use strict';

/* globals io: False, roomId: False */

// connect to the socket server
var socket = io();

socket.on('connect', function() {
    // Join the room
    socket.emit('room', roomId);
});

socket.on('message', function(data) {
   console.log('Incoming message:', data);
});

socket.on('info', function(data) {
   console.log('Incoming info:', data);
});
