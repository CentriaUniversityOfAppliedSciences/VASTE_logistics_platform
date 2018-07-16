'use strict';


var mongoose = require('mongoose'),
  Orders = mongoose.model('Orders');
var Deliveries = mongoose.model('Deliverys');
var async = require('async');

exports.list_all_orders = function(req, res) {
  Orders.find({}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};


exports.find_by_status = function(req, res) {	//statuksen mukaan 
  Orders.find({status:req.params.status}, function(err, orders) {
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
  Orders.remove({_id: req.params.ordersId}, function(err, orders) {
    if (err)
      res.send(err);
    res.json({ message: 'Orders successfully deleted' });
  });
};

exports.getVehicleOrders = function(req,res)
{
	var orderList = [];
	Deliveries.find({vehicleID:req.params.vehiclesId}, function(err, deliverys){
		if (err)
		{
			res.send(err);
		}
		else
		{
			getOrdersForDelivery(deliverys, function (err,r)
			{
				//console.log(r);
				res.json(r);
			});
			
		}
	});
};


function getOrdersForDelivery(deliveries, callback)
{
	var orders = [];
	var iteratorFcn = function(delivery,done)
	{
		if (delivery.orderID == null)
		{
			done();
			return;
		}
		
			var query = {'_id':delivery.orderID};
			Orders.find(query, function(err, result) {
				if (err)
				{
				  res.send(err);
				}
				var h = { "_id":"","subscriber":{},"receiver":{},"address":{},"time":{},"orderStatus":{},"status":"","delivery":{} };
				h.subscriber = result[0].subscriber;
				h.receiver = result[0].receiver;
				h.address = result[0].address;
				h.time = result[0].time;
				h.orderstatus = result[0].orderstatus;
				h.status = result[0].status;
				h._id = result[0]._id;
				h.delivery = delivery;
				console.log(h);
				if (delivery.status != 'cancelled')
				{
					orders.push(h);
				}
				done();
				return;
			  });
		
	};
	var doneIteratingFcn = function(err)
	{
		callback(err,orders);
	};
	
	async.forEach(deliveries, iteratorFcn, doneIteratingFcn);
}


