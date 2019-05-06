/***************************************************************************
   Copyright 2016-2017 OSIsoft, LLC.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 ***************************************************************************/

//************************************
// Begin defining a new symbol
//************************************
(function (CS) {
	//'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Vision to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'amcharts-xyplot',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'amCharts X-Y Plot',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/amcharts-xyplot.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				//
				DataShape: 'TimeSeries',
				DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 600,
				// Specify the value of custom configuration options
				bulletColor: "#cc4748",
				cursorColor: "red",
				xMin: 0,
				xMax: 100,
				yMin: 0,
				yMax: 100,
				autoScale: true,
				bulletSize: 9,
				bulletType: "diamond",
				bulletOpacity: 0.9,
				showTrendLines: true,
				trendLineColor: "orange",
				showTitle: true,
				forceXYTimestampSync: true
			};
		},
		// By including this, you're specifying that you want to allow configuration options for this symbol
		 configOptions: function () {
            return [{
				// Add a title that will appear when the user right-clicks a symbol
				title: 'Format Symbol',
				// Supply a unique name for this cofiguration setting, so it can be reused, if needed
                mode: 'format'
            }];
        },		
		
	};
	
	//************************************
	// Function called to initialize the symbol
	//************************************
	
	function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);
	
	symbolVis.prototype.init = function(scope, elem) {
		
		// Specify which function to call when a data update or configuration change occurs 
		this.onDataUpdate = myCustomDataUpdateFunction;
		this.onConfigChange = myCustomConfigurationChangeFunction;
		
		// Locate the html div that will contain the symbol, using its id, which is "container" by default
		var symbolContainerDiv = elem.find('#container')[0];
        // Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
        symbolContainerDiv.id = newUniqueIDString;
		// Create a variable to hold the custom visualization object
		var customVisualizationObject = false;
		// Create a variable to hold the date item name(s)
		var dataItemLabel_XAxis = "";
		var dataItemLabel_YAxis = "";
		var dataItemUnits_XAxis = "";
		var dataItemUnits_YAxis = "";
		var dataItemPath_XAxis = "";
		var dataItemPath_YAxis = "";
		// Create a variable to hold the combined x-y data array, along with the axes minima and maxima
		var xyDataArray = [];
		var xMin_autoscale;
		var xMax_autoscale;
		var yMin_autoscale;
		var yMax_autoscale;
		// Create variables to hold the trend line coordinates
		var trendLine1_initialXValue = 0;
		var trendLine1_initialValue = 0;
		var trendLine1_finalXValue = 0;
		var trendLine1_finalValue = 0;
		
		
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			if(data) {
				xyDataArray = [];
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// --------------------------------------------------------------------------------------------------
				//console.log("New raw data received: ", data);
				// Get the data item name(s)
				if (data.Data[0].Label){
					dataItemLabel_XAxis = data.Data[0].Label; 
					dataItemPath_XAxis = data.Data[0].Path;
				}
				if (data.Data[1].Label){
					dataItemLabel_YAxis = data.Data[1].Label; 
					dataItemPath_YAxis = data.Data[1].Path;
				}
				if (data.Data[0].Units){
					dataItemUnits_XAxis = data.Data[0].Units; 
				}
				if (data.Data[1].Units){
					dataItemUnits_YAxis = data.Data[1].Units; 
				}				
				// Initialize the min and max for both axes
				xMin_autoscale = data.Data[0].Values[0].Value.replace(",","");
				xMax_autoscale = xMin_autoscale;
				yMin_autoscale = data.Data[1].Values[0].Value.replace(",","");
				yMax_autoscale = yMin_autoscale;
				// For each piece of data in the X-axis data item...
				for (var xIndex = 0; xIndex < data.Data[0].Values.length; xIndex++) {
					// Store the X max and minimum
					if (parseFloat(data.Data[0].Values[xIndex].Value.replace(",","")) > xMax_autoscale) { xMax_autoscale = parseFloat(data.Data[0].Values[xIndex].Value.replace(",","")) };
					if (parseFloat(data.Data[0].Values[xIndex].Value.replace(",","")) < xMin_autoscale) { xMin_autoscale = parseFloat(data.Data[0].Values[xIndex].Value.replace(",","")) };
					// Loop through the y-axis data and see if there's a y-axis data item timestamp that matches this x-axis data item timestamp
					for (var yIndex = 0; yIndex < data.Data[1].Values.length; yIndex++) {
						// Store the Y max and minimum
						if (parseFloat(data.Data[1].Values[yIndex].Value.replace(",","")) > yMax_autoscale) { yMax_autoscale = parseFloat(data.Data[1].Values[yIndex].Value.replace(",","")) };
						if (parseFloat(data.Data[1].Values[yIndex].Value.replace(",","")) < yMin_autoscale) { yMin_autoscale = parseFloat(data.Data[1].Values[yIndex].Value.replace(",","")) };
						// Test for matching timestamps between the temp xy entry and this current y-axis timestamp
						if (!scope.config.forceXYTimestampSync || (data.Data[0].Values[xIndex].Time == data.Data[1].Values[yIndex].Time)) {
							xyDataArray.push({
								Time: data.Data[0].Values[xIndex].Time, 
								x: parseFloat(data.Data[0].Values[xIndex].Value.replace(",","")), 
								y: parseFloat(data.Data[1].Values[yIndex].Value.replace(",","")),
								trendLine1X: null,
								trendLine1Y: null
							});
						}
					}
				}
				//console.log("X-Y array: ", xyDataArray);
				// Add trend lines!
				if (data.Data[2]) {
					// Extract the JSON string from the third data item
					var trendLineJSONString = data.Data[2].Values[0].Value.replace(",","");
					var trendLineJSONStringArray = trendLineJSONString.split(";");
					// Example:
					// 65,50;68,54;74,53;82,54;84,56
					for (var i = 0; i < trendLineJSONStringArray.length; i++) {
						xyDataArray.push({
							Time: null, 
							x: null, 
							y: null,
							trendLine1X: trendLineJSONStringArray[i].split(",")[0],
							trendLine1Y: trendLineJSONStringArray[i].split(",")[1]
						});
					}
					
					/*
					// Remove case sensitivity
					trendLineJSONString = trendLineJSONString.toLowerCase();
					// Parse the JSON string into an object that we can easily query
					var trendLineJSON = JSON.parse(trendLineJSONString);
					// Extract the trend line coordinates from the JSON object
					trendLine1_initialXValue = trendLineJSON.initialxvalue;
					trendLine1_initialValue = trendLineJSON.initialvalue;
					trendLine1_finalXValue = trendLineJSON.finalxvalue;
					trendLine1_finalValue = trendLineJSON.finalvalue;
					console.log("Trend line: " + trendLine1_initialXValue + "," + trendLine1_initialValue + "," + trendLine1_finalXValue + "," + trendLine1_finalValue);
					*/
					
					
					
					
				} else {
					//console.log("No trend lines added yet.");
				}
				// Create the custom visualization
				//console.log("Now creating custom visualization...");
				if (!customVisualizationObject) {
					customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, {
						"type": "xy",
						"backgroundAlpha": 0.0,
						"color": "#E0E0E0",
						"fontFamily": "arial",
						"titles": [
							{
								"text": dataItemLabel_YAxis + " (" + dataItemUnits_YAxis + ") vs.\n" + dataItemLabel_XAxis + " (" + dataItemUnits_XAxis + ")",
								"size": 15
							}
						],
						"graphs": [
							{
								"bullet": scope.config.bulletType,
								"bulletSize": scope.config.bulletSize,
								"bulletAlpha": scope.config.bulletOpacity,
								"lineColor": scope.config.bulletColor,
								"fillAlphas": 0,
								"lineAlpha": 0,
								"xField": "x",
								"yField": "y",
								"balloonText": "[[Time]]<br />" + extractDataItemNameOnly(dataItemLabel_XAxis) + ": [[x]] (" + dataItemUnits_XAxis + ")<br /> " + extractDataItemNameOnly(dataItemLabel_YAxis) + ": [[y]] (" + dataItemUnits_YAxis + ")",
							},
							{
								"bullet": scope.config.bulletType,
								"bulletSize": scope.config.bulletSize,
								"bulletAlpha": scope.config.bulletOpacity,
								"lineColor": "blue",
								"fillAlphas": 0,
								"lineAlpha": 1,
								"xField": "trendLine1X",
								"yField": "trendLine1Y",
								"balloonText": "Trend Line 1<br />" + extractDataItemNameOnly(dataItemLabel_XAxis) + ": [[x]] (" + dataItemUnits_XAxis + ")<br /> " + extractDataItemNameOnly(dataItemLabel_YAxis) + ": [[y]] (" + dataItemUnits_YAxis + ")",
							}
						],
						"valueAxes": [ {
							"position": "bottom",
							"axisAlpha": 0,
							"dashLength": 1,
							"id": "x",
							"title": extractDataItemNameOnly(dataItemLabel_XAxis) + " (" + dataItemUnits_XAxis + ")",
							"axisColor": "#C0C0C0",
							"inside": true
						}, {
							"axisAlpha": 0,
							"dashLength": 1,
							"position": "left",
							"id": "y",
							"title": extractDataItemNameOnly(dataItemLabel_YAxis) + " (" + dataItemUnits_YAxis + ")",
							"axisColor": "#C0C0C0",
							"inside": true
						} ],
						"dataProvider": xyDataArray,
						"chartCursor": {
							"cursorColor": scope.config.cursorColor
						},
						"trendLines": [{
							"initialXValue": trendLine1_initialXValue,
							"initialValue": trendLine1_initialValue,
							"finalXValue": trendLine1_finalXValue,
							"finalValue": trendLine1_finalValue,
							"lineColor": scope.config.trendLineColor,
							"lineAlpha": 1
						}],
						//"creditsPosition": "top-right"
					});
				} else {
					// Update the chart data 
					customVisualizationObject.dataProvider = xyDataArray;
					customVisualizationObject.validateData();
					customVisualizationObject.validateNow();
				}
			}
		}
		
		//************************************
		// Helper function that returns the short form of a 
		//************************************
		function extractDataItemNameOnly(dataItemPath) {
			if (dataItemPath.indexOf("|") != -1) { 
				return dataItemPath.split("|")[1]; 
			} else {
				return dataItemPath;
			}
		}

		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction(data) {
			// If the visualization exists...
			if(customVisualizationObject) {
				// Update the chart styling 
				customVisualizationObject.graphs[0].lineColor = scope.config.bulletColor;
				customVisualizationObject.graphs[0].bulletSize = scope.config.bulletSize;
				customVisualizationObject.graphs[0].bulletAlpha = scope.config.bulletOpacity;
				customVisualizationObject.graphs[0].bullet = scope.config.bulletType;
				customVisualizationObject.chartCursor.cursorColor = scope.config.cursorColor;
				// Update the axis ranges, if desired
				if (!scope.config.autoScale) {
					customVisualizationObject.valueAxes[0].minimum = scope.config.xMin;
					customVisualizationObject.valueAxes[0].maximum = scope.config.xMax;
					customVisualizationObject.valueAxes[1].minimum = scope.config.yMin;
					customVisualizationObject.valueAxes[1].maximum = scope.config.yMax;
				} else {
					customVisualizationObject.valueAxes[0].minimum = xMin_autoscale;
					customVisualizationObject.valueAxes[0].maximum = xMax_autoscale;
					customVisualizationObject.valueAxes[1].minimum = yMin_autoscale;
					customVisualizationObject.valueAxes[1].maximum = yMax_autoscale;
				}
				// Update the trend lines
				customVisualizationObject.trendLines[0].initialXValue = trendLine1_initialXValue;
				customVisualizationObject.trendLines[0].initialValue = trendLine1_initialValue;
				customVisualizationObject.trendLines[0].finalXValue = trendLine1_finalXValue;
				customVisualizationObject.trendLines[0].finalValue = trendLine1_finalValue;
				customVisualizationObject.trendLines[0].lineColor = scope.config.trendLineColor;
				if (scope.config.showTrendLines) {
					customVisualizationObject.trendLines[0].lineAlpha = 1;
				} else {
					customVisualizationObject.trendLines[0].lineAlpha = 0;
				}
				// Update the title
				if (scope.config.showTitle) {
					customVisualizationObject.titles[0].text = dataItemLabel_YAxis + " (" + dataItemUnits_YAxis + ") vs.\n" + dataItemLabel_XAxis + " (" + dataItemUnits_XAxis + ")";
				} else {
					customVisualizationObject.titles[0].text = "";
				}
				// Commit updates to the chart
				customVisualizationObject.validateNow();
				console.log("Styling updated.");
			}
		}
	}
	
	
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);