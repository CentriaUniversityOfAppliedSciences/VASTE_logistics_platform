'use strict';
var mongoose = require('mongoose'),
OrderStatus = mongoose.model('OrderStatus');

exports.list_all_orderStatus = function(req, res) {
    OrderStatus.find({}, function(err, OrderStatus) {
      if (err)
        res.send(err);
      res.json(OrderStatus);
    });
  };
  exports.find_orderStatus_by_ID = function(req, res) {
    OrderStatus.findOne({OrderNumber: req.body.OrderNumber}, function(err, OrderStatus) {
      if (err)
        res.send(err);
      res.json(OrderStatus);
    });
  };
exports.create_OrderStatus = function(req, res){
  var new_OrderStatus = new OrderStatus(req.body);
  new_OrderStatus.save(function(err, OrderStatus) {
    if (err)
      res.send(err);
    res.json(OrderStatus);
  });
};
exports.update_OrderStatus = function(req, res){
  OrderStatus.findOneAndUpdate({OrderNumber: req.body.OrderNumber}, {OrderConfirmed:req.body.status}, {new: true}, function(err, OrderStatus) {
    if (err)
      res.send(err);
    res.json(OrderStatus);
  });
};
exports.delete_OrderStatus = function(req, res){
  OrderStatus.remove({OrderNumber: req.body.OrderNumber}, function(err, OrderStatus) {
    if (err)
      res.send(err);
    res.json({ OrderStatus: 'OrderStatus successfully deleted' });
  });
};
exports.get_OrderStatus = function(req, res){
  OrderStatus.findById(req.body.id, function(err, OrderStatus) {
    if (err)
      res.send(err);
    res.json(OrderStatus);
  });
};
