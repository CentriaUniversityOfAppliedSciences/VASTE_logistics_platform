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
    dc.find({orderID:req.body.orderID,companyID:req.body.companyID}, function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });
};

exports.findappdc = function(req, res) {
    dc.findOne({orderID:req.body.orderID,companyID:req.body.companyID}, function(err, d) {
      var ans = {
        "type":"err",
        "msg":"error"
      }
      if (err)
      {
        res.send(ans);
      }
      var a = d.toObject();
      if (req.body.pincode == a.pin)
      {
        dc.findOneAndUpdate({orderID:req.body.orderID,companyID:req.body.companyID},{status:"verified"},{new: true}, function(err2, da) {
          if (err2)
          {
            ans = {
              "type":"err",
              "msg":"error"
            }
            res.send(ans);
          }
          ans = {
            "type":"ok",
            "msg":"match"
          }
          res.send(ans);
        });

      }
      else {
        res.send(ans);
      }

    });
};

exports.announcedc = function(req, res) {
    dc.findOneAndUpdate({orderID:req.body.orderID,companyID:req.body.companyID},{status:"announced"},{new: true}, function(err, d) {
      if (err)
        res.send(err);
      res.json(d);
    });
};
