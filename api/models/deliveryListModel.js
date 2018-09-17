'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliveryListSchema = new Schema ({



		list:
		[	
			{
				orderNumber:{
					type: String,
					required:'Kindly enter orderNumber'
				},
				address:{
					type: String,
					required:'Kindly enter address'
					
				},
				number:{ //order of list, first address of list is 1 -> 
					type: Number,
					required:'Kindly enter #'
				},
				type:{
					type: String,
					required: 'Kindly enter 1 for pickup or 0 for delivery'
				}
			}
		],
		companyID:
		{
			type: String,
			default: "0"
		},
		timestamp:
		{
			type: Date,
			default: Date.now
		},
		name:
		{
			type: String,
			default: ""
		},
		vehicleId:
		{
			type: String,
			default: ""
		}
	
	
});

module.exports = mongoose.model('DeliveryLists', DeliveryListSchema);