'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  dtc = mongoose.model('DeliveryTimeCorrection');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var apikey = environment.apikey;



exports.list_all_corrections = function(req, res) {
    dtc.find({}, function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });
};

exports.create_a_correction = function(req, res) {
    var new_dtc = new dtc(req.body);
    new_dtc.save(function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });
};


exports.finddtc = function(req, res) {
    dtc.find({deliveryID:req.params.deliveryID  }, function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });

};
