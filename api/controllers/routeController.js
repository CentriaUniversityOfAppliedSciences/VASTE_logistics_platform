'use strict';


var mongoose = require('mongoose'),
  Routes = mongoose.model('Routes');

exports.list_all_routes = function(req, res) {
  Routes.find({}, function(err,routes ) {
    if (err)
      res.send(err);
    res.json(routes);
  });
};

exports.getCompanyRoutes = function(req, res) {
  Routes.find({companyID:req.body.companyID}, function(err, routes) {
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


exports.read_a_routes = function(req, res) {
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
  Routes.deleteOne({_id: req.body.id, companyID: req.body.companyID}, function(err, routes) {
    if(err){
			console.log(err);
      res.send(err);
		}
    res.json({ route: 'Routes successfully deleted' });
  });
};

exports.find_route_by_ID = function(req, res) {
  Routes.find({_id: req.body.routeID}, function(err, routes) {
    if (err)
      res.send(err);
    res.json(routes );
  });
};

exports.find_route_by_routeID = function(req, res) {
  Routes.find({routeID: req.body.routeID}, function(err, routes) {
    if (err)
      res.send(err);
    res.json(routes );
  });
};
