'use strict';

var fs = require('fs');
var mongoose = require('mongoose'),
  UserOrder = mongoose.model('UserOrder'),
  Orders = mongoose.model('Orders');

var Deliveries = mongoose.model('Deliverys');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var apikey = environment.apikey;


exports.list_user_order = function(req, res) {
  if (req.body.apikey == apikey)
  {
    UserOrder.find({userID:req.body.userID}, function(err, uo) {
      if (err)
        res.send(err);
      res.json(uo);
    });
  }
  else {
    res.send("error");
  }
};

exports.create_user_order = function(req, res) {

    var new_uo = new UserOrder(req.body);
    new_uo.save(function(err, uo) {
      if (err)
        res.send(err);
      res.json(uo);
    });

};

exports.remove_user_order = function(req, res) {
    UserOrder.deleteOne({userID: req.body.userID, orderID:req.body.orderID}, function(err, uo) {
      if (err)
        res.send(err);
      res.json({ message: 'Users order successfully deleted' });
    });

};
exports.get_user_orders = function(req, res) {
  if (req.body.apikey == apikey)
  {
    UserOrder.find({userID:req.body.userID}, function(err, uo) {
      if (err)
        res.send(err);
      else {
        getOrderList(uo,function (err,r){

        });
      }
      //res.json(uo);
    });
  }
  else {
    res.send("error");
  }
};




function getOrderList(uos, callback)
{
	var orders = [];
	var iteratorFcn = function(uo,done)
	{
		if (uo.orderID == null)
		{
			done();
			return;
		}

			var query = {'_id':uo.orderID};
			Orders.find(query, function(err, result) {
				if (err)
				{
				  res.send(err);
				}
        else {
          Deliveries.find({orderID:uo.orderID,status: {$nin:['cancelled','done','box_cancelled','terminal_stop']}}, function(err, deliverys){
            var h = { "_id":"","subscriber":{},"receiver":{},"address":{},"time":{},"orderStatus":{},"status":"","delivery":{},"orderInfo":"","orderDescription":"","vasteOrder":"" };
            if (result.length > 0)
            {
              h.subscriber = result[0].subscriber;
              h.receiver = result[0].receiver;
              h.address = result[0].address;
              h.time = result[0].time;
              h.orderStatus = result[0].orderStatus;
              h.status = result[0].status;
              h._id = result[0]._id;
              h.orderInfo = result[0].orderInfo;
              h.orderDescription = result[0].orderDescription;
              h.delivery = deliverys;
              h.vasteOrder = result[0].vasteOrder;
              h.companyID = result[0].companyID;
              h.destination = result[0].destination;


              orders.push(h);


            }
            done();
            return;
          });
        }

		 });

	};
	var doneIteratingFcn = function(err)
	{
		callback(err,orders);
	};

	async.forEach(uos, iteratorFcn, doneIteratingFcn);
}
