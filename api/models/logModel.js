'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema ({

  user:{ //userID who did something
    type: String
  },
  ip:{ //ip of connection
    type: String
  },
  timestamp:{ //when happened
    type: Number
  },
  code:{ //what did they do
    type: String
  },
  severity:{ // estimated severity of what has been done 0->10 with 10 being highest, 0 page load, 10 very dangerous
    type: String
  },
  message:{ //additional info
    type: String
  },
  companyID:{ //company table _id
    type: String
  }


});

module.exports = mongoose.model('Log', LogSchema);
