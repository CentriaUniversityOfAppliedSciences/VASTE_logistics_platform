'use strict';


var mongoose = require('mongoose'),
  CompanyProperties = mongoose.model('CompanyProperties');

  exports.list_all_properties = function(req, res) {
    CompanyProperties.find({}, function(err, companys) {
      if (err)
        res.send(err);
      res.json(companys);
    });
  };


  exports.create_a_property = function(req, res) {
    var new_companys = new CompanyProperties(req.body);
    new_companys.save(function(err, companys) {
      if (err)
        res.send(err);
      res.json(companys);
    });
  };

  exports.update_a_property = function(req, res) {
    CompanyProperties.findOneAndUpdate({_id: req.params.propertyid}, req.body, {new: true}, function(err, companys) {
      if (err)
        res.send(err);
      res.json(companys);
    });
  };


  exports.delete_a_property = function(req, res) {
    CompanyProperties.remove({_id: req.params.propertyid}, function(err, companys) {
      if (err)
        res.send(err);
      res.json({ message: 'Companys successfully deleted' });
    });
  };
  exports.find_by_companyid = function(req, res) {
    CompanyProperties.find({companyID: req.body.companysId}, function(err, companys) {
      if (err)
        res.send(err);
      res.json({companys});
    });
  };
  exports.find_company_by_apikey = function(req, res) {
    CompanyProperties.find({value: req.body.apikey, type:'apikey'}, function(err, companys) {
      if (err)
        res.send(err);
      res.json({companys});
    });
  };
  exports.find_company_by_tempkey = function(req, res) {
    CompanyProperties.find({value: req.body.api_key, type:'tempkey'}, function(err, companys) {
      if (err)
        res.send(err);
      res.json({companys});
    });
  };
