'use strict';
module.exports = function(app){
    var orderStatusRoutes = require('../controllers/orderStatusController');

    app.route('/orderstatus')
      .post(orderStatusRoutes.list_all_orderStatus);

    app.route('/orderstatus/create')
      .post(orderStatusRoutes.create_OrderStatus);

    app.route('/orderstatus/find_orderstatus_by_ID')
      .post(orderStatusRoutes.find_orderStatus_by_ID);

    app.route('/orderstatus/update_orderstatus_by_ID')
      .post(orderStatusRoutes.update_OrderStatus);

}
