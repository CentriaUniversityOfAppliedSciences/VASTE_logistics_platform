'use strict';
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);


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
  bodyParser = require('body-parser');//Bodyparser jolla saadaan pyynnön sisältö talteen
  var logger = require('./api/models/logModel');
  var ologger = require('./api/models/orderLogModel');
  var inUse = require('./api/models/inUseModel');
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

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
