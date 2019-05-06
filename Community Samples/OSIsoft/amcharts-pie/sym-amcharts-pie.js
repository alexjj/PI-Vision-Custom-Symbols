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
		typeName: 'amcharts-pie',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'amCharts Pie Chart',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/amcharts-pie.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				//
				DataShape: 'Table',
				//DataQueryMode:  CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 500,
				// Specify the value of custom configuration options; see the "configure" section below
				textColor: "black",
				backgroundColor: "white",
				outlineColor: "white",
				showTitle: true,
				showLabels: true,
				showLegend: true,
				donut: false
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
        }
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
		var customVisualizationObject;
		// Create var to hold the data, labels, and units
		var dataArray = [];
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			//console.log("Data object: ",data);
			if(data) {
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// --------------------------------------------------------------------------------------------------
				//console.log("Now creating custom visualization...");
				// Extract the units and labels
				for (var i = 0; i < data.Rows.length; i++) {
					// If data has already been logged once for this data item, then simply update the value and timestamp
					if (dataArray[i]) {
						// Update the time and date
						dataArray[i].Time = data.Rows[i].Time;
						dataArray[i].Value = parseFloat( ("" + data.Rows[i].Value).replace(",", "") );
						// If the units and label have been updated, update those
						if (data.Rows[i].Units) {
							dataArray[i].Units = data.Rows[i].Units;
						}
						if (data.Rows[i].Label) {
							dataArray[i].Label = data.Rows[i].Label;
						}
					} else {
						// Create a new data object, extracting attributes from the data update
						var newDataObject = {
							"Label": data.Rows[i].Label,
							"Time": data.Rows[i].Time,
							"Units": data.Rows[i].Units,
							"Value": parseFloat( ("" + data.Rows[i].Value).replace(",", "") ),
						};
						// Write the new object to the data array
						dataArray[i] = newDataObject;
					}
				}
				// Create the pie chart if it doesn't exist
				if (!customVisualizationObject) {
					customVisualizationObject = AmCharts.makeChart( symbolContainerDiv.id, {
						"type": "pie",
						"dataProvider": dataArray,
						"valueField": "Value",
						"titleField": "Label",
						"descriptionField": "Units",
						"titles": createArrayOfChartTitles(),
						"balloonText": "[[title]]\n[[value]] [[description]]\n([[percents]]%)",
						"labelText": "[[title]]\n[[value]] [[description]]\n([[percents]]%)",
						"labelsEnabled": scope.config.showLabels,
						"creditsPosition": "bottom-right",
						"color": scope.config.textColor,
						"outlineColor": scope.config.outlineColor,
						"outlineAlpha": 1,
						"outlineThickness": 1,
						"innerRadius": 0,
						"legend": {
							"enabled": scope.config.showLegend,
							"color": scope.config.textColor,
							"valueText": "[[value]] [[description]]",
							"align": "center",
							"labelWidth": 150
						}
					} );
				} else {
					// Update the title
					if (scope.config.showTitle) {
						customVisualizationObject.titles = createArrayOfChartTitles();
					} else {
						customVisualizationObject.titles = null;
					}						
					// If it does exist, simply update the chart
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
			// Build the titles text, starting with the first item
			var titleText = dataArray[0].Label + " (" + dataArray[0].Units + ")";
			// Add all successive items
			for (var i = 1; i < dataArray.length; i++) {
				titleText += (" vs. " + dataArray[i].Label + " (" + dataArray[i].Units + ")");
			}
			// Format the titles as an array
			var titlesArray = [
				{
					"text": titleText,
					"size": 12
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
                if (customVisualizationObject.color !== scope.config.textColor) {
                    customVisualizationObject.color = scope.config.textColor;
					customVisualizationObject.legend.color = scope.config.textColor;
                }
                if (customVisualizationObject.backgroundColor !== scope.config.backgroundColor) {
                    customVisualizationObject.backgroundColor = scope.config.backgroundColor;
                }
				if (customVisualizationObject.outlineColor !== scope.config.outlineColor) {
                    customVisualizationObject.outlineColor = scope.config.outlineColor;
                }
				// Update the title and labels and legend
				if (scope.config.showTitle) {
					customVisualizationObject.titles = createArrayOfChartTitles();
				} else {
					customVisualizationObject.titles = null;
				}
				customVisualizationObject.labelsEnabled = scope.config.showLabels;
				customVisualizationObject.legend.enabled = scope.config.showLegend;
				// Update donut
				if (scope.config.donut) {
					customVisualizationObject.innerRadius = "60%";
				} else {
					customVisualizationObject.innerRadius = 0;
				}
				// Commit updates to the chart
				customVisualizationObject.validateNow();
			}
		}
		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction };		
	}
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);