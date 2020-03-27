'use strict';
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);

var mongoose = require('mongoose'),
  Lockers = mongoose.model('Lockers');
  var boxes = require('../controllers/boxController');

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
  Lockers.findById(req.body.lockersId, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers);
  });
};

exports.find_locker_by_orderid = function(req,res){
	Lockers.find({orderID: req.body.orderID}, function(err, lockers){
		if(err){
			res.send(err);
			console.log(err);
		}
		res.json(lockers);
	})
}


exports.update_a_lockers = function(req, res) {
  Lockers.findOneAndUpdate({_id: req.body.lockersId}, req.body, {new: true}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers);
  });
};


exports.delete_a_lockers = function(req, res) {
  Lockers.deleteOne({_id: req.body.lockersId}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json({ message: 'Lockers successfully deleted' });
  });
};

exports.find_locker_by_ID = function(req, res) {
  Lockers.find({_id: req.body.lockersId}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers );
  });
};

exports.find_by_pointID = function(req, res) {
  Lockers.find({_id: req.body.pointId}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers );
  });
};

exports.find_by_status = function(req, res) {
  Lockers.find({status: req.body.status}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers );
  });
};

exports.book_a_locker = function(req, res) {
  Lockers.findOneAndUpdate({_id: req.body.id}, {lockerStatus: req.body.lockerStatus,
    lockerCode:req.body.lockerCode,lockerCode2:req.body.lockerCode2,orderID:req.body.orderID,type:req.body.type}, {new: false}, function(err, lockers) {
    if (err)
    {
      res.send(err);
    }
    if (req.body.type == 'pickup' || req.body.type == 'delivery')
    {
      if (req.body.machine == "7" || req.body.machine == "8")
      {
        boxes.boxAnnounce(req.body.type,req.body.vasteOrder,"8600",req.body.size,req.body.valid ,function(vast){
          if (vast != undefined && vast != null && vast != 'error')
          {
            res.json(lockers);
          }
          else {
            res.json(null)
          }
        });
      }
      else if (req.body.machine == "9")
      {
          var Lock = require('./lockController.js');
          if (req.body.mode == 'stowage')
          {
            Lock.createCode(req.body.name1, req.body.code1, 5.0, "Centria", req.body.vasteOrder,req.body.orderID,function(r)
            {
                //res.json(r);
            });
            Lock.createCode(req.body.name2, req.body.code2, 15.0, "Centria", req.body.vasteOrder,req.body.orderID,function(re)
            {
                res.json(lockers);
            });
          }
          else if (req.body.mode == 'box_pickup')
          {
            Lock.createCode("Kuljetusliike", req.body.code1, 10.0, "Centria", req.body.vasteOrder,req.body.orderID,function(r)
            {
                //res.json(r);
            });
            Lock.createCode(req.body.name, req.body.code2, 20.0, "Centria", req.body.vasteOrder,req.body.orderID,function(re)
            {
                res.json(lockers);
            });
          }
          else if (req.body.mode == 'box_delivery')
          {
            Lock.createCode(req.body.name, req.body.code1, 5.0, "Centria", req.body.vasteOrder,req.body.orderID,function(r)
            {
                //res.json(r);
            });
            Lock.createCode("Kuljetusliike", req.body.code2, 15.0, "Centria", req.body.vasteOrder,req.body.orderID,function(re)
            {
                res.json(lockers);
            });
          }
          else if (req.body.mode == 'box')
          {
            if (req.body.type == 'pickup')
            {
              Lock.createCode(req.body.name, req.body.code1, 5.0, "Centria", req.body.vasteOrder,req.body.orderID,function(r)
              {
                  //res.json(r);
              });
              Lock.createCode("Kuljetusliike", req.body.code2, 15.0, "Centria", req.body.vasteOrder,req.body.orderID,function(re)
              {
                  res.json(lockers);
              });
            }
            else {
              Lock.createCode("Kuljetusliike", req.body.code1, 10.0, "Centria", req.body.vasteOrder,req.body.orderID,function(r)
              {
                  //res.json(r);
              });
              Lock.createCode(req.body.name, req.body.code2, 20.0, "Centria", req.body.vasteOrder,req.body.orderID,function(re)
              {
                  res.json(lockers);
              });
            }
          }
      }
      else {
        if (environment.environment =='prod')
        {
          req.body.machine = "100"+req.body.machine;
          boxes.boxAnnounce(req.body.type,req.body.vasteOrder,req.body.machine,req.body.size,req.body.valid ,function(vast){

            if (vast != undefined && vast != null && vast != 'error')
            {
              res.json(lockers);
            }
            else {
              res.json(null)
            }
          });
        }
        else {
          res.json(lockers);
        }
      }
    }
    else {
      res.json(lockers);
    }
  });
};


exports.unbook_a_locker = function(req, res) {
  Lockers.findOneAndUpdate({_id: req.body.id}, {lockerStatus: "available",
    lockerCode:"",lockerCode2:"",orderID:"",type:""}, {new: true}, function(err, lockers) {
    if (err)
    {
      res.send(err);
    }

      /*if(req.body.machine == "1" || req.body.machine == "2")
      {
        req.body.machine = "100"+req.body.machine;

        boxes.boxCancel(req.body.vasteOrder,req.body.type,req.body.machine,function(vast){

          if (vast != undefined && vast != null && vast != 'error')
          {
            res.json(lockers);
          }
          else {
            res.json(null)
          }

        });
      }
      else*/
      if (req.body.machine == "7" || req.body.machine == "8")
      {
        boxes.boxCancel(req.body.vasteOrder,req.body.type,"8600",function(vast){

          if (vast != undefined && vast != null /*&& vast != 'error'*/)
          {
            res.json(lockers);
          }
          else {
            res.json(null);
          }

        });
      }
      else {
        if (environment.environment == 'prod')
        {
          req.body.machine = "100"+req.body.machine;

          boxes.boxCancel(req.body.vasteOrder,req.body.type,req.body.machine,function(vast){

            if (vast != undefined && vast != null && vast != 'error')
            {
              res.json(lockers);
            }
            else {
              res.json(null);
            }

          });
        }
        else
        {
          res.json(lockers);
        }
      }
  });
};

exports.get_locker_pin = function(req, res) {
  Lockers.findOne({orderID: req.body.orderID, type:req.body.type}, function(err, lockers) {
    if (err)
      res.send(err);
    res.json(lockers);
  });
};
