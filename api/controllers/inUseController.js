'use strict';


var mongoose = require('mongoose'),
  inUse = mongoose.model('InUse');

  exports.list_all = function(req, res) {
      inUse.find({companyID:req.body.companyID}, function(err, inuse) {
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

      inUse.findOneAndUpdate({vehicleID: req.body.vehicleID, companyID: req.body.companyID}, {userID:req.body.userID,timestamp:req.body.timestamp,status:req.body.status}, {new: false, upsert: true}, function(err, iu) {
        if (err)
          res.send(err);
        res.json(iu);
      });
  };
