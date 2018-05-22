'use strict';



// Constants
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Car = require('./api/models/carModel'), //Ladataan mallit käyttöön
  bodyParser = require('body-parser');//Bodyparser jolla saadaan pyynnön sisältö talteen

//Mongoose yhteys
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/VasteDB'); 

//määritellään bodyparser käyttöön
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Reittien luominen
var routes = require('./api/routes/carRoutes'); 
routes(app);  //http://localhost:3000/api/car

/*
// App
const app = express();
app.get('/', (req, res) => 
{
  res.send('This is Vaste! on se hyvä\n');
});
*/

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

