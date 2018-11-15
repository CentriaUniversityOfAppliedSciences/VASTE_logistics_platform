'use strict';
module.exports = function(app)
{
  var userRoutes = require('../controllers/inUseController');

  app.route('/inuse')
    .get(userRoutes.list_all)
    .post(userRoutes.create);
  app.route('/inuseupdate')
    .post(userRoutes.update);
};
