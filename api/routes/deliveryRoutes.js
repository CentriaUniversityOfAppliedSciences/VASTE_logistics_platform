'use strict';
module.exports = function(app) 
{
  var deliveryRoutes = require('../controllers/deliveryController');

  // deliveryRoutes Routes
  app.route('/deliverys')
    .get(deliveryRoutes.list_all_deliverys)
    .post(deliveryRoutes.create_a_deliverys)
	.post(deliveryRoutes.find_delivery_by_ID);

	


  app.route('/deliverys/:deliverysId')
    .get(deliveryRoutes.read_a_deliverys)
    .put(deliveryRoutes.update_a_deliverys)
    .delete(deliveryRoutes.delete_a_deliverys);
};