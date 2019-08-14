'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SchoolRouteSchema = new Schema ({


		companyID:{
			type: String,
		},
		name:{
			type: String
		},
		days: {
			type:String
		},
		points:[
			{
					address:{
						type: String
					},
					number:{
						type: Number
					},
					persons:
					{
						type: Number
					}
			}
		]


});

module.exports = mongoose.model('SchoolRoute', SchoolRouteSchema);
