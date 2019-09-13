'use strict';
var mongoose = require('mongoose'),
DeliveryLists = mongoose.model('DeliveryLists');
var Orders = mongoose.model('Orders');
var Deliveries = mongoose.model('Deliverys');
var async = require('async');

exports.list_all_deliveryLists = function(req, res) {
  DeliveryLists.find({}, function(err, deliveryLists) {
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
    res.json(deliveryLists);
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
  DeliveryLists.deleteOne({_id: req.params.deliveryListsId}, function(err, deliveryLists) {
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

exports.getDeliveryListsForVehicle = function(req, res) {
  DeliveryLists.find({vehicleId: req.body.vehicleId}, function(err, deliveryLists) {
    if (err)
		res.send(err);

	getDeliveriesForLists(deliveryLists, function(err,r)
	{
		//console.log(r);
		res.json(r);
	});


  });
};
/*exports.getDeliveryListForVehicleById = function(req, res) {
  DeliveryLists.find({_id: req.params.listId}, function(err, deliveryLists) {
    if (err)
		res.send(err);
		getDeliveriesForLists(deliveryLists, function(err,r)
		{
			console.log(r);
			res.json(r);
		});

  });
};*/

function getDeliveriesForLists(lists, callback)
{
	var ordery = [];
	var iteratorFcn = function(list,done)
	{
		if (list._id == null)
		{
			done();
			return;
		}

			//console.log(list);
		getOrdersForList(list.list, function (err,r)
		{
			var h = { "_id":"","list":[],"companyID":{},"timestamp":{},"name":{},"vehicleId":{}};
					h._id = list._id;
					h.list = r;
					h.companyID = list.companyID;
					h.timestamp = list.timestamp;
					h.name = list.name;
					h.vehicleId = list.vehicleId;

					//console.log(h);

					ordery.push(h);

			done();
			return;
		} );

	};
	var doneIteratingFcn = function(err)
	{
		callback(err,ordery);
	};

	async.forEach(lists, iteratorFcn, doneIteratingFcn);
}

function getOrdersForList(onelist, callback)
{
	var ordery = [];
	var iteratorFcn = function(list,done)
	{
		if (list._id == null)
		{
			done();
			return;
		}

			var query1 = {'_id':list.orderNumber};

			Orders.find(query1, function(err1, result1) {
				if (err1)
				{
				  res.send(err1);
				}
				var query2 = {'orderID':result1[0]._id};

				Deliveries.find(query2, function(err2, result2) {
					if (err2)
					{
					  res.send(err2);
					}
					console.log(result2);

					var h = { "_id":"","subscriber":{},"receiver":{},"address":{},"time":{},"orderStatus":{},"status":"","delivery":{}, "type":"","orderInfo":"","orderDescription":"" };
					h.subscriber = result1[0].subscriber;
					h.receiver = result1[0].receiver;
					h.address = result1[0].address;
					h.time = result1[0].time;
					h.orderstatus = result1[0].orderstatus;
					h.status = result1[0].status;
					h._id = result1[0]._id;
					h.orderInfo = result1[0].orderInfo;
					h.orderDescription = result1[0].orderDescription;
					if (result2[0] == [])
					{
						h.delivery = {};
					}
					else
					{
						h.delivery = result2[0];
					}
					h.type = list.type;
					h.number = list.number;
					//console.log(h);

					ordery.push(h);
					done();
					return;
				});

			  });

	};
	var doneIteratingFcn = function(err)
	{
		callback(err,ordery);
	};

	async.forEach(onelist, iteratorFcn, doneIteratingFcn);
}
