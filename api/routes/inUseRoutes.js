'use strict';
module.exports = function(app)
{
  var userRoutes = require('../controllers/inUseController');

  app.route('/inuse')
    .post(userRoutes.create);
  app.route('/inuselist')
    .post(userRoutes.list_all);
  app.route('/inuseupdate')
    .post(userRoutes.update);
};
