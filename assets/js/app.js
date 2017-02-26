'use strict';
 /* globals Vue: false, user: false, rooms: false, $: false */

new Vue({
  el: 'header',
  data: {
    user: user
  }
});

var vueDashboard = new Vue({
  el: 'main',
  data: {
      activities: [],
      rooms: typeof(rooms) !== 'undefined' ? rooms : false,
      user: user
  },
  methods: {

      addRoom: function() {

          // Prompt the user for a name
          // Use a browser native approach
          var roomName = window.prompt('Please enter a name for the new room');

          if(roomName) {

              $.post('/room/create', {
                  roomName: roomName
              }).then(function(room) {

                  vueDashboard.rooms.push(room);

              });

          } else {
              return;
          }

      },

      deleteRoom: function(room, i, e) {

          e.preventDefault();

          var roomId = room._id;

          $.post('/room/delete', {
              roomId: roomId
          }).then(function() {
              vueDashboard.rooms.splice(i, 1);
          }).catch(function(err) {
              console.log(err);
          });

      }

  }
});
