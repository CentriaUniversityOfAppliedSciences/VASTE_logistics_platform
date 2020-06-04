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

exports.list_all_userids = function(req,res){
	Users.find({}, function(err, users){
		if(err)
			res.send(err);

		var u = [];
		if(users != undefined && users != null)
		{
			for (var i = 0; i < users.length; i++) {
				u.push(users[i].userID);
			}
		}
		res.json(u);
	})
}

exports.find_customer_by_mail = function(req,res){
	Users.find({'userInformation.userMail': req.body.userMail, status:'customer'}, function(err, users){
		if(err)
			res.send(err);
		var u = [];

		if(users != null && users != undefined)
		{
			for (var i = 0; i < users.length; i++) {
				u.push(users[i].userID);
			}
		}
		res.json(u);
	});
}

//Find customer company / store's users
exports.find_store_users = function(req,res){
	Users.find({'userInformation.userCompany': req.body.companyID, $or:[{status:'customer'}, {status: 'shopkeeper'}]}, function(err, users){
		if(err)
			res.send(err);
		var u = [];
		if (users != undefined && users != null)
		{

			for (var i = 0;i< users.length;i++)
			{
				var us = users[i].toObject();
				delete us.passWord;

				u.push(us);
			}

		}
		res.json(u);
	});
}

exports.get_company_drivers = function(req, res) {

    Users.find({'userInformation.userCompany':req.body.companyID, status:'driver'}, function(err, users) {
      if (err)
        res.send(err);
      var u = [];
      if (users != undefined && users != null)
      {

        for (var i = 0;i< users.length;i++)
        {
          var us = users[i].toObject();
					delete us.passWord;

          u.push(us);
        }

      }
      res.json(u);
    });

};

exports.getDrivers = function(req, res) {
  if (req.query.apikey == apikey)
  {
    Users.find({status:'driver'}, function(err, users) {
      if (err)
        res.send(err);
        var u = [];
        if (users != undefined && users != null)
        {

          for (var i = 0;i< users.length;i++)
          {
            var us = users[i].toObject();
            delete us.passWord;
            u.push(us);
          }

        }
        res.json(u);
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

exports.create_a_customer = function(req,res){
		var new_customer = new Users({userID:req.body.userID,passWord:req.body.passWord,status:req.body.status,
                                userInformation:{userName:req.body.userName,userCompany:req.body.companyID,
                                userPhone: req.body.userPhone, userAddress:req.body.userAddress,userMail:req.body.userMail}})

		new_customer.save(function(err, users){
			if(err)
				res.send(err);

			if(users != undefined && users != null){
				users = users.toObject();
				delete users.passWord;
			}
			res.json(users);
		})
};

exports.create_a_driver = function(req, res) {

    var new_users = new Users({userID:req.body.userID,passWord:req.body.passWord,status:'driver',
                                userInformation:{userName:req.body.userName,userCompany:req.body.companyID,
                                userPhone: req.body.userPhone, userAddress:req.body.userAddress,userMail:req.body.userMail}});
    new_users.save(function(err, users) {
      if (err)
        res.send(err);
      if (users != undefined && users != null)
      {
        users = users.toObject();
        delete users.passWord;
      }
      res.json(users);
    });

};

exports.read_a_users = function(req, res) {

    Users.findOne({userID:req.body.userID}, function(err, users) {
      if (err)
        res.send(err);

      if (users != undefined && users != null)
      {
        users = users.toObject();
        delete users.passWord;
      }
      //console.log(users);
      res.json(users);
    });

};

exports.get_api_user = function(req, res) {

    Users.findOne({userID:req.body.userID, 'userInformation.userCompany': req.body.companyID}, function(err, users) {
      if (err)
        res.send(err);

      if (users != undefined && users != null)
      {
        users = users.toObject();
        delete users.passWord;
      }
      //console.log(users);
      res.json(users);
    });

};


exports.update_a_users = function(req, res) {

    Users.findOneAndUpdate({_id: req.body.userID, 'userInformation.userCompany': req.body.companyID}, {$set:{passWord:req.body.passWord}}, {new: true}, function(err, users) {
      if (err){
			console.log(err);
        res.send(err);
			}
      if (users != undefined && users != null)
      {
        users = users.toObject();
        delete users.passWord;
      }
      //delete users.passWord;
      res.json(users);
    });
};

exports.update_a_customers = function(req, res) {

    Users.findOneAndUpdate({_id: req.body.userID, status:'customer'}, {$set:{passWord:req.body.passWord}}, {new: true}, function(err, users) {
      if (err){
			console.log(err);
        res.send(err);
			}
      if (users != undefined && users != null)
      {
        users = users.toObject();
        delete users.passWord;
      }
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
      if (users != undefined && users != null)
      {
        users = users.toObject();
        delete users.passWord;
      }
      //delete users.passWord;
      res.json(users);
    });

};


exports.delete_a_users = function(req, res) {
    Users.deleteOne({_id: req.body.userID, 'userInformation.userCompany':req.body.companyID}, function(err, users) {
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

//customer authentication

exports.customer_identification = function(req,res){
	Users.find({userID:req.body.userId, passWord:req.body.passWord, $or:[{status:'customer'}, {status:'driver'}, {status:'shopkeeper'}]}, function(err, users)
	{
		if(err)
		{
			res.send(err);
		}
		else{
			if(users != undefined && users != null && users.length > 0)
			{
				users = users[0].toObject();
				delete users.passWord;

				users = [users];
				res.json(users);
			}
			else{
				res.send('error');
			}
		}
	});
}

exports.create_a_user_from_confirm = function(req, res) {
	var new_user = new Users({userID:req.body.userID,passWord:req.body.passWord,status:req.body.status,
															userInformation:{userName:req.body.userName,userCompany:req.body.companyID,
															userPhone: req.body.userPhone, userAddress:req.body.userAddress,userMail:req.body.userMail}})

	new_user.save(function(err, users){
		if(err)
			res.send(err);

		if(users != undefined || users != null){
			users = users.toObject();
			delete users.passWord;
		}
		res.json(users);
	})
};

//api user authentication
exports.apiidentification = function(req, res) {

    Users.find({ userID:req.body.userId, passWord:req.body.passWord }, function(err, users) {
      if (err)
      {
        res.send(err);
      }
      else {
        if (users != undefined && users != null && users.length > 0)
        {
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
        else {
          res.json({"status":"error"});
        }
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
