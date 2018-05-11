'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CarSchema = new Schema({
  registerNumber: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  updateDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['online', 'offline']
    }],
    default: ['offline']
  }
});

module.exports = mongoose.model('Cars', CarSchema);