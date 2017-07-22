/* Magic Mirror
 * Node Helper: MMM-GoogleAnalytics
 *
 * By SvenSommer
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var googleapi = require('googleapis');
var ApiKeyFile = require('./keyfile.json');
var NodeGeocoder = require('node-geocoder');
var fs = require('fs');
var config;
var wcities = [];
var text;

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		//console.log(notification, "received by node_helper.js received");
		if (notification === "MMM-GoogleAnalytics-QUERY_DATA") {
			// Send notification
			var self = this;
			this.config = payload;
			this.authorize(function(data){
					self.sendNotification_DISPLAY_DATA(data);
			});
		}
		else if (notification === "MMM-GoogleAnalytics-GET_COORDINATES") {
			//console.log("MMM-GoogleAnalytics-GET_COORDINATES received");
			var self = this;
			this.cities = payload;
			this.getCoordinatesfromCitiesName(this.cities, function(cityinfo){
				//console.log(cityinfo);
				self.sendSocketNotification("MMM-GoogleAnalytics-CITYINFO", cityinfo);
			});
		}
	},

	// Example function send notification test
	sendNotification_DISPLAY_DATA: function(payload) {
		this.sendSocketNotification("MMM-GoogleAnalytics-DISPLAY_DATA", payload);
	},

	getCoordinatesfromGoogle: function(city,callback){
		var geocoder = NodeGeocoder({provider: 'google'});
		//console.log("query geocoder for ",city.country + "," + city.cityname);

			geocoder.geocode({address: city.country + "," + city.cityname, minConfidence: 0.5, limit: 5}, function(err, res) {
				if (err) {
					console.log(err);
					return;
				}
				var cityobject= {
					'country':   city.country,
					'cityname':  city.cityname,
					'latitude':  res[0].latitude,
					'longitude': res[0].longitude}

					callback(cityobject);

				//var coord = {'latitude': res[0].latitude,'longitude': res[0].longitude};
				//callback(city,coord);
			});



	},

	getCoordinatesfromCitiesName: function(cities,callback){
		self = this;
		for (var x = 0, ln = cities.length; x < ln; x++) {
		  setTimeout(function(y) {
			 // console.log(cities[y].country ,cities[y].cityname);
			  if (self.cities[y].country != "(not set)" && self.cities[y].cityname != "(not set)") {
				  self.getCoordinatesfromGoogle(self.cities[y],function(cityinfo){
					  callback(cityinfo);
				  });
			  }
		  }, x * 500, x);
		}
	},

	writeJsonfile: function(cities){
		var fs = require('fs');
		var file = fs.createWriteStream('test.json');
		file.write("MMM_GoogleAnalytics_Users = [");
		for (var cityinfo in cities) {
			if (object.hasOwnProperty(city)) {
				file.write("{lat:"+ cityinfo.latitude+",lng:"+cityinfo.longitude+", label:" + cityinfo.cityname + "},");
			}
		}
		file.write("]");
		file.end();
	},

	authorize: function(callback) {
		var	self = this;
		var google = this.getdefaultObj(googleapi);
		var Key = this.getdefaultObj(ApiKeyFile);

		var jwtClient = new google.default.auth.JWT(Key.default.client_email, null, Key.default.private_key, ['https://www.googleapis.com/auth/analytics.readonly'], null);
		jwtClient.authorize(function (err, tokens) {
		  if (err) {
		    console.log(err);
		    return;
		  }
		  var analytics = google.default.analytics('v3');

		  var querybuilder =  {
			  'auth': jwtClient,
			  'ids': self.config.viewID ,
			  'metrics': self.config.metrics,
			  'start-date': self.config.start_date,
	  	  	  'end-date': self.config.end_date,
		  };
		  if (self.config.dimensions != '') {querybuilder['dimensions'] = self.config.dimensions;}
		  if (self.config.sort != '') {querybuilder['sort'] = self.config.sort;}
		  if (self.config.filters != '') {querybuilder['filters'] = self.config.filters;}
		  if (self.config.segment != '') {querybuilder['segment'] = self.config.segment;}
		  if (self.config.start_index != '') {querybuilder['start-index'] = self.config.start_index;}
		  if (self.config.max_results != '') {querybuilder['max-results'] = self.config.max_results;}

		 analytics.data.ga.get(
			 querybuilder

		  , function (err, response) {
			if (err) {
			  console.log(err);
			  return;
			}
			//console.log(JSON.stringify(response, null, 4));
			callback(response);
		  });
		});
	},

	getdefaultObj: function(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}


});
