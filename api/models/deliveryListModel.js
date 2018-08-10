'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliveryListSchema = new Schema ({


deliveryList:{
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
				orderID:{
					type: Number,
					required:'Kindly enter #'
				}
			}
		],
		companyID:
		{
			type: String,
			default: "1"
		},
		timestamp:
		{
			type: Date,
			default: Date.now
		}
	}
	
});

module.exports = mongoose.model('DeliveryLists', DeliveryListSchema);