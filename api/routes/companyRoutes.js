'use strict';
module.exports = function(app) 
{
  var companyRoutes = require('../controllers/companyController');

  // companyRoutes Routes
  app.route('/companys')
    .get(companyRoutes.list_all_companys)
    .post(companyRoutes.create_a_companys);
	
  app.route('/companys/find_company_by_ID')
	.post(companyRoutes.find_company_by_ID);

	
  app.route('/companys/:companysId')
    .get(companyRoutes.read_a_companys)
    .put(companyRoutes.update_a_companys)
    .delete(companyRoutes.delete_a_companys);
};