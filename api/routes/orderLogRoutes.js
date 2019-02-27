'use strict';
module.exports = function(app)
{
  var ologRoutes = require('../controllers/orderLogController');

  app.route('/ologs')
    .get(ologRoutes.list_all_logs)
    .post(ologRoutes.create_a_log);
  app.route('/companyologs')
    .get(ologRoutes.list_company_logs);
  app.route('/createcompanyolog')
    .post(ologRoutes.create_company_log);
  app.route('/getsingleolog')
    .post(ologRoutes.get_single_log);

};
