'use strict';
module.exports = function(app)
{
  var stripeRoutes = require('../controllers/stripeController');

  // orderRoutes Routes
  app.route('/stripemessage')
    .post(stripeRoutes.create_stripe);

  };
