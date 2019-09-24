'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliveryConfirmationSchema = new Schema ({

	orderID:{
		type: String,
		required: 'Please set the orderID'
	},
	pin:
	{
		type:String,
		required: 'Missing pin'
	},
	status:
	{
		type:String,
		enum: ['initial','announced','verified'], //created, send to customer, customer used pin
		default: 'initial'
	},
	companyID:
	{
		type: String,
		required: 'Missing companyID'
	},
	type:
	{
		type:String,
		enum:['pickup','delivery'],
		default: 'delivery'
	}




});

module.exports = mongoose.model('DeliveryConfirmation', DeliveryConfirmationSchema);
