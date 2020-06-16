'use strict';


var mongoose = require('mongoose'),
  Companys = mongoose.model('Companys');

exports.list_all_companys = function(req, res) {
  Companys.find({}, function(err, companys) {
    if (err)
      res.send(err);
    res.json(companys);
  });
};


exports.create_a_companys = function(req, res) {
  var new_companys = new Companys(req.body);
  new_companys.save(function(err, companys) {
    if (err)
      res.send(err);
    res.json(companys);
  });
};

exports.create_a_customer_company = function(req, res){
	var new_companys = new Companys(req.body);
	new_companys.save(function(err, companys) {
		if (err)
			res.send(err);
		res.json(companys);
	});
}


exports.read_a_companys = function(req, res) {
  Companys.findById(req.params.companysId, function(err, companys) {
    if (err)
      res.send(err);
    res.json(companys);
  });
};


exports.update_a_companys = function(req, res) {
  Companys.findOneAndUpdate({_id: req.params.companysId}, req.body, {new: true}, function(err, companys) {
    if (err)
      res.send(err);
    res.json(companys);
  });
};


exports.delete_a_companys = function(req, res) {
  Companys.deleteOne({_id: req.params.companysId}, function(err, companys) {
    if (err)
      res.send(err);
    res.json({ message: 'Companys successfully deleted' });
  });
};

exports.find_company_by_ID = function(req, res) {
  Companys.find({_id: req.body.companysId}, function(err, companys) {
    if (err)
			console.log(err);
      res.send(err);
    res.json({companys });
  });
};

exports.find_company_by_link = function(req, res) {
  Companys.find({link: req.body.link}, function(err, companys) {
    if (err)
      res.send(err);
    res.json({companys});
  });
};

exports.find_customer_company = function(req,res){
	Companys.find({_id:req.body.companyID, companyType: 'store'}, function(err, companys){
		if(err)
      res.send(err);
		res.json(companys);
	})
}
