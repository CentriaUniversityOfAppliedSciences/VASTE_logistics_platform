'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RouteSchema = new Schema ({


		companyID:{
		type: String,
		},
		repetition:{		//taulukko? päivittäin, viikottain, tilauksesta
			type: String,
		},
		weekDay:{
			type: String //0 - 6, sunday - saturday
		},
		routeID:
		{
			type: String
		},
		points:[
			{
					address:{
						type: String
					},
					latitude:{
						type: String
					},
					longitude:{
						type: String
					},
					number:{
						type: Number
					},
					estimateTime:{
						type: String
					}
			}
		],
		vehicleType:{
			type: String,
			default:  ['car']
		}


});

module.exports = mongoose.model('Routes', RouteSchema);
