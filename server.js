'use strict';
var fs = require('fs');
var https = require ('https');
var environmentJson = fs.readFileSync("./environment.json");
var secretJson = fs.readFileSync("./encryption/secret.json");
var environment = JSON.parse(environmentJson);
var secret = JSON.parse(secretJson);
var key = fs.readFileSync('./encryption/www_vaste_info.key');
var cert = fs.readFileSync( './encryption/vaste_info.crt' );
var cat = fs.readFileSync('./encryption/DigiCertCA.crt');

var credentials = {key: key, cert: cert, ca: cat,passphrase: secret.passphrase};

// Constants
const PORT =  environment.port;
const HOST = '0.0.0.0';

var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  Vehicle = require('./api/models/vehicleModel'), //Ladataan mallit käyttöön
  Order = require('./api/models/orderModel'), //Ladataan mallit käyttöön
  Delivery = require('./api/models/deliveryModel'), //Ladataan mallit käyttöön
  User = require('./api/models/userModel'), //Ladataan mallit käyttöön
  Point = require('./api/models/pointModel'), //Ladataan mallit käyttöön
  Company = require('./api/models/companyModel'), //Ladataan mallit käyttöön
  Locker = require('./api/models/lockerModel'), //Ladataan mallit käyttöön
  Message = require('./api/models/messageModel'), //Ladataan mallit käyttöön
  Route = require('./api/models/routeModel'), //Ladataan mallit käyttöön
  DeliveryList = require('./api/models/deliveryListModel'), //Ladataan mallit käyttöön
  Payment = require('./api/models/paymentModel'), //Ladataan mallit käyttöön
  bodyParser = require('body-parser'),//Bodyparser jolla saadaan pyynnön sisältö talteen
  logger = require('./api/models/logModel'),
  ologger = require('./api/models/orderLogModel'),
  inUse = require('./api/models/inUseModel'),
  dtc = require('./api/models/deliveryTimeCorrectionModel'),
  dc = require('./api/models/deliveryConfirmationModel'),
  drivercompany = require('./api/models/driverCompaniesModel'),
  drivervehicle = require('./api/models/driverVehiclesModel'),
  oe = require('./api/models/orderExtraModel'),
  cp = require('./api/models/companyPropertiesModel');

//Mongoose yhteys
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
if (environment.environment == 'prod')
{
  mongoose.connect('mongodb://localhost/VasteDB');
}
else {
  mongoose.connect('mongodb://localhost/VasteDBTest');
}

//määritellään bodyparser käyttöön
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var httpsServer = https.createServer(credentials, app);

app.use(function(req,res,next){
  console.log(req.path);
  console.log(req.body);
  if (req.path == '/users/identification')
  {
    next();
  }
  else if ((req.path == '/companys' || req.path == '/companyproperties' || req.path == '/users' || req.path == '/companybytempkey'
            || req.path == '/companybylink' || req.path == '/users/apiidentification' || req.path == '/logs' || req.path == '/orders/find_by_status_with_nodelivery'
            || req.path == '/vehicles')
            && req.query.apikey == environment.apikey)
  {
    next();
  }
  else if ((req.path == '/users' || req.path == '/companys' || req.path == '/companyproperties'
              || req.path == '/companyproperties/find_by_companyid' || req.path == '/orders/getSingleOrder'
              || req.path == '/companybytempkey' || req.path == '/companybylink' || req.path == '/users/apiidentification' || req.path == '/logs'
              || req.path == '/users/resetPassword' || req.path == '/users/getResetUser' || req.path == '/orders/find_by_status_with_nodelivery'
              || req.path == '/getSeuraaOrder' || '/deliveryLists')
              && req.body.apikey == environment.apikey
          )
  {
    next();
  }
  else {
    if (req.path == '/ordersby_company' || req.path == '/getCompanyVehicles' || req.path == '/getSingleOrder' || req.path == '/deliveryByCompany'
        || req.path == '/orders/getSingleOrder' || req.path == '/companyologs' || req.path == '/createsingleorder' || req.path == '/createDelivery'
        || req.path == '/getCompanyDrivers' || req.path == '/createDriver' || req.path == '/orders/createapiorder' || req.path == '/orders/getapiorder'
        || req.path == '/orders/getVehicleOrdersReceived' || req.path == '/orders/getVehicleOrdersInprogress' || req.path == '/inuselist' || req.path == '/inuseupdate'
        || req.path == '/updatevehicle' || req.path == '/changeDeliveryStatus' || req.path == '/createvehicle' || req.path == '/removevehicle'
        || req.path == '/users/updatePassword' || req.path == '/users/remove' || req.path == '/users/getUser' || req.path == '/cancelDelivery' || req.path == '/logs'
       )
    {
      sec_find_by_companyid(req.body.companyID, function(rese){
        if (rese != undefined && rese != null && rese.companys != undefined && rese.companys != null && rese.companys.length > 0)
        {
          rese = rese.companys;
          if (rese != undefined && rese != null && rese.length >0)
          {
            var found = false;
            var temp = false;
            for (var i = 0; i < rese.length; i++)
            {
              if (rese[i].type == 'apikey')
              {
                if (req.body.api_key == rese[i].value && rese[i].companyID == req.body.companyID)
                {
                  found = true;
                }
              }
              else if (rese[i].type == 'tempkey')
              {
                if (req.body.api_key == rese[i].value)
                {
                  temp = true;
                }
              }

            }
            if (found == true)
            {
              next();
            }
            else if (temp == true)
            {

                sec_remove_tempkey(req.body.companyID,req.body.api_key,function(vast){
                  if (vast == 'success')
                  {
                    if (req.path == '/orders/createapiorder' || req.path == '/orders/getapiorder' )
                    {
                      next();
                      }
                      else {
                        res.send("error");
                    }
                  }
                  else {
                      res.send("error");
                  }
                });


            }
            else {
              res.send("error");
            }
          }
          else {
            res.send("error");
          }
      }
      else {
        res.send("error");
      }

      });
    }
    else {
      res.send("error");
    }

  }

});

function sec_find_by_companyid(comp,callback) {
  var CompanyProperties = mongoose.model('CompanyProperties');
  CompanyProperties.find({companyID: comp}, function(err, companys) {
    if (err)
    {
      callback("error");
    }
    callback({companys});
  });
};

function sec_remove_tempkey(comp,key,callback)
{
  var CompanyProperties = mongoose.model('CompanyProperties');
  CompanyProperties.remove({companyID:comp,type:'tempkey',value:key}, function(err, cp) {
    if (err)
    {
      callback("error");
    }
    callback("success");
  });
};


//Reittien luominen
var routes = require('./api/routes/vehicleRoutes');
routes(app);
var oRoutes = require('./api/routes/orderRoutes');
oRoutes(app);
var dRoutes = require('./api/routes/deliveryRoutes');
dRoutes(app);
var uRoutes = require('./api/routes/userRoutes');
uRoutes(app);
var pRoutes = require('./api/routes/pointRoutes');
pRoutes(app);
var cRoutes = require('./api/routes/companyRoutes');
cRoutes(app);
var lRoutes = require('./api/routes/lockerRoutes');
lRoutes(app);
var mRoutes = require('./api/routes/messageRoutes');
mRoutes(app);
var rRoutes = require('./api/routes/routeRoutes');
rRoutes(app);
var dLRoutes = require('./api/routes/deliveryListRoutes');
dLRoutes(app);
var pARoutes = require('./api/routes/paymentRoutes');
pARoutes(app);
var logRoutes = require('./api/routes/logRoutes');
logRoutes(app);
var isUseRoutes = require('./api/routes/inUseRoutes');
isUseRoutes(app);
var orderLogRoutes = require('./api/routes/orderLogRoutes');
orderLogRoutes(app);
var dtcRoutes = require('./api/routes/deliveryTimeCorrectionRoutes');
dtcRoutes(app);
var dcRoutes = require('./api/routes/deliveryConfirmationRoutes');
dcRoutes(app);
var cpRoutes = require('./api/routes/companyPropertiesRoutes');
cpRoutes(app);
var driverCompaniesRoutes = require('./api/routes/driverCompaniesRoutes');
driverCompaniesRoutes(app);
var driverVehiclesRoutes = require('./api/routes/driverVehiclesRoutes');
driverVehiclesRoutes(app);
var orderExtraRoutes = require('./api/routes/orderExtraRoutes');
orderExtraRoutes(app);

//app.listen(PORT);
httpsServer.listen(PORT);
console.log(`Running on https://${HOST}:${PORT}`);
