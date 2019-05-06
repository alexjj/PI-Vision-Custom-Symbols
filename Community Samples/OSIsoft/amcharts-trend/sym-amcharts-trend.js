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
		typeName: 'amcharts-trend',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'amCharts Trend',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/amcharts-trend.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				DataShape: 'TimeSeries',
				DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 600,
				// Specify the value of custom configuration options
				minimumYValue: 0,
				maximumYValue: 100,
				useCustomYAxisRange: false,
				showTitle: true,
                textColor: "black",
                backgroundColor: "white",
                plotAreaFillColor: "white",
                fontSize: 12,
                seriesColor: "blue",
                showChartScrollBar: true,
				useColumns: false,
				exportData: false,
				exportDataItemPaths: false
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
        // Specify the name of the function that will be called to initialize the symbol
		//init: myCustomSymbolInitFunction
	};
	
	//************************************
	// Function called to initialize the symbol
	//************************************
	//function myCustomSymbolInitFunction(scope, elem) {
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
        // Create vars to hold the min and max y-axis values
		var autoScaleMinimumValue, autoScaleMaximumValue;
		// Create a var to hold the data item paths
		var dataItemPaths = ["Data Item Paths"];
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
            //console.log("New data received: ", data);
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
				// Store all of the data item paths in the data item paths global variable
				for (var i = 0; i < data.Data.length; i++) {
					if (data.Data[i].Path && (dataItemPaths.lastIndexOf(data.Data[i].Path == -1))) {
						dataItemPaths.push(data.Data[i].Path);
					}
				}
				// Format the data as a new array that can be easily plotted; first, grab the minimum and maximum
				autoScaleMinimumValue = parseFloat( ("" + data.Data[0].Values[0].Value).replace(",", "") );
				autoScaleMaximumValue = parseFloat( ("" + data.Data[0].Values[0].Value).replace(",", "") );
				for (var i = 0; i < data.Data[0].Values.length; i++) {
                    // Create a new event object
					var newDataObject = {
						"timestamp": data.Data[0].Values[i].Time,
						"timestampString": data.Data[0].Values[i].Time, 
						"value": parseFloat( ("" + data.Data[0].Values[i].Value).replace(",", "") )
					};
					// Update the max and min, which later will be used for auto-scaling the chart
					if (newDataObject.value > autoScaleMaximumValue) {
						autoScaleMaximumValue = newDataObject.value;
					}
					if (newDataObject.value < autoScaleMinimumValue) {
						autoScaleMinimumValue = newDataObject.value;
					}
					// Add this object to the data array
					dataArray.push(newDataObject);
				}
				//console.log("Data array: ", dataArray);
				// Create the custom visualization
				if (!customVisualizationObject) {
					customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, {
						"type": "serial",
						"backgroundAlpha": 1,
						"backgroundColor": scope.config.backgroundColor,
						"color": scope.config.textColor,
						"plotAreaFillAlphas": 1,
						"autoMargin": true,
						"autoMarginOffset": 30,
						"marginRight": 50,
						"plotAreaFillColors": scope.config.plotAreaFillColor,
						"creditsPosition": "bottom-right",
						"titles": createArrayOfChartTitles(),
                        "fontSize": scope.config.fontSize,
						"categoryAxis": {
                            "parseDates": true,
                            "minPeriod": "ss"
						},
                        "chartScrollbar": {
                            "graph": "g1",
                            "scrollbarHeight": 80,
                            "autoGridCount": true,
                            "enabled": scope.config.showChartScrollBar
                        },
						"valueAxes": [
							{
								"title": scope.config.Units,
								"titleBold": false
							}
						],
						"graphs": [{
                            "id": "g1",
							"type": "line",
                            "lineColor": scope.config.seriesColor,
							"balloonText": scope.config.Label + "<br /><b>[[timestamp]]</b><br />[[value]] " + scope.config.Units, 
							"valueField": "value"
						}],
						"dataProvider": dataArray,
						"categoryField": "timestamp",
						"chartCursor": { 
							"cursorColor": "gray",
							"valueLineBalloonEnabled": true,
							"valueLineEnabled": true,
							"valueZoomable": true,
                            "categoryBalloonDateFormat": "D/MM/YYYY L:NN:SS A"
						},
						"zoomOutButtonImage": ""
					});
				} else {
					// Update the title
					if (scope.config.showTitle) {
						customVisualizationObject.titles = createArrayOfChartTitles();
					} else {
						customVisualizationObject.titles = null;
					}	
					// Apply fixed scaling, if turned on
					if (scope.config.useCustomYAxisRange) {
						customVisualizationObject.valueAxes[0].minimum = scope.config.minimumYValue;
						customVisualizationObject.valueAxes[0].maximum = scope.config.maximumYValue;
					} else {
						customVisualizationObject.valueAxes[0].minimum = autoScaleMinimumValue;
						customVisualizationObject.valueAxes[0].maximum = autoScaleMaximumValue;
					}
					// Refresh the graph
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
            var titleText = "";
            if (scope.config.Units) {
                titleText =  ("Trend of" + scope.config.Label + " (" + scope.config.Units + ")");
            } else {
                titleText =  ("Trend of" + scope.config.Label);
            }
			// Build the titles array
			var titlesArray = [
				{
					"text": titleText,
					"size": scope.config.fontSize + 3,
					"bold": false
				}
			];
			return titlesArray;
		}		

		//************************************
		// Functions for exporting data
		//************************************
		// Courtesy of http://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
		function createCSVFileContents() {  
			var result, ctr, keys, columnDelimiter, lineDelimiter;
			// Verify that a valid array object was passed in
			if (dataArray == null || !dataArray.length) {
				return null;
			}
			// Specify delimeters that will be used to create the CSV
			columnDelimiter = ',';
			lineDelimiter = '\n';
			// Take the keys from the input array
			keys = Object.keys(dataArray[0]);
			// Add the data items on the trend
			result = '';
			result += "Export from PI Vision" + lineDelimiter;
			result += scope.config.Label + " (" + scope.config.Units + ")" + lineDelimiter;
			// Add the first headers row to the output file
			result += keys.join(columnDelimiter);
			result += lineDelimiter;
			// Loop through all of the items in the input object and add it to the CSV
			dataArray.forEach(function(item) {
				ctr = 0;
				keys.forEach(function(key) {
					if (ctr > 0) result += columnDelimiter;
					result += item[key];
					ctr++;
				});
				result += lineDelimiter;
			});
			return result;
		}	
		// Actually start the download
		function downloadCSV(filename, csv) {  
			var linkElement;
			// Encode the data in the right file format
			if (csv == null) return;
			if (!csv.match(/^data:text\/csv/i)) {
				csv = 'data:text/csv;charset=utf-8,' + csv;
			}
			// Create a link element to allow the file to be downloaded
			linkElement = document.createElement('a');
			symbolContainerDiv.appendChild(linkElement);
			linkElement.setAttribute('href', encodeURI(csv));
			linkElement.setAttribute('download', filename);
			// Click the link!  Then delete the element
			linkElement.click();
			symbolContainerDiv.removeChild(linkElement);
		}
		
		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction(data) {
			// If the visualization exists...
			if(customVisualizationObject) {
				// Turn on column display (instead of line display, if specified)
				if (scope.config.useColumns) {
					customVisualizationObject.graphs[0].type = "column";
				} else {
					customVisualizationObject.graphs[0].type = "line";
				}
				// Apply fixed scaling, if turned on
				if (scope.config.useCustomYAxisRange) {
					customVisualizationObject.valueAxes[0].minimum = scope.config.minimumYValue;
					customVisualizationObject.valueAxes[0].maximum = scope.config.maximumYValue;
				} else {
					customVisualizationObject.valueAxes[0].minimum = autoScaleMinimumValue;
					customVisualizationObject.valueAxes[0].maximum = autoScaleMaximumValue;
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
                if (customVisualizationObject.color != scope.config.textColor) {
                    customVisualizationObject.color = scope.config.textColor;
                }
                if (customVisualizationObject.backgroundColor != scope.config.backgroundColor) {
                    customVisualizationObject.backgroundColor = scope.config.backgroundColor;
                }
                if (customVisualizationObject.plotAreaFillColors != scope.config.plotAreaFillColor) {
                    customVisualizationObject.plotAreaFillColors = scope.config.plotAreaFillColor;
                }
                if (customVisualizationObject.fontSize != scope.config.fontSize) {
                    customVisualizationObject.fontSize = scope.config.fontSize;
                }
				// Check whether you should prepare data for export
				if (scope.config.exportData) {
					// Reset the button back to unchecked, when complete
					scope.config.exportData = false;
					downloadCSV('ExportFromPIVision.csv', createCSVFileContents());
				}
				// Check whether you should prepare the paths for export
				if (scope.config.exportDataItemPaths) {
					// Reset the button back to unchecked, when complete
					scope.config.exportDataItemPaths = false;
					downloadCSV('ExportFromPIPIVision_DataItemPaths.csv', dataItemPaths.toString());
				}
                // Update the scroll bar
                if (customVisualizationObject.chartScrollbar.enabled != scope.config.showChartScrollBar) {
                    customVisualizationObject.chartScrollbar.enabled = scope.config.showChartScrollBar;
                }
				// Commit updates to the chart
				customVisualizationObject.validateNow();
				console.log("Configuration updated.");
			}
		}

		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction };
	}
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);