'use strict';
module.exports = function(app)
{
  var driverCRoutes = require('../controllers/driverCompaniesController');

  // DriverCompanies Routes
  app.route('/driverCompanies')
    .get(driverCRoutes.list_all)
    .post(driverCRoutes.create_a_connection);
  app.route('/getDriverCompanies/:driverID')
    .get(driverCRoutes.findDriver);

};
