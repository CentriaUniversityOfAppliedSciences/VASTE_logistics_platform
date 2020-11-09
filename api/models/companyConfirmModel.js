'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanyConfirmSchema = new Schema ({

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
	companyType:{//yrityksen tyyppi
		type: String,
		enum: ["store", "transport"],
		default: "transport"
	},
	userID:{
		type: String,
		required: 'Please enter your user name here',
		unique: true
	},
	passWord:{
		type: String,
		required: 'Please enter your password here'
	},
	status:{
		type: String,
		enum: ['customer', 'operator','superoperator', 'driver','apiuser'],
	     default: 'customer'
	},
	userInformation:{
		userName:{
	           type: String,
	           required: 'Please enter your name'
		},
		userCompany:{
			type: String
		},
		userPhone:{
			type: String,
			required:'Please enter your phone number'
		},
		userAddress:{
			type: String,
			required: 'Please enter your address here'
		},
		userMail:{
			type: String,
			required: 'Please enter your email here'
		},
	},
	confirmStatus:{
		type: String,
		enum: ['pending', 'approved', 'denied'],
			 default: 'pending'
	}
});

module.exports = mongoose.model('companyConfirms', CompanyConfirmSchema);
