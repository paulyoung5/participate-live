'use strict';
 /* globals Vue: false, user: false, room: false */

Vue.component('poll-question', {
    props: ['item', 'selectedAnswer'],
    template: `<div class="ui basic segment">

                    <h3 class="ui dividing header">{{ item.title }}</h3>

                    <div class="ui two doubling link cards">

                        <a class="ui card" v-on:click="selectAnswer(key)" :class="{ green: key === selectedAnswer }" v-for="(value, key) in item.answers" href="#">

                          <div class="content">

                            <h3 class="ui center aligned header">

                              <div class="content">

                                  {{ key }}
                                  <div class="sub header">{{ value }}</div>

                              </div>

                            </h3>

                          </div>

                        </a>

                    </div>

                </div>`
});

var vueRoom = new Vue({
    el: 'main',
    data: {
        user: typeof user !== 'undefined' ? user : false,
        room: room,
        participants: 0,
        activityTitle: '',
        newAnswerText: '',
        answers: [],
        activityList: [
          {
            title: 'Countries',
            type: 'Poll',
            description: 'A quiz about countries and continents.',
            date: '17/1/17',
            items: [

                {
                    title: 'What is the capital of Morocco?',
                    answers: {
                        'A': {
                            title: 'Rabat',
                            votes: 0
                        },
                        'B': {
                            title: 'Tangier',
                            votes: 0
                        },
                        'C': {
                            title: 'Marrakech',
                            votes: 0
                        },
                        'D': {
                            title: 'Chefchauoen',
                            votes: 0
                        }
                    }
                }

            ]
          }
      ],
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
        },

        removeAnswer: function(i) {
            this.answers.splice(i, 1);
        },

        logData: function() {
            console.log(this.activityTitle);
            console.log(this.answers);
        }

    }

});
