'use strict';

/* globals io: False, room: False, Vue: false, vueRoom: false, Whiteboard: false, $, user: false */

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

socket.on('poll vote', function(i) {

    if(user) {
        vueRoom.answers[i].votes++;
    }

});

socket.on('update data', function(data) {

    Object.keys(data).forEach(function(key) {

        Vue.set(vueRoom, key, data[key]);

    });

});

socket.on('start activity', function(data) {

    Vue.set(vueRoom, 'activityStarted', true);

});

socket.on('stop activity', function(data) {

    Vue.set(vueRoom, 'activityStarted', false);

});
