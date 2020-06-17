'use strict';


var mongoose = require('mongoose'),
  Payments = mongoose.model('Payments');

exports.list_all_payments = function(req, res) {
  Payments.find({type:0}, function(err, payments) {
    if (err)
		{
      res.send(err);
		}
    //console.log(payments);
    res.json({payments});
  });
};

exports.list_all_payments_other = function(req, res) {
  Payments.find({type:req.body.type}, function(err, payments) {
    if (err)
		{
      res.send(err);
		}
    //console.log(payments);
    res.json({payments});
  });
};

exports.create_a_payments = function(req, res) {
  var new_payments = new Payments(req.body);
  new_payments.save(function(err, payments) {
    if (err)
		{
      res.send(err);
		}
		if(payments != null || payments != undefined)
		{
			payments = payments.toObject();
		}
    res.json(payments);
  });
};

exports.find_by_companyid = function(req,res){
	Payments.find({"companyID": req.body.companyID}, function(err, payments){
		if(err)
		{
			res.send(err);
		}
		res.json(payments)
	})
}


exports.read_a_payments = function(req, res) {
  Payments.findById(req.params.paymentsId, function(err, payments) {
    if (err)
      res.send(err);
    res.json(payments);
  });
};


exports.update_a_payments = function(req, res) {
  Payments.findOneAndUpdate({_id: req.params.paymentsId}, req.body, {new: true}, function(err, payments) {
    if (err)
      res.send(err);
    res.json(payments);
  });
};


exports.delete_a_payments = function(req, res) {
  Payments.deleteOne({_id: req.body.paymentID, companyID: req.body.companyID}, function(err, payments) {
    if (err)
		{
      res.send(err);
		}
    res.json({ payment: 'Payments successfully deleted' });
  });
};


exports.find_payment_by_ID = function(req, res) {
  Payments.find({_id: req.params.paymentsId}, function(err, payments) {
    if (err)
      res.send(err);
    res.json(payments );
  });
};

exports.find_payment_by_delivery = function(req, res){
	Payments.find({deliveryId:req.params.deliverysId}, function(err, payments){
	if (err)
      res.send(err);
    res.json(payments);
  });
};

exports.find_payment_by_company = function(req, res){
	Payments.find({company:req.params.company}, function(err, payments){
	if (err)
      res.send(err);
    res.json(payments);

  });
}

exports.find_payment_by_company_and_route = function(req, res){
	Payments.find({companyID: req.body.companyID, routeID:req.body.routeID}, function(err, payments){
	if (err)
      res.send(err);
    res.json(payments);
  });
}

exports.find_payment_by_route_and_type = function(req, res){
	Payments.find({companyID: req.body.companyID, routeID:req.body.routeID, type: req.body.type}, function(err, payments){
	if (err)
      res.send(err);
    res.json(payments);

  });
};
