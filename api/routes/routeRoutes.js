'use strict';
module.exports = function(app)
{
  var routeRoutes = require('../controllers/routeController');

  // routeRoutes Routes
  app.route('/routes')
    .get(routeRoutes.list_all_routes)
    .post(routeRoutes.create_a_routes);

	app.route('/listAllRoutes')
		.post(routeRoutes.list_all_routes)

 //app.route('/routes/find_by_ID')
//	.post(routeRoutes.find_by_ID);


  app.route('/routes/:routeId')
    .get(routeRoutes.read_a_routes)
    .put(routeRoutes.update_a_routes)
    .delete(routeRoutes.delete_a_routes);

  app.route('/getCompanyRoutes')
    .get(routeRoutes.getCompanyRoutes);
  app.route('/createNewRoute')
    .post(routeRoutes.create_a_routes);
	app.route('/deleteRoute')
		.post(routeRoutes.delete_a_routes);



};
