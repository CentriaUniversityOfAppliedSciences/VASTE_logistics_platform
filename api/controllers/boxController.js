'use strict';
var request = require('request');
var fs = require('fs');
var environmentJson = fs.readFileSync("./environment.json");
var environment = JSON.parse(environmentJson);

exports.boxAnnounce = function(req, res) {
  generateParcel(req.body.vasteOrder,function (vast){
    var parcel = "";
    if (req.body.status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (req.body.status == "delivery")
    {
      parcel = vast["2"]
    }
    var options = {
          uri: "http://localhost:"+environment.boxApi+"/api/announce",
          method: 'POST',
          headers: {
          "content-type": "application/json",
          },
          json: {
            "ParcelId":parcel,
            "MachineCode":req.body.machine,
            "BoxSize":req.body.size,
            "ValidUntil":req.body.valid
          }

      };
      sendToApi(options,function(vast){
        res.send(vast);
      });
  });

};

exports.boxCancel = function(req, res) {
  generateParcel(req.body.vasteOrder,function (vast){
    var parcel = "";
    if (req.body.status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (req.body.status == "delivery")
    {
      parcel = vast["2"]
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

exports.boxFindParcel = function(req, res) {
  generateParcel(req.body.vasteOrder,function (vast){
    var parcel = "";
    if (req.body.status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (req.body.status == "delivery")
    {
      parcel = vast["2"]
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

exports.boxTrack = function(req, res) {
  generateParcel(req.body.vasteOrder,function (vast){
    var parcel = "";
    if (req.body.status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (req.body.status == "delivery")
    {
      parcel = vast["2"]
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
    sendToApi(options,function(vast){
      res.send(vast);
    });
  });
};

exports.boxUpdate = function(req, res) {
  generateParcel(req.body.vasteOrder,function (vast){
    var parcel = "";
    if (req.body.status == "pickup")
    {
      parcel = vast["1"];
    }
    else if (req.body.status == "delivery")
    {
      parcel = vast["2"]
    }
    var options = {
        uri: "http://localhost:"+environment.boxApi+"/api/update",
        method: 'POST',
        headers: {
        "content-type": "application/json",
        },
        json: {
          "ParcelId":parcel,
          "MachineCode":req.body.machine,
          "FetchCode":req.body.fetch,
          "ValidUntil":req.body.valid
        }

    };
    sendToApi(options,function(vast){
      res.send(vast);
    });
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
