'use strict';


var mongoose = require('mongoose'),
DriverVehicles = mongoose.model('DriverVehicles');

exports.list_all = function(req, res) {
  DriverVehicles.find({}, function(err, dc) {
    if (err)
      res.send(err);
    res.json(dc);
  });
};

exports.create_a_connection = function(req, res) {
  var ndc = new DriverVehicles(req.body);
  ndc.save(function(err, dc) {
    if (err)
      res.send(err);
    res.json(dc);
  });
};

exports.read_a_connection = function(req, res) {
  DriverVehicles.findById(req.params.id, function(err, dc) {
    if (err)
      res.send(err);
    res.json(dc);
  });
};

exports.findDriver = function(req, res) {
  DriverVehicles.find({_id: req.params.driverID}, function(err, dc) {
    if (err)
      res.send(err);
    res.json(dc);
  });
};

exports.update_a_dc = function(req, res) {
  DriverVehicles.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, dc) {
    if (err)
      res.send(err);
    res.json(vehicles);
  });
};

exports.delete_a_dc = function(req, res) {
  DriverVehicles.deleteOne({_id: req.params.id}, function(err, dc) {
    if (err)
      res.send(err);
    res.json({ message: 'Driver/vehicle connection successfully deleted' });
  });
};
