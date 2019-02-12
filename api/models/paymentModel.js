'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema ({

	paymentType:{  //kilometers,weight, person, hinnoittelu tyyppi/ peruste, kilometri, paino, kuutio, henkilö
		type: String,
	},
	scale:{
		type: String,
		enum: ['0-10','10-25','25-100', 'over 100'],
			default: ['0-10'],
	},
	amount:{
		type: Number,
		required: 'Please give amount for the scale'
	},
	companyID:{
		type: String,
	},

	beginTime:{
		type: Number,
		required: 'Please set the date and time when the payment is valid (epoch)'
	},
	endTime:{
		type: Number,
		required: 'Please set the date and time when the payment time ends (epoch)'
	}

});
module.exports = mongoose.model('Payments', PaymentSchema);
