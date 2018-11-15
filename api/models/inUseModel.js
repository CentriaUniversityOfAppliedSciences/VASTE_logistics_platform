'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InUseSchema = new Schema ({
  vehicleID:{
		type: String
	},
  userID:{
    type: String
  },
  timestamp:{
    type: Number
  },
  status:{
    type: String,
    enum: ['active', 'offline'],
    default: ['active']
  }

});

module.exports = mongoose.model('InUse', InUseSchema);
