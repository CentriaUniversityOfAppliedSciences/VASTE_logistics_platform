'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderStatusSchema = new Schema ({


	OrderNumber:{ // order _id
        type: String
    },
    StripeID:{ //stripe ch_xxxxxxx
        type: String
    },
    OrderConfirmed:{
        type: Number
    },
    OrderPaid:{ // in cents
        type: Number
    },
    CompanyID:{ //company _id
        type: String
    }

});
module.exports = mongoose.model('OrderStatus', OrderStatusSchema);
