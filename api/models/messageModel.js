'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema ({

	messageId:{
		type: String,
	},
	
	phoneNumber:{
		type: String,	
	},
	messageTime:{
		type: String,
	},
	messageContent:{
		type: String,
		required:' message to receiver'
	},
	deliveryId:{
		type: String
	}


});

module.exports = mongoose.model('Messages', MessageSchema);
