'use strict';
 /* globals Vue: false, user: false, room: false, pollChart: false, socket: false */

vueRoom = new Vue({
    el: 'main',
    data: {

        user: typeof user !== 'undefined' ? user : false,
        room: room,
        participants: 0,
        roomMaximised: false,

        activityTitle: '',
        newAnswerText: '',
        answers: [],
        questionIndex: 0,

        openResponseTitle: '',
        responses: [],

        activityStarted: false,
        whiteboardEnabled: false,
        pollEnabled: false,
        openResponsesEnabled: false

    },
    methods: {

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

            console.log('Voted for ', this.answers[i].title);

        },


        newResponse: function(r) {

            this.responses.push(r);

        },


        startActivity: function(e, activityType) {

            e.preventDefault();

            document.getElementById('pollChartPane').className = 'sixteen wide column';

            this.activityStarted = true;
            this.answers = this.answers.map(function(a) {
                return {
                    title: a.title,
                    votes: 0
                };
            });

            switch(activityType) {

                case 'poll':
                    this.pollEnabled = true;
                    this.whiteboardEnabled = false;
                    this.openResponsesEnabled = false;
                    break;

                case 'whiteboard':
                    this.whiteboardEnabled = true;
                    this.pollEnabled = false;
                    this.openResponsesEnabled = false;
                    break;

                case 'openResponses':
                    this.openResponsesEnabled = true;
                    this.pollEnabled = false;
                    this.whiteboardEnabled = false;
                    break;

            }

            var changes = {
                activityTitle: this.activityTitle,
                answers: this.answers,
                pollEnabled: this.pollEnabled,

                whiteboardEnabled: this.whiteboardEnabled,

                openResponseTitle: this.openResponseTitle,
                responses: this.responses,
                openResponsesEnabled: this.openResponsesEnabled
            };

            console.log('changes pushed to everyone else: ', changes);

            socket.emit('update data', changes);

        },

        resetActivity: function(e) {

            e.preventDefault();

            this.activityStarted = false;
            this.activityTitle = '';
            this.answers = [];

            this.openResponseTitle = '';

            this.pollEnabled = false;
            this.whiteboardEnabled = false;
            this.openResponsesEnabled = false;

            document.getElementById('pollChartPane').className = 'six wide column';

        },

        toggleFullScreen: function() {

            this.roomMaximised = !this.roomMaximised;

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

        }

    },
    watch: {

        activityTitle: function(value) {

            if(typeof(pollChart) !== 'undefined') {
                pollChart.options.title.text = value;
            }

        },

        answers: {

            handler: function() {

                if(typeof(pollChart) !== 'undefined') {
                    pollChart.options.data[0].dataPoints = this.answerVotes;
                }
            },
            deep: true

        },

        activityStarted: function(value) {

            if(value) {
                socket.emit('start activity');
            } else {
                socket.emit('stop activity');
            }

        }

    }

});
