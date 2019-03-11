'use strict';


var mongoose = require('mongoose'),
  Stripe = mongoose.model('Stripe');
var async = require('async');

exports.create_stripe = function(req, res) {
  var new_stripe = new Stripe(req.body);
  new_stripe.save(function(err, st) {
    if (err)
      res.send(err);
    res.json(st);
  });
};
