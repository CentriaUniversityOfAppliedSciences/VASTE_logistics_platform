'use strict';



// Constants
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Vehicle = require('./api/models/vehicleModel'), //Ladataan mallit käyttöön
  Order = require('./api/models/orderModel'), //Ladataan mallit käyttöön
  Delivery = require('./api/models/deliveryModel'), //Ladataan mallit käyttöön
  User = require('./api/models/userModel'), //Ladataan mallit käyttöön
  Point = require('./api/models/pointModel'), //Ladataan mallit käyttöön
  bodyParser = require('body-parser');//Bodyparser jolla saadaan pyynnön sisältö talteen

//Mongoose yhteys
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/VasteDB'); 

//määritellään bodyparser käyttöön
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());//a


//Reittien luominen
var routes = require('./api/routes/vehicleRoutes'); 
routes(app);  //http://localhost:3000/api/car
var oRoutes = require('./api/routes/orderRoutes'); 
oRoutes(app); 
var dRoutes = require('./api/routes/deliveryRoutes'); 
dRoutes(app); 
var uRoutes = require('./api/routes/userRoutes'); 
uRoutes(app); 
var pRoutes = require('./api/routes/pointRoutes'); 
uRoutes(app); 

/*
// App
const app = express();
app.get('/', (req, res) => 
{
  res.send('This is Vaste! on se hyvä\n');
});
*/

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);

