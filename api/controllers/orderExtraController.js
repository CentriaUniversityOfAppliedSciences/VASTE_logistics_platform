'use strict';


var mongoose = require('mongoose'),
orderExtra= mongoose.model('OrderExtra');

exports.list_all_oe = function(req, res) {
  orderExtra.find({}, function(err, oe) {
    if (err)
      res.send(err);
    res.json(oe);
  });
};
exports.list_all_order_oe = function(req, res) {
  orderExtra.find({orderID:req.body.orderID, companyID:req.body.companyID}, function(err, oe) {
    if (err)
      res.send(err);
    res.json(oe);
  });
};
exports.create_a_oe = function(req, res) {
  var oex = new orderExtra(req.body);
  oex.save(function(err, oe) {
    if (err)
      res.send(err);
    res.json(oe);
  });
};
exports.update_a_oe = function(req, res) {
  orderExtra.findOneAndUpdate({_id: req.body.extraID}, req.body, {new: true}, function(err, oe) {
    if (err)
      res.send(err);
    res.json(oe);
  });
};

exports.delete_a_oe = function(req, res) {
  orderExtra.remove({_id: req.body.extraID}, function(err, oe) {
    if (err)
      res.send(err);
    res.json({ message: 'Successfully deleted' });
  });
};
