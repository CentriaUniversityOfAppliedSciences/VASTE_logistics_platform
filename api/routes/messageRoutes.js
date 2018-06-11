'use strict';
module.exports = function(app) 
{
  var messageRoutes = require('../controllers/messageController');

  // messageRoutes Routes
  app.route('/messages')
    .get(messageRoutes.list_all_messages)
    .post(messageRoutes.create_a_messages);
	
  app.route('/messages/find_message_by_ID')
	.post(messageRoutes.find_message_by_ID);

  app.route('/findMessageByDelivery')
	.post(messageRoutes.find_message_by_delivery);
	
  app.route('/find_message_by_phoneNumber')
	.post(messageRoutes.find_message_by_phoneNumber);
	
  app.route('/messages/:messagesId')
    .get(messageRoutes.read_a_messages)
    .put(messageRoutes.update_a_messages)
    .delete(messageRoutes.delete_a_messages);
};