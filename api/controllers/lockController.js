'use strict';
var request = require('request');
var async = require('async');
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);
var mongoose = require('mongoose'),
  Locks = mongoose.model('Locks');

exports.createCode = function(name, code, days, door, vaste,order, callback) {

    var options = {
          uri: "http://localhost:"+environment.boxApi+"/api/vaste",
          method: 'POST',
          headers: {
          "content-type": "application/json",
          },
          json: {
            "Name":name,
            "AccessCode":code,
            "Days":days,
            "Door":door,
            "VasteCode":vaste
          }

      };
      console.log(options);
      callback("error");
      /*sendToApi(options,function(vast){
        console.log(vast);
        var j = {
          "calendarDataTitle_Id": vast.CalendarDataTitle_Id,
          "calendarData_Id":vast.CalendarData_Id,
          "calendarDataRecurringEntry_Id":vast.CalendarDataRecurringEntry_Id,
          "calendarDataRecurringEntryException_Id":vast.CalendarDataRecurringEntryException_Id,
          "orderID": order,
          "name":name
        };
        var new_Lock = new Locks(j);
        new_Lock.save(function(err, lock) {
          if (err)
          {
            console.log(err);
          }
          console.log(lock);
            callback(vast);
        });

      });*/

};
exports.deleteCode = function(calendarDataTitle_Id, calendarData_Id, calendarDataRecurringEntry_Id, calendarDataRecurringEntryException_Id, name, callback) {

    var options = {
          uri: "http://localhost:"+environment.boxApi+"/api/vaste",
          method: 'DELETE',
          headers: {
          "content-type": "application/json",
          },
          json: {
            "CalendarDataTitle_Id":calendarDataTitle_Id,
            "CalendarData_Id":calendarData_Id,
            "CalendarDataRecurringEntry_Id":calendarDataRecurringEntry_Id,
            "CalendarDataRecurringEntryException_Id":calendarDataRecurringEntryException_Id,
            "Name":name
          }

      };
      //console.log(options);
      //callback("error");
      sendToApi(options,function(vast){
        callback(vast);
      });

};






function sendToApi(options, callback)
{
      request(options, function (error, response, body) {
        console.log(error);
        console.log(response);
        console.log(body);
          if (!error && response.statusCode == 200) {
            callback(body);
          }
          else
          {
            callback('error');
          }
        });
}
