'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SchoolDailySchema = new Schema ({


		companyID:{
			type: String,
		},
		name:{
			type: String
		},
    date:{
      type: String
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

module.exports = mongoose.model('SchoolDaily', SchoolDailySchema);
