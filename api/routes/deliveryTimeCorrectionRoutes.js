'use strict';
module.exports = function(app)
{
  var dtcRoutes = require('../controllers/DeliveryTimeCorrectionController');

  // dtcRoutes Routes
  app.route('/dtc')
    .get(dtcRoutes.list_all_corrections)
    .post(dtcRoutes.create_a_correction);
  app.route('/dtc/:deliveryID')
  	.get(dtcRoutes.finddtc);

};
