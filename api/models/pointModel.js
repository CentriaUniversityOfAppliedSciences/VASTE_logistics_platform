'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PointSchema = new Schema ({ //Boxit

	name:{
		type: String,
		required:'Name of the point'
	},
	address:{
		type: String,
		required:'Address of the point'
	},
	number:{
		type: String,
		required:'Serial number'
	}



});

module.exports = mongoose.model('Points', PointSchema);
