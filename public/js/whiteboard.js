'use strict';

/* globals $: false, socket: false, room: false */

var Whiteboard = {};

Whiteboard.init = (el, context) => {

    Whiteboard.el = el;

    context.fillStyle = 'solid';
    context.strokeStyle = '#bada55';
    context.lineWidth = 5;
    context.lineCap = 'round';

    Whiteboard.draw = (x, y, type) => {

        if(type === 'dragstart') {
            context.beginPath();
            return context.moveTo(x, y);
        } else if(type === 'drag') {
            context.lineTo(x, y);
            return context.stroke();
        } else {
            return context.closePath();
        }

    };

    Whiteboard.point = (x, y) => {

        var r = context.lineWidth;

        context.beginPath();
        context.arc(x + r, y + r, r, 0, 2 * Math.PI, false);

        var temp = context.fillStyle;

        context.fillStyle = context.strokeStyle;
        context.fill();

        context.fillStyle = temp;

    };

    Whiteboard.clear = () => {
        context.clearRect(0, 0, Whiteboard.el.width(), Whiteboard.el.height());
    };

    return;

};

$(function() {

    $('#whiteboard').removeClass('loading');

    var el = $('#whiteboard canvas');
    var context = el[0].getContext('2d');

    Whiteboard.init(el, context);

    var x, y;

    $('#whiteboard canvas').drag('start', function( ev, dd ){

        x = ev.pageX - dd.originalX;
        y = ev.pageY - dd.originalY + 23;

        Whiteboard.draw(x, y, 'dragstart');
        socket.emit('canvas draw', {
            x: x,
            y: y,
            type: 'dragstart'
        });

    }).drag(function( ev, dd ){

        x = ev.pageX - dd.originalX;
        y = ev.pageY - dd.originalY + 23;

        Whiteboard.draw(x, y, 'drag');
        socket.emit('canvas draw', {
            x: x,
            y: y,
            type:'drag'
        });

    }).click(function(e) {

        var rect = this.getBoundingClientRect();

        var x = e.clientX - rect.left - 7,
            y = e.clientY - rect.top + 14;

        Whiteboard.point(x, y);

        socket.emit('canvas point', {
            x: x,
            y: y
        });

    });

    $('.clearWhiteboard').click(function() {

        Whiteboard.clear();
        socket.emit('canvas clear');

    });

});
