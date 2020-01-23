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
  app.route('/orders/updatePincode')
    .post(orderRoutes.updatePincode);
  app.route('/getBoxOrder')
    .post(orderRoutes.getAllForId2);
  app.route('/failedOrder')
    .post(orderRoutes.archive_a_failed_order);
  app.route('/orders/boxOrders')
    .post(orderRoutes.getVehicleOrdersBoxes);
    app.route('/orders/groupOrders')
      .post(orderRoutes.getVehicleOrdersGroup);
	app.route('/customerDeleteOrder')
		.post(orderRoutes.customer_archive_a_orders_removal);
	app.route('/getCompanyOrder')
		.post(orderRoutes.read_a_company_order);
	app.route('/getGroupFreeOrders')
		.post(orderRoutes.read_group_free_orders);
	app.route('/driverGetOrder')
		.post(orderRoutes.driver_read_a_company_order);
	app.route('/updateOrdersCompany')
		.post(orderRoutes.update_a_orders_company);




};
