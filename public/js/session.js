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
    el: '#room',
    components: {
        'swatches-picker': Swatches
    },
    data: {

        user: typeof user !== 'undefined' ? user : false,
        room: room,
        participants: 0,
        roomMaximised: false,
        sharingDimmerActive: false,

        activityTitle: '',
        newAnswerText: '',
        answers: [],

        openResponseTitle: '',
        responses: [],

        canDraw: [],

        paused: true,

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

        showSharingDimmer: function() {

            this.sharingDimmerActive = true;

        },

        hideSharingDimmer: function() {

            this.sharingDimmerActive = false;

        },

        addNewAnswer: function(e) {

            e.preventDefault();

            if(!this.newAnswerText) {
                this.newAnswerText = '';
                document.getElementById('newAnswerText').focus();
                return;
            }

            this.answers.push({
              title: this.newAnswerText,
              votes: parseInt(Math.random() * (30 - 5) + 5)
            });
            this.newAnswerText = '';
            document.getElementById('newAnswerText').focus();

        },

        removeAnswer: function(i, e) {

            e.preventDefault();

            var confirm = window.confirm('Are you sure you want to remove this answer?');

            if(confirm) {
                this.answers.splice(i, 1);
            } else {
                return;
            }

        },

        vote: function(i, e) {

            e.preventDefault();

            socket.emit('poll vote', i);

            this.answers[i].votes++;

        },


        newResponse: function(r) {

            this.responses.push(r);

            socket.emit('new response', r);

        },


        startPoll: function(e) {

            e.preventDefault();

            document.getElementById('pollChartPane').className = 'sixteen wide column';

            this.paused = false;
            this.answers = this.answers.map(function(a) {
                return {
                    title: a.title,
                    votes: 0
                };
            });

            var changes = {
                activityTitle: this.activityTitle,
                answers: this.answers,

                openResponseTitle: this.openResponseTitle,
                responses: this.responses,

                currentActivity: 'poll'
            };

            socket.emit('update data', changes);

        },

        resetPoll: function(e) {

            e.preventDefault();

            this.paused = true;
            this.activityTitle = '';
            this.answers = [];

            this.openResponseTitle = '';

            document.getElementById('pollChartPane').className = 'six wide column';

        },

        toggleFullScreen: function() {

            this.roomMaximised = !this.roomMaximised;

            setTimeout(function() {
                fireRefreshEventOnWindow();
            }, 5);

        },

        addNewResponse: function() {
            this.responses.push({title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales pellentesque bibendum.'});
        },

        beforeResponseEnter: function() {

            $('html,body').animate({ scrollTop: $("#responses").offset().top}, 'slow');

        },

        afterResponseEnter: function() {

            var responses = document.getElementById('responses');

            if(typeof(responses) !== 'undefined') {

                responses.scrollTop = responses.scrollHeight;

            }

        }

    },
    computed: {

        answerTitles: function() {

            return this.answers.map(function(a) {
                return a.title;
            });

        },

        answerVotes: function() {

            return this.answers.map(function(a) {
                return {
                    y: a.votes,
                    indexLabel: a.title
                };
            });

        },

        totalVotes: function() {

            var votes = this.answers.map(function(a) {
                return a.votes;
            });

            return votes.reduce(function(a, b) {
                return a + b;
            }, 0);

        }

    },
    watch: {

        openResponseTitle: function(val) {

            this.responses = [];

            socket.emit('update data', {
                openResponseTitle: val
            });

        },

        colors: {

            handler: function(value) {

                Whiteboard.setColour(value.hex);

            },
            deep: true

        },

        activityTitle: function(value) {

            if(typeof(pollChart) !== 'undefined') {
                pollChart.options.title.text = value;
            }

            socket.emit('update data', {
                activityTitle: value
            });

        },

        answers: {

            handler: function() {

                if(typeof(pollChart) !== 'undefined') {
                    pollChart.options.data[0].dataPoints = this.answerVotes;
                }
            },
            deep: true

        },

        paused: function(value) {

            if(!value) {
                socket.emit('start poll');
            } else {
                socket.emit('stop poll');
            }

        }



    }

});
