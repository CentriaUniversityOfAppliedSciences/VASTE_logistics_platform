'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var OrderExtraSchema = new Schema({
  orderID: {
    type:String,
    required: 'Missing orderID'
  },
  value:{
    type:String,
    enum:['wheelchair','stretcher','cold','warm','normal'], //pyörätuoli,paari,kylmä,kuuma,normaali
    default: 'normal'
  },
  companyID:
  {
    type: String,
    required: 'Missing companyID'
  }


});

module.exports = mongoose.model('OrderExtra', OrderExtraSchema);
