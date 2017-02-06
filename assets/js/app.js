'use strict';
 /* globals Vue: false, user: false, rooms: false */

new Vue({
  el: 'header',
  data: {
    user: user
  }
});

Vue.component('activity-item', {
  props: ['activity'],
  template: `<div class="card">
              <div class="content">
                "{{ activity.title }}"
              </div>
              <div class="content">
                <div class="meta">Created {{ activity.date }}</div>
                <div class="description">{{ activity.description }}</div>
              </div>
            </div>`
});

Vue.component('modal', {
    props: ['modal'],
    template: `<div class="ui modal">
                  <i class="close icon"></i>
                  <div class="header">
                    {{ modal.title }}
                  </div>
                  <div class="content">
                    <p>{{{ modal.body }}}</p>
                  </div>
                  <div class="actions">
                    <div class="ui button">Cancel</div>
                    <div class="ui primary button">OK</div>
                  </div>
                </div>`
});

new Vue({
  el: 'main',
  data: {
    activities: [
          /* Example item: {
            title: 'Continents',
            description: 'A quiz about countries and continents.',
            date: '17/1/17'
          }*/
      ],
      rooms: rooms
  },
  methods: {

      showEditor: function() {

          // TODO: work on display 'Editor' modal for rooms

          console.log('test');

      }

  }
});
