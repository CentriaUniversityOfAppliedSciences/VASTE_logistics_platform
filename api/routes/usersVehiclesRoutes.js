'use strict';
module.exports = function(app)
{
  var usersCarsRoutes = require('../controllers/usersVehiclesController');

	app.route('/createNewCarLink')
		.post(usersCarsRoutes.link_new_user);

	app.route('/getDriversCars')
		.post(usersCarsRoutes.find_cars_by_userID);
}
