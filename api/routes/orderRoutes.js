'use strict';
module.exports = function(app)
{
  var orderRoutes = require('../controllers/orderController');

  // orderRoutes Routes
  app.route('/orders')
    .get(orderRoutes.list_all_orders)
    .post(orderRoutes.create_a_orders);

  app.route('/ordersby_company/:companyID')
    .get(orderRoutes.list_all_orders_by_company);

  app.route('/orders/find_by_status')
	 .post(orderRoutes.find_by_status);

  app.route('/orders/find_by_status_with_nodelivery')
	 .post(orderRoutes.find_by_status_with_nodelivery);

  app.route('/orders/:ordersId')
    .get(orderRoutes.read_a_orders)
    .put(orderRoutes.update_a_orders)
    .delete(orderRoutes.delete_a_orders);

	app.route('/orders/getVehicleOrders/:vehiclesId')
		.get(orderRoutes.getVehicleOrders);
  app.route('/orders/getVehicleOrdersReceived/:vehiclesId')
  	.get(orderRoutes.getVehicleOrdersReceived);
  app.route('/orders/getVehicleOrdersInprogress/:vehiclesId')
    .get(orderRoutes.getVehicleOrdersInprogress);
};
