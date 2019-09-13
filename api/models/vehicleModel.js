'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VehicleSchema = new Schema({
  _id:
    {
    type: String,
    required: 'Please enter the vehicle identifier'
  },
  registerNumber:
    {
    type: String,
    required: 'Please enter the vehicle registernumber',
    unique: true
  },
  type:
  {
    type: String,
    default:  'car'
  },
  updateDate:
    {
    type: Date,
    default: Date.now
  },
  status:
  {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  state:
  {
    type: String,
    enum: ['booked', 'available'],
    default: 'available'
  },
  space:
  {
	type:String,
	enum: ['space','full'],
	default: 'space'
  },
  longitude:
  {
	  type: Number,		//sijainti
      default: 0.0
  },
  latitude:
  {
	  type: Number,
      default: 0.0
  },
	maxHeight:{
	 	type: Number,
	 	required: 'height in cm'
	},
	maxWidth:{
		type: Number,
		required: "width in cm"
	},
	maxLength:{
		type: Number,
		required: "length in cm"
	},
  maxWeight:
  {
	  type: Number,
	  required: 'in kilos'
  },
	maxVolume:{
		type: Number,
		required: 'in m3'
	},
  maxPeople:
  {
	  type: Number,
	  required: 'Number of people'
  },
	homeTown:
	{
		type: String,
		required: "Please choose a home town"
	},
  companyID:
  {
	  type: String,
	  default:"0"
  },
	fuelConsumption:
	{
		type: Number,
		required: "Please enter estimated fuel consumption per 100km"
	},
	fuelType:
	{
		type: String,
		required: "Please enter fuel type"
	}
});

module.exports = mongoose.model('Vehicles', VehicleSchema);
