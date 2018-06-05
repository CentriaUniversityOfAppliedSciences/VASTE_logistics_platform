'use strict';


var mongoose = require('mongoose'),
  Points = mongoose.model('Points');

exports.list_all_points = function(req, res) {
  Point.find({}, function(err, point) {
    if (err)
      res.send(err);
    res.json(point);
  });
};


exports.create_a_points = function(req, res) {
  var new_points = new Points(req.body);
  new_points.save(function(err, point) {
    if (err)
      res.send(err);
    res.json(point);
  });
};


exports.read_a_points = function(req, res) {
  Point.findById(req.params.pointId, function(err, point) {
    if (err)
      res.send(err);
    res.json(point);
  });
};


exports.update_a_points = function(req, res) {
  Point.findOneAndUpdate({_id: req.params.pointsId}, req.body, {new: true}, function(err, point) {
    if (err)
      res.send(err);
    res.json(point);
  });
};


exports.delete_a_points = function(req, res) {
  Point.remove({_id: req.params.pointsId}, function(err, point) {
    if (err)
      res.send(err);
    res.json({ message: 'Point successfully deleted' });
  });
}; 

exports.find_point_by_ID = function(req, res){
	Points.find({points:req.params.pointounerId}, function(err, points){
	if (err)
      res.send(err);
    res.json(points);
  });
}; 
