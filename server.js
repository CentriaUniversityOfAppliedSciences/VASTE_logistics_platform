'use strict';

const express = require('express');

// Constants
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

//Ladataan mallit käyttöön
Car = require('./api/models/carModels')
//Bodyparser jolla saadaan pyynnön sisältö talteen
bodyParser = require('body-parser');

//Mongoose yhteys
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/VasteDB'); 

//määritellään bodyparser käyttöön
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Reittien luominen
var routes = require('./api/routes/carRoutes'); /
routes(app); 

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

