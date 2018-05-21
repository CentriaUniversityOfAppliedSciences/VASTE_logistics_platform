'use strict';
module.exports = function(app) {
  var carRoutes = require('../controllers/carRoutesControllers');

  // carRoutes Routes
  app.route('/cars')
    .get(carRoutes.list_all_cars)
    .post(carRoutes.create_a_cars);


  app.route('/cars/:carsId')
    .get(carRoutes.read_a_cars)
    .put(carRoutes.update_a_cars)
    .delete(carRoutes.delete_a_cars);
};