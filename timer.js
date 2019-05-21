'use strict';
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var secretJson = fs.readFileSync("./encryption/secret.json");
var secret = JSON.parse(secretJson);
var mongoose = require('mongoose');
var Order = require('./api/models/orderModel'), //Ladataan mallit käyttöön
Delivery = require('./api/models/deliveryModel'), //Ladataan mallit käyttöön
Locker = require('./api/models/lockerModel'), //Ladataan mallit käyttöön
ologger = require('./api/models/orderLogModel'),
poi = require('./api/models/pointModel');
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
var Points = mongoose.model('Points');

function getBoxes()
{
  find_by_status_function("pickup_not_ready",function(res) //lähettäjä ei vielä toimittanut
  {
    if (res != undefined && res != null && res != 'err')
    {
      for (var i = 0; i< res.length;i++)
      {
        boxes.boxAnnounceTrack(res[i].vasteOrder,res[i]._id, "pickup",function (ida,sa,aa,ra)
        {
          if (ra != undefined && ra != null && ra != 'error' && ra.length > 0 && ra[0].parcelCode != undefined && ra[0].parcelCode != null && ra[0].parcelCode.length > 4)
          {
            boxes.boxTrack(ida,aa, sa,function(id,s,a,r)
            {
              if (r != undefined && r != null && r != 'error')
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
                        get_locker_pin(a,s,id,r["IBMachineCode"],function (ss,idd,mm,ty)
                        {
                          var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
                          boxes.boxUpdate(idd,ss,mm,ty.lockerCode2,valid,function(rt)
                          {

                          });
                        });

                      }
                    }
                  }
                }
                else {
                  checkIfOvertime(id,s,a);
                }
              }
              else {
                console.log("pickup boxtrack fail");
              }

            });
          }
          else {
            console.log("pickup boxAnnounceTrack fail");
            announceAgain(ida,aa,sa);
          }

        });
      }
    }
  });
  find_by_status_function("delivery_not_ready",function(res) //kuljettajalla kyydissä
  {
    if (res != undefined && res != null && res != 'err')
    {
      for (var i = 0; i< res.length;i++)
      {
        boxes.boxAnnounceTrack(res[i].vasteOrder,res[i]._id, "delivery",function (ida,sa,aa,ra)
        {
          if (ra != undefined && ra != null && ra != 'error' && ra.length > 0 && ra[0].parcelCode != undefined && ra[0].parcelCode != null && ra[0].parcelCode.length > 4)
          {

          }
          else {
            console.log("delivery boxAnnounceTrack fail");
            announceAgain(ida,aa,sa);
          }

        });
      }
    }
  });

  find_by_status_function("delivery_ready",function(res) // vastaanottaja ei vielä hakenut
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
                    get_locker_pin(a,s,id,r["IBMachineCode"],function (ss,idd,mm,ty)
                    {
                      var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
                      boxes.boxUpdate(idd,ss,mm,ty.lockerCode2,valid,function(rt)
                      {

                      });
                    });
                  }
                  else if (s == 'delivery')
                  {
                    get_locker_pin(a,s,id,r["IBMachineCode"],function (ss,idd,mm,ty)
                    {
                      if (ty != undefined && ty != null)
                      {
                        checkIfPincode(mm,idd,"delivery",ty.lockerCode2);
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
      if (r != undefined && r != null && r.FetchCode == undefined)
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

var announceAgain = function(vasteOrder,id,status)
{
  find_order_by_id(vasteOrder,id,status,function(v,i,s,res)
  {
    findBoxByOrder(v,i,s,res,function(vv,idd,ss,rr,l,p)
    {
      if (p != undefined && p != null && p != 'error' && p.number != undefined && p.number != null && p.number.length > 0)
      {
        var n = "100"+p.number;
        var size = "Small";
        if (l.lockerSize == "1")
        {
          size = "Small";
        }
        else if (l.lockerSize == "2")
        {
          size = "Medium";
        }
        else if (l.lockerSize == "3")
        {
          size = "Large";
        }
        else if (l.lockerSize == "4")
        {
          size = "XLarge";
        }
        var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
        boxes.boxAnnounce(ss,vv,n,size,valid, function(k)
        {

        });
      }
    });
  });

}

var findBoxByOrder = function(v,id,s,r,callback)
{
  Lockers.findOne({orderID: id,type:s}, function(err, l){
		if(err){
			console.log(err);
      callback("","","","","",'error');
		}
    if (l != undefined && l != null && l.pointID != undefined && l.pointID != null)
    {
      Points.findOne({_id:l.pointID}, function(err, p) {
        if (err)
          callback("","","","","",'error');
        callback(v,id,s,r,l,p);
      });
    }
    else {
      callback("","","","","",'error');
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

var find_order_by_id = function(v,id,s,callback) {	//statuksen mukaan function
  Orders.findOne({_id:id, archieved:0,status: {$nin:['cancelled','done','box_cancelled']}}, function(err, orders) {
    if (err)
      callback("err");
    callback(v,id,s,orders);
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

var get_locker_pin = function(orderID, type,vasteOrder,machine, callback) {
  Lockers.findOne({orderID: orderID, type:type}, function(err, lockers) {
    if (err)
      callback("err");
    callback(type,vasteOrder,machine,lockers);
  });
};


var checkIfOvertime = function(vasteOrder,status,id)
{
    boxes.boxAnnounceTrack(vasteOrder,id,status,function(a,b,c,ra){
      if (ra != undefined && ra != null && ra != 'error' && ra.length > 0 && ra[0].parcelCode != undefined && ra[0].parcelCode != null && ra[0].parcelCode.length > 4)
      {
        var hh = new Date(ra[0].validUntil);
        if (hh < new Date())
        {
          find_order_by_id(a,c,b,function(v,i,s,res)
          {
            var receiver = res.subscriber.name.email;
            generateVasteOrderNum3(v,function(hhs)
            {
              sendAlert(receiver,hhs["1"]);
            });
            findBoxByOrder(v,i,"pickup",res,function(vv,idd,ss,rr,l,p)
            {
              if (p != undefined && p != null && p != 'error' && p.number != undefined && p.number != null && p.number.length > 0)
              {
                var n = "100"+p.number;
                Lockers.findOneAndUpdate({_id: l._id}, {lockerStatus: "available",
                  lockerCode:"",lockerCode2:"",orderID:"",type:""}, {new: true}, function(err, lockers) {
                  if (err)
                  {
                  console.log(err);
                  }

                    if(p.number == "1" || p.number == "2")
                    {

                      boxes.boxCancel(vv,ss,n,function(vast){

                        if (vast != undefined && vast != null /*&& vast != 'error'*/)
                        {
                          console.log(lockers);
                        }

                      });
                    }
                    else if (p.number == "7" || p.number == "8")
                    {
                      boxes.boxCancel(vv,ss,"8600",function(vast){

                        if (vast != undefined && vast != null /*&& vast != 'error'*/)
                        {
                          console.log(lockers);
                        }

                      });
                    }
                    else {
                      console.log(lockers);
                    }
                    removeOrder(idd);
                    sendStatusChange2(idd,"auto_remove");


                });
              }
            });

            findBoxByOrder(v,i,"delivery",res,function(vv,idd,ss,rr,l,p)
            {
              if (p != undefined && p != null && p != 'error' && p.number != undefined && p.number != null && p.number.length > 0)
              {
                var n = "100"+p.number;
                Lockers.findOneAndUpdate({_id: l._id}, {lockerStatus: "available",
                  lockerCode:"",lockerCode2:"",orderID:"",type:""}, {new: true}, function(err, lockers) {
                  if (err)
                  {
                  console.log(err);
                  }

                    if(p.number == "1" || p.number == "2")
                    {

                      boxes.boxCancel(vv,ss,n,function(vast){

                        if (vast != undefined && vast != null /*&& vast != 'error'*/)
                        {
                          console.log(lockers);
                        }

                      });
                    }
                    else if (p.number == "7" || p.number == "8")
                    {
                      boxes.boxCancel(vv,ss,"8600",function(vast){

                        if (vast != undefined && vast != null /*&& vast != 'error'*/)
                        {
                          console.log(lockers);
                        }

                      });
                    }
                    else {
                      console.log(lockers);
                    }
                    removeOrder(idd);
                    sendStatusChange2(idd,"auto_remove");

                });
              }
            });
          });
        }
      }
    });
}

var removeOrder = function(id)
{
  Orders.findOneAndUpdate({_id: id}, {archieved:2}, {new: true}, function(err, orders) {
    if (err)
		{
			 res.send(err);
		}
    //res.json(orders);
  });
}

var sendAlert = function(r,v)
{
  console.log("sending alert to email");
  var msg = '<h2>Vastepiste tilauksen tila muuttunut</h2>'
  + '<br><br>Vastepiste toimituksesi: <h3>' + v + '</h3> on peruutettu, koska et ole toimittanut pakettia määräaikaan mennessä Vastepisteeseen.'
  + '<br><br>Mikäli haluat vielä lähettää toimituksen, ole hyvä ja tilaa uusi toimitus osoitteessa www.vastepiste.fi.'
  + '<br><br>Tilaukseen varattu katevaraus peruutetaan.'
  + '<br><br><br>Terveisin Vastetiimi'
	+ '<br><br>Palvelun tarjoaa Centria-ammattikorkeakoulun EAKR-rahoitettu Vaste-hanke.';


	sendEmail(r, 'Vastepiste tilauksen tila muuttunut',msg, function(mailResult, error){
			if (!mailResult) {
        console.log(error);
					//callback(false, error);
			} else {
        console.log(mailResult);
					//callback(true);
			}
	});
}


var sendEmail = function(receiver, subject, msgHTML, callback)
{
    // Create the transporter with the required configuration for Outlook
    // change the user and pass !
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
           ciphers:'SSLv3'
        },
        auth: {
            user: secret.email,
            pass: secret.email_pass
        }
    });

    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: '"noreply vaste.info" <vaste.noreply@centria.fi>', // sender address (who sends)
        to: receiver, // list of receivers (who receives)
        subject: subject, // Subject line
        text: '', // plaintext body
        html: msgHTML // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(false, error);
        } else {
            callback(true);
        }
    });
}

var generateVasteOrderNum3 = function(num,callback){
	var ret = {"1":"","2":""};

    num = num.toString();
		if(num.length == 1){
			ret["1"] = "VA00000"+num;
      ret["2"] = "00000"+num;
		}
		if(num.length == 2){
			ret["1"] = "VA0000"+num;
      ret["2"] = "0000"+num;
		}
		if(num.length == 3){
			ret["1"] = "VA000"+num;
      ret["2"] = "000"+num;
		}
		if(num.length == 4){
			ret["1"] = "VA00"+num;
      ret["2"] = "00"+num;
		}
		if(num.length == 5){
			ret["1"] = "VA0"+num;
      ret["2"] = "0"+num;
		}
		if(num.length > 5){
			ret["1"] = "VA"+num;
      ret["2"] = num;
		}
		callback(ret);

}


//setInterval(getBoxes,360000); //6min
//setInterval(getBoxes,10000); //10s
checkIfOvertime("181","pickup","5ce3d091b5bbe109b49c50a6");
