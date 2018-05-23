'use strict';
module.exports = function(app) 
{
  var orderRoutes = require('../controllers/orderController');

  // orderRoutes Routes
  app.route('/orders')
    .get(orderRoutes.list_all_orders)
    .post(orderRoutes.create_a_orders);


  app.route('/orders/:ordersId')
    .get(orderRoutes.read_a_orders)
    .put(orderRoutes.update_a_orders)
    .delete(orderRoutes.delete_a_orders);
};