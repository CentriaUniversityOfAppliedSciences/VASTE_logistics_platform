'use strict';


var mongoose = require('mongoose'),
  Cars= mongoose.model('Cars');

exports.list_all_cars = function(req, res) {
  Cars.find({}, function(err, cars) {
    if (err)
      res.send(err);
    res.json(cars);
  });
};




exports.create_a_cars = function(req, res) {
  var new_cars = new Cars(req.body);
  new_cars.save(function(err, cars) {
    if (err)
      res.send(err);
    res.json(cars);
  });
};


exports.read_a_cars = function(req, res) {
  Cars.findById(req.params.carsId, function(err, cars) {
    if (err)
      res.send(err);
    res.json(cars);
  });
};


exports.update_a_cars = function(req, res) {
  Cars.findOneAndUpdate({_id: req.params.carsId}, req.body, {new: true}, function(err, cars) {
    if (err)
      res.send(err);
    res.json(cars);
  });
};


exports.delete_a_cars = function(req, res) {


  Cars.remove({
    _id: req.params.carsId
  }, function(err, cars) {
    if (err)
      res.send(err);
    res.json({ message: 'Cars successfully deleted' });
  });
};


