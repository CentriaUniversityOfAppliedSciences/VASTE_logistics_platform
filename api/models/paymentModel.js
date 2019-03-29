'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema ({

	/*paymentType:{  //kilometers,weight, person, hinnoittelu tyyppi/ peruste, kilometri, paino, kuutio, henkilö
		type: String,
	},
	scale:{
		type: String,
		enum: ['0-10','10-25','25-100', 'over 100'],
			default: ['0-10'],
	},*/
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

	/*beginTime:{
		type: Number,
		required: 'Please set the date and time when the payment is valid (epoch)'
	},
	endTime:{
		type: Number,
		required: 'Please set the date and time when the payment time ends (epoch)'
	}*/

});
module.exports = mongoose.model('Payments', PaymentSchema);
