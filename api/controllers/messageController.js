'use strict';


var mongoose = require('mongoose'),
  Messages = mongoose.model('Messages');

exports.list_all_messages = function(req, res) {
  Messages.find({}, function(err, ) {
    if (err)
      res.send(err);
    res.json(messages);
  });
};


exports.create_a_messages = function(req, res) {
  var new_messages = new Messages(req.body);
  new_messages.save(function(err, messages) {
    if (err)
      res.send(err);
    res.json(messages);
  });
};


exports.read_a_messages = function(req, res) {
  Messages.findById(req.params.messagesId, function(err, messages) {
    if (err)
      res.send(err);
    res.json(messages);
  });
};


exports.update_a_messages = function(req, res) {
  Messages.findOneAndUpdate({_id: req.params.messagesId}, req.body, {new: true}, function(err, messages) {
    if (err)
      res.send(err);
    res.json(messages);
  });
};


exports.delete_a_messages = function(req, res) {
  Messages.remove({_id: req.body.id}, function(err, messages) {
    if (err)
      res.send(err);
    res.json({ message: 'Messages successfully deleted' });
  });
};

exports.find_message_by_ID = function(req, res) {
  Messages.find({orderID: req.body.orderID}, function(err, messages) {
    if (err)
      res.send(err);
    res.json(messages );
  });
};
