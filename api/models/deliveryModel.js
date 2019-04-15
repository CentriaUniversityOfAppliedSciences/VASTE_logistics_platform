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
	time:{
		pickupTime:{
			type: Number

		},
		deliveryTime:{
			type: Number

		},
	},
	deliveryList:{
		type: String,
		default: "0"
	},
	status: {			//tilan seuranta

      type: String,
      enum: ['received', 'accepted', 'inProgress', 'cancelled', 'done', 'pickup_not_ready','pickup_ready','box_accepted','delivery_not_ready','delivery_ready','box_cancelled'],
      default: ['received']
   },
	 companyID:
	 {
		 type: String,
		 required: 'Missing companyID'
	 }



});

module.exports = mongoose.model('Deliverys', DeliverySchema);
