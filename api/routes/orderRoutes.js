'use strict';
module.exports = function(app)
{
  var orderRoutes = require('../controllers/orderController');

  // orderRoutes Routes
  app.route('/orders')
    .get(orderRoutes.list_all_orders)
    .post(orderRoutes.create_a_orders);

  app.route('/ordersby_company')
    .get(orderRoutes.list_all_orders_by_company);

  app.route('/orders/find_by_status')
	 .post(orderRoutes.find_by_status);

  app.route('/orders/find_by_status_with_nodelivery')
	 .post(orderRoutes.find_by_status_with_nodelivery);

  app.route('/orders/:ordersId')
    .get(orderRoutes.read_a_orders)
    .put(orderRoutes.update_a_orders);

app.route('/updateOrder')
    .post(orderRoutes.update_a_orders);

app.route('/deleteOrder')
		.post(orderRoutes.archive_a_orders_removal);

	app.route('/orders/getVehicleOrders')
		.post(orderRoutes.getVehicleOrders);
  app.route('/orders/getVehicleOrdersReceived')
  	.post(orderRoutes.getVehicleOrdersReceived);
  app.route('/orders/getVehicleOrdersInprogress')
    .post(orderRoutes.getVehicleOrdersInprogress);
  app.route('/orders/getOrder/:ordersId')
    .get(orderRoutes.getAllForId);
  app.route('/orders/createapiorder')
    .post(orderRoutes.create_a_orders);
  app.route('/createsingleorder')
    .post(orderRoutes.create_a_orders);
  app.route('/orders/getapiorder')
    .post(orderRoutes.get_api_order);
  app.route('/orders/getSingleOrder')
    .post(orderRoutes.getAllForId);
  app.route('/getSingleOrder')
    .get(orderRoutes.read_single_order);
  app.route('/getSeuraaOrder')
    .post(orderRoutes.read_a_orders);
  app.route('/orders/change_order_status')
    .post(orderRoutes.change_order_status);

};
