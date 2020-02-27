'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LockSchema = new Schema ({
  calendarDataTitle_Id:{
    type: String
  },
  calendarData_Id:{
    type: String
  },
  calendarDataRecurringEntry_Id:{
    type: String
  },
  calendarDataRecurringEntryException_Id:{
    type: String
  },
  orderID:{
    type: String
  },
  name:{
    type: String
  }

});



module.exports = mongoose.model('Locks', LockSchema);
