'use strict';
var request = require('request');
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var mongoose = require('mongoose'),
  Coupons = mongoose.model('Coupons');

exports.list_all_coupons = function(req,res){
	Coupons.find({}, function(err, coupons){
		if(err)
			res.send(err);
		res.json(coupons);
	})
};

exports.update_a_coupon = function(req,res){
	Coupons.findOneAndUpdate({couponID: req.body.couponID}, {$set:{redemptions:req.body.redemptions}}, {new: true}, function(err, coupons){
		if(err)
			res.send(err);
		res.json(coupons);
	});
};

exports.create_a_coupon = function(req,res){
	var new_coupon = new Coupons(req.body);
	new_coupon.save(function(err, coupons){
		if(err)
			res.send(err);
		res.json(coupons)
	});
};

exports.delete_a_coupon = function(req,res){
	Coupons.deleteOne({_id: req.body.couponID}, function(err, coupons){
		if(err){
			console.log(err);
			res.send(err);
		}
		res.json({coupon: 'Coupon successfully deleted'});
	});
}

exports.find_a_coupon = function(req,res){
	Coupons.findOne({couponID:req.body.couponID}, function(err, coupons){
		if(err)
			res.send(err);
		res.json(coupons);
	})
}
