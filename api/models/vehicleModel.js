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
    type: [{
      type: String,
      enum: ['online', 'offline']
    }],
    default: ['offline']
  },
  state: 
  {
    type: [{
      type: String,
      enum: ['booked', 'available']
    }],
    default: ['available']
  },
  longitude: 
  {
	  type: Number,		//sijainti
      default: -9999.99
  },
  latitude: 
  {
	  type: Number,	
      default: -9999.99
  },
});

module.exports = mongoose.model('Vehicles', VehicleSchema);

