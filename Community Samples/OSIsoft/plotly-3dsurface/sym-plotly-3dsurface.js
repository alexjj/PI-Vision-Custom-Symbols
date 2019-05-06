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
		typeName: 'plotly-3dsurface',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'AmCharts Trend',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/plotly-3dsurface.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				// Specify the data shape type (for symbols that update with new data)
				DataShape: 'TimeSeries',
				DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 450,
				Width: 700,
				// Specify the value of custom configuration options below, if any
				showTitle: true,
				backgroundColor: "white",
				seriesColor: "black"
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
		// Create a var to hold the data item paths
		var dataItemLabels = [
			"Please Select An Additional Data Item", 
			"Please Select An Additional Data Item", 
			"Please Select An Additional Data Item"
		];
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
            //console.log("New data received: ", data);
			if (data !== null && data.Data) {
				dataArray = [ [], [], [], []];
				// Check for an error
				if (data.Data[0].ErrorDescription) {
					console.log(data.Data[0].ErrorDescription);
				}
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// -----------------------------------------------------------------------------------------
				if (data.Data[0] && data.Data[1] && data.Data[2]) {
					
					// Store all of the 3 data item labels in the data item labels global variable
					for (var i = 0; i < 3; i++) {
						if (data.Data[i].Label && data.Data[i].Units) {
							dataItemLabels[i] = data.Data[i].Label + " (" + data.Data[i].Units + ")";;
						}
					}
					// Format the data as a new array that can be easily plotted
					for (var i = 0; i < data.Data[0].Values.length; i++) {
						// Try to parse the values
						var newXValue = parseFloat( ("" + data.Data[0].Values[i].Value).replace(",", "") );
						var newYValue = parseFloat( ("" + data.Data[1].Values[i].Value).replace(",", "") );
						var newZValue = parseFloat( ("" + data.Data[2].Values[i].Value).replace(",", "") );
						if (!isNaN(newXValue) && !isNaN(newYValue) && !isNaN(newZValue)) {
							dataArray[0].push(newXValue);
							dataArray[1].push(newYValue);
							dataArray[2].push(newZValue);
							dataArray[3].push("" + data.Data[0].Values[i].Time);
						}
					}
				}
				//console.log("Data array: ", dataArray);
				// Create the custom visualization
				if (!customVisualizationObject) {
					customVisualizationObject = true;
					var data = [
						{
							opacity:0.8,
							type: 'scatter3d',
							x: dataArray[0],
							y: dataArray[1],
							z: dataArray[2],
							hoverinfo: "x+y+z+text",
							text: dataArray[3],
							marker: {
								color: scope.config.seriesColor,
								size: 12,
								symbol: 'circle',
								line: {
									color: scope.config.seriesColor,
									width: 1
								},
								opacity: 0.8
							}
						}
					];
					var layout = {
						title: createChartTitles(),
						autosize: true,
						scene: createScene(),
						paper_bgcolor: scope.config.backgroundColor
					};
					var config = {
						showLink: false,
						displaylogo: false,
						editable: false,
						modeBarButtonsToRemove: ["sendDataToCloud"]
					};
					Plotly.newPlot(symbolContainerDiv, data, layout, config);
				} else {
					// Update the title
					symbolContainerDiv.layout.title = createChartTitles();
					symbolContainerDiv.layout.scene = createScene();
					// Update the data
					symbolContainerDiv.data = [
						{
							opacity:0.8,
							type: 'scatter3d',
							x: dataArray[0],
							y: dataArray[1],
							z: dataArray[2],
							hoverinfo: "x+y+z+text",
							text: dataArray[3],
							marker: {
								color: scope.config.seriesColor,
								size: 12,
								symbol: 'circle',
								line: {
									color: scope.config.seriesColor,
									width: 1
								},
								opacity: 0.8
							}
						}
					];
					// Refresh the graph
					Plotly.redraw(symbolContainerDiv);
				}
			}
		}
        
		//************************************
		// Functions that return an array of titles and axis labels
		//************************************
		function createChartTitles() {
			// Start with the first data item
            var titleText = "";
			if (scope.config.showTitle) {
				titleText = "X: " + dataItemLabels[0] + "<br>Y: " + dataItemLabels[1] + "<br>Z: " + dataItemLabels[2];
			}
			return titleText;
		}
		function createScene() {
			var scene = {
				xaxis:{
					color: "red",
					titlefont: {
						color: "red"
					}
				},
				yaxis:{
					color: "green",
					titlefont: {
						color: "green"
					}
				},
				zaxis:{
					color: "blue",
					titlefont: {
						color: "blue"
					}
				}
			};
			// Start with the first data item
			if (dataItemLabels[0].indexOf("|") != -1) {
				scene.xaxis.title = "X: " + dataItemLabels[0].split("|").slice(-1)[0];
			} else {
				scene.xaxis.title = "X: " + dataItemLabels[0];
			}
			// Add all subsequent items
			if (dataItemLabels[1].indexOf("|") != -1) {
				scene.yaxis.title = "Y: " + dataItemLabels[1].split("|").slice(-1)[0];
			} else {
				scene.yaxis.title = "Y: " + dataItemLabels[1];
			}
			if (dataItemLabels[2].indexOf("|") != -1) {
				scene.zaxis.title = "Z: " + dataItemLabels[2].split("|").slice(-1)[0];
			} else {
				scene.zaxis.title = "Z: " + dataItemLabels[2];
			}
			return scene;
		}
		
		//************************************
		// Function that is called when the symbol is resized
		//************************************
		function myCustomResizeFunction() {
			Plotly.Plots.resize(symbolContainerDiv);
		}
		
		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction(data) {
			// If the visualization exists...
			if(customVisualizationObject) {
				// Update the title
				symbolContainerDiv.layout.title = createChartTitles();
				// Update the colors
				symbolContainerDiv.layout.paper_bgcolor = scope.config.backgroundColor;
				symbolContainerDiv.data[0].marker = {
					color: scope.config.seriesColor,
					size: 12,
					symbol: 'circle',
					line: {
						color: scope.config.seriesColor,
						width: 1
					},
					opacity: 0.8
				};
				// Refresh the graph
				Plotly.redraw(symbolContainerDiv);
				// Commit updates to the chart
				console.log("Configuration updated.");
			}
		}

		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction, resize:myCustomResizeFunction };
	}
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);