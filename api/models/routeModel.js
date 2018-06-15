'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RouteSchema = new Schema ({

		
		routeCompany:{
		type: String,
		},
		routeRepetition:{		//taulukko? päivittäin, viikottain, tilauksesta
			type: String,
		},
		startPoint:{
			type: String,
		},
		endPoint:{
			type: String,
		},
		startTime:{
			type: String,
		},
		endTime:{
			type: String
		}
	
	
});

module.exports = mongoose.model('Routes', RouteSchema);