'use strict';
module.exports = function(app)
{
  var companyConfirmRoutes = require('../controllers/companyConfirmController');

	app.route('/newCompanyConfirm')
		.post(companyConfirmRoutes.create_new_company_confirm);
	app.route('/getPendingCompanyConfirms')
		.post(companyConfirmRoutes.list_company_confirms);
	app.route('/findCompanyConfirm')
		.post(companyConfirmRoutes.find_company_confirm);
	app.route('/updateCompanyConfirm')
		.post(companyConfirmRoutes.update_company_confirm);
};
