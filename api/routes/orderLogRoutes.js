'use strict';
module.exports = function(app)
{
  var ologRoutes = require('../controllers/orderLogController');

  app.route('/ologs')
    .get(ologRoutes.list_all_logs)
    .post(ologRoutes.create_a_log);

};
