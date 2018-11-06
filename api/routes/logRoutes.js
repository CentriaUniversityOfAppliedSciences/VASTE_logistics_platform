'use strict';
module.exports = function(app)
{
  var logRoutes = require('../controllers/logController');

  app.route('/logs')
    .get(logRoutes.list_all_logs)
    .post(logRoutes.create_a_log);

};
