'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

var roomSchema = new Schema({
    title: 'string',
    hostId: 'string',
    activityId: 'string'
});

roomSchema.statics.findByUser = function(userId) {

    return this.find({ hostId: userId });

};

module.exports = mongoose.model('Room', roomSchema);
