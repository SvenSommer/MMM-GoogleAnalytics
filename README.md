# MMM-GoogleAnalytics

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) to display data from Google Analytics.

![Screenshot of a MMM-GoogleAnalytics](https://github.com/SvenSommer/MMM-GoogleAnalytics/blob/master/MMM_GoogleAnalytics_screenshot.png?raw=true)

![Screenshot of a MMM-GoogleAnalytics](https://github.com/SvenSommer/MMM-GoogleAnalytics/blob/master/MMM-GoogleAnalytics_animated_short.gif?raw=true)

## Using the module
### 1. Install of the module

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/SvenSommer/MMM-GrafanaChart
````

### 2. Install Googles Analytics Core Reporting API
Install the Googles Analytics Core Reporting API for Node.js in your ``MMM-GoogleAnalytics`` folder by using npm:

`
cd MMM-GoogleAnalytics
npm install --save googleapis
`
### 3. Get the credentials from Google
To get the credentials from Google, following this [blogpost](http://robstechlog.com/2017/07/19/display-website-statistics-smart-mirror-mmm-googleanalytics/).

After you have done this, you should be able to:
* Copy your ``viewID``. You'll need it in the next step.
* Rename your credential file (e.g. ``mywebsiteGAapi-6116b1dg49a1.json``) in ``keyfile.json`` and save it in your ``MMM-GoogleAnalytics`` folder, like ``MMM-GoogleAnalytics/keyfile.json``. If you haven't done already.

### 4. Configure the module in your `config.js` file.
To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
		module: 'MMM-GoogleAnalytics',
		header: 'mywebsite.com - Today',
		position: 'top_left',
		config: {
			viewID : 'ga:123456700', // see README.md, how to get viewID and your keyfile.json
            start_date: 'today', //today,1daysAgo,
            end_date: 'today',
            metrics: 'ga:newusers,ga:users, ga:sessions, ga:pageviews,  ga:sessionDuration',
            dimensions: 'ga:city, ga:country',
            sort: '-ga:users',
            filters: '',
            segment: '',
            start_index: 1,
            max_results: 50,
            updateInterval: 60 * 1000* 10, // every minute
            showtable: 1,
            exportdatatoMMM_Globe: 1
			}
		},
    ]
}
```

## Configuration options
Check out the [common queries](https://developers.google.com/analytics/devguides/reporting/core/v3/common-queries) in the [API Reference](https://developers.google.com/analytics/devguides/reporting/core/v3/reference).

The [Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/) lets you play with the API by building queries. Very useful!

| Option           | Required | Type | Description
|----------------- |-----------|-------|----------------
| `viewID`        | *yes*|`string`| Google Analytics view (profile) ID. Follow this [blogpost](http://robstechlog.com/2017/07/19/display-website-statistics-smart-mirror-mmm-googleanalytics/) to get it.
| `start_date`        | *yes*|`string`| Start date for fetching Analytics data.
| `end_date`        | *yes*|`string`| End date for fetching Analytics data.
| `metrics`        | *yes*|`string`| The aggregated statistics for user activity to your site, such as clicks or pageviews. See [Possible Options](https://developers.google.com/analytics/devguides/reporting/core/dimsmets).
| `dimensions`        | *no*|`string`| Breaks down metrics by common criteria.
| `sort`        | *no*|`string`| A list of metrics and dimensions indicating the sorting order and sorting direction for the returned data.
| `filters`        | *no*|`string`| restricts the data returned from your request.
| `max_results`        | *no*|`int`| The maximum number of rows to include in the response.
| `showtable` | *no*|`int`| 1 - shows results in a table. 0 - no table is shown
| `exportdatatoMMM_Globe` | *no*|`int`| Modul is able to send coordinates of users to another module [MMM-Globe](https://github.com/Eunanibus/MMM-Globe). Therefore you need to include ``ga:city, ga:country`` in dimension section of your query.
