
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
#
#
**/

//************************************
// Begin defining a new symbol
//************************************
(function (CS) {
	//'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Vision to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'timeSeriesDataTable',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'Time Series Data Table',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/timeSeriesDataTable.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				//
				DataShape: 'TimeSeries',
				//DataQueryMode:  CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 400,
				Intervals: 1000,				
				// Specify the value of custom configuration options; see the "configure" section below
				showDataItemNameCheckboxValue: true,
				showTimestampCheckboxValue: true,
				showDataItemNameCheckboxStyle: "table-cell",
				showTimestampCheckboxStyle: "table-cell",				
				numberOfDecimalPlaces: 2,
				dataItemColumnColor: "cyan",
				timestampColumnColor: "lightgray",
				valueColumnColor: "lightgreen",
				hoverColor: "darkslategray",
				evenRowColor: "darkgray",
				oddRowColor: "none",
				outsideBorderColor: "none",
				headerBackgroundColor: "none",
				headerTextColor: "white",
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
		var symbolContainerElement = elem.find('#container')[0];
        // Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
        symbolContainerElement.id = newUniqueIDString;
		var dataItemLabel = "";
		var dataItemUnits;
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			if(data) {
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// --------------------------------------------------------------------------------------------------
				//console.log("Now creating custom visualization...");
				// Clear the table
				$('#' + symbolContainerElement.id).empty();

				// Get the data item name and units
				if (data.Data[0].Path){
					dataItemLabel = (data.Data[0].Path.split("|"))[1]; 
				}
				if (data.Data[0].Units) {
					dataItemUnits = data.Data[0].Units;
				}
				// For each piece of data...
				data.Data[0].Values.forEach(function(pieceOfData) {
					// Create a new row for the table
					var newRow = symbolContainerElement.insertRow(-1);
					newRow.className = "myCustomRowClass";	
					// Add a cell to the row to contain this
					var dataItemCell = newRow.insertCell(-1);
					dataItemCell.innerHTML = dataItemLabel;
					dataItemCell.className = "myCustomCellClass myCustomDataItemCellClass";
					// Add a cell to the row to contain this
					var timeStampCell = newRow.insertCell(-1);
					// Check to see if the timestamp is returned as a string or data object
					if (typeof(pieceOfData.Time) == "string")
					{
						timeStampCell.innerHTML = (pieceOfData.Time);
					} else {
						timeStampCell.innerHTML = myFormatTimestampFunction(pieceOfData.Time);
					}
					// Apply padding and the specified color for this column
					timeStampCell.className = "myCustomCellClass myCustomTimestampCellClass";				
					// Add a cell to the row to contain the value
					var valueCell = newRow.insertCell(-1);
					var newInnerHTMLString = "";
					// Check if the value is a string or error; if it isn't numeric, just display the raw string
					try {
    					newInnerHTMLString = parseFloat(("" + pieceOfData.Value).replace(",","")).toFixed(scope.config.numberOfDecimalPlaces);
					}
					catch (err) {
						newInnerHTMLString = pieceOfData.Value;
					}
					// If the math above failed, display the raw data value (it's likely a string)
					if (newInnerHTMLString == "NaN") {
						newInnerHTMLString = pieceOfData.Value;
					}
					valueCell.innerHTML = newInnerHTMLString;
					// Apply padding and the specified color for this column
					valueCell.className = "myCustomCellClass myCustomValueCellClass";	
				});
				// Add a row of headers
				var headersRow = symbolContainerElement.insertRow(0);
				// Add a cell to the row to contain this
				var dataItemHeaderCell = headersRow.insertCell(-1);
				dataItemHeaderCell.innerHTML = "<b>Data Item</b>";
				dataItemHeaderCell.className = "myCustomCellClass myCustomDataItemCellClass myCustomHeaderCellClass";					
				// Add a cell to the row to contain this
				var timeStampHeaderCell = headersRow.insertCell(-1);
				timeStampHeaderCell.innerHTML = "<b>Timestamp</b>";
				timeStampHeaderCell.className = "myCustomCellClass myCustomTimestampCellClass myCustomHeaderCellClass";		
				// Add a cell to the row to contain the value
				var valueHeaderCell = headersRow.insertCell(-1);
				valueHeaderCell.innerHTML = "<b>Value</b>";
				if (dataItemUnits) {
					valueHeaderCell.innerHTML = valueHeaderCell.innerHTML + " (" + dataItemUnits + ")";
				}
				valueHeaderCell.style.textAlign = "right";
				valueHeaderCell.className = "myCustomCellClass myCustomHeaderCellClass";		
			}
		}

		//************************************
		// Converts a date object to a small date string
		//************************************
		var myMonthAbbreviationsArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		function myFormatTimestampFunction(rawTime) {
			// Set a new date object to be the time from this particular piece of data
			var MyDateObject = new Date(0);
            MyDateObject.setUTCSeconds(rawTime);
			// Build a formatted string using the new date object
			var MyDateString = "";
			MyDateString = myPrependZeroIfNeededFunction(MyDateObject.getDate()) 
				+ "-" 
				+ myMonthAbbreviationsArray[MyDateObject.getMonth()] 
				+ "-" 
				+ MyDateObject.getFullYear()
				+ " " 
				+ myPrependZeroIfNeededFunction(MyDateObject.getHours()) 
				+ ":" 
				+ myPrependZeroIfNeededFunction(MyDateObject.getMinutes()) 
				+ ":" 
				+ myPrependZeroIfNeededFunction(MyDateObject.getSeconds());	
			return MyDateString;
		}
		//************************************
		// Prepends a zero to a number if necessary when building a date string, to ensure 2 digits are always present
		//************************************
		function myPrependZeroIfNeededFunction(MyNumber) {
			// If the number is less than 10...
			if (MyNumber < 10) {
				// Add a zero ahead of it, to ensure it'll appear as two characters
				return ("0" + MyNumber);
			} else {
				return (MyNumber);
			}
		}
		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction(data) {
			// Update chart background and border
			document.getElementById(symbolContainerElement.id).style.border = "3px solid " + scope.config.outsideBorderColor;
			// Update whether or not to show cells
			if (scope.config.showTimestampCheckboxValue) {
				scope.config.showTimestampCheckboxStyle = "table-cell";
			} else {
				scope.config.showTimestampCheckboxStyle = "none";
			}
			if (scope.config.showDataItemNameCheckboxValue) {
				scope.config.showDataItemNameCheckboxStyle = "table-cell";
			} else {
				scope.config.showDataItemNameCheckboxStyle = "none";
			}			
		}
		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction };		
	}
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);