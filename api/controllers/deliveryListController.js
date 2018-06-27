'use strict';
var mongoose = require('mongoose'),
DeliveryLists = mongoose.model('DeliveryLists');


exports.list_all_deliveryLists = function(req, res) {
  DeliveryLists.find({}, function(err, ) {
    if (err)
      res.send(err);
    res.json(deliveryLists);
  });
};


exports.create_a_deliveryLists = function(req, res) {
  var new_deliveryLists = new DeliveryLists(req.body);
  new_deliveryLists.save(function(err, deliveryLists) {
    if (err)
      res.send(err);
    res.json(deliveryLists);
  });
};


exports.read_a_deliveryLists = function(req, res) {
  DeliveryLists.findById(req.params.deliveryListID, function(err, deliveryLists) {
    if (err)
      res.send(err);
    res.json(DeliveryList);
  });
};


exports.update_a_deliveryLists = function(req, res) {
  DeliveryLists.findOneAndUpdate({_id: req.params.deliveryListId}, req.body, {new: true}, function(err, deliveryLists) {
    if (err)
      res.send(err);
    res.json(deliveryLists);
  });
};


exports.delete_a_deliveryLists = function(req, res) {
  DeliveryLists.remove({_id: req.params.deliveryListsId}, function(err, deliveryLists) {
    if (err)
      res.send(err);
    res.json({ deliveryList: 'DeliveryList successfully deleted' });
  });
}; 

exports.find_deliveryLists_by_ID = function(req, res) {
  DeliveryLists.find({_id: req.params.deliveryListsId}, function(err, deliveryLists) {
    if (err)
      res.send(err);
    res.json(deliveryLists );
  });
};