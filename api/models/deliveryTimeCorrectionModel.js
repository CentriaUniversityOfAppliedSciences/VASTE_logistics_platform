'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliveryTimeCorrectionSchema = new Schema ({

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
	estimate:{
		type: Number,
		required: 'Please set the estimated arrival'
	},
	delay:{
		type: Number,
		required: 'Please set the delay from estimated arrival'
	},
	companyID:
	{
		type: String,
		required: 'Missing companyID'
	}



});

module.exports = mongoose.model('DeliveryTimeCorrection', DeliveryTimeCorrectionSchema);
