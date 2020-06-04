'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserOrderSchema = new Schema ({
  userID:{
    type: String,
  },
  orderID:{
    type:String
  },
	customerCompany:{
		type: String
	}
});

module.exports = mongoose.model('UserOrder', UserOrderSchema);
