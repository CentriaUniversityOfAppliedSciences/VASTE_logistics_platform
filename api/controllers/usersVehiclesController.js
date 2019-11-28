'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  usersCars = mongoose.model('UsersVehicles');
  var environmentJson = fs.readFileSync("./environment.json");
  var environment = JSON.parse(environmentJson);
  var apikey = environment.apikey;


exports.link_new_user = function(req, res){
	var new_car = new usersCars({vehicleID: req.body.vehicleID, owners:{userID:req.body.userID}});
	new_car.save(function(err, user_cars){
		if(err)
			res.send(err);
		res.json(user_cars)
	})
};

exports.find_cars_by_userID = function(req,res){
	usersCars.find({"owners.userID": req.body.userID}, function(err, car_users){
		if(err)
			res.send(err);
		res.json(car_users);
	})
}
