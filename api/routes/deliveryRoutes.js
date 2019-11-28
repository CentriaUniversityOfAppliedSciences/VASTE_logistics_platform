'use strict';
module.exports = function(app)
{
  var deliveryRoutes = require('../controllers/deliveryController');

  // deliveryRoutes Routes
  app.route('/deliverys')
    .get(deliveryRoutes.list_all_deliverys)
    .post(deliveryRoutes.create_a_deliverys);
  app.route('/deliveryByCompany')
    .get(deliveryRoutes.list_by_company);
  app.route('/findDeliveryById')
	.post(deliveryRoutes.find_delivery_by_ID);
  app.route('/findDeliveryByVehicle')
	.post(deliveryRoutes.list_by_vehicle);
  app.route('/findDeliveryByOrder')
	.post(deliveryRoutes.find_delivery_by_order);
  app.route('/createDelivery')
   .post(deliveryRoutes.create_a_deliverys);
	app.route('/createDriverDelivery')
		.post(deliveryRoutes.driver_create_a_deliverys);

  app.route('/find_by_status')
	.post(deliveryRoutes.find_by_status);


  app.route('/deliverys/:deliverysId')
    .get(deliveryRoutes.read_a_deliverys)
    .post(deliveryRoutes.update_a_deliverys)
    .delete(deliveryRoutes.delete_a_deliverys);

  app.route('/changeDeliveryStatus')
	 .post(deliveryRoutes.changeDeliveryStatus);
  app.route('/cancelDelivery')
 	 .post(deliveryRoutes.delete_a_deliverys);
  app.route('/cancelBoxDelivery')
  	.post(deliveryRoutes.delete_a_boxdeliverys);
  app.route('/cancelAddressDelivery')
    .post(deliveryRoutes.delete_a_addressdeliverys);


};
