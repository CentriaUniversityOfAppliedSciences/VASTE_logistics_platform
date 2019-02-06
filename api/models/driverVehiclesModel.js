'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DriverVehiclesSchema = new Schema({
    vehicleID:{ //_id from vehicles collection
      type: String,
      required: 'vehicleID required'
    },
    driverID:{ //_id from driver collection
      type: String,
      required: 'driverID required'
    }

});

module.exports = mongoose.model('DriverVehicles', DriverVehiclesSchema);
