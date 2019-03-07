'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderStatusSchema = new Schema ({


	OrderNumber:{
        type: String
    },
    StripeID:{
        type: String
    },
    OrderConfirmed:{
        type: Number
    },
    OrderPaid:{
        type: Number
    },
    CompanyID:{
        type: String
    }

});
module.exports = mongoose.model('OrderStatus', OrderStatusSchema);
