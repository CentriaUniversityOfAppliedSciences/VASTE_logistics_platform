'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema ({

	type:{
		type: Number
		//0: box2box, 1: storage, 2: door2box, 3: box2door, 4: address2address
	},
	amount:{
		type: Number
	},
	companyID:{
		type: String
	},
	weekDay:{
		type: String
		//0 - 6, sunday - saturday
	},
	route:{
		type: String
	},
	routeID:{
		type:String
	}


});
module.exports = mongoose.model('Payments', PaymentSchema);
