'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LockerSchema = new Schema ({

		lockerId:{
			type: String,
		},
		lockerState:{
			type: String,
			enum: ['booked', 'available'],
			default: ['available']
		},
		
		lockerSize:{
			type: String,
		},
		
		lockerCode:{
			type: String,
		}

	
});

module.exports = mongoose.model('Lockers', LockerSchema);