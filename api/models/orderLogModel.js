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
    enum: ['customer_created', 'operator_created', 'operator_delivery', 'driver_accept', 'driver_cancel', 'driver_pickup','driver_delivery',
    'operator_cancel', 'operator_archive_1', 'operator_archive_2','box_accepted','box_cancelled', 'pickup_not_ready', 'pickup_ready',
		'delivery_ready','delivery_not_ready','failed_box_order_archive_3','order_status_change','terminal_stop','terminal_start','box_auto', 'customer_archive_2',
    'stowage_not_ready','stowage_ready','address_pickup_start','address_pickup_accepted','address_pickup_done','address_delivery_not_ready'],
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
