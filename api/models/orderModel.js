'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema ({
	subscriber:{		//Tilaaja
		name: {
        lastName: {
            type: String,
            required: 'Kindly enter your lastname'
			},
        firstName:  {
            type: String,
            required: 'Kindly enter your firstname'
			},

		phoneNumber:{
			type: String,
			required:'Kindly enter your phone number'
			},
		email:{
			type: String
		}
		}
		},


	receiver:{			//Vastaanottaja
		name: {
        lastName: {
            type: String,
            required: 'Kindly enter receivers lastname'
        },
        firstName:  {
            type: String,
            required: 'Kindly enter receivers firstname'
        },

		phoneNumber:{
			type: String,
			required:'Kindly enter receivers phone number'
		},
		email:{
			type: String
		}
		}
	},


	status: {			//tilan seuranta

		type: String,
		enum: ['received', 'accepted', 'inProgress', 'cancelled', 'done'],
		default: ['received']
   },


   address: {			//osoitteet, nouto ja toimitus
	  pickup: {
			pstreet:{
			type: String,
			required:'Please enter pickup street address'
			},
			pnumber:{
			type: String,
			required:'Please enter pickup postcode'
			},
			plocal:{
			type: String,
			required: 'Please enter pickup locality'
			},
			papartmentnumber:{
				type: String
			},
		},
		delivery: {
			dstreet:{
			type: String,
			required:'Please enter delivery street address'
			},
			dnumber:{
			type: String,
			required:'Please enter delivery postcode'
			},
			dlocal:{
			type: String,
			required: 'Please enter delivery locality'
			},
			dapartmentnumber:{
				type: String
			},
		},
    },

	time: {				//aikaikkunat, nouto ja toimitus
		pickupTime:{
			pAfter:{
				type: Number,
			required: 'Please set the date and time when the order is ready to pickup'
			},
			pBefore:{
				type: Number,
			required: 'Please set the date and time before the order must be pickup'
			}
		},
		 deliveryTime:{
			dAfter:{
			type: Number,
			required: 'Please set the date and time when the order can be delivered'
			},
			dBefore:{
			type: Number,
			required: 'Please set the date and time before the order must be delivered'
			},
		},
	},

	orderStatus: {			//tilauksen sisältö
		persons: {
			type: Number
			},
		package:			//array
		[	{
				packageHeight:{
					type: Number
				},
				packageWidth:{
					type: Number
				},
				packageLength:{
					type: Number
				},
				packageVolume:{
					type: Number
				},
				weight:{
					type: Number
				},
				number:{
				type: Number
				}
			}
		]

	},
	orderInfo:
	{
		type: String
	},
	orderDescription:
	{
		type: String
	}
});

module.exports = mongoose.model('Orders', OrderSchema);
