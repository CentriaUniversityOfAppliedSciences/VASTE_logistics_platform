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
		}

});

module.exports = mongoose.model('Companys', CompanySchema);