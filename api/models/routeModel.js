'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RouteSchema = new Schema ({


		companyID:{
		type: String,
		},
		weekDay:{
			type: String //0 - 6, sunday - saturday
		},
		name:{
			type: String
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
						type: Number
					},
					deviation:{
						type: Number
					}
			}
		],
		vehicleType:{
			type: String,
			default:  ['car']
		}


});

module.exports = mongoose.model('Routes', RouteSchema);
