'use strict';
module.exports = function(app) 
{
  var pointRoutes = require('../controllers/pointController');

  // pointRoutes Routes
  app.route('/points')
    .get(pointRoutes.list_all_points)
    .post(pointRoutes.create_a_points)
	.post(pointRoutes.find_point_by_ID);

	


  app.route('/points/:pointsId')
    .get(pointRoutes.read_a_points)
    .put(pointRoutes.update_a_points)
    .delete(pointRoutes.delete_a_points);
};