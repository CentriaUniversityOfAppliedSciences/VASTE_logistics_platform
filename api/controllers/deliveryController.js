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

exports.find_by_status = function(req, res) {	//statuksen mukaan
  Deliverys.find({status:req.params.status}, function(err, deliverys) {
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
	Deliverys.find({vehicleID:req.params.vehiclesId, orderID:req.params.ordersId}, function(err, deliverys){
	if (err)
      res.send(err);
    res.json(deliverys);
  });
}; 

exports.find_delivery_by_vehicle = function(req, res){
	Deliverys.find({vehicleID:req.params.vehiclesId}, function(err, deliverys){
	if (err)
      res.send(err);
    res.json(deliverys);
  });
}; 	

exports.find_delivery_by_order = function(req, res){
	Deliverys.find({orderID:req.params.ordersId}, function(err, deliverys){
	if (err)
      res.send(err);
    res.json(deliverys);
  });
}; 
