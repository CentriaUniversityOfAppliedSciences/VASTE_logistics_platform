'use strict';
module.exports = function(app)
{
  var lockerRoutes = require('../controllers/lockerController');

  // lockerRoutes Routes
  app.route('/lockers')
    .get(lockerRoutes.list_all_lockers)
    .post(lockerRoutes.create_a_lockers);


  app.route('/book_a_locker')
    .post(lockerRoutes.book_a_locker);
  app.route('/unbook_a_locker')
    .post(lockerRoutes.unbook_a_locker);
  app.route('/get_locker_pin')
    .post(lockerRoutes.get_locker_pin);

};
