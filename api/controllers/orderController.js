'use strict';


var mongoose = require('mongoose'),
  Orders = mongoose.model('orders');

exports.list_all_orders = function(req, res) {
  Orders.find({}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};




exports.create_a_orders = function(req, res) {
  var new_orders = new Orders(req.body);
  new_orders.save(function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};


exports.read_a_orders = function(req, res) {
  Orders.findById(req.params.ordersId, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};


exports.update_a_orders = function(req, res) {
  Orders.findOneAndUpdate({_id: req.params.ordersId}, req.body, {new: true}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};


exports.delete_a_orders = function(req, res) {


  Orders.remove({
    _id: req.params.ordersId
  }, function(err, orders) {
    if (err)
      res.send(err);
    res.json({ message: 'Orders successfully deleted' });
  });
};


