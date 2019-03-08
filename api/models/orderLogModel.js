'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderLogSchema = new Schema ({

  user:{ //userID who did something
    type: String
  },
  ip:{ //ip of connection
    type: String
  },
  timestamp:{ //when happened
    type: Number
  },
  code:{ //what happened
    type: String,
    enum: ['customer_created', 'operator_created', 'operator_delivery', 'driver_accept', 'driver_cancel', 'driver_pickup','driver_delivery','operator_cancel', 'operator_archive_1', 'operator_archive_2'],
		default: ['customer_created']
  },
  orderID:{ // order mongo _id
    type: String
  },
  deliveryID:{ //delivery mongo _id
    type: String
  },
  companyID:{ //company mongo _id
    type: String
  },
  vehicleID: //vehicle mongo _id
  {
      type: String
  }
});

module.exports = mongoose.model('orderLog', orderLogSchema);
