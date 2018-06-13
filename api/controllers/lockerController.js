'use strict';


var mongoose = require('mongoose'),
  Lockers = mongoose.model('Lockers');

exports.list_all_lockers = function(req, res) {
  Lockers.find({}, function(err, ) {
    if (err)
      res.send(err);
    res.json(lockers);
  });
};


exports.create_a_lockers = function(req, res) {
  var new_lockers = new Lockers(req.body);
  new_lockers.save(function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers);
  });
};


exports.read_a_lockers = function(req, res) {
  Lockers.findById(req.params.lockersId, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers);
  });
};


exports.update_a_lockers = function(req, res) {
  Lockers.findOneAndUpdate({_id: req.params.lockersId}, req.body, {new: true}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers);
  });
};


exports.delete_a_lockers = function(req, res) {
  Lockers.remove({_id: req.params.lockersId}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json({ message: 'Lockers successfully deleted' });
  });
}; 

exports.find_locker_by_ID = function(req, res) {
  Lockers.find({_id: req.params.lockersId}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers );
  });
}; 

exports.find_by_pointID = function(req, res) {
  Lockers.find({_id: req.params.pointId}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers );
  });
}; 

exports.find_by_status = function(req, res) {
  Lockers.find({status: req.params.status}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers );
  });
}; 