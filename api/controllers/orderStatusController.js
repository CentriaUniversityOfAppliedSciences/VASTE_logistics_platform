'use strict';
var mongoose = require('mongoose'),
OrderStatus = mongoose.model('OrderStatus');

exports.list_all_orderStatus = function(req, res) {
    OrderStatus.find({}, function(err, os) {
      if (err)
        res.send(err);
      res.json(os);
    });
  };
  exports.list_by_company = function(req, res) {
      OrderStatus.find({CompanyID:req.body.companyID}, function(err, os) {
        if (err)
          res.send(err);
        res.json(os);
      });
    };
  exports.find_orderStatus_by_ID = function(req, res) {
    OrderStatus.findOne({OrderNumber: req.body.OrderNumber}, function(err, os) {
      if (err)
        res.send(err);
      res.json(os);
    });
  };
exports.create_OrderStatus = function(req, res){
  var new_OrderStatus = new OrderStatus(req.body);
  new_OrderStatus.save(function(err, os) {
    if (err)
      res.send(err);
    res.json(os);
  });
};
exports.update_OrderStatus = function(req, res){
  OrderStatus.findOneAndUpdate({OrderNumber: req.body.OrderNumber}, {OrderConfirmed:req.body.status}, {new: true}, function(err, os) {
    if (err)
      res.send(err);
    res.json(os);
  });
};
exports.delete_OrderStatus = function(req, res){
  OrderStatus.deleteMany({OrderNumber: req.body.OrderNumber}, function(err, os) {
    if (err)
      res.send(err);
    res.json({"status" : 'OrderStatus successfully deleted' });
  });
};
exports.get_OrderStatus = function(req, res){
  OrderStatus.findById(req.body.id, function(err, os) {
    if (err)
      res.send(err);
    res.json(os);
  });
};
