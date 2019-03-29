'use strict'

module.exports = function(app)
{
	var superiorRoutes = require('../controllers/superiorController');

	app.route('/getCompanies')
		.post(superiorRoutes.get_companies_id);
};
