'use strict';


var mongoose = require('mongoose'),
  Users = mongoose.model('Users');

exports.list_all_users = function(req, res) {
  Users.find({}, function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};


exports.create_a_users = function(req, res) {
  var new_users = new Users(req.body);
  new_users.save(function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};


exports.read_a_users = function(req, res) {
  Users.findById(req.params.usersId, function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};


exports.update_a_users = function(req, res) {
  Users.findOneAndUpdate({_id: req.params.usersId}, req.body, {new: true}, function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};


exports.delete_a_users = function(req, res) {
  Users.remove({_id: req.params.usersId}, function(err, users) {
    if (err)
      res.send(err);
    res.json({ message: 'Users successfully deleted' });
  });
}; 




