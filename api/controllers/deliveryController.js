'use strict';


var mongoose = require('mongoose'),
  Deliverys = mongoose.model('Deliverys');
var Orders = mongoose.model('Orders');
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);

exports.list_all_deliverys = function(req, res) {
  Deliverys.find({}, function(err, deliverys) {
    if (err)
      res.send(err);
    res.json(deliverys);
  });
};
exports.list_by_company = function(req, res) {
  Deliverys.find({companyID:req.body.companyID}, function(err, deliverys) {
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
    {
      res.send(err);
    }
    var log = require('../controllers/orderLogController');
    var ipa = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var jso = {
      user:"api",
      ip: ipa,
      timestamp: Math.floor(new Date() / 1000),
      code: "operator_delivery",
      orderID:deliverys.orderID,
      deliveryID: deliverys._id,
      companyID: req.body.companyID
    };
    log.logThis(jso);
    sendStatusChange(deliverys.orderID,"operator_delivery",req.body.companyID);

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
  Deliverys.findOneAndUpdate({_id: req.body.deliveryID, companyID: req.body.companyID},{status:"cancelled"} ,{new: true},function(err, deliverys) {
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
      code: "operator_cancel",
      orderID:req.body.orderID,
      deliveryID: req.body.deliverysId,
      companyID: req.body.companyID
    };
    log.logThis(jso);
    sendStatusChange(req.body.orderID, "operator_cancel");

    res.json(deliverys);
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

exports.changeDeliveryStatus = function(req,res)
{
	var query = { _id: req.body.deliveryID };
	var update = { vehicleID:req.body.vehicleID,status: req.body.status, time: {pickupTime: req.body.pickupTime, deliveryTime: req.body.deliveryTime} };
  Deliverys.find({_id:req.body.deliveryID,vehicleID:req.body.vehicleID, status: {$ne:'cancelled',$ne:'done'}, companyID:req.body.companyID}, function(err, deli){

    var a = deli[0].orderID;
    if (a.length > 3)
    {
    	Deliverys.findOneAndUpdate(query,update, function(err, deliverys){
    		if(err)
    		{
    			res.send(err);
    		}
    		var oQuery = { _id: req.body.orderID };
    		var oUpdate = { status: req.body.orderStatus };
    		Orders.findOneAndUpdate(oQuery, oUpdate, function(err2, ord)
    		{
    			if (err2)
    			{
    				res.send(err2);
    			}
          var log = require('../controllers/orderLogController');
          var ipa = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          var c = "";
          if (req.body.status == "accepted")
          {
            c = "driver_accept";
          }
          else if (req.body.status == "inProgress")
          {
            c = "driver_pickup";
          }
          else if (req.body.status == "cancelled")
          {
            c = "driver_cancel";
          }
          else if (req.body.status == "done")
          {
            c = "driver_delivery";
          }
          var jso = {
            user:"api",
            ip: ipa,
            timestamp: Math.floor(new Date() / 1000),
            code: c,
            orderID:req.body.orderID,
            deliveryID: req.body.deliveryID,
            companyID: ord.companyID
          };
          log.logThis(jso);
          sendStatusChange(req.body.orderID,c,ord.companyID);
          sendStatusChange2(req.body.orderID,c);
    			res.json(deliverys);

    	   });

    });
    }
    else {
      res.json({'error':'Delivery not found'});
    }
  });
};

function sendStatusChange(orderID,status,comp)
{
  var envi = "test";
  if (environment.port == 3000)
  {
    envi = "prod";
  }

    var jso = {
      "orderID":orderID,
      "status":status,
      "companyID":comp,
      "environment":envi
    };
    var request = require('request');
  	var options = {
  		uri: "https://localhost:5140/webhook",
  		method: 'POST',
      rejectUnauthorized: false,
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
