# MMM-GoogleAnalytics

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) to display data from Google Analytics.

![Screenshot of a MMM-GoogleAnalytics](http://robstechlog.com/wp-content/uploads/2017/07/MMM-Googleanalytics_feature.png?raw=true)

<br>

An optional broadcast of visitors/customers location data to [MMM-Globe](https://github.com/SvenSommer/MMM-Globe) is also possible.<p>

![Screenshot of a MMM-GoogleAnalytics](https://github.com/SvenSommer/MMM-GoogleAnalytics/blob/master/MMM-GoogleAnalytics_animated.gif?raw=true)
##### Important note to MMM-Globe
Unfortunately MMM-Globe is not capable of running properly on a Raspberry Pi 3 causes of lacking computing power.

Or with the words of the creator of MMM-Globe: "Due to the intensive calculations needed to construct the objects, and the computational ability needed, I do not recommend using this module if your Mirror uses a Raspberry Pi. Please only use this module if you have something a little more powerful driving your mirror. I don’t want my work to be responsible for any mishaps with your devices."

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

### 2. Install Googles Analytics Core Reporting API and node-geocoder library
Install the Googles Analytics Core Reporting API for Node.js in your ``MMM-GoogleAnalytics`` folder by using npm:

```
cd MMM-GoogleAnalytics
npm install --save googleapis
npm install node-geocoder
```
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
            metrics: 'ga:newusers, ga:users, ga:sessions, ga:pageviews,  ga:sessionDuration',
            dimensions: 'ga:city, ga:country',
            sort: '-ga:users',
            filters: '',
            segment: '',
            start_index: 1,
            max_results: 50,
            updateInterval: 60 * 1000* 10, // every minute
            showtable: 1,
            exportdatatoMMM_Globe: 0
            }
        },
    ]
}
```
### 5. (Optional) Configure the module to broadcast to MMM-Globe
If you want to display the geographic  location of your website visitors on the [MMM-Globe](https://github.com/SvenSommer/MMM-Globe) module, follow the following steps:
* The Query needs to include ``'ga:city, ga:country'`` for the dimensions. In this specific order.
* Follow the install instructions of [MMM-Globe](https://github.com/SvenSommer/MMM-Globe)
* within the ``config section`` of MMM-Globe, change ``receiveExternalLocations:`` to ``1``.

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
| `exportdatatoMMM_Globe` | *no*|`int`| Modul is able to send coordinates of users to another module [MMM-Globe](https://github.com/SvenSommer/MMM-Globe). Therefore you need to include ``ga:city, ga:country`` in dimension section of your query.
