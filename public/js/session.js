'use strict';
 /* globals Vue: false, user: false, room: false, pollChart: false, pollAnswers: false */

var vueRoom = new Vue({
    el: 'main',
    data: {
        user: typeof user !== 'undefined' ? user : false,
        room: room,
        participants: 0,
        activityTitle: '',
        newAnswerText: '',
        answers: [],
        questionIndex: 0
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

        logData: function() {
            console.log(this.activityTitle);
            console.log(this.answers);
        },

        vote: function(i, e) {

            e.preventDefault();

            this.answers[i].votes++;

            console.log('Voted for ', this.answers[i].title);

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

            pollChart.options.title.text = value;

        },

        answers: {

            handler: function() {

                pollChart.options.data[0].dataPoints = this.answerVotes;

            },
            deep: true

        }

    }

});
