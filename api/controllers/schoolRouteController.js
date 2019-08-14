'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  school = mongoose.model('SchoolRoute');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var apikey = environment.apikey;



exports.list_all_routes = function(req, res) {
    school.find({companyID:req.body.companyID}, function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });
};


exports.create_a_route = function(req, res) {
    var new_school = new school(req.body);
    new_school.save(function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });
};

exports.list_day_route = function(req,res){
	var day = req.body.day;
	school.findOne({companyID: req.body.companyID, days: { $regex: day, $options: 'ig'}}, function(err, s){
		if (err)
			res.send(err)
		res.json(s);
	})
}
