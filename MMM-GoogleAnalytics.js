/* global Module */

/* Magic Mirror
 * Module: MMM-GoogleAnalytics
 *
 * By SvenSommer
 * MIT Licensed.
 */

Module.register("MMM-GoogleAnalytics", {
	defaults: {

		viewID : 'ga:123456700',
		metrics: 'ga:newusers,ga:users, ga:sessions, ga:pageviews',
		start_date: 'today',
		end_date: 'today',
		dimensions: 'ga:country',
		sort: '-ga:pageviews',
		max_results: 10,
		filters: '',
		animationSpeed: 5000,
		updateInterval: 10 * 10 * 1000, //every ten minutes
		retryDelay: 500000,
		showtotalline: true,
		showtable: true,
		displaySymbols: true,
		exportdatatoMMM_Globe: false,
		debug: false
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;
		this.getData();

		//this.sendTestArray();

		setInterval(function() {
			self.getData()
			self.updateDom();
		}, this.config.updateInterval);
	},

	processData: function() {
		var self = this;
		//this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;


	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		var self = this;
		//this.loaded = false;
		this.sendSocketNotification("MMM-GoogleAnalytics-QUERY_DATA", this.config);
		this.loaded = true;	



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
		wrapper.className = "small";
		if(!this.loaded) {
                wrapper.innerHTML = "Loading...";
				wrapper.classname = "small dimmed";
                return wrapper;
        }

		if (this.dataNotification) {
			if (this.debug) {
				console.log(this.dataNotification);
			}


			if (this.config.showtable) {
				var wrapperDataNotification = document.createElement("div");

					var table = document.createElement("table");
					table.className = "small";

					var hrow = document.createElement("tr");
					var trow = document.createElement("tr");
					var columnDataTypes = [];


					for (var h in this.dataNotification.columnHeaders) {
						var cheader_element = this.dataNotification.columnHeaders[h];
						columnDataTypes.push(cheader_element.dataType);
						//header line
						var headercell = document.createElement("td");
						if (!this.config.displaySymbols) {
							headercell.innerHTML = this.translate(cheader_element.name);
							headercell.className = "header";
						}else {
							var headeraymbol = document.createElement("span");
							if (!this.translate(cheader_element.name).indexOf("fa-")) {
								headercell.innerHTML = cheader_element.name;
							}else {
								headeraymbol.className = this.translate(cheader_element.name);
							}
							headercell.appendChild(headeraymbol);
							headercell.className =  " centered";
							}
						hrow.appendChild(headercell);


						//total line
						var totalcell = document.createElement("td");

						if (cheader_element.dataType === "INTEGER" ){
							totalcell.innerHTML  = this.dataNotification.totalsForAllResults[cheader_element.name];
							totalcell.className = "totalline centered";
						}
						else if (cheader_element.dataType === "TIME") {
							totalcell.innerHTML  = this.getTimeFormat(this.dataNotification.totalsForAllResults[cheader_element.name]);
							totalcell.className = "totalline align-right";
						}
						else {
							totalcell.innerHTML = "";
							totalcell.className = "totalline";
						}
						trow.appendChild(totalcell);

					}
					table.appendChild(hrow);


					//rows
					for (var r in this.dataNotification.rows) {
						var crow_element  = this.dataNotification.rows[r];
						var row = document.createElement("tr");
						i = 0;
						for (var c in crow_element) {
							var rowcell = document.createElement("td");
							if (columnDataTypes[i] === "TIME") {
								rowcell.innerHTML = this.getTimeFormat(crow_element[c]);
								rowcell.className = "align-right";
							}else {
								rowcell.innerHTML = crow_element[c];
								rowcell.className = "centered";
							}
							row.appendChild(rowcell);
							i++;
						}
						table.appendChild(row);
					}
					//adding total line
					if (this.config.showtotalline) {
						table.appendChild(trow);
					}

					wrapper.appendChild(table);
				}

				if (this.config.debug) {
					var d = new Date();
					var labelLastUpdate = document.createElement("label");
					labelLastUpdate.innerHTML = "Updated: " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+ ":" + ("0" + d.getSeconds()).slice(-2) + "<br>Intervall: " + this.config.updateInterval/1000 + "s";
					wrapper.appendChild(labelLastUpdate);
				}


			}
		return wrapper;
	},

	exportDatatoOtherModule: function(){
		var cities =  [];
		for (var r in this.dataNotification.rows) {
				var crow_element  = this.dataNotification.rows[r];
				cities.push({
				'cityname': crow_element[0],
				'country':crow_element[1]
				});
			}
			this.getCoordinatesfromCitiesName(cities);
	},

	getTimeFormat: function(int) {
		var sec_num = parseInt(int, 10); // don't forget the second param
	    var hours   = Math.floor(sec_num / 3600);
	    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	    var seconds = sec_num - (hours * 3600) - (minutes * 60);

	    if (hours   < 10 && hours > 0) {hours   = "0"+hours + "h :";} else if (hours === 0) {hours  = ""} else {hours   = hours + "h :";};
	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}

	    return hours+minutes+'m '+seconds+'s ';
	},

	getScripts: function() {
		return [];
	},

	getCoordinatesfromCitiesName: function(cities){
		this.sendSocketNotification("MMM-GoogleAnalytics-GET_COORDINATES", cities);

	},

	getStyles: function () {
		return [
			"MMM-GoogleAnalytics.css", "font-awesome.css"
		];
	},

	// Load translations files
	getTranslations: function() {
		if (!this.config.displaySymbols) {
			return {
				en: "translations/en.json",
				es: "translations/es.json",
				de: "translations/de.json",

			};
		}else {
			return {
				en: "translations/symbols.json",
				es: "translations/symbols.json",
				de: "translations/symbols.json",
			};
		}


	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if (this.debug) {
			console.log(notification, "received by MMM-GoogleAnalytics.js received");
		}

		if(notification === "MMM-GoogleAnalytics-DISPLAY_DATA") {
			this.dataNotification = payload;
			this.updateDom();
			this.loaded = true;
			if ( this.config.exportdatatoMMM_Globe) {
				this.exportDatatoOtherModule();
			}
		}
		else if (notification === "MMM-GoogleAnalytics-CITYINFO") {
			this.sendNotification("MMM-GoogleAnalytics-CITYINFO", payload);
		}
	},
	notificationReceived: function (notification, cityinfo, sender) {
		if(notification === "MMM-GoogleAnalytics-CITYINFO" && sender === "MMM-GoogleAnalytics") {
			if (this.debug) {
				console.log("MMM-GoogleAnalytics-CITYINFO received by MMM-GoogleAnalytics", cityinfo);
			}
		}
	},
});
