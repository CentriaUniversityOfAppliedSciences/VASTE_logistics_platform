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
exports.list_all_orders_by_company = function(req, res) {
  Orders.find({$or:[{companyID:req.body.companyID},{companyID:"0"}]}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};

exports.find_by_status = function(req, res) {	//statuksen mukaan

  Orders.find({status:req.body.status}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};


exports.find_by_status_with_nodelivery = function(req, res) {	//statuksen mukaan jos ei deliveryä
  Orders.find({status:req.body.status}, function(err, orders) {
    if (err)
      res.send(err);
	getOrdersWithoutDelivery(orders, function(err,r)
	{
		res.json(r);
	});

  });
};

exports.create_a_orders = function(req, res) {
  getMaxOrderNum(function(num)
  {
    var n = 0;
    if(typeof num != "undefined" && num != null && num.length != null && num.length > 0){
      n = num[0].vasteOrder;
    }
    else
    {
      n = 0;
    }
    req.body.vasteOrder = n+1;
    var new_orders = new Orders(req.body);
    new_orders.save(function(err, orders) {
      if (err)
      {
        res.send(err);
      }
      var log = require('../controllers/orderLogController');
      var ipa = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      if (orders != undefined && orders != null && orders._id.length > 0)
      {
        var jso = {
          user:"api",
          ip: ipa,
          timestamp: Math.floor(new Date() / 1000),
          code: "customer_created",
          orderID:orders._id,
          deliveryID: "",
          companyID: orders.companyID
        };
        log.logThis(jso);
      }
      res.json(orders);
    });
  });
};

var getMaxOrderNum = function(callback)
{
  Orders.find({},['vasteOrder'],{limit:1,sort:{vasteOrder: -1}}, function(err, orders) {
    if (err)
      callback(null);
    callback(orders);
  });
}

exports.read_a_orders = function(req, res) {
  Orders.findById(req.body.ordersId, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};
exports.read_single_order = function(req, res) {
  Orders.find({_id:req.body.ordersId,companyID:req.body.companyID}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};
exports.get_api_order = function(req, res) {
  Orders.find({companyID:req.body.companyID,_id:req.body.orderID}, function(err, orders) {
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
	Deliveries.find({vehicleID:req.body.vehicleID, companyID:req.body.companyID}, function(err, deliverys){
		if (err)
		{
			res.send(err);
		}
		else
		{
			getOrdersForDelivery(deliverys,"mine", function (err,r)
			{
				//console.log(r);
				res.json(r);
			});

		}
	});
};

exports.getVehicleOrdersReceived = function(req,res)
{
	var orderList = [];
	Deliveries.find({vehicleID:req.body.vehiclesId, companyID: req.body.companyID}, function(err, deliverys){
		if (err)
		{
			res.send(err);
		}
		else
		{
			getOrdersForDelivery(deliverys,"received", function (err,r)
			{
				//console.log(r);
				res.json(r);
			});

		}
	});
};
exports.getVehicleOrdersInprogress = function(req,res)
{
	var orderList = [];
	Deliveries.find({vehicleID:req.body.vehiclesId, companyID: req.body.companyID}, function(err, deliverys){
		if (err)
		{
			res.send(err);
		}
		else
		{
			getOrdersForDelivery(deliverys,"inprogress", function (err,r)
			{
				//console.log(r);
				res.json(r);
			});

		}
	});
};


function getOrdersForDelivery(deliveries,mode, callback)
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
				var h = { "_id":"","subscriber":{},"receiver":{},"address":{},"time":{},"orderStatus":{},"status":"","delivery":{},"orderInfo":"","orderDescription":"","vasteOrder":"" };
				if (result.length > 0)
				{
					h.subscriber = result[0].subscriber;
					h.receiver = result[0].receiver;
					h.address = result[0].address;
					h.time = result[0].time;
					h.orderStatus = result[0].orderStatus;
					h.status = result[0].status;
					h._id = result[0]._id;
					h.orderInfo = result[0].orderInfo;
					h.orderDescription = result[0].orderDescription;
					h.delivery = delivery;
          h.vasteOrder = result[0].vasteOrder;
          h.companyID = result[0].companyID;

					//console.log(h);
          if (mode == 'mine')
          {
  					if (delivery.status != 'cancelled' && delivery.status != 'done')
  					{
  						orders.push(h);
  					}
          }
          else if (mode == 'received')
          {
            if (delivery.status == 'received')
  					{
  						orders.push(h);
  					}
          }
          else if (mode == 'inprogress')
          {
            if (delivery.status == 'accepted' || delivery.status == 'inProgress')
  					{
  						orders.push(h);
  					}
          }
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
function getOrdersWithoutDelivery(orders, callback)
{
	var ordery = [];
	var iteratorFcn = function(order,done)
	{
		if (order._id == null)
		{
			done();
			return;
		}

			var query = {'orderID':order._id};
			Deliveries.find(query, function(err, result) {
				if (err)
				{
				  res.send(err);
				}
				var hasDeli = 0;
				for (var i = 0;i< result.length;i++)
				{
					if (result[i].status != "cancelled")
					{
						hasDeli = 1;
					}
				}
				if (hasDeli != 1)
				{
					var h = { "_id":"","subscriber":{},"receiver":{},"address":{},"time":{},"orderStatus":{},"status":"","delivery":{},"orderInfo":"","orderDescription":"","vasteOrder":"" };
					h.subscriber = order.subscriber;
					h.receiver = order.receiver;
					h.address = order.address;
					h.time = order.time;
					h.orderStatus = order.orderStatus;
					h.status = order.status;
					h._id = order._id;
					h.orderInfo = order.orderInfo;
					h.orderDescription = order.orderDescription;
					h.delivery = {};
          h.vasteOrder = order.vasteOrder;
          h.companyID = order.companyID;
					//console.log(h);

					ordery.push(h);
				}

				done();
				return;
			  });

	};
	var doneIteratingFcn = function(err)
	{
		callback(err,ordery);
	};

	async.forEach(orders, iteratorFcn, doneIteratingFcn);
}

exports.getAllForId = function(req, res) {
  Orders.find({_id:req.body.ordersId,companyID:req.body.companyID}, function(err, orders) {
    if (err)
    {
      res.send(err);
    }
    console.log("1");
    console.log(orders);
    getDeliveryForOrder(orders, function(err,resu)
    {
      console.log("2");
      console.log(resu);
      res.json(resu[0]);
    });


  });
};

function getDeliveryForOrder(orders, callback)
{
	var ordery = [];
	var iteratorFcn = function(order,done)
	{
		if (order._id == null)
		{
			done();
			return;
		}

			var query = {'orderID':order._id};
			Deliveries.find(query, function(err, result) {
				if (err)
				{
				  res.send(err);
				}
				var hasDeli = 0;
        var deli = {};
				for (var i = 0;i< result.length;i++)
				{
					if (result[i].status != "cancelled")
					{
						hasDeli = 1;
            deli = result[i];
					}
				}
				if (hasDeli != 1)
				{
					var h = { "_id":"","subscriber":{},"receiver":{},"address":{},"time":{},"orderStatus":{},"status":"","delivery":{},"orderInfo":"","orderDescription":"","vasteOrder":"" };
					h.subscriber = order.subscriber;
					h.receiver = order.receiver;
					h.address = order.address;
					h.time = order.time;
					h.orderStatus = order.orderStatus;
					h.status = order.status;
					h._id = order._id;
					h.orderInfo = order.orderInfo;
					h.orderDescription = order.orderDescription;
					h.delivery = {};
          h.vasteOrder = order.vasteOrder;
          h.companyID = order.companyID;
          h.destination = order.destination;
					ordery.push(h);
				}
        else {
          var h = { "_id":"","subscriber":{},"receiver":{},"address":{},"time":{},"orderStatus":{},"status":"","delivery":{},"orderInfo":"","orderDescription":"","vasteOrder":"" };
          h.subscriber = order.subscriber;
          h.receiver = order.receiver;
          h.address = order.address;
          h.time = order.time;
          h.orderStatus = order.orderStatus;
          h.status = order.status;
          h._id = order._id;
          h.orderInfo = order.orderInfo;
          h.orderDescription = order.orderDescription;
          h.delivery = deli;
          h.vasteOrder = order.vasteOrder;
          h.companyID = order.companyID;
          h.destination = order.destination;
          ordery.push(h)
        }

				done();
				return;
			  });

	};
	var doneIteratingFcn = function(err)
	{
		callback(err,ordery);
	};

	async.forEach(orders, iteratorFcn, doneIteratingFcn);
}
