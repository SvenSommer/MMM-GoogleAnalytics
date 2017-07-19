/* global Module */

/* Magic Mirror
 * Module: MMM-GoogleAnalytics
 *
 * By SvenSommer
 * MIT Licensed.
 */

Module.register("MMM-GoogleAnalytics", {
	defaults: {
		updateInterval: 60 * 10 * 1000,
		viewID : 'ga:123456700',
		metrics: 'ga:newusers,ga:users, ga:sessions, ga:pageviews',
		start_date: 'today',
		end_date: 'today',
		dimensions: 'ga:country',
		sort: '-ga:pageviews',
		max_results: 10,
		filters: '',
		updateInterval: 60 * 10 * 1000,
		animationSpeed: 5000,
		retryDelay: 500000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		var self = this;

		var urlApi = "";
		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.onreadystatechange = function() {
			 self.processData();
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		if(!this.loaded) {
                wrapper.innerHTML = "Loading...";
                return wrapper;
        }

		if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");

			var table = document.createElement("table");
			table.className = "small";

			var hrow = document.createElement("tr");
			for (var h in this.dataNotification.columnHeaders) {
				var cheader_element = this.dataNotification.columnHeaders[h];

				var headercell = document.createElement("td");
				headercell.innerHTML = "<b>" + this.translate(cheader_element.name)+ "</b>&nbsp;";
				hrow.appendChild(headercell);
			}
			table.appendChild(hrow);

			for (var r in this.dataNotification.rows) {
				var crow_element  = this.dataNotification.rows[r];
				var row = document.createElement("tr");

				for (var c in crow_element) {
					var rowcell = document.createElement("td");
					rowcell.innerHTML = crow_element[c];
					row.appendChild(rowcell);
				}
				table.appendChild(row);
			}
			wrapper.appendChild(table);

		}
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	// Load translations files
	getTranslations: function() {
		return {
			en: "translations/en.json",
			es: "translations/es.json",
			de: "translations/de.json",

		};
	},

	processData: function() {
		var self = this;
		//this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		this.sendSocketNotification("MMM-GoogleAnalytics-QUERY_DATA", this.config);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-GoogleAnalytics-DISPLAY_DATA") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
