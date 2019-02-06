'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DriverCompaniesSchema = new Schema({
    driverID:{ //_id from users collection
      type: String,
      required: 'driverID required'
    },
    companyID:{ //_id from companies collection
      type: String,
      required: 'companyID required'
    }

});

module.exports = mongoose.model('DriverCompanies', DriverCompaniesSchema);
