'use strict';

var mongoose = require('mongoose');

var activity = mongoose.model('activity', {
  userId: { type: String, required: true},
  title: { type: String, required: true},
  date: { type: String, required: true},
  description: { type: String, required: true},
  type: { type: String, required: true}
});

module.exports = activity;
