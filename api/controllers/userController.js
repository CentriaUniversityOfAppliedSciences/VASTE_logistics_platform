'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  Users = mongoose.model('Users');
  var environmentJson = fs.readFileSync("./environment.json");
  var environment = JSON.parse(environmentJson);
  var apikey = environment.apikey;

exports.list_all_users = function(req, res) {
  if (req.query.apikey == apikey)
  {
    Users.find({}, function(err, users) {
      if (err)
        res.send(err);
      res.json(users);
    });
  }
  else {
    res.send("error");
  }
};

exports.get_company_drivers = function(req, res) {
  if (req.query.apikey == apikey)
  {
    Users.find({'userInformation.userCompany':req.params.companyID, status:'driver'}, function(err, users) {
      if (err)
        res.send(err);
      console.log(users);
      res.json(users);
    });
  }
  else {
    res.send("error");
  }
};

exports.getDrivers = function(req, res) {
  if (req.query.apikey == apikey)
  {
    Users.find({status:'driver'}, function(err, users) {
      if (err)
        res.send(err);
      res.json(users);
    });
  }
  else {
    res.send("error");
  }
};


exports.create_a_users = function(req, res) {
  if (req.body.apikey == apikey)
  {
    var new_users = new Users(req.body);
    new_users.save(function(err, users) {
      if (err)
        res.send(err);
      res.json(users);
    });
  }
  else {
    res.send("error");
  }
};


exports.read_a_users = function(req, res) {
  if (req.body.apikey == apikey)
  {
    Users.findById(req.params.usersId, function(err, users) {
      if (err)
        res.send(err);
      res.json(users);
    });
  }
  else {
    res.send("error");
  }
};


exports.update_a_users = function(req, res) {
  if (req.body.apikey == apikey)
  {
    Users.findOneAndUpdate({_id: req.body.userID}, {$set:{passWord:req.body.passWord}}, {new: true}, function(err, users) {
      if (err){
			console.log(err);
        res.send(err);
			}
      res.json(users);
    });
  }
  else {
    res.send("error");
  }
};


exports.delete_a_users = function(req, res) {
  if (req.body.apikey == apikey)
  {
    Users.remove({_id: req.params.usersId}, function(err, users) {
      if (err)
        res.send(err);
      res.json({ message: 'Users successfully deleted' });
    });
  }
  else {
    res.send("error");
  }
};

//android use, uses req.body instead of req.params
exports.identification = function(req, res) {
  if (req.body.apikey == apikey)
  {
    Users.find({userID:req.body.userId, passWord:req.body.passWord }, function(err, users) {
      if (err)
        res.send(err);

      res.json(users);
    });
  }
  else {
    res.send("error");
  }
};
