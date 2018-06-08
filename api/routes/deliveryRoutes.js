'use strict';
module.exports = function(app) 
{
  var deliveryRoutes = require('../controllers/deliveryController');

  // deliveryRoutes Routes
  app.route('/deliverys')
    .get(deliveryRoutes.list_all_deliverys)
    .post(deliveryRoutes.create_a_deliverys);
  app.route('/findDeliveryById')
	.post(deliveryRoutes.find_delivery_by_ID);
  app.route('/findDeliveryByVehicle')
	.post(deliveryRoutes.find_delivery_by_vehicle);
  app.route('/findDeliveryByOrder')
	.post(deliveryRoutes.find_delivery_by_order);
	
  app.route('/list_all_received')
	.post(deliveryRoutes.list_all_received);

  app.route('/list_all_inProgress')
	.post(deliveryRoutes.list_all_inProgress);
	
  app.route('/list_all_done')
	.post(deliveryRoutes.list_all_done);

  app.route('/deliverys/:deliverysId')
    .get(deliveryRoutes.read_a_deliverys)
    .put(deliveryRoutes.update_a_deliverys)
    .delete(deliveryRoutes.delete_a_deliverys);
};