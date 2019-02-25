'use strict';
module.exports = function(app)
{
  var logRoutes = require('../controllers/logController');

  app.route('/logs')
    .post(logRoutes.create_a_log);
  app.route('/getlogs')
    .get(logRoutes.list_all_logs);

};
