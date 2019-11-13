'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfirmSchema = new Schema ({

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
	confirmStatus:{
		type: String,
		enum: ['pending', 'approved', 'denied'],
      default: 'pending'
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

	}

});

module.exports = mongoose.model('confirmUsers', ConfirmSchema);
