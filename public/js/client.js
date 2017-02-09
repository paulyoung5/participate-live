'use strict';

/* globals io: False, room: False, Vue: false, vueRoom: false, Whiteboard: false, $ */

// connect to the socket server
var socket = io();

socket.on('connect', function() {
    // Join the room
    socket.emit('join room', room._id);
});

socket.on('message', function(data) {
   console.log('Incoming message:', data);
});

socket.on('info', function(data) {
   console.log('Incoming info:', data);
});

socket.on('canvas draw', function(data) {

    Whiteboard.draw(data.x, data.y, data.type);

});

socket.on('canvas point', function(data) {

    Whiteboard.point(data.x, data.y);

});

socket.on('canvas clear', function() {

    Whiteboard.clear();

});

socket.on('update data', function(data) {

    Vue.set(vueRoom, 'participants', data.connected.length-1);

});
