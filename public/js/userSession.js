'use strict';
 /* globals Vue: false, user: false, room: false, pollChart: false, socket: false, VueColor: false, Whiteboard: false */

var Swatches = VueColor.Swatches;

 var defaultProps = {
  hex: '#194d33',
  hsl: {
    h: 150,
    s: 0.5,
    l: 0.2,
    a: 1
  },
  hsv: {
    h: 150,
    s: 0.66,
    v: 0.30,
    a: 1
  },
  rgba: {
    r: 25,
    g: 77,
    b: 51,
    a: 1
  },
  a: 1
};

vueRoom = new Vue({
    el: 'main',
    components: {
        'swatches-picker': Swatches
    },
    data: {

        user: false,
        room: room,
        participants: 0,

        activityTitle: '',
        answers: [],

        openResponseTitle: '',
        newResponseText: '',

        canDraw: false,
        voteCast: false,

        paused: true,
        currentActivity: 'poll',

        colors: defaultProps


    },
    methods: {

        clearWhiteboard: function() {
            Whiteboard.clear();
            socket.emit('canvas clear');
        },

        onChange (val) {
          this.colors = val;
        },

        vote: function(i, e) {

            e.preventDefault();

            socket.emit('poll vote', i);

            this.voteCast = true;

            // TODO: Work on showing "waiting on the next activity" after vote cast

            setTimeout(function() {

                this.voteCast = false;
                this.paused = true;

            }.bind(this), 1000);

        },

        submitResponse: function() {

            if(this.newResponseText) {
                socket.emit('new response', this.newResponseText);
            }

        }

    },
    watch: {

        colors: {

            handler: function(value) {

                Whiteboard.setColour(value.hex);

            },
            deep: true

        },

        currentActivity: function(val) {

            if(val === 'poll') {
                this.paused = true;
            } else {
                this.paused = false;
            }

        }

    }

});
