'use strict';


var mongoose = require('mongoose'),
  Deliverys = mongoose.model('Deliverys');

exports.list_all_deliverys = function(req, res) {
  Deliverys.find({}, function(err, deliverys) {
    if (err)
      res.send(err);
    res.json(deliverys);
  });
};


exports.create_a_deliverys = function(req, res) {
  var new_deliverys = new Deliverys(req.body);
  new_deliverys.save(function(err, deliverys) {
    if (err)
      res.send(err);
    res.json(deliverys);
  });
};


exports.read_a_deliverys = function(req, res) {
  Deliverys.findById(req.params.deliverysId, function(err, deliverys) {
    if (err)
      res.send(err);
    res.json(deliverys);
  });
};


exports.update_a_deliverys = function(req, res) {
  Deliverys.findOneAndUpdate({_id: req.params.deliverysId}, req.body, {new: true}, function(err, deliverys) {
    if (err)
      res.send(err);
    res.json(deliverys);
  });
};


exports.delete_a_deliverys = function(req, res) {
  Deliverys.remove({_id: req.params.deliverysId}, function(err, deliverys) {
    if (err)
      res.send(err);
    res.json({ message: 'Deliverys successfully deleted' });
  });
}; 


exports.find_delivery_by_ID = function(req, res){
	Deliverys.find({vehicles:req.params.vehiclesId, orders:req.params.ordersId}, function(err, deliverys){
	if (err)
      res.send(err);
    res.json(deliverys);
  });
}; 

exports.find_delivery_by_ID = function(req, res){
	Deliverys.find({vehicles:req.params.vehiclesId}, function(err, deliverys){
	if (err)
      res.send(err);
    res.json(deliverys);
  });
}; 	

exports.find_delivery_by_ID = function(req, res){
	Deliverys.find({orders:req.params.ordersId}, function(err, deliverys){
	if (err)
      res.send(err);
    res.json(deliverys);
  });
}; 