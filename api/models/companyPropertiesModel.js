'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanyPropertiesSchema = new Schema ({
  companyID:{ //Mongodb _id from Companys-table
    type: String,
    required: 'Kindly enter companyID'
  },
  type: {			//type of property
		type: String,
		enum: ['webhook', 'webpage', 'api', 'apikey', 'tempkey','stripe', 'superior'],
		default: 'webhook',
    required:'Kindly enter type of property'
   },
   value:{ //value of property
     type: String,
     required:'Kindly enter value of property'
   },
   timestamp: //timestamp when created
   {
     type: Date,
     default: Date.now
   }

});

module.exports = mongoose.model('CompanyProperties', CompanyPropertiesSchema);
