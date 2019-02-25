'use strict';
module.exports = function(app)
{
  var orderExtraRoutes = require('../controllers/orderExtraController');
    app.route('/getorderExtra')
      .post(orderExtraRoutes.list_all_oe);
    app.route('/createorderExtra')
      .post(orderExtraRoutes.create_a_oe);
    app.route('/orderExtraUpdate')
      .post(orderExtraRoutes.update_a_oe);
    app.route('/orderExtraRemove')
      .post(orderExtraRoutes.delete_a_oe);
    app.route('/getOrdersExtra')
      .post(orderExtraRoutes.list_all_order_oe);

};
