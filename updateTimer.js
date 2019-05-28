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
pointy = require('./api/models/pointModel');
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


var boxJson = {
  "1":"1001",
  "2":"1002",
  "3":"1003",
  "4":"1004",
  "5":"1005",
  "6":"1006"
};

function checkBoxes()
{
  console.log("updateTimer running:" + Date().toString());

  for (var i = 1; i < Object.keys(boxJson).length; i++)
  {
    boxes.getStates(boxJson[i],function(m,r)
    {
    //testFunc("1007",function(m,r)
    //{
      if (r != undefined && r != null && r != 'error')
      {
        for (var k = 0;k < r.length; k++)
        {
          if (r[k].Parcels != null && r[k].Parcels != undefined && r[k].Parcels.length > 5)
          {
            checkIfRightSize(m,r[k].Parcels,r[k].BoxSize);
          }
        }
        checkMachineLockers(m,r);
      }
    });
  }
}

var checkMachineLockers = function(m,j)
{
  getDirtyLockers(m,j,function(mm,jj,d)
  {
    var mmm = m.substr(3);
    Points.findOne({number:mmm}, function(err, popo) {
      if (err)
      {
        console.log("checkMachineLockers points find error");
      }
      var query = {'pointID':popo._id,'lockerStatus':"malfunction"};
      Lockers.find(query, function(err2, la) {
        if (err2)
        {
          console.log("checkMachineLockers lockers find error");
        }
        if (la != undefined && la != null)
        {
          if (la.length > 0)
          {
            markIfDirtyCheck(mm,jj,d,popo,la);
          }
          else {
            markIfDirty(mm,jj,d,popo,la);
          }
        }

      });
    });
  });

}

var markIfDirty = function(m,j,d,p,l)
{
  if (d["1"] > 0)
  {
    for (var kk = 0;kk < d["1"];kk++)
    {
      Lockers.findOneAndUpdate({lockerStatus:"available",lockerSize:"1",pointID:p._id}, {lockerStatus: "malfunction"}, {new: true}, function(err, laa) {
        sendAlert(m,"Lokero poistettu käytöstä");
      });
    }
  }
  if (d["2"] > 0)
  {
    for (var kk = 0;kk < d["2"];kk++)
    {
      Lockers.findOneAndUpdate({lockerStatus:"available",lockerSize:"2",pointID:p._id}, {lockerStatus: "malfunction"}, {new: true}, function(err, laa) {
        sendAlert(m,"Lokero poistettu käytöstä");
      });
    }
  }
  if (d["3"] > 0)
  {
    for (var kk = 0;kk < d["3"];kk++)
    {
      Lockers.findOneAndUpdate({lockerStatus:"available",lockerSize:"3",pointID:p._id}, {lockerStatus: "malfunction"}, {new: true}, function(err, laa) {
        sendAlert(m,"Lokero poistettu käytöstä");
      });
    }
  }
  if (d["4"] > 0)
  {
    for (var kk = 0;kk < d["4"];kk++)
    {
      Lockers.findOneAndUpdate({lockerStatus:"available",lockerSize:"4",pointID:p._id}, {lockerStatus: "malfunction"}, {new: true}, function(err, laa) {
        sendAlert(m,"Lokero poistettu käytöstä");
      });
    }
  }
}

var markIfDirtyCheck = function(m,j,d,p,l)
{
  getDirtyLockers2(m,j,d,p,l,function (mm,jj,dd,pp,ll,aa)
  {
    if (aa["1"] > 0)
    {
      for (var kk = 0;kk < aa["1"];kk++)
      {
        Lockers.findOneAndUpdate({lockerStatus:"malfunction",lockerSize:"1",pointID:p._id}, {lockerStatus: "available"}, {new: true}, function(err, laa) {
          sendAlert(mm,"Lokero lisätty käyttöön");
        });
      }
    }
    else if (aa["1"] < 0)
    {
      var aaa = aa["1"]*-1;
      for (var kk = 0;kk < aaa;kk++)
      {
        Lockers.findOneAndUpdate({lockerStatus:"available",lockerSize:"1",pointID:p._id}, {lockerStatus: "malfunction"}, {new: true}, function(err, laa) {
          sendAlert(mm,"Lokero poistettu käytöstä");
        });
      }
    }
    else {
      console.log("size 1 lockers up to date in box " + pp.number);
    }
    if (aa["2"] > 0)
    {
      for (var kk = 0;kk < aa["2"];kk++)
      {
        Lockers.findOneAndUpdate({lockerStatus:"malfunction",lockerSize:"2",pointID:p._id}, {lockerStatus: "available"}, {new: true}, function(err, laa) {
          sendAlert(mm,"Lokero lisätty käyttöön");
        });
      }
    }
    else if (aa["2"] < 0)
    {
      var aaa = aa["2"]*-1;

      for (var kk = 0;kk < aaa;kk++)
      {
        Lockers.findOneAndUpdate({lockerStatus:"available",lockerSize:"2",pointID:p._id}, {lockerStatus: "malfunction"}, {new: true}, function(err, laa) {
          sendAlert(mm,"Lokero poistettu käytöstä");
        });
      }
    }
    else {
      console.log("size 2 lockers up to date in box " + pp.number);
    }
    if (aa["3"] > 0)
    {
      for (var kk = 0;kk < aa["3"];kk++)
      {
        Lockers.findOneAndUpdate({lockerStatus:"malfunction",lockerSize:"3",pointID:p._id}, {lockerStatus: "available"}, {new: true}, function(err, laa) {
          sendAlert(mm,"Lokero lisätty käyttöön");
        });
      }
    }
    else if (aa["3"] < 0)
    {
      var aaa = aa["3"]*-1;

      for (var kk = 0;kk < aaa;kk++)
      {
        Lockers.findOneAndUpdate({lockerStatus:"available",lockerSize:"3",pointID:p._id}, {lockerStatus: "malfunction"}, {new: true}, function(err, laa) {
          sendAlert(mm,"Lokero poistettu käytöstä");
        });
      }
    }
    else {
      console.log("size 3 lockers up to date in box " + pp.number);
    }
    if (aa["4"] > 0)
    {
      for (var kk = 0;kk < aa["4"];kk++)
      {
        Lockers.findOneAndUpdate({lockerStatus:"malfunction",lockerSize:"4",pointID:p._id}, {lockerStatus: "available"}, {new: true}, function(err, laa) {
          sendAlert(mm,"Lokero lisätty käyttöön");
        });
      }
    }
    else if (aa["4"] < 0)
    {
      var aaa = aa["4"]*-1;

      for (var kk = 0;kk < aaa;kk++)
      {
        Lockers.findOneAndUpdate({lockerStatus:"available",lockerSize:"4",pointID:p._id}, {lockerStatus: "malfunction"}, {new: true}, function(err, laa) {
          sendAlert(mm,"Lokero poistettu käytöstä");
        });
      }
    }
    else {
      console.log("size 4 lockers up to date in box " + pp.number);
    }
  });

}
var getDirtyLockers2 = function(m,j,d,p,l,callback)
{
  var res = {
    "1":0,
    "2":0,
    "3":0,
    "4":0
  };
  for (var i = 0; i < l.length; i++)
  {
    if (l[i].lockerSize == "1")
    {
      var a = res["1"];
      a = a + 1;
      res["1"] = a;
    }
    else if (l[i].lockerSize == "2")
    {
      var a = res["2"];
      a = a + 1;
      res["2"] = a;
    }
    else if (l[i].lockerSize == "3")
    {
      var a = res["3"];
      a = a + 1;
      res["3"] = a;
    }
    else if (l[i].lockerSize == "4")
    {
      var a = res["4"];
      a = a + 1;
      res["4"] = a;
    }
  }
  var aa = {
    "1":0,
    "2":0,
    "3":0,
    "4":0
  };
  aa["1"] = res["1"]-d["1"];
  aa["2"] = res["2"]-d["2"];
  aa["3"] = res["3"]-d["3"];
  aa["4"] = res["4"]-d["4"];


  callback(m,j,d,p,l,aa);
}

var getDirtyLockers = function(m,j,callback)
{
  var res = {
    "1":0,
    "2":0,
    "3":0,
    "4":0
  };
  for (var i = 0; i < j.length;i++)
  {
    if (j[i].Defect != "false" || j[i].Secured != "false" || j[i].Soiled != "false")
    {
      if (j[i].BoxSize == "Small")
      {
        var a = res["1"];
        a = a + 1;
        res["1"] = a;
      }
      else if (j[i].BoxSize == "Medium")
      {
        var a = res["2"];
        a = a + 1;
        res["2"] = a;
      }
      else if (j[i].BoxSize == "Large")
      {
        var a = res["3"];
        a = a + 1;
        res["3"] = a;
      }
      else if (j[i].BoxSize == "XLarge")
      {
        var a = res["4"];
        a = a + 1;
        res["4"] = a;
      }
    }
  }
  callback(m,j,res);
}

var checkIfRightSize = function(machine,parcel,size)
{
  parseParcel(machine,parcel,size,function(m,p,s,mode,r){ // r = parsetettu vasteOrder, mode = pickup/delivery
    if (r != undefined && r != null && r != "error")
    {
      getOrder(m,p,s,mode,r,function(mm,pp,ss,momo,rr,ty) // rrr = tilaus objekti
      {
        if (ty != undefined && ty != null && ty != 'err')
        {
          get_locker(mm,pp,ss,momo,rr,ty,function(mmm,ppp,sss,momomo,rrr,tyy,lo) // lo = lokeron tiedot
          {
            if (lo != undefined && lo != null && lo != 'err')
            {
              if (lo.lockerSize == "1")
              {
                if (sss == "Small")
                {
                  //console.log("oikea koko!");
                }
                else {
                  handleWrongSize(mmm,ppp,sss,momomo,rrr,tyy,lo)
                  {

                  }
                  console.log("väärä koko!");
                }
              }
              else if (lo.lockerSize == "2")
              {
                if (sss == "Medium")
                {
                  //console.log("oikea koko!");
                }
                else {
                  handleWrongSize(mmm,ppp,sss,momomo,rrr,tyy,lo)
                  {

                  }
                  console.log("väärä koko!");
                }
              }
              else if (lo.lockerSize == "3")
              {
                if (sss == "Large")
                {
                //  console.log("oikea koko!");
                }
                else {
                  handleWrongSize(mmm,ppp,sss,momomo,rrr,tyy,lo)
                  {

                  }
                  console.log("väärä koko!");
                }
              }
              else if (lo.lockerSize == "4")
              {
                if (sss == "XLarge")
                {
                //  console.log("oikea koko!");
                }
                else {
                  handleWrongSize(mmm,ppp,sss,momomo,rrr,tyy,lo)
                  {

                  }
                  console.log("väärä koko!");
                }
              }
            }
          });
        }
      });
    }
  });
}

var parseParcel = function(machine,parcel,size,callback) // parseroi vasteOrder parcel-tiedosta
{
  if (parcel.length > 0)
  {
    var str = parcel.split("");
    if (str[0] == "F" && str[1] == "C" && str[2] == "1")
    {
      var mode = "pickup";
      if (str[3] == "1")
      {
        mode = "delivery";
      }
      for (var i = 4;i< str.length; i++)
      {
          if(str[i] != "0")
          {
            callback(machine,parcel,size,mode,parcel.substr(i));
            break;
          }

      }
    }
    else {
      callback(machine,parcel,size,"error","error");
    }
  }
  else {
    callback(machine,parcel,size,"error","error");
  }

}


var getOrder = function(m,p,s,mo,o,callback) {	//tilausten haku
  Orders.findOne({vasteOrder:o, archieved:0}, function(err, ty) {
    if (err)
      callback("err");
    callback(m,p,s,mo,o,ty);
  });
};

var get_locker = function(m,p,s,mo,o,ty, callback) { //lokeron tietojen haku
  Lockers.findOne({orderID: ty._id, type:mo}, function(err, lockers) {
    if (err)
      callback("err");
    callback(m,p,s,mo,o,ty,lockers);
  });
};


var handleWrongSize = function(m,p,s,mo,o,ty,lo) // vaihda lokeroa mongossa
{
  var mm = m.substr(3);
  Points.findOne({_id:lo.pointID}, function(err, popo) {

    if (mm == popo.number)
    {
      if (err)
      {
        console.log("handleWrongSize find points error");
      }
      var df = "0";
      if (s == "Small")
      {
        df = "1";
      }
      else if (s == "Medium")
      {
        df = "2";
      }
      else if (s == "Large")
      {
        df = "3";
      }
      else if (s == "XLarge")
      {
        df = "4";
      }
      if (df != "0")
      {
        var query = {'pointID':popo._id,'lockerSize':df,'lockerStatus':"available"};
        Lockers.findOne(query, function(err2, la) {

          if (err2)
          {
            console.log("handleWrongSize error in finding available locker");
          }
          if(la != undefined && la != null && la.lockerStatus == "available")
          {
            Lockers.findOneAndUpdate({_id: la._id}, {lockerStatus: lo.lockerStatus,
              lockerCode:lo.lockerCode,lockerCode2:lo.lockerCode2,orderID:lo.orderID,type:lo.type}, {new: true}, function(err, laa) {
                if (err)
                {
                  console.log("failed to update available locker");
                }
                Lockers.findOneAndUpdate({_id: lo._id}, {lockerStatus: "available",
                  lockerCode:"",lockerCode2:"",orderID:"",type:""}, {new: true}, function(err, loo) {
                    if (err)
                    {
                      console.log("failed to update former booked locker");
                    }
                    sendAlert(m,"lokeron koko vaihdettu")
                });
            });
          }
          else {
            console.log("handleWrongSize locker is wrong size and no available locker found");
            //sendAlert();
          }
        });
      }
    }
  });
}


var sendAlert = function(m,type)
{
  console.log("sending alert to email");
  var msg = '<h2>Lokeron tila on muuttunut</h2>'
  + '<br><br>Boksinumero: ' + m
  + '<br><br>Tyyppi: ' + type
  ;
  var receiver = "vaste.info@centria.fi";
	sendEmail(receiver, 'Boksipäivitys',msg, function(mailResult, error){
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


setInterval(checkBoxes,600000);
//setInterval(checkBoxes,10000);

var testFunc = function(m,callback)
{
  callback(m,testJson);
}

var testJson = [
  {
    "BoxNumber": "1",
    "BoxSize": "Large",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "2",
    "BoxSize": "Medium",
    "Defect": "false",
    "Parcels": "FC10000000177",
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "3",
    "BoxSize": "Large",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "4",
    "BoxSize": "Medium",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "5",
    "BoxSize": "Medium",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "6",
    "BoxSize": "Medium",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "7",
    "BoxSize": "XLarge",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "8",
    "BoxSize": "Large",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "9",
    "BoxSize": "Small",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "10",
    "BoxSize": "Small",
    "Defect": "false",
    "Parcels": "FC10000000178",
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "11",
    "BoxSize": "Medium",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  },
  {
    "BoxNumber": "12",
    "BoxSize": "Medium",
    "Defect": "false",
    "Parcels": null,
    "Secured": "false",
    "Soiled": "false"
  }
];
