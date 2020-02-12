'use strict';
module.exports = function(app)
{
  var userConfirmRoutes = require('../controllers/userConfirmController');

	app.route('/newUserConfirm')
		.post(userConfirmRoutes.create_new_confirm);
	app.route('/getConfirm')
		.post(userConfirmRoutes.find_confirm);
	app.route('/deleteConfirm')
	 	.post(userConfirmRoutes.delete_confirm);
	app.route('/listCompanyConfirms')
		.post(userConfirmRoutes.list_company_driver_confirms);
	app.route('/updateConfirm')
		.post(userConfirmRoutes.update_confirm);

};
