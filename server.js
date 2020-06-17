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
var cert2 = fs.readFileSync( "./encryption/2020/www_vaste_info_cert.cer" );
var cat2 = fs.readFileSync("./encryption/2020/www_vaste_info.cer");
var key2 = fs.readFileSync("./encryption/2020/vaste.key");

var credentials = {key: key, cert: cert, ca: cat,passphrase: secret.passphrase};
var credentials2 = {
    key: key2,
    ca: cat2,
    cert: cert2,
    passphrase: secret.passphrase2,
    requestCert: true,
    rejectUnauthorized: false
  };

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
  cp = require('./api/models/companyPropertiesModel'),
  osm = require('./api/models/orderStatusModel'),
  st = require('./api/models/stripeModel'),
  school = require('./api/models/schoolRouteModel'),
  schoolDaily = require('./api/models/schoolDailyModel'),
	coupon = require('./api/models/couponModel'),
  userOrder = require('./api/models/userOrderModel'),
	userConfirm = require('./api/models/userConfirmModel'),
	usersVehicles = require('./api/models/usersVehiclesModel.js'),
  locks = require('./api/models/lockModel.js');

//Mongoose yhteys
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser',true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
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
  //console.log(req.path);
  if (req.path == '/users/identification' || req.path == '/users/customerauth')
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
              || req.path == '/getSeuraaOrder' || req.path == '/deliveryLists' || req.path == '/getCompanyApi' || req.path == '/listPayments' || req.path == '/stripemessage'
              || req.path == '/createsingleorder' || req.path == '/points' || req.path == '/lockers' || req.path == '/points/getboxes' || req.path == '/points/getbox'
              || req.path == '/book_a_locker' || req.path == '/orders/change_order_status' || req.path == '/get_locker_pin' || req.path == '/orders/updatePincode'
              || req.path == '/getBoxOrder' || req.path == '/orderstatus/create' || req.path == '/box/cancel'
              || req.path == '/box/findparcel' || req.path == '/box/getfree' || req.path == '/box/boxtrack' || req.path == '/box/update'
              || req.path == '/failedOrder' || req.path == '/points/getById' || req.path == '/bystripe' || req.path == '/orderstatus/find_orderstatus_by_ID'
              || req.path == '/unbook_a_locker' || req.path == '/orderstatus/update_orderstatus_by_ID' || req.path == '/getOrderLogs'
              || req.path == '/orderstatus/list_by_company' ||  req.path == '/find_locker_by_orderID' || req.path == '/customerDeleteOrder'
              || req.path == '/messages/find_message_by_order' || req.path == '/messages/create_message' || req.path == '/listPaymentsOther' || req.path == '/users/updatePassword'
              || req.path == '/getDeliveryConfirmation' || req.path == '/createDeliveryConfirmation' || req.path == '/announceDeliveryConfirmation' || req.path == '/listAllRoutes'  || req.path == '/findPaymentByRoute' || req.path == '/findSingleRoute'
							|| req.path == '/findRoutePayments'
							|| /*Koulukyydit ->*/ req.path == '/createSchoolRouteModel' || req.path == '/getDailySchoolRoute' || req.path == '/createSchoolDaily' || req.path == '/schoolRouteModels' /*<-----koulukyydit*/
              || /*asiakkaan tilaukset ->*/ req.path == '/usersorder' || req.path == '/createusersorder' || req.path == '/removeusersorder' || req.path == '/getuserorderlist'  /*<-----asiakkaan tilaukset*/
              || /*For superoperator ->*/req.path =='/getCompaniesDeliveries' ||req.path =='/getCompanies' || req.path == "/getCompaniesOrders"
							|| req.path == "/getCompaniesVehicles" || req.path == '/getCompaniesLogs' || req.path == '/getCompaniesDrivers' || req.path == '/superGetSingleOrder'
						  || req.path == '/superCreateDelivery' || req.path == '/superUpdateOrder' || req.path == '/superCancelDelivery' || req.path == '/createPayment'
							|| req.path == '/superDeleteOrder' || req.path == '/superDeliveryLists' || req.path == '/getCompaniesPayments' || req.path == '/superDeleteVehicle'
							|| req.path == '/superDeleteUser' || req.path == '/getCompaniesName' || req.path == '/superCreateDriver' || req.path == '/superAddVehicle' || req.path == '/superCancelBoxDelivery'
							|| req.path == '/superCreateSinglePayment' || req.path == '/superDeletePayment' || req.path == '/updateLockerPin2' || req.path == '/superGetLockerData'
							|| req.path == '/superGetPointData' || req.path == '/getKebaLockers' || req.path == '/getCompaniesRoutes' || req.path == '/superCreateRoute' || req.path == '/superDeleteRoute'
							|| req.path == '/superListApplicants' || req.path == '/superEditOrder' || req.path == '/superGetCustomerUsers' || req.path == '/superGetCustomerCompanies'/*<-super*/
							|| /*Kupongit ->*/req.path == '/getCoupons' || req.path == '/updateCoupon' || req.path == '/createCoupon' || req.path == '/deleteCoupon' || req.path == '/getSingleCoupon' /*<-- kupongit*/
							|| req.path == '/superCancelAddressDelivery' || req.path == '/createCustomer' || req.path == '/users/customerupdatepass' || req.path == '/getUsers' ||req.path == '/getUserByMail' || req.path == '/getGroupFreeOrders'
							|| /*userConfirms -->*/ req.path == '/newUserConfirm' || req.path == '/getConfirm' || req.path == '/deleteConfirm' || req.path == '/createConfirmUser' || req.path == '/updateConfirm' /*<-----userconfirms*/
							|| /*usercCars -->*/ req.path == '/driverAddVehicle' || req.path == '/createNewCarLink' || req.path == '/getDriversCars' || req.path == '/createDriverDelivery'/*<---usercars*/
							|| req.path == '/getVehicleByID' || req.path == '/findDeliveryByVehicle' || req.path == '/driverGetOrder' || req.path == '/findDeliveryByOrder' || req.path == '/updateOrdersCompany' || req.path == '/points/testLock'
							|| req.path == '/editOrder' || req.path == '/getUnfinishedOrderAmount'
							|| /*customerCompanies ->*/req.path == '/createCustomerCompany' || req.path == '/getUserCompanyOrders' || req.path == '/findCustomerCompany' || req.path == '/findStoreCustomers'/*<--customerCompanies*/
						)
              && req.body.apikey == environment.apikey
          )
  {

    next();
  }
  else if ((req.path == '/appCreateCustomer') && req.body.apikey == environment.joukkoistusapikey)
  {
    next();
  }
  else {
    if (req.path == '/ordersby_company' || req.path == '/getCompanyVehicles' || req.path == '/getSingleOrder' || req.path == '/deliveryByCompany'
        || req.path == '/orders/getSingleOrder' || req.path == '/companyologs' || req.path == '/createsingleorder' || req.path == '/createDelivery'
        || req.path == '/getCompanyDrivers' || req.path == '/createDriver' || req.path == '/orders/createapiorder' || req.path == '/orders/getapiorder'
        || req.path == '/orders/getVehicleOrdersReceived' || req.path == '/orders/getVehicleOrdersInprogress' || req.path == '/inuselist' || req.path == '/inuseupdate'
        || req.path == '/updatevehicle' || req.path == '/changeDeliveryStatus' || req.path == '/createvehicle' || req.path == '/removevehicle'
 				|| req.path == '/updateOrder'  || req.path == '/getCompanyPayments' || req.path == '/deleteOrder'  || req.path == '/users/remove' || req.path == '/users/getUser'
        || req.path == '/cancelDelivery' || req.path == '/logs' || req.path == '/orders/getVehicleOrders' || req.path == '/cancelBoxDelivery' || req.path == '/createSinglePayment' || req.path == '/createPayment'
				|| req.path == '/deletePayment' || req.path == '/orders/boxOrders' || req.path == '/cancelAddressDelivery' || req.path == '/getCompanyRoutes' || req.path == '/createNewRoute'
				|| req.path == '/deleteRoute' || req.path == '/get_locker_pin' || req.path == '/getCompanyOrder' || req.path == '/orders/groupOrders' || req.path == '/listCompanyConfirms'
				|| req.path == '/companys/find_company_by_ID' || req.path == '/orders/routeOrders' || req.path == '/orders/updateRouteOrder'
        || req.path == '/orders/updateRouteOrderStatus' || req.path == '/orders/routeOrdersReceived'
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
                    if (req.path == '/orders/createapiorder' || req.path == '/orders/getapiorder' || req.path == '/createsingleorder' )
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
var orderStatusRoutes = require('./api/routes/orderStatusRoutes');
orderStatusRoutes(app);
var stripeRoutes = require('./api/routes/stripeRoutes');
stripeRoutes(app);
var superiorRoutes = require('./api/routes/superiorRoutes');
superiorRoutes(app);
var boxRoutes = require('./api/routes/boxRoutes');
boxRoutes(app);
var schoolModelRoutes = require('./api/routes/schoolRouteRoutes');
schoolModelRoutes(app);
var schoolDailyRoutes = require('./api/routes/schoolDailyRoutes');
schoolDailyRoutes(app);
var couponRoutes = require('./api/routes/couponRoutes');
couponRoutes(app);
var userOrderRoutes = require('./api/routes/userOrderRoute');
userOrderRoutes(app);
var userConfirmRoutes = require('./api/routes/userConfirmRoutes');
userConfirmRoutes(app);
var usersVehiclesRoutes = require('./api/routes/usersVehiclesRoutes');
usersVehiclesRoutes(app);

//app.listen(PORT);
httpsServer.listen(PORT);
console.log(`Running on https://${HOST}:${PORT}`);
