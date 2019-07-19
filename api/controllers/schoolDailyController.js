'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  school = mongoose.model('SchoolDaily');
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
