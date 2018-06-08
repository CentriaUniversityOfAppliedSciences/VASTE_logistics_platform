'use strict';
module.exports = function(app) 
{
  var pointRoutes = require('../controllers/pointController');

  // pointRoutes Routes
  app.route('/points')
    .get(pointRoutes.list_all_points)
    .post(pointRoutes.create_a_points);
	
  app.route('/points/find_point_by_ID')	
	.post(pointRoutes.find_point_by_ID);

  app.route('points/list_all_booked')
	.post(pointRoutes.list_all_booked);
	
  app.route('points/list_all_available')
	.post(pointRoutes.list_all_available);
	
  app.route('/points/:pointsId')
    .get(pointRoutes.read_a_points)
    .put(pointRoutes.update_a_points)
    .delete(pointRoutes.delete_a_points);
};