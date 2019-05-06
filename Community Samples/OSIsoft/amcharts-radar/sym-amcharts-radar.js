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
		typeName: 'amcharts-radar',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'amCharts Radar',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/sym-amcharts-radar.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				//
				DataShape: 'TimeSeries',
				DataQueryMode:  CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 600,
				// Specify the value of custom configuration options
				minimumYValue: 0,
				maximumYValue: 100,
				useCustomYAxisRange: false,
				showTitle: true,
                textColor: "white",
                backgroundColor: "#303030",
                gridColor: "gray",
                fontSize: 12,
                seriesColor: "#3e98d3",
                showChartScrollBar: true,
                fillAlphas: 0.1
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
		// Create a variable to hold the combined data array
		var dataArray = [];
		// Create variables to hold the old axis specifications
		var minimumYValue_old, maximumYValue_old;
		// Also remember the snapshot value!
		var snapshotValue;
        
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
            console.log("New data received: ", data.Data);
			if (data !== null && data.Data) {
				dataArray = [];
				// Check for an error
				if (data.Data[0].ErrorDescription) {
					console.log(data.Data[0].ErrorDescription);
				}
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// -----------------------------------------------------------------------------------------
				console.log("Now creating custom visualization...");
				// Get the data item name(s) and unit(s)
                if (data.Data[0].Label) {
                    scope.config.Label = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        scope.config.Label += (", " + data.Data[i].Label);
                    }
                    scope.config.Label = scope.config.Label.substring(1);
                }
                if (data.Data[0].Units) {
					scope.config.Units = data.Data[0].Units;
                }
				// Format the data as a new array that can be easily plotted
				var i = 0;
				for (i = 0; i < data.Data[0].Values.length; i++) {
                    // Create a new event object
					var newDataObject = {
						"timestampString": (new Date(data.Data[0].Values[i].Time)).toISOString(),
                        "timestampLabel":  (new Date(data.Data[0].Values[i].Time)).toLocaleString().replace(",",""),
						"value": parseFloat( ( "" + data.Data[0].Values[i].Value ).replace(",", "") ),
                        "indexNumber": i
					};
					// Store the snapshot value for use in the title!
					snapshotValue = newDataObject.value;
					// Add this object to the data array
					dataArray.push(newDataObject);
				}
				//console.log("Data array: ", dataArray);
				// Create the custom visualization
				if (!customVisualizationObject) {
					customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, {
						"type": "radar",
						"backgroundAlpha": 1,
						"backgroundColor": scope.config.backgroundColor,
						"color": scope.config.textColor,
						"plotAreaFillAlphas": 1,
						"plotAreaFillColors": scope.config.plotAreaFillColor,
						"fontFamily": "arial",
						"creditsPosition": "bottom-right",
						"titles": createArrayOfChartTitles(),
                        "fontSize": 12,
						"valueAxes": [{
							"axisAlpha": 0.2,
							"axisColor": scope.config.gridColor,
                            "gridAlpha": 0.2,
							"gridColor": scope.config.gridColor,
							"title": "",
                            "gridType": "circles",
                            "integersOnly": "false",
                            "autoGridCount": false,
							"fillAlpha":0.05
						}],
						"categoryAxis": {
							"title": "",
                            "showFirstLabel": true,
                            "showLastLabel": true,
                            "categoryFunction": function (valueText, dataItem, categoryAxis) {
                                // Specify the max number of labels that should be shown
                                var maxNumberOfLabels = 12;
                                var labelDivisor = Math.ceil(dataArray.length / maxNumberOfLabels);
                                if (labelDivisor == 0) {
                                    labelDivisor = 1;
                                }                                
                                // Only return every nth label, using the divisor calculated above
                                if (dataItem.indexNumber % labelDivisor == 0) {
                                    return dataItem.timestampLabel;
                                } else {
                                    return "";
                                }
                            }
						},                     
						"graphs": [{
							"fillAlphas": scope.config.fillAlphas,
                            "lineColor": scope.config.seriesColor,
							"balloonText": (scope.config.Label + "<br />[[timestampLabel]]<br /> [[value]]" + scope.config.Units), 
							"valueField": "value",
                            "bullet": "round",
                            "bulletAlpha": 0
						}],
						"balloon": {
								"color": "white",
								"borderColor":"white",
								"fillColor": "#303030"
						},
						"dataProvider": dataArray,
						"categoryField": "timestampString",
					});
				} else {
					// Update the title
					if (scope.config.showTitle) {
						customVisualizationObject.titles = createArrayOfChartTitles();
					} else {
						customVisualizationObject.titles = null;
					}					
					customVisualizationObject.dataProvider = dataArray;
					customVisualizationObject.validateData();
					customVisualizationObject.validateNow();
				}
			}
		}
        
		//************************************
		// Function that returns an array of titles
		//************************************
		function createArrayOfChartTitles() {
            var titleText = scope.config.Label + "\n" + snapshotValue;
            if (scope.config.Units) {
                titleText = titleText + " " + scope.config.Units;
            }
			// Build the titles array
			var titlesArray = [
				{
					"text": titleText,
					"size": scope.config.fontSize,
					"bold": false,
					"color": scope.config.seriesColor
				}
			];
			return titlesArray;
		}		

		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction(data) {
			// If the visualization exists...
			if(customVisualizationObject) {
				// Update the minimum, max
				if (minimumYValue_old != scope.config.minimumYValue) {
					minimumYValue_old = scope.config.minimumYValue;
				}
				if (maximumYValue_old != scope.config.maximumYValue) {
					maximumYValue_old = scope.config.maximumYValue;
                }
                if (scope.config.useCustomYAxisRange) {
                    customVisualizationObject.valueAxes[0].minimum = scope.config.minimumYValue;
                    customVisualizationObject.valueAxes[0].maximum = scope.config.maximumYValue;
                } else {
                }
				// Update the title
				if (scope.config.showTitle) {
					customVisualizationObject.titles = createArrayOfChartTitles();
				} else {
					customVisualizationObject.titles = null;
				}
                // Update colors and fonts
                if (customVisualizationObject.graphs[0].lineColor != scope.config.seriesColor) {
                    customVisualizationObject.graphs[0].lineColor = scope.config.seriesColor;
                }
                if (customVisualizationObject.graphs[0].fillAlphas != scope.config.fillAlphas) {
                    customVisualizationObject.graphs[0].fillAlphas = scope.config.fillAlphas;
                }                
                if (customVisualizationObject.color != scope.config.textColor) {
                    customVisualizationObject.color = scope.config.textColor;
                }
                if (customVisualizationObject.backgroundColor != scope.config.backgroundColor) {
                    customVisualizationObject.backgroundColor = scope.config.backgroundColor;
                }
                if (customVisualizationObject.valueAxes[0].gridColor != scope.config.gridColor) {
                    customVisualizationObject.valueAxes[0].gridColor = scope.config.gridColor;
					customVisualizationObject.valueAxes[0].axisColor = scope.config.gridColor;
                }
                if (customVisualizationObject.fontSize != scope.config.fontSize) {
                    customVisualizationObject.fontSize = scope.config.fontSize;
                }
				// Commit updates to the chart
				customVisualizationObject.validateNow();
				console.log("Configuration updated.");
			}
		}	
	}
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);