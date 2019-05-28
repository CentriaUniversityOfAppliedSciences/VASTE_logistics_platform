'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderStatusSchema = new Schema ({


	OrderNumber:{ // order _id
        type: String
    },
    StripeID:{ //stripe ch_xxxxxxx or pi_xxxxxxxxxx
        type: String
    },
    OrderConfirmed:{ // 1 = charge uncaptured, 2 = charge captured, 3 = charge cancelled
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
