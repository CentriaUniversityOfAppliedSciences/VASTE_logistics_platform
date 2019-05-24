'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema ({

	timestamp:{
		type: String,
	},
	receiver:{
		type: String
	},
	orderID:{
		type: String
	},
	companyID:
	{
		type: String,
		required: 'Missing companyID'
	}


});

module.exports = mongoose.model('Messages', MessageSchema);
