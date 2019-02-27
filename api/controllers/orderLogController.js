'use strict';


var mongoose = require('mongoose'),
 logger = mongoose.model('orderLog');


exports.list_all_logs = function(req, res) { // get all logs
  logger.find({}, function(err, logs) {
    if (err)
      res.send(err);
    res.json(logs);
  });
};

exports.list_company_logs = function(req, res) { // get all logs
  logger.find({companyID:req.body.companyID}, function(err, logs) {
    if (err)
      res.send(err);
    console.log(logs);
    res.json(logs);
  });
};

exports.create_a_log = function(req, res) { //create a new log
    var new_log = new logger(req.body);
    new_log.save(function(err, logs) {
      if (err)
        res.send(err);
      res.json(logs);
    });
};

exports.create_company_log = function(req, res) { //create a new log
    var new_log = new logger(req.body);
    new_log.save(function(err, logs) {
      if (err)
        res.send(err);
      res.json(logs);
    });
};

exports.get_single_log = function(req, res) { // get all logs
  logger.find({companyID:req.body.companyID, orderID:req.body.orderID}, function(err, logs) {
    if (err)
      res.send(err);
    res.json(logs);
  });
};

exports.logThis = function(jso)
{
  var new_log = new logger(jso);
  new_log.save(function(err, logs) {
    //console.log(logs);
  });
}
