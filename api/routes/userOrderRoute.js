'use strict';
module.exports = function(app)
{
  var userOrderRoutes = require('../controllers/userOrderController');

  // userOrdersRoutes Routes
  app.route('/usersorder')
    .post(userOrderRoutes.list_user_order);
  app.route('/createusersorder')
    .post(userOrderRoutes.create_user_order);
  app.route('/removeusersorder')
    .post(userOrderRoutes.remove_user_order);
  app.route('/getuserorderlist')
    .post(userOrderRoutes.get_user_orders);



};
