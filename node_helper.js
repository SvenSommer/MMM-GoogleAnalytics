/* Magic Mirror
 * Node Helper: MMM-GoogleAnalytics
 *
 * By SvenSommer
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var googleapi = require('googleapis');
var ApiKeyFile = require('./keyfile.json');
var config;

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, config) {
		if (notification === "MMM-GoogleAnalytics-QUERY_DATA") {
			// Send notification
			var self = this;
			this.config = config;
			this.authorize(function(string){
					self.sendNotificationTest(string);
			});
		}
	},

	// Example function send notification test
	sendNotificationTest: function(payload) {
		this.sendSocketNotification("MMM-GoogleAnalytics-DISPLAY_DATA", payload);
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

/*
		  'auth': jwtClient,
	  	'ids': self.config.viewID ,
	  	'metrics': self.config.metrics,

	  	'start-date': self.config.start_date,
	  	'end-date': self.config.end_date,
	  	'sort': self.config.sort,
	  	'max-results' : self.config.max_results,
	  	'filters' : self.config.filters */
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
			console.log(JSON.stringify(response, null, 4));
			callback(response);
		  });
		});
	},

	getdefaultObj: function(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}


});
