'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new schema ({
	customer:{
		name: {
        lastName: {
            type: String,
            required: 'Kindly enter your lastname' // pelkkä nimi? samaan etu ja suku? object tyypillä?
        },
        firstName: String
		
		phoneNumber:{			//tuleeko asiakas erikseen ja nämä tiedot sinne?
			type: String,
			required:'Kindly enter your phone number' 
		},
		}
	},
	
	packageStatus:{
	size: [{				//paketin koko, määritetäänkö jotain standardeja mistä valita? 
	  type: String,
		enum: ['small','medium','big']
	}],
	default: ['medium']
	},
	
	status: {
    type: [{
      type: String,
      enum: ['wait', 'coming','arrived']//odottaa, tulossa, saapunut 'pending', 'ongoing', 'completed'?
    }],
    default: ['wait']
   },
   
   address: {			//osoitteet, nouto ja toimitus
	  pickup: {
		  type: String,
		  required:'Kindly indicate pickup adress'
	  },
	  delivery: {
		  type: String,
		  required: 'Kindly indicate delivery adress'
	  },
    },
	
	time: {				//aika, nouto ja toimitus
		pickupTime:{
			type: String,
			required: 'Kindly indicate pickup time'
		},
		deliveryTime:{
			type: String,
			required: 'Kindly indicate delivery time'
		},
	},
}),

module.exports = mongoose.model('Orders', OrderSchema);