'use strict';

var mongoose = require('mongoose'),
  Orders = mongoose.model('Orders');
var Deliveries = mongoose.model('Deliverys');
var async = require('async');
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var Lockers = mongoose.model('Lockers');


exports.list_all_orders = function(req, res) {
  Orders.find({archieved:0}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};
exports.list_all_orders_by_company = function(req, res) {
  Orders.find({$or:[{companyID:req.body.companyID, archieved:0},{companyID:"0", archieved:0}]}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};

exports.find_by_status = function(req, res) {	//statuksen mukaan

  Orders.find({status:req.body.status, archieved:0}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};

exports.find_by_status_function = function(stat,callback) {	//statuksen mukaan function

  Orders.find({status:stat, archieved:0}, function(err, orders) {

    if (err)
      callback("err");
    callback(orders);
  });
};


exports.find_by_status_with_nodelivery = function(req, res) {	//statuksen mukaan jos ei deliveryä

  Orders.find({status:req.body.status, archieved:0}, function(err, orders) {
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
				console.log("uus tilaus");
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
  Orders.find({_id:req.body.ordersId,companyID:req.body.companyID, archieved:0}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};
exports.get_api_order = function(req, res) {
  Orders.find({companyID:req.body.companyID,_id:req.body.orderID, archieved:0}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};

exports.update_a_orders = function(req, res) {
  Orders.findOneAndUpdate({_id: req.body.orderID}, req.body, {new: true}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};

exports.change_order_status = function(req, res) {
  Orders.findOneAndUpdate({vasteOrder: req.body.vasteOrder}, {status:req.body.status}, {new: true}, function(err, orders) {
    if (err)
      res.send(err);
    var log = require('../controllers/orderLogController');
    var ipa = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (orders != undefined && orders != null)
    {
      var jso = {
        user:"api",
        ip: ipa,
        timestamp: Math.floor(new Date() / 1000),
        code: req.body.status,
        orderID:orders._id,
        companyID: orders.companyID,
      };
      log.logThis(jso);
      Deliveries.findOneAndUpdate({orderID:orders._id, companyID:orders.companyID,status: {$nin:['cancelled','done','box_cancelled']}},{status:req.body.status},{new: false}, function(err, deliverys){
        if (req.body.status == 'done')
        {
          Lockers.updateMany({orderID:orders._id}, {lockerStatus: 'available',lockerCode:'000000',lockerCode2:'000000',orderID:'',type:''}, function(err, lockers) {
            if (err)
              res.send(err);
            sendStatusChange2(orders._id,req.body.status);
            res.json({"msg":"Order and delivery and locker changed"});
          });
        }
        else {
          sendStatusChange2(orders._id,req.body.status);
          res.json({"msg":"Order and delivery changed"});
        }

      });
    }
    else {
      res.json({"msg":"Order not found"});
    }


  });
};

exports.archive_a_orders_removal = function(req, res) {
  Orders.findOneAndUpdate({_id: req.body.orderID}, {archieved:2}, {new: true}, function(err, orders) {
    if (err)
		{
			 res.send(err);
		}
		var log = require('../controllers/orderLogController');
    var ipa = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var jso = {
      user:"api",
      ip: ipa,
      timestamp: Math.floor(new Date() / 1000),
      code: "operator_archive_2",
      orderID:req.body.orderID,
      companyID: req.body.companyID,
    };
    log.logThis(jso);

    res.json(orders);
  });
};

exports.archive_a_failed_order = function(req, res) {
  Orders.findOneAndUpdate({_id: req.body.orderID}, {archieved:3}, {new: true}, function(err, orders) {
    if (err)
		{
			 res.send(err);
		}
		var log = require('../controllers/orderLogController');
    var ipa = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var jso = {
      user:"api",
      ip: ipa,
      timestamp: Math.floor(new Date() / 1000),
      code: "failed_box_order_archive_3",
      orderID:orders._id,
      companyID: orders.companyID,
    };
    log.logThis(jso);

    res.json(orders);
  });
};

exports.updatePincode = function(req, res) {
  Orders.findOneAndUpdate({_id: req.body.orderID}, {orderInfo:req.body.orderInfo}, {new: true}, function(err, orders) {
    if (err)
		{
			 res.send(err);
		}
    res.json(orders);
  });
};



exports.delete_a_orders = function(req, res) {
  Orders.remove({_id: req.body.orderID}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
};

exports.getVehicleOrders = function(req,res)
{
	Deliveries.find({vehicleID:req.body.vehicleID, companyID:req.body.companyID}, function(err, deliverys){
		if (err)
		{
			res.send(err);
		}
		else
		{
			getOrdersForDelivery(deliverys,"mine", function (err,r)
			{
				res.json(r);
			});

		}
	});
};

exports.getVehicleOrdersReceived = function(req,res)
{
	Deliveries.find({vehicleID:req.body.vehiclesId, companyID: req.body.companyID}, function(err, deliverys){
		if (err)
		{
			res.send(err);
		}
		else
		{
			getOrdersForDelivery(deliverys,"received", function (err,r)
			{
				res.json(r);
			});

		}
	});
};

exports.getVehicleOrdersBoxes = function(req,res)
{
  Orders.find({companyID:req.body.companyID, archieved:0, $or:[{status:"pickup_ready"},{status:"terminal_start"}] }, function(err, orders) {
    if (err)
      res.send(err);
    getOrdersWithoutDelivery(orders, function(err,r)
    {
      res.json(r);
    });

  });
};


exports.getVehicleOrdersInprogress = function(req,res)
{
	Deliveries.find({vehicleID:req.body.vehiclesId, companyID: req.body.companyID}, function(err, deliverys){
		if (err)
		{
			res.send(err);
		}
		else
		{
			getOrdersForDelivery(deliverys,"inprogress", function (err,r)
			{
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
          h.destination = result[0].destination;

          if (mode == 'mine')
          {
  					if (delivery.status != 'cancelled' && delivery.status != 'done' && delivery.status != 'box_cancelled')
  					{
  						orders.push(h);
  					}
          }
          else if (mode == 'received')
          {
            if (delivery.status == 'received' || delivery.status == 'pickup_ready')
  					{
  						orders.push(h);
  					}
          }
          else if (mode == 'inprogress')
          {
            if (delivery.status == 'accepted' || delivery.status == 'inProgress' || delivery.status == 'box_accepted' || delivery.status == 'delivery_not_ready')
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
					if (result[i].status != "cancelled" && result[i].status != 'box_cancelled')
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
          h.destination = order.destination;

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
  Orders.find({_id:req.body.ordersId,companyID:req.body.companyID, archieved:0}, function(err, orders) {
    if (err)
    {
      res.send(err);
    }
    getDeliveryForOrder(orders, function(err,resu)
    {
      res.json(resu[0]);
    });


  });
};

exports.getAllForId2 = function(req, res) {
  Orders.find({_id:req.body.ordersId, archieved:0}, function(err, orders) {
    if (err)
    {
      res.send(err);
    }
    getDeliveryForOrder(orders, function(err,resu)
    {
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
					if (result[i].status != "cancelled" && result[i].status != 'box_cancelled')
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



function sendStatusChange2(orderID,status)
{
  var toport = "3511";
  if (environment.port == 3000)
  {
    toport = "3501";
  }
  else {
    toport = "3511"
  }

    var jso = {
      "orderID":orderID,
      "status":status
    };
    var request = require('request');
  	var options = {
  		uri: "https://localhost:"+toport+"/webhook",
      rejectUnauthorized: false,
  		method: 'POST',
  		headers: {
          "content-type": "application/json",
          },
  		json: jso
  	};
  	request(options, function (error, response, body) {
  	  if (!error && response.statusCode == 200) {

  	  }
  	  else
  	  {
  		  console.log(response);
  	  }
  	});
}
