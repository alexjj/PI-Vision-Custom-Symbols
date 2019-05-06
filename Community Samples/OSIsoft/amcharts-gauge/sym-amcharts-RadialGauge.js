
/**
# ***********************************************************************
# * DISCLAIMER:
# *
# * All sample code is provided by OSIsoft for illustrative purposes only.
# * These examples have not been thoroughly tested under all conditions.
# * OSIsoft provides no guarantee nor implies any reliability,
# * serviceability, or function of these programs.
# * ALL PROGRAMS CONTAINED HEREIN ARE PROVIDED TO YOU "AS IS"
# * WITHOUT ANY WARRANTIES OF ANY KIND. ALL WARRANTIES INCLUDING
# * THE IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY
# * AND FITNESS FOR A PARTICULAR PURPOSE ARE EXPRESSLY DISCLAIMED.
# ************************************************************************
#
# Updated by dlopez@osisoft.com
# Visualizations provided by amCharts: https://www.amcharts.com/
#
**/

//************************************
// Begin defining a new symbol
//************************************
(function (CS) {
	'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Vision to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'amCharts-RadialGauge',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'amCharts Radial Gauge',
		// Specify the number of data sources for this symbol; for a gauge, it'll be just a single data source
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/amcharts-radialgauge.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				//
				DataShape: 'Gauge',
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 300,
				// Specify the value of custom configuration options; see the "configure" section below
				showValueCheckboxValue: true,
				showTitleCheckboxValue: true,
				gaugeMinimum: 0,
				gaugeZone1Maximum: 67,
				gaugeZone2Maximum: 134,
				gaugeZone3Maximum: 160,
				gaugeZone4Maximum: 190,
				gaugeZone5Maximum: 200,
				gaugeInterval: 20,
				gaugeZone1Color: "#84b761",
				gaugeZone2Color: "#fdd400",
				gaugeZone3Color: "#cc4748",
				gaugeZone4Color: "#fdd400",
				gaugeZone5Color: "#84b761",
				gaugeAngle: 180
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
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			if(data) {
				// Update the current scope with the new data value, time, and label
				scope.value = data.Value.replace(",","");
				scope.time = data.Time;
				if(data.Label) {
					scope.label = data.Label;
				}
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// --------------------------------------------------------------------------------------------------
				if(!customVisualizationObject) {
					// Use the amCharts Javascript library to create this visualization; download it from here:
					// https://www.amcharts.com/download/ (download the file for "JavaScript CHARTS")
					// Inside the downloaded ZIP file there is a folder called "amcharts"; copy all of the contents
					// And paste them into the same directory as this file (C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext)
					customVisualizationObject = AmCharts.makeChart(newUniqueIDString, {
						// Position the watermark
						"creditsPosition": "bottom-right",
						// Specify the visualization type and color theme
						// For additional parameters, see https://docs.amcharts.com/3/javascriptcharts/AmAngularGauge
						"type": "gauge",
						"theme": "light",
						// Add a title, and set its size and color
						"titles": [ {
							"text": "",
							"size": 15,
							"color": "#FFFFFF"
						} ],
						// Specify where the guage should be in the container, vertically (centered is the default)
						//"gaugeY": 0,
						// Specify the background opacity and color
						"faceAlpha": 0.9,
						"faceColor": "#FFFFFF",
						// Specify parameters for the radial axis
						"axes": [ {
							// Specify the start and end angles, in degrees, measured from the top of the dial
							"startAngle": (-1 * scope.config.gaugeAngle / 2),
							"endAngle": (1 * scope.config.gaugeAngle / 2),
							// Specify the axis line thickness and opacity for the axis and tick lines
							"axisThickness": 1,
							"axisAlpha": 0.2,
							"tickAlpha": 0.2,
							// Specify the interval for tick marks
							"valueInterval": scope.config.gaugeInterval,
							// Define colored bands to highlight different areas on the radial axis
							// Use HEX color codes (for example, http://www.color-hex.com/)
							"bands": [ {
								"startValue": scope.config.gaugeMinimum,
								"endValue":   scope.config.gaugeZone1Maximum,
								"color":      scope.config.gaugeZone1Color
							}, {
								"startValue": scope.config.gaugeZone1Maximum,
								"endValue":   scope.config.gaugeZone2Maximum,
								"color":      scope.config.gaugeZone2Color
							}, {
								"startValue": scope.config.gaugeZone2Maximum,
								"endValue":   scope.config.gaugeZone3Maximum,
								"color":      scope.config.gaugeZone3Color
							}, {
								"startValue": scope.config.gaugeZone3Maximum,
								"endValue":   scope.config.gaugeZone4Maximum,
								"color":      scope.config.gaugeZone4Color
							}, {
								"startValue": scope.config.gaugeZone4Maximum,
								"endValue":   scope.config.gaugeZone5Maximum,
								"color":      scope.config.gaugeZone5Color
							}   
							],
							"endValue": scope.config.gaugeZone5Maximum,
							// Specify where the axis label will be (usually below the gauge)
							"bottomText": "",
							"bottomTextYOffset": -20
						} ],
						// Add an arrow indicator to the gauge
						"arrows": [ {
							"value": scope.value
						} ]
					} );
				// If the custom visualization already exists, then simply tell it to update with the new data	
				} else {
					// Update the arrow value
					customVisualizationObject.arrows[ 0 ].setValue( scope.value );
				}
				// At this point, the visualization exists. 
				// Show or hide the title
				if (scope.config.showTitleCheckboxValue == false) {
					customVisualizationObject.titles[ 0 ].text = ( "" );
				} else {
					customVisualizationObject.titles[ 0 ].text = ( scope.label );
				}
				// Update the axis label
				if (scope.config.showValueCheckboxValue == false) {
					customVisualizationObject.axes[ 0 ].setBottomText( "" );
				} else {
					customVisualizationObject.axes[ 0 ].setBottomText( scope.value );
				}
				// Commit these updates to the visualization
					customVisualizationObject.validateData();
				// --------------------------------------------------------------------------------------------------
			}
		}
		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction(data) {
			// If the chart exists...
			if(customVisualizationObject) {
				console.log("Now updating visualization with these new settings...");
				// Show or hide the value
				if (scope.config.showValueCheckboxValue == false) {
					customVisualizationObject.axes[ 0 ].setBottomText( "" );
				} else {
					customVisualizationObject.axes[ 0 ].setBottomText( scope.value );
				}
				// Show or hide the title
				if (scope.config.showTitleCheckboxValue == false) {
					customVisualizationObject.titles[ 0 ].text = ( "" );
				} else {
					customVisualizationObject.titles[ 0 ].text = ( scope.label );
				}
				// Update the chart band positions
				customVisualizationObject.axes [ 0 ].bands [ 0 ].startValue = scope.config.gaugeMinimum; 
				customVisualizationObject.axes [ 0 ].bands [ 0 ].endValue   = scope.config.gaugeZone1Maximum; 
				customVisualizationObject.axes [ 0 ].bands [ 1 ].startValue = scope.config.gaugeZone1Maximum; 
				customVisualizationObject.axes [ 0 ].bands [ 1 ].endValue   = scope.config.gaugeZone2Maximum; 
				customVisualizationObject.axes [ 0 ].bands [ 2 ].startValue = scope.config.gaugeZone2Maximum;
				customVisualizationObject.axes [ 0 ].bands [ 2 ].endValue   = scope.config.gaugeZone3Maximum;
				customVisualizationObject.axes [ 0 ].bands [ 3 ].startValue = scope.config.gaugeZone3Maximum;
				customVisualizationObject.axes [ 0 ].bands [ 3 ].endValue   = scope.config.gaugeZone4Maximum;
				customVisualizationObject.axes [ 0 ].bands [ 4 ].startValue = scope.config.gaugeZone4Maximum;
				customVisualizationObject.axes [ 0 ].bands [ 4 ].endValue   = scope.config.gaugeZone5Maximum;
				customVisualizationObject.axes [ 0 ].endValue = scope.config.gaugeZone5Maximum; 
				// Update the chart interval if it's above 0.1
				if ( scope.config.gaugeInterval >= 0.1 ) {
					customVisualizationObject.axes [ 0 ].valueInterval = scope.config.gaugeInterval;
				}
				// Update the chart band colors
				customVisualizationObject.axes [ 0 ].bands [ 0 ].color = scope.config.gaugeZone1Color; 
				customVisualizationObject.axes [ 0 ].bands [ 1 ].color = scope.config.gaugeZone2Color; 
				customVisualizationObject.axes [ 0 ].bands [ 2 ].color = scope.config.gaugeZone3Color; 
				customVisualizationObject.axes [ 0 ].bands [ 3 ].color = scope.config.gaugeZone4Color; 
				customVisualizationObject.axes [ 0 ].bands [ 4 ].color = scope.config.gaugeZone5Color; 
				// Update the chart angle
				if ( scope.config.gaugeAngle >= 1 ) {
					customVisualizationObject.axes [ 0 ].startAngle = (-1 * scope.config.gaugeAngle / 2);
					customVisualizationObject.axes [ 0 ].endAngle = (1 * scope.config.gaugeAngle / 2);
				}
				// Command the visualization to accept the new updates
				customVisualizationObject.validateNow();
				console.log("Update complete.");
			}
		}
		
		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction };
	}
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);