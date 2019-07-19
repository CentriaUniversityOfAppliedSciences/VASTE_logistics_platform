'use strict';
module.exports = function(app)
{
  var schoolDaily = require('../controllers/schoolDailyController');

  // schoolDaily Routes
  app.route('/getschoolDailys')
    .post(schoolDaily.list_all_routes);
  app.route('/createSchoolDaily')
    .post(schoolDaily.create_a_route);
};
