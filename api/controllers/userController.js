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

    Users.find({'userInformation.userCompany':req.body.companyID, status:'driver'}, function(err, users) {
      if (err)
        res.send(err);
      console.log(users);
      res.json(users);
    });

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

    var new_users = new Users(req.body);
    new_users.save(function(err, users) {
      if (err)
        res.send(err);
      res.json(users);
    });

};


exports.read_a_users = function(req, res) {

    Users.findOne({userID:req.body.userID}, function(err, users) {
      if (err)
        res.send(err);
      console.log(users);
      res.json(users);
    });

};


exports.update_a_users = function(req, res) {

    Users.findOneAndUpdate({_id: req.body.userID, 'userInformation.userCompany': req.body.companyID}, {$set:{passWord:req.body.passWord}}, {new: true}, function(err, users) {
      if (err){
			console.log(err);
        res.send(err);
			}
      console.log(users);
      //delete users.passWord;
      res.json(users);
    });

};
exports.reset_a_user = function(req, res) {

    Users.findOneAndUpdate({_id: req.body.userID}, {$set:{passWord:req.body.passWord}}, {new: true}, function(err, users) {
      if (err){
			console.log(err);
        res.send(err);
			}
      console.log(users);
      //delete users.passWord;
      res.json(users);
    });

};


exports.delete_a_users = function(req, res) {

    Users.remove({_id: req.body.userID, 'userInformation.userCompany':req.body.companyID}, function(err, users) {
      if (err)
        res.send(err);
      res.json({ message: 'User successfully deleted' });
    });

};

//android,www use, uses req.body
exports.identification = function(req, res) {

    Users.find({ userID:req.body.userId, passWord:req.body.passWord }, function(err, users) {
      if (err)
      {
        res.send(err);
      }
      else {
        var CompanyProperties = mongoose.model('CompanyProperties');
        if (users != undefined && users != null && users.length > 0)
        {
          CompanyProperties.find({companyID: users[0].userInformation.userCompany}, function(err, cp) {
            users = users[0].toObject();
            delete users.passWord;
            if (err)
            {
              res.send(err);
            }
            else{
              for(var x = 0;x < cp.length; x++)
              {
                if (cp[x].type == 'apikey')
                {
                  users['apikey'] = cp[x].value;
                }
              }
              users = [users];
              res.json(users);
            }
          });
        }
        else {
          res.send('error');
        }
      }

    });

};

//api user authentication
exports.apiidentification = function(req, res) {

    Users.find({ userID:req.body.userId, passWord:req.body.passWord }, function(err, users) {
      if (err)
      {
        res.send(err);
      }
      else {
        var CompanyProperties = mongoose.model('CompanyProperties');
        CompanyProperties.find({companyID: users[0].userInformation.userCompany}, function(err, cp) {
          var ret = {"userID":users[0].userID, "status":users[0].status};
          if (err)
          {
            res.send(err);
          }
          else{
            for(var x = 0;x < cp.length; x++)
            {
              if (cp[x].type == 'apikey')
              {
                //ret['apikey'] = cp[x].value;
                createTempKey(function (back){
                  ret['api_key'] = back;
                  ret = [ret];
                  var CompanyProperties = mongoose.model('CompanyProperties');
                  var new_companys = new CompanyProperties({companyID:users[0].userInformation.userCompany,type:'tempkey',value:back});
                  new_companys.save(function(err, cp) {
                    if (err){
                      res.send(err);
                    }
                    res.json(ret);
                    //res.json(companys);
                  });

                });
              }
            }

          }
        });
      }

    });

};

function createTempKey(callback)
{
  var chars = "0123456789ABCDEFGHJKLMNPRSTUVWXTZabcdefhikmnprstuvwxyz";
	var string_length = 32;
	var randomstring = '';
  for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
  callback(randomstring)
}
