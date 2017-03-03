'use strict';

var Whiteboard = {};

Whiteboard.init = (el, context) => {

    Whiteboard.el = el;
    Whiteboard.context = context;

    Whiteboard.context.fillStyle = 'solid';
    Whiteboard.context.lineWidth = 8;
    Whiteboard.context.lineCap = 'round';

    Whiteboard.setColour = (colour) => {

        Whiteboard.context.strokeStyle = colour;

    };

    Whiteboard.draw = (x, y, type) => {

        if(type === 'dragstart') {
            Whiteboard.context.beginPath();
            return Whiteboard.context.moveTo(x, y);
        } else if(type === 'drag') {
            Whiteboard.context.lineTo(x, y);
            return Whiteboard.context.stroke();
        } else {
            return Whiteboard.context.closePath();
        }

    };

    Whiteboard.point = (x, y) => {

        var r = Whiteboard.context.lineWidth;

        Whiteboard.context.beginPath();
        Whiteboard.context.arc(x + r, y + r, r, 0, 2 * Math.PI, false);

        var temp = Whiteboard.context.fillStyle;

        Whiteboard.context.fillStyle = Whiteboard.context.strokeStyle;
        Whiteboard.context.fill();

        Whiteboard.context.fillStyle = temp;

    };

    Whiteboard.clear = () => {

        $('.canvasMsgDimmer').dimmer('show');

        Whiteboard.context.clearRect(0, 0, Whiteboard.el.width, Whiteboard.el.height);

        setTimeout(function() {
            $('.canvasMsgDimmer').dimmer('hide');
        }, 1000);

    };

    Whiteboard.resize = () => {
        Whiteboard.el.width = Whiteboard.el.parentElement.offsetWidth - 35;
    };

    Whiteboard.redraw = () => {

        var temp = {
                fillStyle: Whiteboard.context.fillStyle,
                strokeStyle: Whiteboard.context.strokeStyle,
                lineCap: Whiteboard.context.lineCap,
                lineWidth: Whiteboard.context.lineWidth
        };

        // Grab snapshot of the canvas to repaint later
        var img = Whiteboard.context.getImageData(0, 0, Whiteboard.el.width, Whiteboard.el.height);

        // Resize the canvas
        Whiteboard.resize();

        // Repaint the canvas contents
        Whiteboard.context.putImageData(img, 0, 0);

        // Restyle the canvas pencil
        for (var property in temp) {

            Whiteboard.context[property] = temp[property];

        }

    };

    Whiteboard.setColour('#d23572');

    window.addEventListener('resize', () => {

        Whiteboard.redraw();

    });

    return;

};
