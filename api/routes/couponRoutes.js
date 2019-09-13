'use strict';
module.exports = function(app)
{
  var couponRoutes = require('../controllers/couponController');

  // orderRoutes Routes
  app.route('/getCoupons')
    .post(couponRoutes.list_all_coupons);

	app.route('/updateCoupon')
		.post(couponRoutes.update_a_coupon);

	app.route('/createCoupon')
		.post(couponRoutes.create_a_coupon);

	app.route('/deleteCoupon')
		.post(couponRoutes.delete_a_coupon);

	app.route('/getSingleCoupon')
		.post(couponRoutes.find_a_coupon);

  };
