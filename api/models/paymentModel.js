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
	
	deliveryId:{
		type: String,
	},
		
	company:{
		type: String,
	},
	validityTime:{		
			vBegin:{
				type: Number,
			required: 'Please set the date and time when the payment is valid'
			},
			vEnd:{
				type: Number,
			required: 'Please set the date and time when the payment time ends'
			}
	}
});
module.exports = mongoose.model('Payments', PaymentSchema);