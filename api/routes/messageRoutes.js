'use strict';
module.exports = function(app)
{
  var messageRoutes = require('../controllers/messageController');

  // messageRoutes Routes
  app.route('/messages/create_message')
    .post(messageRoutes.create_a_messages);

  app.route('/messages/find_message_by_order')
	.post(messageRoutes.find_message_by_ID);

};
