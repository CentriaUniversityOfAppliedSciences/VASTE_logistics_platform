'use strict';
module.exports = function(app) 
{
  var lockerRoutes = require('../controllers/lockerController');

  // lockerRoutes Routes
  app.route('/lockers')
    .get(lockerRoutes.list_all_lockers)
    .post(lockerRoutes.create_a_lockers);
	
  app.route('/lockers/find_locker_by_ID')
	.post(lockerRoutes.find_locker_by_ID);
	
  app.route('/lockers/find_by_pointID')
	.post(lockerRoutes.find_by_pointID);

	  app.route('/lockers/find_by_status')
	.post(lockerRoutes.find_by_status);
	
  app.route('/lockers/:lockersId')
    .get(lockerRoutes.read_a_lockers)
    .put(lockerRoutes.update_a_lockers)
    .delete(lockerRoutes.delete_a_lockers);
};