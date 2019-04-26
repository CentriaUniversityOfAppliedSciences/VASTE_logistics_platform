'use strict';
module.exports = function(app)
{
  var pointRoutes = require('../controllers/pointController');

  // pointRoutes Routes
  app.route('/points')
    .get(pointRoutes.list_all_points)
    .post(pointRoutes.create_a_points);

  app.route('/points/getboxes')
	 .post(pointRoutes.listboxes);
  app.route('/points/getbox')
    .post(pointRoutes.listbox);
  app.route('/points/getById')
    .post(pointRoutes.getPointById);


};
