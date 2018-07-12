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
    required: 'Please enter the vehicle registernumber'
  },
  type: 
  {
    type: String,
    default:  ['Car']
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
    default: ['offline']
  },
  state: 
  {	
    type: String,
    enum: ['booked', 'available'],
    default: ['available']
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
  maxSize:
  {
	  type: String,
	  required: 'height x length x width in cm'
  },
  maxWeight:
  {
	  type: Number,
	  required: 'in kilos'
  },
  maxPeople:
  {
	  type: Number,
	  required: 'Number of people'
  }
});

module.exports = mongoose.model('Vehicles', VehicleSchema);

