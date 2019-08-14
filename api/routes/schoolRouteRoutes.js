'use strict';
module.exports = function(app)
{
  var schoolRoutes = require('../controllers/schoolRouteController');

  // dcRoutes Routes
  app.route('/schoolRouteModels')
    .post(schoolRoutes.list_all_routes);
  app.route('/createSchoolRouteModel')
    .post(schoolRoutes.create_a_route);
	app.route('/getDailySchoolRoute')
		.post(schoolRoutes.list_day_route);

};
