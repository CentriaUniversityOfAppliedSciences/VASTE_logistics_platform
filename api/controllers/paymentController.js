'use strict';


var mongoose = require('mongoose'),
  Payments = mongoose.model('Payments');

exports.list_all_payments = function(req, res) {
  Payments.find({}, function(err, payments) {
    if (err)
		{
      res.send(err);
		}
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
  Payments.remove({_id: req.params.paymentsId}, function(err, payments) {
    if (err)
      res.send(err);
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
};
