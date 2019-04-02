'use strict';


var mongoose = require('mongoose'),
  Points = mongoose.model('Points');
  var Lockers = mongoose.model('Lockers');
  var async = require('async');

exports.list_all_points = function(req, res) {
  Points.find({}, function(err, point) {
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
  Points.findById(req.params.pointId, function(err, point) {
    if (err)
      res.send(err);
    res.json(point);
  });
};


exports.update_a_points = function(req, res) {
  Points.findOneAndUpdate({_id: req.params.pointId}, req.body, {new: true}, function(err, point) {
    if (err)
      res.send(err);
    res.json(point);
  });
};


exports.delete_a_points = function(req, res) {
  Points.remove({_id: req.params.pointId}, function(err, point) {
    if (err)
      res.send(err);
    res.json({ message: 'Point successfully deleted' });
  });
};



exports.listboxes = function(req, res) {
  Points.find({}, function(err, points) {
    if (err)
      res.send(err);
    getBoxStatuses(points,function(erro,r){
      res.json(r);
    });
  });


};

function getBoxStatuses(boxes, callback)
{
	var boxe = [];
	var iteratorFcn = function(box,done)
	{
		if (box._id == null)
		{
			done();
			return;
		}

			var query = {'pointID':box._id};
			Lockers.find(query, function(err, result) {
				if (err)
				{
				  res.send(err);
				}
        var b = box.toObject();
        b.lockers = result;
				boxe.push(b);
				done();
				return;
			  });

	};
	var doneIteratingFcn = function(err)
	{
		callback(err,boxe);
	};

	async.forEach(boxes, iteratorFcn, doneIteratingFcn);
}
