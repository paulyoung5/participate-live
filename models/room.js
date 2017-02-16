'use strict';

var mongoose = require('mongoose'),
    shortid = require('shortid'),
    Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

var roomSchema = new Schema({
    _id: {
        type: String,
        'default': shortid.generate
    },
    title: 'string',
    hostId: 'string'
});

roomSchema.statics.findByUser = function(userId) {

    return this.find({ hostId: userId });

};

module.exports = mongoose.model('Room', roomSchema);
