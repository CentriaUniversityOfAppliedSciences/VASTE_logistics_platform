'use strict';


var mongoose = require('mongoose'),
  Routes = mongoose.model('Routes');

exports.list_all_routes = function(req, res) {
  Routes.find({}, function(err, ) {
    if (err)
      res.send(err);
    res.json(routes);
  });
};


exports.create_a_routes = function(req, res) {
  var new_routes = new Routes(req.body);
  new_routes.save(function(err, routes) {
    if (err)
      res.send(err);
    res.json(routes);
  });
};

  Routes.findById(req.params.routesId, function(err, routes) {
    if (err)
      res.send(err);
    res.json(routes);
  });
};


exports.update_a_routes = function(req, res) {
  Routes.findOneAndUpdate({_id: req.params.routesId}, req.body, {new: true}, function(err, routes) {
    if (err)
      res.send(err);
    res.json(routes);
  });
};


exports.delete_a_routes = function(req, res) {
  Routes.remove({_id: req.params.routesId}, function(err, routes) {
    if (err)
      res.send(err);
    res.json({ route: 'Routes successfully deleted' });
  });
}; 

exports.find_route_by_ID = function(req, res) {
  Routes.find({_id: req.params.routesId}, function(err, routes) {
    if (err)
      res.send(err);
    res.json(routes );
  });
};