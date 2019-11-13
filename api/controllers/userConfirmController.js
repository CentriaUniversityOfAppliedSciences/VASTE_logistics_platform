'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  UserConfirms = mongoose.model('confirmUsers');
  var environmentJson = fs.readFileSync("./environment.json");
  var environment = JSON.parse(environmentJson);
  var apikey = environment.apikey;


exports.create_new_confirm = function(req,res){
	var new_confirm = new UserConfirms({userID:req.body.userID,passWord:req.body.passWord,status:req.body.status,
															userInformation:{userName:req.body.userName,userCompany:req.body.userCompany,
															userPhone: req.body.userPhone, userAddress:req.body.userAddress,userMail:req.body.userMail}});
	new_confirm.save(function(err, userconfirms) {
		if (err)
			res.send(err);
		if (userconfirms != undefined || userconfirms != null)
		{
			userconfirms = userconfirms.toObject();
			delete userconfirms.passWord;
		}
		res.json(userconfirms);
	});
};

exports.find_confirm = function(req,res){
	UserConfirms.find({_id:req.body.confirmID, confirmStatus:"pending"}, function(err, userconfirms){
		if(err)
			res.send(err);
		res.json(userconfirms);
	})
}

exports.delete_confirm = function(req,res){
	UserConfirms.deleteOne({_id:req.body.confirmID}, function(err, userconfirms){
		if(err)
			res.send(err);
		res.json({message: "UserConfirm successfully deleted"});
	})
}

exports.update_confirm = function(req,res){
	UserConfirms.findOneAndUpdate({_id:req.body.confirmID},{$set:{confirmStatus:req.body.confirmStatus}},{new: true}, function(err, userconfirms){
		if(err)
			res.send(err);
		res.json(userconfirms);
	})
}
