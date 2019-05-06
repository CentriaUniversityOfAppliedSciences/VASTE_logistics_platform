'use strict';
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var mongoose = require('mongoose');
var Order = require('./api/models/orderModel'), //Ladataan mallit käyttöön
Delivery = require('./api/models/deliveryModel'), //Ladataan mallit käyttöön
Locker = require('./api/models/lockerModel'), //Ladataan mallit käyttöön
ologger = require('./api/models/orderLogModel');
mongoose.Promise = global.Promise;
var moment = require('moment');

if (environment.environment == 'prod')
{
  mongoose.connect('mongodb://localhost/VasteDB');
}
else {
  mongoose.connect('mongodb://localhost/VasteDBTest');
}

var boxes = require('./api/controllers/boxController');

var logger = mongoose.model('orderLog');
var Orders = mongoose.model('Orders');
var Deliveries = mongoose.model('Deliverys');
var Lockers = mongoose.model('Lockers');

function getBoxes()
{
  find_by_status_function("pickup_not_ready",function(res)
  {
    if (res != undefined && res != null && res != 'err')
    {
      for (var i = 0; i< res.length;i++)
      {
        boxes.boxTrack(res[i].vasteOrder,res[i]._id, "pickup",function(id,s,a,r)
        {
          if (r != undefined && r != null)
          {
            if (r["IBstep"] != undefined && r["IBstep"] != null)
            {
              if (r["PUstep"] != undefined && r["PUstep"] != null)
              {
                if (r["PUstep"] == "PARCEL_PICKED_UP_BY_RECIPIENT")
                {

                }
              }
              else {
                if (r["IBstep"] == "PARCEL_DELIVERED")
                {
                  if (s == 'pickup')
                  {
                    change_order_status(id,"pickup_ready");
                    get_locker_pin(a,s,function (ty)
                    {
                      console.log(ty);
                      var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
                      boxes.boxUpdate(id,s,r["IBMachineCode"],ty.lockerCode2,valid,function(rt)
                      {
                        console.log(rt);
                      });
                    });

                  }
                }
              }
            }
          }

        });
      }
    }
  });
  find_by_status_function("delivery_ready",function(res)
  {
    if (res != undefined && res != null && res != 'err')
    {
      for (var i = 0; i< res.length;i++)
      {
        boxes.boxTrack(res[i].vasteOrder, res[i]._id, "delivery",function(id,s,a,r)
        {
          if (r != undefined && r != null )
          {
            if (r["IBstep"] != undefined && r["IBstep"] != null)
            {
              if (r["PUstep"] != undefined && r["PUstep"] != null)
              {
                if (r["PUstep"] == "PARCEL_PICKED_UP_BY_RECIPIENT")
                {
                  if (s == 'delivery')
                  {
                    change_order_status(id,"done");
                  }
                }
              }
              else {
                if (r["IBstep"] == "PARCEL_DELIVERED")
                {
                  if (s == 'pickup')
                  {
                    change_order_status(id,"pickup_ready");
                    get_locker_pin(a,s,function (ty)
                    {
                      var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
                      boxes.boxUpdate(id,s,r["IBMachineCode"],ty.lockerCode2,valid,function(rt)
                      {

                      });
                    });
                  }
                  else if (s == 'delivery')
                  {
                    get_locker_pin(a,s,function (ty)
                    {
                      if (ty != undefined && ty != null)
                      {
                        checkIfPincode(r["IBMachineCode"],id,"delivery",ty.lockerCode2);
                      }
                    });
                  }
                }
              }
            }
          }

        });
      }
    }
  });
}


var checkIfPincode = function(machine,id,dir,pin)
{
  boxes.boxFindParcel(id,machine,dir,pin,function(a,b,c,d,r){
    if(r != undefined && r != null && r != 'error')
    {
      if (r.FetchCode.length < 2)
      {
        console.log("no FetchCode found for parcel: "+a);
        var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
        boxes.boxUpdate(a,c,b,d,valid,function(rt)
        {

        });
      }
    }
  });
}


var find_by_status_function = function(stat,callback) {	//statuksen mukaan function
  Orders.find({status:stat, archieved:0}, function(err, orders) {
    if (err)
      callback("err");
    callback(orders);
  });
};

var change_order_status = function(vasteOrder, stat) {
  Orders.findOneAndUpdate({vasteOrder: vasteOrder}, {status:stat}, {new: true}, function(err, orders) {
    if (err)
      res.send(err);

    if (orders != undefined && orders != null)
    {
      var jso = {
        user:"timer",
        ip: "127.0.0.1",
        timestamp: Math.floor(new Date() / 1000),
        code: "order_status_change:"+stat,
        orderID:orders._id,
        companyID: orders.companyID,
      };
      logThis(jso);
      Deliveries.findOneAndUpdate({orderID:orders._id, companyID:orders.companyID,status: {$nin:['cancelled','done','box_cancelled']}},
      {status:stat},{new: true}, function(err, deliverys){
        if (stat == 'done')
        {
          Lockers.updateMany({orderID:orders._id}, {lockerStatus: 'available',lockerCode:'000000',lockerCode2:'000000',orderID:'',type:''}, function(err, lockers) {
            if (err)
              res.send(err);
            sendStatusChange2(orders._id,stat);
          });
        }
        else {
          sendStatusChange2(orders._id,stat);
        }

      });
    }



  });
};
function sendStatusChange2(orderID,status)
{
  var toport = "3511";
  if (environment.port == 3000)
  {
    toport = "3501";
  }
  else {
    toport = "3511"
  }

    var jso = {
      "orderID":orderID,
      "status":status
    };
    var request = require('request');
  	var options = {
  		uri: "https://localhost:"+toport+"/webhook",
      rejectUnauthorized: false,
  		method: 'POST',
  		headers: {
          "content-type": "application/json",
          },
  		json: jso
  	};
  	request(options, function (error, response, body) {
  	  if (!error && response.statusCode == 200) {

  	  }
  	  else
  	  {
  		  console.log(response);
  	  }
  	});
}

var logThis = function(jso)
{
  var new_log = new logger(jso);
  new_log.save(function(err, logs) {
    //console.log(logs);
  });
}

var get_locker_pin = function(orderID, type, callback) {
  Lockers.findOne({orderID: orderID, type:type}, function(err, lockers) {
    if (err)
      callback("err");
    callback(lockers);
  });
};











setInterval(getBoxes,360000);
