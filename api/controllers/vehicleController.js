'use strict';


var mongoose = require('mongoose'),
Vehicles= mongoose.model('Vehicles');

exports.list_all_vehicles = function(req, res) {
  Vehicles.find({}, function(err, vehicles) {
    if (err)
      res.send(err);
    res.json(vehicles);
  });
};


exports.create_a_vehicles = function(req, res) {
  var new_vehicles = new Vehicles(req.body);
  new_vehicles.save(function(err, vehicles) {
    if (err)
      res.send(err);
    res.json(vehicles);
  });
};


exports.read_a_vehicles = function(req, res) {
  Vehicles.findById(req.params.vehiclesId, function(err, vehicles) {
    if (err)
      res.send(err);
    res.json(vehicles);
  });
};


exports.update_a_vehicle = function(req, res) {
  Vehicles.findOneAndUpdate({_id: req.params.vehiclesId}, req.body, {new: true}, function(err, vehicles) {
    if (err)
      res.send(err);
    res.json(vehicles);
  });
};


exports.delete_a_vehicles = function(req, res) {
  Vehicles.remove({_id: req.params.vehiclesId}, function(err, vehicles) {
    if (err)
      res.send(err);
    res.json({ message: 'Vehicles successfully deleted' });
  });
};

exports.read_a_vehicles = function(req, res) {
 Vehicles.findById(req.params.vehiclesId, function(err, vehicles) {
   if (err)
     res.send(err);
   res.json(vehicles);
 });
};


exports.update_a_vehicle = function(req, res) {
 Vehicles.findOneAndUpdate({_id: req.params.vehiclesId}, req.body, {new: true}, function(err, vehicles) {
   if (err)
     res.send(err);
   res.json(vehicles);
 });
};
