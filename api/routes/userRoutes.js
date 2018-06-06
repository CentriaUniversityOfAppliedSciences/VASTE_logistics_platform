'use strict';
module.exports = function(app) 
{
  var userRoutes = require('../controllers/userController');

  // userRoutes Routes
  app.route('/users')
    .get(userRoutes.list_all_users)
    .post(userRoutes.create_a_users);
	
  app.route('/users/find_user_by_ID')
	.post(userRoutes.find_user_by_ID);

  app.route('/users/:usersId')
    .get(userRoutes.read_a_users)
    .put(userRoutes.update_a_users)
    .delete(userRoutes.delete_a_users);
};