'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LockerSchema = new Schema ({

		lockerId:{
			type: String,
		},

		lockerStatus:{
			type: String,
			enum: ['available','booked','in_use','malfunction'],
			default: 'available'
		},

		pointID: //point _id
		{
			type: String

		},
		lockerSize:{ //1 small, 2 medium, 3 large, 4 xl
			type: String
		},
		lockerCode:{
			type: String
		},
		lockerCode2:{
			type: String
		},
		orderID:{
			type: String
		},
		type:{ //pickup or delivery
			type: String,
			enum: ['pickup','delivery'],
			default: 'pickup'
		}



});

module.exports = mongoose.model('Lockers', LockerSchema);
