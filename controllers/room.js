'use strict';

var express = require('express'),
    router = express.Router(),
    assert = require('assert'),
    shortid = require('shortid'),
    models = require('../models/index'),
    Room = models.Room;

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

router.post('/delete', function(req, res, next) {

    var roomId = req.body.roomId;

    assert(roomId, 'roomId is null, defined or empty');

    Room.findById(roomId, function(err, room) {

        if(err) {
            return next(err);
        } else if (room === null) {
            return next(new Error('No room was found with that ID.'));
        } else {
            room.remove();
            res.json(true);
        }

    });

});

router.post('/create', function(req, res, next) {

    new Room({
        title: req.body.roomName,
        hostId: req.user.id
    }).save().then(function(doc) {
        res.json(doc);
    }).catch(function(err) {
        next(err);
    });

});

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
