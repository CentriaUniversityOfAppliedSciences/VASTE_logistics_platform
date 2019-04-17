'use strict'

module.exports = function(app)
{
	var superiorRoutes = require('../controllers/superiorController');

	app.route('/superDeleteVehicle')
		.post(superiorRoutes.super_delete_a_vehicle);

	app.route('/getCompanies')
		.post(superiorRoutes.get_company_id);

	app.route('/getCompaniesName')
		.post(superiorRoutes.get_company_name);

	app.route('/getCompaniesOrders')
		.post(superiorRoutes.get_companies_orders);

	app.route('/getCompaniesVehicles')
		.post(superiorRoutes.get_companies_vehicles);

	app.route('/getCompaniesDeliveries')
		.post(superiorRoutes.get_companies_deliveries);

	app.route('/getCompaniesLogs')
		.post(superiorRoutes.get_companies_logs);

	app.route('/getCompaniesDrivers')
		.post(superiorRoutes.get_companies_drivers);

	app.route('/superGetSingleOrder')
		.get(superiorRoutes.get_single_company_order);

	app.route('/superCreateDelivery')
		.post(superiorRoutes.super_create_a_deliverys);

	app.route('/superUpdateOrder')
		.post(superiorRoutes.super_update_a_order);

	app.route('/superCancelDelivery')
		.post(superiorRoutes.super_delete_a_delivery);

	app.route('/superDeleteOrder')
		.post(superiorRoutes.super_archive_a_orders_removal);

	app.route('/superDeliveryLists')
	   .post(superiorRoutes.super_create_a_deliveryLists);

	app.route('/getCompaniesPayments')
		.post(superiorRoutes.super_get_companies_payments);

	app.route('/superDeleteUser')
		.post(superiorRoutes.super_delete_a_user);

	app.route('/superCreateDriver')
		.post(superiorRoutes.super_create_a_user);

	app.route('/superAddVehicle')
		.post(superiorRoutes.super_create_a_vehicle);

	app.route('/superCancelBoxDelivery')
	 	.post(superiorRoutes.super_delete_a_boxdeliverys);


};
