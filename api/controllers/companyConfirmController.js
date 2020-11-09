'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  CompanyConfirms = mongoose.model('companyConfirms');
  var environmentJson = fs.readFileSync("./environment.json");
  var environment = JSON.parse(environmentJson);
  var apikey = environment.apikey;


exports.create_new_company_confirm = function(req,res){
	var new_comp_confirm = new CompanyConfirms({
		companyName: req.body.companyName,
		companyAddress: req.body.companyAddress,
		companyType: req.body.type,
		companyID: req.body.companyID,
		link: req.body.link,
		userID:req.body.userID,
		passWord:req.body.passWord,
		status:req.body.status,
		userInformation:{
			userName:req.body.userName,
			userCompany:req.body.userCompany,
			userPhone: req.body.userPhone,
			userAddress:req.body.userAddress,
			userMail:req.body.userMail
		}
	});

	new_comp_confirm.save(function(err, compconfirms) {
		if (err)
			res.send(err);
		if (compconfirms != undefined || compconfirms != null)
		{
			compconfirms = compconfirms.toObject();
			delete compconfirms.passWord;
		}
		res.json(compconfirms);
	});
};

exports.list_company_confirms = function(req, res){
	CompanyConfirms.find({confirmStatus: 'pending'}, function(err, compconfirms){
		if(err){
			res.send(err);
		}
		else{
			res.send(compconfirms);
		}
	})
}

exports.find_company_confirm = function(req, res){
	CompanyConfirms.find({confirmStatus: req.body.confirmStatus, _id:req.body.confirmID}, function(err, compconfirms){
		if(err){
			res.send(err);
		}
		else{
			res.send(compconfirms);
		}
	})
}

exports.update_company_confirm = function(req ,res){
	CompanyConfirms.findOneAndUpdate({_id: req.body.confirmID}, {confirmStatus:req.body.confirmStatus}, function(err, compconfirms){
		if(err){
			res.send(err);
		}
		res.json(compconfirms);
	})
}
