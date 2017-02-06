'use strict';

/* globals io: False, room: False */

// connect to the socket server
var socket = io();

socket.on('connect', function() {
    // Join the room
    socket.emit('join room', room._id);
});
