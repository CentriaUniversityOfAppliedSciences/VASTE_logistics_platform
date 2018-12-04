'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliveryConfirmationSchema = new Schema ({

	vehicleID:{
		type: String,
		required: 'Please set the vehicleID'
	},
	orderID:{
		type: String,
		required: 'Please set the orderID'
	},
	deliveryID:
	{
		type: String,
		required: 'Please set the deliveryID'
	},
	name:
	{
		type:String,
		required: 'Please set the name of the file'
	},
	type:
	{
		type:String,
		enum: ['signature', 'image'],
		default: ['image']
	}




});

module.exports = mongoose.model('DeliveryConfirmation', DeliveryConfirmationSchema);
