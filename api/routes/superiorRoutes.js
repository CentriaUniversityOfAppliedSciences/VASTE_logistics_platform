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

	app.route('/superCreateSinglePayment')
		.post(superiorRoutes.super_create_a_payments);

	app.route('/superDeletePayment')
		.post(superiorRoutes.super_delete_a_payment);

	app.route('/updateLockerPin2')
		.post(superiorRoutes.super_update_locker_pin2);

	app.route('/superGetLockerData')
		.post(superiorRoutes.super_get_locker_data);

	app.route('/superGetPointData')
		.post(superiorRoutes.super_list_all_points);

	app.route('/getKebaLockers')
		.post(superiorRoutes.get_locker_data_from_keba);

	app.route('/getCompaniesRoutes')
		.get(superiorRoutes.super_list_companies_routes);

	app.route('/superCreateRoute')
		.post(superiorRoutes.super_create_a_routes);

	app.route('/superDeleteRoute')
		.post(superiorRoutes.super_delete_a_routes);

	app.route('/superListApplicants')
		.post(superiorRoutes.super_list_companies_confirms);

	app.route('/superCancelAddressDelivery')
		.post(superiorRoutes.super_delete_a_addressdeliverys);

	app.route('/superEditOrder')
		.post(superiorRoutes.super_edit_a_order);

	app.route('/superGetCustomerUsers')
    .post(superiorRoutes.super_get_customers);
	app.route('/superGetCustomerCompanies')
	   .post(superiorRoutes.super_get_customer_companies);
	app.route('/superLinkCustomerCompany')
     .post(superiorRoutes.link_transport_company);
	app.route('/superCustomerCompanyLinkCheck')
	   .post(superiorRoutes.check_if_link_exists);
	app.route('/superGetTransporterLinks')
	   .post(superiorRoutes.get_transporter_links);
	app.route('/superDeleteLink')
	   .post(superiorRoutes.super_delete_a_link);
	app.route('/superCreateCompanyFromConfirm')
 		 .post(superiorRoutes.super_create_company_from_confirm);
	app.route('/superRemoveUnfinishedCompany')
		.post(superiorRoutes.super_delete_failed_confirm_company);




};
