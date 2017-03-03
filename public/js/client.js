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

    Whiteboard.setColour(data.colour);

    Whiteboard.draw(data.x, data.y, data.type);

    setTimeout(function () {
        Whiteboard.setColour(vueRoom.colors.hex);
    }, 1000);

});

socket.on('canvas point', function(data) {

    Whiteboard.setColour(data.colour);

    Whiteboard.point(data.x, data.y);

    setTimeout(function () {
        Whiteboard.setColour(vueRoom.colors.hex);
    }, 1000);

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

socket.on('start poll', function(data) {

    Vue.set(vueRoom, 'paused', false);

});

socket.on('stop poll', function(data) {

    Vue.set(vueRoom, 'paused', true);

});

socket.on('room tab change', function(data) {

    Vue.set(vueRoom, 'currentActivity', data.tab);

    if(data.tab === 'poll') {
        Vue.set(vueRoom, 'paused', true);
    } else {
        Vue.set(vueRoom, 'paused', false);
    }

});

socket.on('new response', function(response) {

    vueRoom.responses.push({
        title: response
    });

});
