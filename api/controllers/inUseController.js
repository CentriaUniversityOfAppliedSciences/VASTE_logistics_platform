'use strict';


var mongoose = require('mongoose'),
  inUse = mongoose.model('InUse');

  exports.list_all = function(req, res) {
      inUse.find({}, function(err, inuse) {
        if (err)
          res.send(err);
        res.json(inuse);
      });
  };

  exports.create = function(req, res) {
      var ius = new inUse(req.body);
      ius.save(function(err, inuse) {
        if (err)
          res.send(err);
        res.json(inuse);
      });
  };

  exports.update = function(req, res) {
      //var ius = new inUse(req.body);

      inUse.findOneAndUpdate({vehicleID: req.body.vehicleID}, {userID:req.body.userID,timestamp:req.body.timestamp,status:req.body.status, vehicleID:req.body.vehicleID}, {new: false, upsert: true}, function(err, iu) {
        if (err)
          res.send(err);
        res.json(iu);
      });
  };
