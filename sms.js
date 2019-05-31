var smsToken = "MTlhMjRjNDBhOWMzZDFiODc0YjU4YjJjMDU0NGVjZjM6L1IvYF5hTjk=";
var teliaTokenUrl = "https://api.opaali.telia.fi/autho4api/v1/token";
var teliaSMSUrl = "https://api.opaali.telia.fi/production/messaging/v1/outbound/tel%3A%2B358406812646/requests";
//var teliaSMSUrl = "https://api.opaali.telia.fi/sandbox/messaging/v1/outbound/tel%3A%2B358406812646/requests";

var request = require('request');
var authToken = "";

var sendSMS = function(puh, msg, sender)
{
	getSMSAuthToken(function(token, error) {
		if (!error && token != null) {
			var options = {
				uri: teliaSMSUrl,
				method: 'POST',
				json: true,
				headers: {
					"Authorization": "Bearer " + token
				},
				json: {
					"outboundMessageRequest": {
						"address": puh,
						"senderAddress": "tel:+358406812646",
						"outboundSMSTextMessage": {
							"message":msg
						},
						"senderName": sender
					}
				}
			};

			request(options, function (error, response, body) {
				if (!error && response.statusCode == 201) {
					console.log("success");
					//console.log(response);
				}
				else {
					console.log(response.statusCode);
					console.log("error or failure");
					//console.log(response);
				}
			});
		}
	});
}

module.exports.sendSMS = sendSMS;


var getSMSAuthToken = function(callback)
{
	var options = {
		uri: teliaTokenUrl,
		method: 'POST',
		headers: {
			"Authorization" : "Basic " +smsToken
		},
		form: {
			"grant_type":"client_credentials"
		}
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var authToken = json.access_token;
			callback(authToken);
		}
		else {
			console.log(response);
			callback(null, error);
		}
	});
}

module.exports.getSMSAuthToken = getSMSAuthToken;
