'use strict';
module.exports = function(app)
{
  var dcRoutes = require('../controllers/deliveryConfirmationController');

  // dcRoutes Routes
  app.route('/dc')
    .get(dcRoutes.list_all_confirmations)
    .post(dcRoutes.create_a_confirmation);
  app.route('/dc/:deliveryID')
  	.get(dcRoutes.finddc);

};
