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
			type: String,
			required:'Kindly enter your e-mail'
		}
		},
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
			type: String,
			required:'Kindly enter your e-mail'
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
			type: Number,
			required:'Please add the numbers of persons to pickup'
			},
		package:			//array
		[	{
				size: {
					type: String,
					required:'Please enter the size of the package: width x height x depth'
				},
				weight:{
					type: Number,
					required:'Please enter the package weight in grams'
				},
				number:{
				type: Number,
				required:'Please enter the number of the packages'
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