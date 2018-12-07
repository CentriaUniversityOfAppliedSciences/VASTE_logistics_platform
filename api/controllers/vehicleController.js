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

exports.find_by_status = function(req, res) {
  Vehicles.find({status:req.params.status}, function(err, vehicles) {
    if (err)
      res.send(err);
    res.json(vehicles);
  });
};

exports.find_by_state = function(req, res) {
  Vehicles.find({state:req.params.state}, function(err, vehicles) {
    if (err)
      res.send(err);
    res.json(vehicles);
  });
};

exports.find_by_companyid = function(req, res) {
  Vehicles.find({"companyID":req.params.companyID}, function(err, vehicles) {
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

exports.find_by_size = function(req, res) {
  Vehicles.find({maxSize: req.params.maxSize}, function(err, vehicles) {
    if (err)
      res.send(err);
    res.json({vehicles });
  });
};

exports.find_by_weight = function(req, res) {
  Vehicles.find({maxWeight: req.params.maxWeight}, function(err, vehicles) {
    if (err)
      res.send(err);
    res.json({vehicles });
  });
};

exports.find_by_people = function(req, res) {
  Vehicles.find({maxPeople: req.params.maxPeople}, function(err, vehicles) {
    if (err)
      res.send(err);
    res.json({vehicles });
  });
};
