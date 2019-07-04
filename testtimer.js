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
poi = require('./api/models/pointModel'),
Message = require('./api/models/messageModel');
var sms = require("./sms");



mongoose.Promise = global.Promise;
var moment = require('moment');

mongoose.connect('mongodb://localhost/VasteDBTest');


var boxes = require('./api/controllers/boxController');

var logger = mongoose.model('orderLog');
var Orders = mongoose.model('Orders');
var Deliveries = mongoose.model('Deliverys');
var Lockers = mongoose.model('Lockers');
var Points = mongoose.model('Points');
var Messages = mongoose.model('Messages');

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

                        if (r["IBMachineCode"] == "8600")
                        {
                          change_order_status(id,"pickup_ready");
                          get_locker_pin(a,s,id,r["IBMachineCode"],function (ss,idd,mm,ty)
                          {
                            if (ty != undefined && ty != null)
                            {
                              var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
                              boxes.boxUpdate(idd,ss,mm,ty.lockerCode2,valid,function(rt)
                              {

                              });
                            }
                          });
                        }

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
        boxes.boxTrack(res[i].vasteOrder, res[i]._id, "delivery",function(id,s,a,r)
        {
          if (r != undefined && r != null )
          {
            if (r["IBstep"] != undefined && r["IBstep"] != null)
            {
              if (r["PUstep"] != undefined && r["PUstep"] != null)
              {

              }
              else {
                if (r["IBstep"] == "PARCEL_DELIVERED")
                {
                  if (s == 'delivery')
                  {
                    console.log("driver delivery completed");
                    if (r["IBMachineCode"] == "8600")
                    {
                      get_locker_pin(a,s,id,r["IBMachineCode"],function (ss,idd,mm,ty)
                      {
                        if (ty != undefined && ty != null)
                        {
                          var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
                          boxes.boxUpdate(idd,ss,mm,ty.lockerCode2,valid,function(rt)
                          {

                          });
                          checkIfSendMessage(idd,ss,a,ty.lockerCode2,mm);
                        }

                      });
                    }

                  }
                }
              }
            }
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
        var moodi = "delivery";
        if (res[i].destination == 'box_pickup')
        {
          moodi = "pickup";
        }
        boxes.boxTrack(res[i].vasteOrder, res[i]._id, moodi,function(id,s,a,r)
        {
          if (r != undefined && r != null )
          {
            if (r["IBstep"] != undefined && r["IBstep"] != null)
            {
              if (r["PUstep"] != undefined && r["PUstep"] != null)
              {
                if (r["PUstep"] == "PARCEL_PICKED_UP_BY_RECIPIENT")
                {
                  if (s == 'delivery' || s == 'pickup')
                  {
                    if (r["IBMachineCode"] == "8600")
                    {
                      change_order_status(id,"done");
                    }
                  }
                }
              }
              else {
                if (r["IBstep"] == "PARCEL_DELIVERED")
                {
                  if (s == 'pickup')
                  {
                    if (r["IBMachineCode"] == "8600")
                    {

                      //change_order_status(id,"pickup_ready");
                      get_locker_pin(a,s,id,r["IBMachineCode"],function (ss,idd,mm,ty)
                      {
                        if (ty != undefined && ty != null)
                        {
                          var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
                          boxes.boxUpdate(idd,ss,mm,ty.lockerCode2,valid,function(rt)
                          {
                            checkIfSendMessage(idd,ss,a,ty.lockerCode2,mm);
                          });
                        }
                      });
                    }
                  }
                  else if (s == 'delivery')
                  {
                    if (r["IBMachineCode"] == "8600")
                    {
                      get_locker_pin(a,s,id,r["IBMachineCode"],function (ss,idd,mm,ty)
                      {
                        if (ty != undefined && ty != null)
                        {
                          checkIfPincode(mm,idd,"delivery",ty.lockerCode2);
                          checkIfSendMessage(idd,ss,a,ty.lockerCode2,mm);
                        }

                      });
                    }
                  }
                }
              }
            }
          }

        });
      }
    }
  });

  find_by_status_function("stowage_not_ready",function(res) // lähettäjä ei vielä vienyt säilöön
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
                        if (r["IBMachineCode"] == "8600")
                        {
                          change_order_status(id,"stowage_ready");
                          get_locker_pin(a,s,id,r["IBMachineCode"],function (ss,idd,mm,ty)
                          {
                            if (ty != undefined && ty != null)
                            {
                              var valid = moment(Date.now()).add(3, 'day').format("YYYY-MM-DDTHH:mm:ss");
                              boxes.boxUpdate(idd,ss,mm,ty.lockerCode2,valid,function(rt)
                              {

                              });
                            }
                          });
                        }

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



  find_by_status_function("stowage_ready",function(res) // vastaanottaja ei vielä hakenut säilöstä
  {
    if (res != undefined && res != null && res != 'err')
    {
      for (var i = 0; i< res.length;i++)
      {
        boxes.boxTrack(res[i].vasteOrder, res[i]._id, "pickup",function(id,s,a,r)
        {
          if (r != undefined && r != null )
          {
            if (r["IBstep"] != undefined && r["IBstep"] != null)
            {
              if (r["PUstep"] != undefined && r["PUstep"] != null)
              {
                if (r["PUstep"] == "PARCEL_PICKED_UP_BY_RECIPIENT")
                {
                  if (s == 'pickup')
                  {
                    if (r["IBMachineCode"] == "8600")
                    {
                      change_order_status(id,"stowage_done");
                    }
                  }
                }
              }
              else {
                if (r["IBstep"] == "PARCEL_DELIVERED")
                {
                  if (s == 'pickup')
                  {
                    if (r["IBMachineCode"] == "8600")
                    {
                      get_locker_pin(a,s,id,r["IBMachineCode"],function (ss,idd,mm,ty)
                      {
                        if (ty != undefined && ty != null)
                        {
                          checkIfPincode(mm,idd,"pickup",ty.lockerCode2);
                          checkIfSendMessage(idd,ss,a,ty.lockerCode2,mm);
                        }

                      });
                    }
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
        if (p.number == '7' || p.number == '8')
        {
          var n = "8600";
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
  Orders.findOne({_id:id, archieved:0,status: {$nin:['cancelled','done','box_cancelled','terminal_stop']}}, function(err, orders) {
    if (err)
      callback("err");
    callback(v,id,s,orders);
  });
};

var change_order_status = function(vasteOrder, stat) {
  var ss = stat;
  if (stat == "stowage_done")
  {
    stat = "done";
  }
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
      if (stat != "stowage_ready" || ss != "stowage_done")
      {
        Deliveries.findOneAndUpdate({orderID:orders._id, companyID:orders.companyID,status: {$nin:['cancelled','done','box_cancelled','terminal_stop']}},
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
      else if (ss == "stowage_done")
      {
        Lockers.updateMany({orderID:orders._id}, {lockerStatus: 'available',lockerCode:'000000',lockerCode2:'000000',orderID:'',type:''}, function(err, lockers) {
          if (err)
            res.send(err);
          sendStatusChange2(orders._id,ss);
        });
      }
      else if (stat == "stowage_ready")
      {
        sendStatusChange2(orders._id,stat);
      }
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
                if (p.number == '7' || p.number == '8')
                {
                  var n = "8600";
                  Lockers.findOneAndUpdate({_id: l._id}, {lockerStatus: "available",
                    lockerCode:"",lockerCode2:"",orderID:"",type:""}, {new: true}, function(err, lockers) {
                    if (err)
                    {
                    console.log(err);
                    }


                      if (p.number == "7" || p.number == "8")
                      {
                        boxes.boxCancel(vv,ss,"8600",function(vast){

                          if (vast != undefined && vast != null /*&& vast != 'error'*/)
                          {
                            console.log(lockers);
                          }

                        });
                      }

                      removeOrder(idd);
                      sendStatusChange2(idd,"auto_remove");


                  });
                }
              }
            });

            findBoxByOrder(v,i,"delivery",res,function(vv,idd,ss,rr,l,p)
            {
              if (p != undefined && p != null && p != 'error' && p.number != undefined && p.number != null && p.number.length > 0)
              {
                if (p.number == "7" || p.number == "8")
                {
                  var n = "8600";
                  Lockers.findOneAndUpdate({_id: l._id}, {lockerStatus: "available",
                    lockerCode:"",lockerCode2:"",orderID:"",type:""}, {new: true}, function(err, lockers) {
                    if (err)
                    {
                    console.log(err);
                    }


                      if (p.number == "7" || p.number == "8")
                      {
                        boxes.boxCancel(vv,ss,"8600",function(vast){

                          if (vast != undefined && vast != null /*&& vast != 'error'*/)
                          {
                            console.log(lockers);
                          }

                        });
                      }
                      removeOrder(idd);
                      sendStatusChange2(idd,"auto_remove");

                  });
                }
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
// Käyttö boksien avauskoodin lähetyksessä
var sendBoxPasscode = function(receiver,address,code,last,tunnus,machine, callback)
{
  var msg = "";
  if (machine == "1006")
  {
    msg = '<h2>Toimitus noudettavissa!</h2>' +
    '<br><br>Toimituksen tunnus: ' + tunnus +
    '<br><br>Toimitus saapunut kohteeseen: ' + address +
    '<br><br>Lokeron avauskoodi: ' + code +
    '<br><img src="cid:uniqbarcode"/>' +
    '<br><br>Ala-Viirteen ulko-oven avauskoodi: 27537' +
    '<br><br><br> Toimitus on noudettava viimeistään ennen: ' + last +
    '<br><br><br>Terveisin Vastetiimi,' +
    '<br><br>Palvelun tarjoaa Centria-ammattikorkeakoulun EAKR-rahoitettu Vaste-hanke.';
  }
  else {
    msg = '<h2>Toimitus noudettavissa!</h2>' +
    '<br><br>Toimituksen tunnus: ' + tunnus +
    '<br><br>Toimitus saapunut kohteeseen: ' + address +
    '<br><br>Lokeron avauskoodi: ' + code +
    '<br><img src="cid:uniqbarcode"/>' +
    '<br><br><br> Toimitus on noudettava viimeistään ennen: ' + last +
    '<br><br><br>Terveisin Vastetiimi,' +
    '<br><br>Palvelun tarjoaa Centria-ammattikorkeakoulun EAKR-rahoitettu Vaste-hanke.';
  }
    sendEmailWithBar(receiver, 'Toimitus saapunut', msg,code, function(mailResult, error){

        if (!mailResult) {
            callback(false, error);
        } else {
            callback(true);
        }
    });
}

var sendBoxPasscodeStowage = function(receiver,address,code,last,tunnus,machine, callback)
{
  var msg = "";
  if (machine == "1006")
  {
    msg = '<h2>Toimitus noudettavissa!</h2>' +
    '<br><br>Toimituksen tunnus: ' + tunnus +
    '<br><br>Toimitus saapunut kohteeseen: ' + address +
    '<br><br>Lokeron avauskoodi: ' + code +
    '<br><img src="cid:uniqbarcode"/>' +
    '<br><br>Ala-Viirteen ulko-oven avauskoodi: 27537' +
    '<br><br><br> Toimitus on noudettava viimeistään ennen: ' + last +
    '<br><br><br>Terveisin Vastetiimi,' +
    '<br><br>Palvelun tarjoaa Centria-ammattikorkeakoulun EAKR-rahoitettu Vaste-hanke.';
  }
  else {
    msg = '<h2>Toimitus noudettavissa!</h2>' +
    '<br><br>Toimituksen tunnus: ' + tunnus +
    '<br><br>Toimitus saapunut kohteeseen: ' + address +
    '<br><br>Lokeron avauskoodi: ' + code +
    '<br><img src="cid:uniqbarcode"/>' +
    '<br><br><br> Toimitus on noudettava viimeistään ennen: ' + last +
    '<br><br><br>Terveisin Vastetiimi,' +
    '<br><br>Palvelun tarjoaa Centria-ammattikorkeakoulun EAKR-rahoitettu Vaste-hanke.';
  }
    sendEmailWithBar(receiver, 'Toimitus saapunut', msg,code, function(mailResult, error){

        if (!mailResult) {
            callback(false, error);
        } else {
            callback(true);
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

var sendEmailWithBar = function(receiver, subject, msgHTML, barcode, callback)
{
    const bwipjs = require('bwip-js');
    var nodemailer = require('nodemailer');
    // Create the transporter with the required configuration for Outlook
    // change the user and pass !
    bwipjs.toBuffer({
        bcid:        'code128',       // Barcode type
        text:        barcode,    // Text to encode
        scale:       3,               // 3x scaling factor
        height:      10,              // Bar height, in millimeters
        includetext: false,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
    },
    function (err, bar){
      if (err)
      {

      }
      else {
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
            html: msgHTML, // html body
            attachments: [
              {
                filename: 'barcode.png',
                content: bar,
                cid: 'uniqbarcode'
              }
            ]
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

var checkIfSendMessage = function(vasteOrder,status,id,code,machine)
{
  Messages.find({orderID: id}, function(err, messages) {
    if (err)
    {
      console.log(err);
    }
    if (messages != undefined && messages != null && messages.length == 0)
    {
      find_order_by_id(vasteOrder,id,status,function(v,ij,s,res)
      {
        var add = res.address.delivery.dstreet + ", " + res.address.delivery.dnumber + " " + res.address.delivery.dlocal;
        var last = moment(res.time.deliveryTime.dBefore).format("DD.MM.YYYY HH:mm");
        var em = res.receiver.name.email;
        generateVasteOrderNum3(res.vasteOrder,function(hhs)
        {
          if (status == "stowage_done")
          {
            sendBoxPasscodeStowage(em,add,code,last,hhs["1"],machine, function(hhh){
              if (hhh)
              {
                var new_messages = new Messages({
                  "timestamp": Date.now(),
                  "receiver":em,
                  "orderID":ij,
                  "companyID":res.companyID
                });
                new_messages.save(function(err, mes) {
                  if (err)
                  {
                    console.log(err);
                  }
                  console.log("sent sendBoxPasscode");
                });
              }
            });
            if (environment.environment == 'prod')
            {
              sendDeliveryDoneSMS(res.receiver.name.phoneNumber,code,machine);
            }
          }
          else {
            sendBoxPasscode(em,add,code,last,hhs["1"],machine, function(hhh){
              if (hhh)
              {
                var new_messages = new Messages({
                  "timestamp": Date.now(),
                  "receiver":em,
                  "orderID":ij,
                  "companyID":res.companyID
                });
                new_messages.save(function(err, mes) {
                  if (err)
                  {
                    console.log(err);
                  }
                  console.log("sent sendBoxPasscode");
                });
              }
            });
            if (environment.environment == 'prod')
            {
              sendDeliveryDoneSMS(res.receiver.name.phoneNumber,code,machine);
            }
          }

        });
      });


    }
  });
}

var sendDeliveryDoneSMS = function(dphone,code,machine)
{
	if(dphone != undefined && dphone != null)
	{
		//dphone = vastaanottajan puh nro
		//code = toimituspisteen 6-numeroinen lokerokoodi
		//var code = r.lockerCode2;
		//var dphone = result.receiver.name.phoneNumber;
		var letter = dphone.charAt(0);

		if(letter == "0")
		{
			var phone2 = dphone.replace(letter, "+358");
      if (machine == "1006")
      {
        sms.sendSMS(["tel:"+phone2], "Tilauksesi on valmis noudettavaksi! \n\nVastepisteen avauskoodisi on: "+code+", ulko-oven avauskoodi: 27537", "Vastetiimi");
      }
      else {
        sms.sendSMS(["tel:"+phone2], "Tilauksesi on valmis noudettavaksi! \n\nVastepisteen avauskoodisi on: "+code+"", "Vastetiimi");
      }

		}
		else
		{
			sms.sendSMS(["tel:"+dphone], "Tilauksesi on valmis noudettavaksi! \n\nVastepisteen avauskoodisi on: "+code+"", "Vastetiimi");
		}
	}
}

var sendOrderReceivedSMS = function(phone,pin0)
{
	//phone = lähettäjän puhelin nro.
	if(phone != undefined && phone != null && phone.length > 5)
	{
		//pin0 = FC-alkunen koodi
		var letter = phone.charAt(0);

		if(letter == "0"){
			var phone2 = phone.replace(letter, "+358");
			sms.sendSMS(["tel:"+phone2], "Tilaus vastaanotettu! \n\nVastepisteen avauskoodisi on: "+pin0+"\n\nTilauksen tiedot on lähetetty sähköpostiisi.", "Vastetiimi");
		}
		else{
			sms.sendSMS(["tel:"+phone], "Tilaus vastaanotettu! \n\nVastepisteen avauskoodisi on: "+pin0+"\n\nTilauksen tiedot on lähetetty sähköpostiisi.", "Vastetiimi");
		}
	}
}


getBoxes();
