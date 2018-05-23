'use strict';
module.exports = function(app) 
{
  var vehicleRoutes = require('../controllers/vehicleController');

  // carRoutes Routes
  app.route('/vehicles')
    .get(vehicleRoutes.list_all_vehicles)
    .post(vehicleRoutes.create_a_vehicles);


  app.route('/vehicles/:vehiclesId')
    .get(vehicleRoutes.read_a_vehicles)
    .put(vehicleRoutes.update_a_vehicle)
    .delete(vehicleRoutes.delete_a_vehicles);
};