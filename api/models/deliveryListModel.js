'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliveryListSchema = new Schema ({


deliveryList:{
		list:
		[	{
				orderNumber:{
				type: String,
				},
				Address:{
				type: String,
				},
				orderID:{

				}
			}
		]
	}
	
});

module.exports = mongoose.model('DeliveryLists', DeliveryListSchema);