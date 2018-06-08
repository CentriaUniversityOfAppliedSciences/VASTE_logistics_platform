'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PointSchema = new Schema ({ //Boxit ja terminaalit
	
	pointName:{
		type: String,
		required:'Name of the point'
	},
	
	pointAddress:{
		type: String,
		required:'Address of the point'
	},

	pointOuner:{			//onko samoja yrityksiä kuin kulkuneuvojen omistajissa- tiedon yhdistäminen?
		type: String,
		required:'Company name'
	},
	
	pointounerId:{
		type: String,
	}
	

});

module.exports = mongoose.model('Points', PointSchema);