'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  dc = mongoose.model('DeliveryConfirmation');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var apikey = environment.apikey;



exports.list_all_confirmations = function(req, res) {
    dc.find({}, function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });
};

exports.create_a_confirmation = function(req, res) {
    var new_dc = new dc(req.body);
    new_dc.save(function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });
};


exports.finddc = function(req, res) {
    dc.find({deliveryID:req.params.deliveryID  }, function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });

};
