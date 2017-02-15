'use strict';
 /* globals Vue: false, user: false, room: false, chartData: false */

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

        addNewAnswer: function() {

            this.answers.push({
              title: this.newAnswerText,
              votes: 0
            });
            this.newAnswerText = '';
            document.getElementById('newAnswerText').focus();

            chartData.add({
                title: this.newAnswerText,
                votes: 0
            });

        },

        removeAnswer: function(i) {

            this.answers.splice(i, 1);

            chartData.remove(i);

        },

        logData: function() {
            console.log(this.activityTitle);
            console.log(this.answers);
        },

        vote: function(i) {

            this.answers[i].votes++;

            chartData.get(i).votes++;

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
                return a.votes;
            });

        }

    }

});

var VueWhiteboard = new Vue({
    el: '#whiteboard',
    methods: {
        setPaintbrushSize: function() {

            console.log('test');

        }
    }
});
