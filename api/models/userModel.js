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
		required: 'Please enter your pass word here'
	},
	
	userInformation:{
		userName:{		
            type: String,
            required: 'Please enter your name' 
		},
		userphoneNumber:{			
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