'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  Users = mongoose.model('Users'),
	Vehicles = mongoose.model('Vehicles'),
	Users = mongoose.model('Users'),
	CompanyProperties = mongoose.model('CompanyProperties'),
	Deliverys = mongoose.model('Deliverys'),
	Orders = mongoose.model('Orders');
  var environmentJson = fs.readFileSync("./environment.json");
  var environment = JSON.parse(environmentJson);
  var apikey = environment.apikey;

exports.get_companies_id = function(req,res){
	CompanyProperties.find({value: req.body.operatorID, type: 'superior'}, function(err, companys){
		if(err)
		{
			res.send(err);
		}
		res.json(companys);
	});
};
