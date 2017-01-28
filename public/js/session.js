'use strict';
 /* globals Vue: false, user: false */

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

new Vue({
    el: 'main',
    data: {
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
                        'A': 'Rabat',
                        'B': 'Tangier',
                        'C': 'Marrakech',
                        'D': 'Cefchauoen'
                    }
                },
                {
                    title: 'What is the capital of Spain?',
                    answers: {
                        'A': 'Madrid',
                        'B': 'Tangier',
                        'C': 'Marrakech',
                        'D': 'Cefchauoen'
                    }
                }

            ]
          }
      ],
      questionIndex: 0,
      selectedAnswer: ''
    },
    methods: {

        next: function() {
            this.questionIndex++;
            $('#activityProgress').progress('increment');
        },

        prev: function() {
            this.questionIndex--;
            $('#activityProgress').progress('decrement');
        },

        selectAnswer: function() {
            console.log(event);
        }

    }

});
