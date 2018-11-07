'use strict';


var mongoose = require('mongoose'),
 logger = mongoose.model('Log');


exports.list_all_logs = function(req, res) { // get all logs
  logger.find({}, function(err, logs) {
    if (err)
      res.send(err);
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

exports.logThis = function(jso)
{
  var new_log = new logger(jso);
  new_log.save(function(err, logs) {
    console.log(logs);
  });
}
