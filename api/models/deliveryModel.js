'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliverySchema = new Schema ({
	
	vehicleID:{
		type: String
		},
		
	orderID:{
		type: String
		},
	
	time:{
		pickupTime:{
			type: Number,
			required: 'Please set the date and time when the order is laden '
			},
		deliveryTime:{
			type: Number,
			required: 'Please set the date and time when the order is delivered'
			},
		},
		
	status: {			//tilan seuranta
    type: [{
      type: String,
      enum: ['received', 'inProgress', 'done']
    }],
    default: ['received']
   },

});

module.exports = mongoose.model('Deliverys', DeliverySchema);