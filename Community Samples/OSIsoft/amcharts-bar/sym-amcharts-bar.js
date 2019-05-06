
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
	//'use strict';
	
	var myCustomSymbolDefinition = {

		typeName: 'amcharts-bar',
		displayName: 'amCharts Bar Chart',
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/bar-chart-icon.png',
		visObjectType: symbolVis,
		getDefaultConfig: function () {
			return {
				//
				DataShape: 'Table',
				Height: 300,
				Width: 600,
				minimumValue: 0,
				maximumValue: 100,
				binSize: 10,
				showTitle: true,
                textColor: "black",
                backgroundColor: "white",
                plotAreaFillColor: "white",
                fontSize: 14,
                useBarsInsteadOfColumns: false,
                sortBinsByValue: false,
                useGradientBinColors: true,
                seriesColor: "red"
            };
		},
	
        configOptions: function () {
            return [{
				title: 'Format Symbol',
                mode: 'format'
            }];
        },
 
	};
	
	
	function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);
	
	symbolVis.prototype.init = function(scope, elem) {	
		this.onDataUpdate = dataupdate;
		
		var labels = getLabels(scope.symbol.DataSources);
		
		var chart = initChart();
		
		
		
		function initChart(){
		
			var symbolContainerDiv = elem.find('#container')[0];
			symbolContainerDiv.id = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
			
			//var dataprovider = labels.map(function(label){return {StreamName: label}});
			
			var chartconfig = getChartConfig();
					
			var customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, chartconfig);
			return customVisualizationObject;
		}		
		
		function getLabels(datasources){
			return  datasources.map(function(item){
					var isAttribute = /af:/.test(item);
					var label = isAttribute ? item.match(/\w*\|.*$/)[0] : item.match(/\w+$/)[0];
					return {Label: label};
			});	
		} 
		
		//the data object us supplied by Coresight data layer.
		function dataupdate(newdata) {
			 
			 
			 if (!newdata || !chart) return;
			if(!labels) labels = getLabels(scope.symbol.DataSources);
			//if Rows have Label => either configuration is updated 
			if(newdata.Rows[0].Label) labels = newdata.Rows.map(function(item){return {Label: item.Label}});
			var dataprovider = convertToChartDataFormat(newdata, labels);
			 
			chart.dataProvider = dataprovider;
			chart.validateData();

			
		}
             
		 function convertToChartDataFormat(newdata, labels) {
			return newdata.Rows.map(function(item, index){
				return {Value: item.Value, Time: item.Time, StreamName: labels[index].Label}
			});
		 }
		
        
		function getChartConfig() {
            return {
						"type": "serial",
						"theme": "light",
						"backgroundAlpha": 1,
						//"backgroundColor": scope.config.backgroundColor,
						//"color": scope.config.textColor,
						"plotAreaFillAlphas": 1,
						//"plotAreaFillColors": scope.config.plotAreaFillColor,
						"fontFamily": "arial",
						"marginRight": 30,
						//"creditsPosition": "bottom-right",
						//"titles": createArrayOfChartTitles(),
                        //"fontSize": 12,
                        //"rotate": scope.config.useBarsInsteadOfColumns,
						"valueAxes": [{
							"position": "left",
							"title": "Value"
						}],
						"categoryAxis": {
							"title": "Attribute"
						},
						"graphs": [{
							"type": "column",
							"fillAlphas": 1,
							"balloonText": "<b> [[StreamName]] </b><br/>Value: [[Value]]", 
							"valueField": "Value",
							"fillColorsField": "color"
						}],
						//"rotate": false, 
						"dataProvider": "",
						"categoryField": "StreamName",
						"chartCursor": { 
							"cursorColor": "gray",
							"valueLineBalloonEnabled": true,
							"valueLineEnabled": true,
							"valueZoomable": true
						},
						"zoomOutButtonImage": "",
						"export":{
							"enabled": true
						}
					}
        }

	}
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.Coresight);