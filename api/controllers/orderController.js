'use strict';

var mongoose = require('mongoose'),
  Orders = mongoose.model('Orders'),
  orderStatusFunc = mongoose.model('OrderStatus');
var Deliveries = mongoose.model('Deliverys');
var async = require('async');
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var Lockers = mongoose.model('Lockers');
var dc = mongoose.model('DeliveryConfirmation');


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
    {
      console.log(err);
      res.send(err);
    }
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
      if (orders != undefined && orders != null)
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

				//console.log(jso);
        log.logThis(jso);
      }
      if (req.body.destination == 'box_delivery')
      {
        try{
          var randomstring = require("randomstring");
          var pin = randomstring.generate({length:6,charset:'numeric'});
          var j = {
            "companyID": orders.companyID,
            "orderID":orders._id,
            "pin":pin,
            "type":"delivery"
          };
          var new_dc = new dc(j);
          new_dc.save(function(err, d) {
          });
        }
        catch (e)
        {
          console.log(e);
        }
      }
      else if (req.body.destination == 'box_pickup')
      {
        try{
          var randomstring = require("randomstring");
          var pin = randomstring.generate({length:6,charset:'numeric'});
          var j = {
            "companyID": orders.companyID,
            "orderID":orders._id,
            "pin":pin,
            "type":"pickup"
          };
          var new_dc = new dc(j);
          new_dc.save(function(err, d) {
          });
        }
        catch (e)
        {
          console.log(e);
        }
      }
      if (req.body.destination == 'box_address' || req.body.destination == 'group_free')
      {
        try{
          var randomstring = require("randomstring");
          var pin = randomstring.generate({length:6,charset:'numeric'});
          var j = {
            "companyID": orders.companyID,
            "orderID":orders._id,
            "pin":pin,
            "type":"delivery"
          };
          var new_dc = new dc(j);
          new_dc.save(function(err, d) {
          });
        }
        catch (e)
        {
          console.log(e);
        }
        try{
          var randomstring = require("randomstring");
          var pin = randomstring.generate({length:6,charset:'numeric'});
          var j = {
            "companyID": orders.companyID,
            "orderID":orders._id,
            "pin":pin,
            "type":"pickup"
          };
          var new_dc = new dc(j);
          new_dc.save(function(err, d) {

            if (req.body.destination == 'group_free')
            {
              sendStatusChange2(orders._id,"new_group_free");
            }
            else if (req.body.destination == 'box_address')
            {
              sendStatusChange2(orders._id,"box_address_received");
            }
          });
        }
        catch (e)
        {
          console.log(e);
        }
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

exports.read_a_company_order = function(req,res){
	Orders.find({_id:req.body.orderID, companyID:req.body.companyID}, function(err,orders){
		if(err)
			res.send(err);
		res.json(orders);
	});
}

exports.driver_read_a_company_order = function(req,res){
	Orders.find({_id:req.body.orderID, companyID:req.body.companyID}, function(err,orders){
		if(err)
			res.send(err);
		res.json(orders);
	});
}

exports.read_group_free_orders = function(req,res){
	Orders.find({companyID:req.body.companyID, destination:"group_free",  archieved:0, status:"received"}, function(err,orders){
		if(err)
			res.send(err);
		res.json(orders);
	});
}

exports.getRouteOrdersReceived = function (req,res){
  Orders.find({companyID:req.body.companyID, destination:"route_delivery",  archieved:0, status:"received"}, function(err,orders){
		if(err)
			res.send(err);
		res.json(orders);
	});
}
exports.getRouteOrders = function (req,res){
  Orders.find({companyID:req.body.companyID, destination:"route_delivery",  archieved:0, status:"accepted"}, function(err,orders){
		if(err)
			res.send(err);
		res.json(orders);
	});
}

exports.updateRouteOrder = function (req,res){
  Orders.findOneAndUpdate({_id:req.body.orderID,"address.deliveryList._id":req.body.item},{$set:{"address.deliveryList.$.visited":req.body.visited}},{new:true}, function(err,orders){
		if(err)
			res.send(err);
		res.json(orders);
	});
}
exports.updateRouteOrderStatus = function (req,res){
  Orders.findOneAndUpdate({_id:req.body.orderID,destination:"route_delivery"},{$set:{"status":req.body.status}},{new:true}, function(err,orders){
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
      Deliveries.findOneAndUpdate({orderID:orders._id, companyID:orders.companyID,status: {$nin:['cancelled','done','box_cancelled','terminal_stop']}},{status:req.body.status},{new: false}, function(err, deliverys){

        sendStatusChange2(orders._id,req.body.status);
        res.json({"msg":"Order and delivery changed"});


      });
    }
    else {
      res.json({"msg":"Order not found"});
    }
	});
}

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

exports.edit_a_orders = function(req, res) {
  Orders.findOneAndUpdate({_id: req.body.orderID}, req.body, {new: true}, function(err, orders) {
    if (err)
      res.send(err);

		var log = require('../controllers/orderLogController');
		var ipa = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var jso = {
			user:"api",
			ip: ipa,
			timestamp: Math.floor(new Date() / 1000),
			code: "operator_edit",
			orderID:req.body.orderID,
			companyID: req.body.companyID
		};
		log.logThis(jso);
    res.json(orders);
  });
};

exports.update_a_orders_company = function(req,res){
	Orders.findOneAndUpdate({_id: req.body.orderID}, {companyID:req.body.companyID}, function(err, orders){
		if(err){
			res.send(err);
		}
		else{
			res.json(orders);
		}
	})
}

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
      Deliveries.findOneAndUpdate({orderID:orders._id, companyID:orders.companyID,status: {$nin:['cancelled','done','box_cancelled','terminal_stop']}},{status:req.body.status},{new: false}, function(err, deliverys){
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

exports.customer_archive_a_orders_removal = function(req, res) {
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
      code: "customer_archive_2",
      orderID:req.body.orderID,
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
  Orders.deleteOne({_id: req.body.orderID}, function(err, orders) {
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
        checkForPrices(r,function(err2,rr)
        {
          res.json(rr);
        });

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
        checkForPrices(r,function (err2,rr)
        {
          res.json(rr);
        });

			});

		}
	});
};



exports.getVehicleOrdersBoxes = function(req,res)
{
  Orders.find({companyID:req.body.companyID, archieved:0, $or:[{status:"pickup_ready"},{status:"terminal_start"},{status:"address_pickup_start"},{status:"received",destination:"box_address"}] }, function(err, orders) {
    if (err)
      res.send(err);
    getOrdersWithoutDelivery(orders, function(err,r)
    {
      checkForPrices(r,function(err2,rr)
      {
        res.json(rr);
      });
    });

  });
};

exports.getVehicleOrdersGroup = function(req,res)
{
  Orders.find({archieved:0,destination:"group_free", status:"received"}, function(err, orders) {
    if (err)
      res.send(err);
    getOrdersWithoutDelivery(orders, function(err,r)
    {
      checkForPrices(r,function(err2,rr)
      {
        res.json(rr);
      });
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
        checkForPrices(r,function(err2,rr)
        {
          res.json(rr);
        });
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
  					if (delivery.status != 'cancelled' && delivery.status != 'done' && delivery.status != 'box_cancelled' && delivery.status != 'terminal_stop')
  					{
  						orders.push(h);
  					}
          }
          else if (mode == 'received')
          {
            if (delivery.status == 'received' || delivery.status == 'pickup_ready' || delivery.status == 'address_pickup_start')
  					{
  						orders.push(h);
  					}
          }
          else if (mode == 'inprogress')
          {
            if (delivery.status == 'accepted' || delivery.status == 'inProgress' || delivery.status == 'box_accepted'
            || delivery.status == 'delivery_not_ready' || delivery.status == 'address_pickup_accepted' || delivery.status == 'address_pickup'
            || delivery.status == 'address_delivery_not_ready')
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
      var rrr = {};
			Deliveries.find(query, function(err, result) {
				if (err)
				{
				  res.send(err);
				}
				var hasDeli = 0;
				for (var i = 0;i< result.length;i++)
				{
					if (result[i].status != "cancelled" && result[i].status != 'box_cancelled' && result[i].status != 'terminal_stop')
					{
						hasDeli = 1;
					}
          if (result[i].status == 'terminal_start')
          {
            hasDeli = 2;
            rrr = result[i];
          }
				}
				if (hasDeli == 0)
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
        else if (hasDeli == 2)
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
          h.delivery = rrr;
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

exports.list_amount_of_orders = function(req, res){
	Orders.find({companyID: req.body.companyID, archieved:0}, function(err, orders){
		if(err)
			res.send(err);
		res.json(orders);
	})
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
					if (result[i].status != "cancelled" && result[i].status != 'box_cancelled' && result[i].status != 'terminal_stop')
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
function checkForPrices(orders,callback)
{
  var ordery = [];
	var iteratorFcn = function(order,done)
	{

		if (order._id == null)
		{
			done();
			return;
		}
			var query = {'OrderNumber':order._id};
			orderStatusFunc.findOne(query, function(err, result) {
				if (err)
				{
				  res.send(err);
				}
        if (result != undefined && result != null && result.OrderPaid > 0)
        {
          order.price = result.OrderPaid;
        }
        else {
          order.price = 0;
        }
        ordery.push(order);
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
