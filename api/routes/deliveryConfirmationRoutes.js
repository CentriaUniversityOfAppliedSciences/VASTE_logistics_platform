'use strict';
module.exports = function(app)
{
  var dcRoutes = require('../controllers/deliveryConfirmationController');

  // dcRoutes Routes
  app.route('/dc')
    .get(dcRoutes.list_all_confirmations);
  app.route('/getDeliveryConfirmation')
  	.post(dcRoutes.finddc);
  app.route('/createDeliveryConfirmation')
    .post(dcRoutes.create_a_confirmation);
  app.route('/getAppDeliveryConfirmation')
  	.post(dcRoutes.findappdc);
  app.route('/announceDeliveryConfirmation')
  	.post(dcRoutes.announcedc);

};
