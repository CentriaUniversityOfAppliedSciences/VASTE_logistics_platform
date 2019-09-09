'use strict';

var fs = require('fs');
var mongoose = require('mongoose');
  var Users = mongoose.model('Users');
	var Vehicles = mongoose.model('Vehicles');
	var Lockers = mongoose.model('Lockers');
	var DeliveryLists = mongoose.model('DeliveryLists');
	var Companys = mongoose.model('Companys');
	var Users = mongoose.model('Users');
	var logger = mongoose.model('orderLog');
	var Points = mongoose.model('Points');
	var Payments = mongoose.model('Payments');
	var CompanyProperties = mongoose.model('CompanyProperties');
	var Deliverys = mongoose.model('Deliverys');
	var Orders = mongoose.model('Orders');
	var Routes = mongoose.model('Routes');
  var environmentJson = fs.readFileSync("./environment.json");
  var environment = JSON.parse(environmentJson);
  var apikey = environment.apikey;

		var boxes = require('./boxController');

	exports.get_company_id = function(req, res) {
    CompanyProperties.find({value: req.body.userID, type: 'superior'}, function(err, companys) {
      if(err){
        res.send(err);
			}
      res.json(companys);
    });
  };

	exports.get_company_name = function(req,res){
		Companys.find({_id: req.body.companyID}, function(err, companys) {
			if(err)
			{
				res.send(err);
			}
			var c = [];
			if(companys != undefined ||companys != null)
			{
				for(var i = 0; i < companys.length; i++){
					var co = companys[i].toObject();
					c.push(co);
				}
			}
			res.json(c);
		});
	}

	exports.get_companies_orders = function(req,res){
		Orders.find({companyID:req.body.companyID, archieved:0}, function(err,orders){
			if(err){
				res.send(err);
			}
			var o = [];
			if(orders != undefined || orders != null)
			{
				for(var i = 0; i < orders.length; i++)
				{
					var or = orders[i].toObject();
					o.push(or);
				}
			}
			res.json(o);
		})
	};

	exports.get_companies_vehicles = function(req,res){
		Vehicles.find({companyID: req.body.companyID}, function(err,vehicles){
			if(err){
				res.send(err);
			}

			var v = [];
			if(vehicles != undefined || vehicles != null)
			{
				for(var i = 0; i < vehicles.length; i++)
				{
					var ve = vehicles[i].toObject();
					v.push(ve);
				}
			}
			res.json(v);
		})
	};

	exports.get_companies_deliveries = function(req,res){
		Deliverys.find({companyID: req.body.companyID}, function(err, deliverys){
			if(err)
			{
				res.send(err);
			}

			var d = [];
			if(deliverys != undefined || deliverys != null)
			{
				for(var i = 0; i < deliverys.length; i++)
				{
					var de = deliverys[i].toObject();
					d.push(de);
				}
			}
			res.json(d);
		})
	};

	exports.get_companies_logs = function(req,res){
		logger.find({companyID: req.body.companyID}, function(err, logs){
			if(err)
			{
				res.send(err);
			}

			var l = [];
			if(logs != undefined || logs != null)
			{
				for(var i = 0; i < logs.length; i++)
				{
					var lo = logs[i].toObject();
					l.push(lo);
				}
			}
			res.json(l);
		})
	};


	exports.get_companies_drivers = function(req, res) {

	    Users.find({'userInformation.userCompany':req.body.companyID, status:'driver'}, function(err, users) {
	      if (err)
	        res.send(err);
	      var u = [];
	      if (users != undefined || users != null)
	      {

	        for (var i = 0;i< users.length;i++)
	        {
	          var us = users[i].toObject();
	          delete us.passWord;
	          u.push(us);
	        }

	      }
	      res.json(u);
	    });

	};

	exports.get_single_company_order = function(req,res){
		Orders.find({_id:req.body.orderID, archieved:0}, function(orders, err){
			if(err){
				res.send(err);
			}
			else{
			res.json(orders);
		}
	})
}

exports.super_create_a_deliverys = function(req,res){
	var new_deliverys = new Deliverys(req.body);
	new_deliverys.save(function(err, deliverys){
		if(err){
			res.send(err);
		}
		var log = require('../controllers/orderLogController');
		var ipa = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var jso = {
			user:"api",
			ip: ipa,
			timestamp: Math.floor(new Date() / 1000),
			code: "operator_delivery",
			orderID: deliverys.orderID,
			deliveryID: deliverys._id,
			companyID: req.body.companyID,
			vehicleID: req.body.vehicleID
		};
		log.logThis(jso);
		sendStatusChange(deliverys.orderID, "operator_delivery", req.body.companyID);

		res.json(deliverys);
	});
}

exports.super_update_a_order = function(req,res){
	Orders.findOneAndUpdate({_id: req.body.orderID}, req.body, {new: true}, function(err, orders) {
    if (err)
      res.send(err);
    res.json(orders);
  });
}

exports.super_delete_a_delivery = function(req,res){
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
}

exports.super_archive_a_orders_removal = function(req, res) {
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

exports.super_create_a_deliveryLists = function(req,res){
	var new_deliveryLists = new DeliveryLists(req.body);
  new_deliveryLists.save(function(err, deliveryLists) {
    if (err)
      res.send(err);
    res.json(deliveryLists);
  });
};

exports.super_get_companies_payments = function(req,res){
	Payments.find({"companyID": req.body.companyID}, function(err, payments){
		if(err)
		{
			res.send(err);
		}
		var p = [];
		if(payments != undefined || payments != null)
		{
			for(var i =0; i < payments.length; i++)
			{
				var pa = payments[i].toObject();
				p.push(pa);
			}
		}
		res.json(p);
	})
};

exports.super_delete_a_vehicle = function(req, res) {
  Vehicles.deleteOne({_id: req.body.vehiclesId}, function(err, vehicles){
    if(err){
      res.send(err);
		}

    res.json({ message: 'Vehicle successfully deleted' });
  });
};

exports.super_delete_a_user = function(req,res){
	Users.deleteOne({_id: req.body.userID}, function(err, users) {
		if (err)
			res.send(err);
		res.json({ message: 'User successfully deleted' });
	});
}

exports.super_create_a_user = function(req,res){
	var new_users = new Users({userID:req.body.userID,passWord:req.body.passWord,status:'driver',
															userInformation:{userName:req.body.userName,userCompany:req.body.userCompany,
															userPhone: req.body.userPhone, userAddress:req.body.userAddress,userMail:req.body.userMail}});
	new_users.save(function(err, users) {
		if (err)
			res.send(err);
		if (users != undefined || users != null)
		{
			users = users.toObject();
			delete users.passWord;
		}
		res.json(users);
	});
}

exports.super_create_a_vehicle = function(req, res) {
  var new_vehicles = new Vehicles(req.body);
  new_vehicles.save(function(err, vehicles) {
    if (err)
      res.send(err);
    res.json(vehicles);
  });
};

exports.super_delete_a_boxdeliverys = function(req, res) {
  Deliverys.findOneAndUpdate({_id: req.body.deliveryID, companyID: req.body.companyID},{status:"box_cancelled"} ,{new: true},function(err, deliverys) {
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


exports.super_create_a_payments = function(req, res) {
  var new_payments = new Payments(req.body);
  new_payments.save(function(err, payments) {
    if (err)
		{
      res.send(err);
		}
    res.json(payments);
  });
};

exports.super_delete_a_payment = function(req, res) {
  Payments.deleteOne({_id: req.body.paymentID}, function(err, payments) {
    if (err)
      res.send(err);
    res.json({ payment: 'Payments successfully deleted' });
  });
};

exports.super_update_locker_pin2 = function(req,res){
	Lockers.findOneAndUpdate({_id: req.body.lockersId, type:req.body.type}, {$set:{lockerCode2:req.body.code}}, {new:true}, function(err,lockers){
		if(err){
			console.log(err);
			res.send(err)
		}

		if(lockers != undefined || lockers != null){
			lockers = lockers.toObject();
		}

		res.json(lockers);
	})
};

exports.super_get_locker_data = function(req,res){
	Lockers.find({}, function(err, lockers){
		if(err)
		{
			res.send(err);
		}
		res.json(lockers);
	});
};

exports.super_list_all_points = function(req, res) {
  Points.find({}, function(err, point) {
    if (err)
      res.send(err);
    res.json(point);
  });
};

exports.get_locker_data_from_keba = function(req,res){
	boxes.getStatesApi(req.body.machineCode, function(data){
		res.send(data);
	});
}

exports.super_list_companies_routes = function(req, res) {
  Routes.find({companyID: req.body.companyID}, function(err,routes) {
    if (err){
      res.send(err);
		}

		var r = [];
		if(routes != undefined  || routes != null)
		{
			for(var i = 0; i < routes.length; i++){
				var ro = routes[i].toObject();
				r.push(ro);
			}
		}
    res.json(r);
  });
};

exports.super_create_a_routes = function(req, res) {
  var new_routes = new Routes(req.body);
  new_routes.save(function(err, routes) {
    if (err)
      res.send(err);
    res.json(routes);
  });
};

exports.super_delete_a_routes = function(req, res) {
  Routes.deleteOne({_id: req.body.id, companyID: req.body.companyID}, function(err, routes) {
    if(err){
			console.log(err);
      res.send(err);
		}
    res.json({ route: 'Routes successfully deleted' });
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

		//console.log("sendStatusChange jso " + JSON.stringify(jso));
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
