'use strict';
var request = require('request');
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);

exports.boxAnnounce = function(status,vasteOrder,machine,size,valid, callback) {
  generateParcel(vasteOrder,function (vast){
    var parcel = "";
    if (status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (status == "delivery")
    {
      parcel = vast["2"];
    }
    var options = {
          uri: "http://localhost:"+environment.boxApi+"/api/announce",
          method: 'POST',
          headers: {
          "content-type": "application/json",
          },
          json: {
            "ParcelId":parcel,
            "MachineCode":machine,
            "BoxSize":size,
            "ValidUntil":valid
          }

      };
      //console.log(options);
      //callback("error");
      sendToApi(options,function(vast){
        callback(vast);
      });
  });

};

exports.boxCancel = function(vasteOrder,status,machine,callback) {
  generateParcel(vasteOrder,function (vast){
    var parcel = "";
    if (status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (status == "delivery")
    {
      parcel = vast["2"];
    }
    var options = {
        uri: "http://localhost:"+environment.boxApi+"/api/cancel",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "ParcelId":parcel,
          "MachineCode":machine
        }

    };

    sendToApi(options,function(vast){
      callback(vast);
    });
  });
};

exports.boxCancelApi = function(req, res) {
  generateParcel(req.body.vasteOrder,function (vast){
    var parcel = "";
    if (req.body.status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (req.body.status == "delivery")
    {
      parcel = vast["2"];
    }
    var options = {
        uri: "http://localhost:"+environment.boxApi+"/api/cancel",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "ParcelId":parcel,
          "MachineCode":req.body.machine
        }

    };
    sendToApi(options,function(vast){
      res.send(vast);
    });
  });
};

exports.boxFindParcelApi = function(req, res) {
  generateParcel(req.body.vasteOrder,function (vast){
    var parcel = "";
    if (req.body.status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (req.body.status == "delivery")
    {
      parcel = vast["2"];
    }
    var options = {
        uri: "http://localhost:"+environment.boxApi+"/api/findparcel",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "ParcelId":parcel,
          "MachineCode":req.body.machine
        }

    };
    sendToApi(options,function(vast){
      res.send(vast);
    });
  });
};
exports.boxFindParcel = function(vasteOrder,machine,status,pin,callback) {
  generateParcel(vasteOrder,function (vast){
    var parcel = "";
    if (status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (status == "delivery")
    {
      parcel = vast["2"];
    }
    var options = {
        uri: "http://localhost:"+environment.boxApi+"/api/findparcel",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "ParcelId":parcel,
          "MachineCode":machine
        }

    };
    sendToApi(options,function(vast){
      callback(vasteOrder,machine,status,pin,vast);
    });
  });
};

exports.boxFreeLockers = function(req, res) {
  var options = {
        uri: "http://localhost:"+environment.boxApi+"/api/freelockers",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "MachineCode":req.body.machine
        }

    };
    sendToApi(options,function(vast){
      res.send(vast);
    });
};

exports.boxTrack = function(vasteOrder,id,status,callback) {
  generateParcel(vasteOrder,function (vast){
    var parcel = "";
    if (status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (status == "delivery")
    {
      parcel = vast["2"];
    }
    var options = {
        uri: "http://localhost:"+environment.boxApi+"/api/trackandtrace",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "ParcelId":parcel
        }

    };
    //console.log(options);
    //callback(vasteOrder,status,id,{"IBstep":"PARCEL_DELIVERED"});
    //callback(vasteOrder,status,id,{"IBstep":"PARCEL_DELIVERED","PUstep":"PARCEL_PICKED_UP_BY_RECIPIENT"});
    sendToApi(options,function(vast){
      //console.log("api resp:");
      //console.log(vast);
      callback(vasteOrder,status,id,vast);
    });
  });
};

exports.boxUpdate = function(vasteOrder,status,machine,fetch,valid,callback) {
  generateParcel(vasteOrder,function (vast){
    var parcel = "";
    if (status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (status == "delivery")
    {
      parcel = vast["2"];
    }
    var options1 = {
        uri: "http://localhost:"+environment.boxApi+"/api/findparcel",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "ParcelId":parcel,
          "MachineCode":machine
        }

    };
    sendToApi(options1,function(vast1){
      if (vast1 != undefined && vast1 != null && vast1.length > 0)
      {
        var options2 = {
            uri: "http://localhost:"+environment.boxApi+"/api/update",
            method: 'POST',
            headers: {
              "content-type": "application/json",
            },
            json: {
              "ParcelId":parcel,
              "MachineCode":machine,
              "FetchCode":fetch,
              "ValidUntil":valid,
              "VersionInfo":vast1[0].VersionInfo
            }

          };
          sendToApi(options2,function(vast2){
            callback(vast2);
          });
      }
      else {
        callback("error")
      }
      //console.log(options);
      //callback("error");

    });
  });
};

exports.boxUpdateApi = function(req,res) {
  generateParcel(req.body.vasteOrder,function (vast){
    var parcel = "";
    if (req.body.status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (req.body.status == "delivery")
    {
      parcel = vast["2"];
    }

    var options1 = {
        uri: "http://localhost:"+environment.boxApi+"/api/findparcel",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "ParcelId":parcel,
          "MachineCode":req.body.machine
        }

    };
    //console.log(options1);
    //res.send("error");
    sendToApi(options1,function(vast1){
      var options2 = {
          uri: "http://localhost:"+environment.boxApi+"/api/update",
          method: 'POST',
          headers: {
          "content-type": "application/json",
          },
          json: {
            "ParcelId":parcel,
            "MachineCode":req.body.machine,
            "FetchCode":req.body.fetch,
            "ValidUntil":req.body.valid,
            "VersionInfo":vast1[0].VersionInfo
          }

      };

      sendToApi(options2,function(vast2){

        res.send(vast2);
      });
    });
  });
};


exports.getStates = function(machine,callback) {
    var options = {
        uri: "http://localhost:"+environment.boxApi+"/api/getBoxesState",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "MachineCode":machine
        }
    };
    //console.log(options);
    sendToApi(options,function(vast){
      //console.log(vast);
      callback(machine,vast);
    });
};




function sendToApi(options, callback)
{
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            callback(body);
          }
          else
          {
            callback('error');
          }
        });
}


function generateParcel(num,callback){
	var ret = {"1":"","2":""};

    num = num.toString();
		if(num.length == 1){
			ret["1"] = "FC1000000000"+num;
      ret["2"] = "FC1100000000"+num;
		}
		else if(num.length == 2){
			ret["1"] = "FC100000000"+num;
      ret["2"] = "FC110000000"+num;
		}
		else if(num.length == 3){
			ret["1"] = "FC10000000"+num;
      ret["2"] = "FC11000000"+num;
		}
		else if(num.length == 4){
			ret["1"] = "FC1000000"+num;
      ret["2"] = "FC1100000"+num;
		}
		else if(num.length == 5){
			ret["1"] = "FC100000"+num;
      ret["2"] = "FC110000"+num;
		}
		else if(num.length == 6){
			ret["1"] = "FC10000"+num;
      ret["2"] = "FC11000"+num;
		}
    else if(num.length == 7){
			ret["1"] = "FC1000"+num;
      ret["2"] = "FC1100"+num;
		}
    else if(num.length == 8){
			ret["1"] = "FC100"+num;
      ret["2"] = "FC110"+num;
		}
    else if(num.length == 9){
      ret["1"] = "FC10"+num;
      ret["2"] = "FC11"+num;
    }
		callback(ret);

}
