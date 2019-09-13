'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var couponSchema = new Schema ({

  couponID:{ //coupon's id, used to fetch coupons
    type: String
  },
	redemptions:{ //amount of redemptions
		type: Number,
		default: '0'
	},
	max_redemptions:{ //maximum amount of allowed redemptions
		type: Number
	}
});

module.exports = mongoose.model('Coupons', couponSchema);
