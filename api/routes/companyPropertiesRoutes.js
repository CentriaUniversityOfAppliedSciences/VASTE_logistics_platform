'use strict';
module.exports = function(app)
{
  var companyPropertiesRoutes = require('../controllers/companyPropertiesController');

  // companyPropertiesRoutes Routes
  app.route('/companyproperties')
    .get(companyPropertiesRoutes.list_all_properties)
    .post(companyPropertiesRoutes.create_a_property);

  app.route('/companyproperties/find_by_companyid')
  .post(companyPropertiesRoutes.find_by_companyid);

	app.route('/getCompanyApi')
		.post(companyPropertiesRoutes.find_by_companyid_and_type);

  app.route('/companyproperties/:propertyid')
    .put(companyPropertiesRoutes.update_a_property)
    .delete(companyPropertiesRoutes.delete_a_property);

  app.route('/companybyapi')
    .post(companyPropertiesRoutes.find_company_by_apikey);
  app.route('/companybytempkey')
    .post(companyPropertiesRoutes.find_company_by_tempkey);

};
