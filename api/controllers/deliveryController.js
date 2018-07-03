'use strict';


var mongoose = require('mongoose'),
  Deliverys = mongoose.model('Deliverys');
var Orders = mongoose.model('Orders');
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

exports.changeDeliveryStatus = function(req,res) //android version, uses req.body instead of req.params
{
	var query = { _id: req.body.deliveryID };
	var update = { status: req.body.status, time: {pickupTime: req.body.pickupTime, deliveryTime: req.body.deliveryTime} };
	if (req.body.status == 'cancelled')
	{
		update = { vehicleID: '',status: req.body.status, time: {pickupTime: req.body.pickupTime, deliveryTime: req.body.deliveryTime} };
	}
	console.log(req.body);
	Deliverys.findOneAndUpdate(query,update, function(err, deliverys){
		if(err)
		{
			res.send(err);
		}
		console.log(deliverys);
		var oQuery = { _id: req.body.orderID };
		var oUpdate = { status: req.body.orderStatus };
		Orders.findOneAndUpdate(oQuery, oUpdate, function(err2, ord)
		{
			if (err2)
			{
				res.send(err2);
			}
			console.log(ord);
			res.json(deliverys);
		});
		
	});
};