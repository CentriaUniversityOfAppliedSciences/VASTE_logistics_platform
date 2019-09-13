'use strict';


var mongoose = require('mongoose'),
DriverCompanies = mongoose.model('DriverCompanies');

exports.list_all = function(req, res) {
  DriverCompanies.find({}, function(err, dc) {
    if (err)
      res.send(err);
    res.json(dc);
  });
};

exports.create_a_connection = function(req, res) {
  var ndc = new DriverCompanies(req.body);
  ndc.save(function(err, dc) {
    if (err)
      res.send(err);
    res.json(dc);
  });
};

exports.read_a_connection = function(req, res) {
  DriverCompanies.findById(req.params.id, function(err, dc) {
    if (err)
      res.send(err);
    res.json(dc);
  });
};

exports.findDriver = function(req, res) {
  DriverCompanies.find({_id: req.params.driverID}, function(err, dc) {
    if (err)
      res.send(err);
    res.json(dc);
  });
};

exports.update_a_dc = function(req, res) {
  DriverCompanies.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, dc) {
    if (err)
      res.send(err);
    res.json(vehicles);
  });
};

exports.delete_a_dc = function(req, res) {
  DriverCompanies.deleteOne({_id: req.params.id}, function(err, dc) {
    if (err)
      res.send(err);
    res.json({ message: 'Driver/company connection successfully deleted' });
  });
};
