'use strict';
module.exports = function(app)
{
  var deliveryListRoutes = require('../controllers/deliveryListController');

  // deliveryListRoutes DeliveryLists
  app.route('/deliveryLists')
    .get(deliveryListRoutes.list_all_deliveryLists)
    .post(deliveryListRoutes.create_a_deliveryLists);

 //app.route('/deliveryLists/find_by_ID')
//	.post(deliveryListRoutes.find_by_ID);


  app.route('/deliveryList/:deliveryListId')
    .get(deliveryListRoutes.read_a_deliveryLists)
    .put(deliveryListRoutes.update_a_deliveryLists)
    .delete(deliveryListRoutes.delete_a_deliveryLists);
	app.route('/deliveryListForVehicle')
		.post(deliveryListRoutes.getDeliveryListsForVehicle);
};
