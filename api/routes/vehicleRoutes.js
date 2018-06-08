'use strict';
module.exports = function(app) 
{
  var vehicleRoutes = require('../controllers/vehicleController');

  // carRoutes Routes
  app.route('/vehicles')
    .get(vehicleRoutes.list_all_vehicles)
    .post(vehicleRoutes.create_a_vehicles);
	
  app.route('vehicles/list_all_online')
	.post(vehicleRoutes.list_all_online)
	//.get(vehicleRoutes.list_all_online);

  app.route('vehicles/list_all_offline')
	.post(vehicleRoutes.list_all_offline)
	//.get(vehicleRoutes.list_all_offline);
	
  app.route('vehicles/list_all_booked')
	.post(vehicleRoutes.list_all_booked)
	//.get(vehicleRoutes.list_all_booked);
	
  app.route('vehicles/list_all_available')
	.post(vehicleRoutes.list_all_available)
	//.get(vehicleRoutes.list_all_available);

  app.route('/vehicles/:vehiclesId')
    .get(vehicleRoutes.read_a_vehicles)
    .put(vehicleRoutes.update_a_vehicle)
    .delete(vehicleRoutes.delete_a_vehicles);
};