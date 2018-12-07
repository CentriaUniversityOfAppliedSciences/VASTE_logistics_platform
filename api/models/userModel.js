'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema ({

	userID:{
		type: String,
		required: 'Please enter your user name here'
	},

	passWord:{
		type: String,
		required: 'Please enter your password here'
	},
	status:{
		type: String,
		enum: ['customer', 'operator','superoperator', 'driver'],
      default: ['customer']
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
		}
	}

});

module.exports = mongoose.model('Users', UserSchema);
