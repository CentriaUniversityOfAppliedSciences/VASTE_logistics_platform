'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LockerSchema = new Schema ({

		lockerId:{
			type: String,
		},
		
		lockerStatus:{
			type: String,
			enum: ['available','booked','in_use'],
			default: ['available']
		},
		pointID:
		{
		type: String
		},
		lockerSize:{
			type: String
		},
		lockerCode:{
			type: String
		}

	
});

module.exports = mongoose.model('Lockers', LockerSchema);