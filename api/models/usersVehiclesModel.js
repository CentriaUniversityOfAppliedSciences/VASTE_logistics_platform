'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	vehicleID:{
		type: String,
		required: 'Please enter vehicleID'
	},
	owners:{
		userID:{
			type: String,
			required: 'Please enter userID'
		}
	},
});

module.exports = mongoose.model('UsersVehicles', UserSchema);
