'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StripeSchema = new Schema({
    
    EventType:{
        type: String
    },
    CustomerID:{
        type: String
    },
    Paid:{
        type: Number
    },
    Amount:{
        type: Number
    },
    Currency:{
        type: String
    },
    Name:{
        type: String
    },
    CreatedOn:{
        type:Number
    }


});
module.exports = mongoose.model('Stripe', StripeSchema);