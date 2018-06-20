'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliverySchema = new Schema ({
	
	vehicleID:{
		type: String,
		required: 'Please set the vehicleID'
		},
		
	orderID:{
		type: String,
		required: 'Please set the orderID'
		},
		
	deliveryID:{
		type: String		
		},	
	
	time:{
		pickupTime:{
			type: Number
			
		},
		deliveryTime:{
			type: Number
			
		},
	},
		
	status: {			//tilan seuranta
    
      type: String,
      enum: ['received', 'inProgress', 'done'],
      default: ['received']
   }
   
	

});

module.exports = mongoose.model('Deliverys', DeliverySchema);