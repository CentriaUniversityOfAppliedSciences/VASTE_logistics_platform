'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  UserOrder = mongoose.model('UserOrder');

var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var apikey = environment.apikey;


exports.list_user_order = function(req, res) {
  if (req.body.apikey == apikey)
  {
    UserOrder.find({userID:req.body.userID}, function(err, uo) {
      if (err)
        res.send(err);
      res.json(uo);
    });
  }
  else {
    res.send("error");
  }
};

exports.create_user_order = function(req, res) {

    var new_uo = new UserOrder(req.body);
    new_uo.save(function(err, uo) {
      if (err)
        res.send(err);
      res.json(uo);
    });

};

exports.remove_user_order = function(req, res) {
    UserOrder.deleteOne({userID: req.body.userID, orderID:req.body.orderID}, function(err, uo) {
      if (err)
        res.send(err);
      res.json({ message: 'Users order successfully deleted' });
    });

};
