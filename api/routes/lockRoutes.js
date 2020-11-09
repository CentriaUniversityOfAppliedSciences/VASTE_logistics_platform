'use strict';
module.exports = function(app)
{
  var lockRoutes = require('../controllers/lockController');

  // lockerRoutes Routes
  app.route('/lock')
    .post(lockRoutes.createCodeMinutes);


};
