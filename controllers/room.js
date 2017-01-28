'use strict';

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    models = require('../models/index'),
    Room = models.Room;

/*
Room.create({
    title: 'Room A',
    hostId: 'twitter|20535830',
    activityId: '20_activity_id'
}, function(err) {
    if(err) {
        return new Error(err);
    }
});

Room.create({
    title: 'Room B',
    hostId: 'facebook|10208302306179706',
    activityId: '10_activity_id'
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

  if(!mongoose.Types.ObjectId.isValid(roomId)) {
      return next(new Error('No room was found with that ID.'));
  }

  Room.findById(roomId, function(err, room) {

      console.log('test');
      console.log(room);

      if(err){
          return next(err);
      } else if(room === null) {
          return next(new Error('No room was found with that ID.'));
      }

      // We need to check what interface the user should be shown
      var roomTemplate;

      if(req.isAuthenticated()) {

          var userId = req.user.id;

          isUserHost(userId, roomId, function(result) {
              roomTemplate = result ? 'pages/host/room' : 'pages/room';
          });

      } else {
          roomTemplate = 'pages/room';
      }

      return res.render(roomTemplate, {

          room: JSON.stringify(room),
          roomId: roomId,
          env: process.env,
          pageTitle: room.title,
          user: JSON.stringify(req.user)

      });

  });

});

module.exports = router;
