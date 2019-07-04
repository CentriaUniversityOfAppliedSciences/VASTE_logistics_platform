'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema ({

	type:{
		type: Number
		//0: box2box, 1: door2box, 2: box2door jne
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
	}


});
module.exports = mongoose.model('Payments', PaymentSchema);
