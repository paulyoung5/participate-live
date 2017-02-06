'use strict';

var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    shortid = require('shortid'),
    models = require('../models/index'),
    Room = models.Room;

/*
Room.create({
    title: 'Room A',
    hostId: 'twitter|20535830'
}, function(err) {
    if(err) {
        return new Error(err);
    }
});

Room.create({
    title: 'Room B',
    hostId: 'facebook|10208302306179706'
}, function(err) {
    if(err) {
        return new Error(err);
    }
});
*/

var isUserHost = (userId, roomId, callback) => {

    Room.findById(roomId, function(error, room) {

        if(error) {
            return error;
        } else {
            // Check if user owns that room
            return callback(room.hostId === userId);
        }

    });

};

router.get('/:id', function(req, res, next) {

  var roomId = req.params.id;

  assert(roomId, 'roomId is null, defined or empty');

  Room.findById(roomId, function(err, room) {

      if(err){
          return next(err);
      } else if(!shortid.isValid(roomId)) {
          return next(new Error('No room was found with that ID.'));
      } else if(room === null) {
          return next(new Error('No room was found with that ID.'));
      }

      var renderRoom = function(isHost) {

          assert(room, 'room is null or undefined');
          assert(process.env, 'env is null or undefined');

          var data = {

                  room: JSON.stringify(room),
                  env: process.env,
                  pageTitle: room.title

              },
              roomTemplate;

          if(isHost) {

              data.user = JSON.stringify(req.user);

              assert(data.user, 'user is null or undefined');

              roomTemplate = 'pages/host/room';
          } else {
              roomTemplate = 'pages/room';
          }

          console.log(data.user);

          return res.render(roomTemplate, data);

      };

      // We need to check what interface the user should be shown
      // Check is the user is logged in
      if(req.isAuthenticated()) {

          var userId = req.user.id;
          assert(userId, 'user ID is null, undefined or empty');

          // If they are logged in, check if they own this room
          // i.e. they are the host
          isUserHost(userId, roomId, function(result) {

              if(result) {
                  renderRoom(true);
              }

          });

      } else {

          renderRoom(false);

      }

  });

});

module.exports = router;
