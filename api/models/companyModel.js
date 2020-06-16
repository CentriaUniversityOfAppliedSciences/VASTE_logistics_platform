'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema ({

	companyName:{
		type: String,
		required:'Company name'
		},

	companyAddress:{
		type: String,
		required:'Company address'
		},

	companyID:{ //y-tunnus
		type: String
	},
	link:{
		type: String
	},
	type:{
		type: String,
		enum: ['shop','transport'],
		default: 'transport'
	}
});

module.exports = mongoose.model('Companys', CompanySchema);
