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
            type: String
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
            type: String
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


	status: {			//tilan seuranta //vastaanotettu, kuljettaja hyväksynyt, noudettu, peruutettu, valmis, lähettäjä ei ole vienyt boksiin, lähettäjä vienyt boksiin, kuljettaja ei ole vienyt boksiin,kuljettaja vienyt boksiin

		type: String,
		enum: ['received', 'accepted', 'inProgress', 'cancelled' ,'done', 'pickup_not_ready','pickup_ready','box_accepted','delivery_not_ready','delivery_ready','box_cancelled','terminal_start','terminal_stop'],
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
	},
	vasteOrder:
	{
		type: Number
	},
	destination:
	{
		type: String,
		enum: ['address', 'box', 'depot','driver'],
		default: ['address']
	},
	companyID:
	{
		type: String,
		default: '0'
	},
	archieved: //if 0 shows up in normal orders queries, if 1 archieved (usually when status done) and has to be queried with different separately. 2 if removed by operator, 3 if failed box order
	{
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Orders', OrderSchema);
