'use strict';
module.exports = function(app)
{
  var driverVRoutes = require('../controllers/driverVehiclesController');

  // DriverVehicles Routes
  app.route('/driverVehicles')
    .get(driverVRoutes.list_all)
    .post(driverVRoutes.create_a_connection);
  app.route('/getDriverVehicles/:driverID')
    .get(driverVRoutes.findDriver);

};
