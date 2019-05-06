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
# Visualizations provided by amCharts: https://www.amcharts.com/
#
**/

(function (PV) {
	'use strict';
	
	var definition = {
		typeName: 'amcharts-linechart',
		displayName: 'amCharts Line Chart',
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		iconUrl: 'Scripts/app/editor/symbols/ext/Icons/LineChart.png',
		visObjectType: symbolVis,
		getDefaultConfig: function () {
			return {
				DataShape: 'Timeseries',
				DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModePlotValues,
				DataType: true,
				Height: 300,
				Width: 600,
				FormatType: "F3",
				BackgroundColor: "",
				TextColor: "#ffffff",
				Graphs: [],
				ValueAxes: [],
				Rotate: false,
				LabelRotation: 0,
				LegendPosition: "right"
				
            };
		},	
        configOptions: function () {
            return [{
				title: 'Format Symbol',
                mode: 'default'
            }];
        },
		inject: ['dataPump', 'webServices']

 
	};
	
	function symbolVis() { };
    PV.deriveVisualizationFromBase(symbolVis);
	

	symbolVis.prototype.init = function(scope, elem, dataPump, webServices) {	
	
		this.onDataUpdate = dataUpdate;
		this.onConfigChange = configChange;
		scope.webServices = webServices;
		var chart;
		scope.runtimeData.MetaData = [];
		scope.runtimeData.deleteTrace = deleteChartDataSources;

		addDataSourcesToChart(scope.symbol.DataSources, scope.config.Graphs);

		//
		// Chart data helper functions
		//
		function dataUpdate(newdata) { 
			if (!newdata || !chart) return;

			var dataprovider = convertToChartDataFormat(newdata);		
			chart.dataProvider = dataprovider;
			

			chart.validateData();
			chart.animateAgain();
		}


		function convertToChartDataFormat(newdata) {
			var metadata = scope.runtimeData.MetaData;		
			return _.chain(newdata.Data)
					.map(function(dataArray, index){

						var starttime = new Date(dataArray.StartTime);
						var endtime = new Date(dataArray.EndTime);
						var lastitem = {
										Value: ParseValue(dataArray.Values[dataArray.Values.length - 1].Value, metadata[index]),
										Time: dataArray.Values[dataArray.Values.length - 1].Time,
										DateTime: endtime
									}
						var lastvalue = _.object(['Value' + index, 'ValueString' + index, 'Time', 'DateTime'], [lastitem.Value.Value, lastitem.Value.Name, lastitem.Time, lastitem.DateTime]);
						
						var parsedValues = dataArray.Values
								.map(function(dataitem){
									var datetime = new Date(dataitem.Time);						
									var value = ParseValue(dataitem.Value, metadata[index]);
									
									if(dataArray.Values.length == 1) {
										return [
											_.object(['Value' + index, 'ValueString' + index, 'Time', 'DateTime'], [value.Value, value.Name, dataitem.Time, starttime]), 
										]
									}
									return _.object(['Value' + index, 'ValueString' + index, 'Time', 'DateTime'], [value.Value, value.Name, dataitem.Time, datetime]);
									/* datetime >= starttime 
											? _.object(['Value' + index, 'Time', 'DateTime'], [value, dataitem.Time, datetime])
											: undefined; */
								});
						
						parsedValues.push(lastvalue);
						return parsedValues;
					})
					.flatten()
					.compact()
					.groupBy(function(item){return item.DateTime})
					.map(function(item){
						if (_.size(item) > 1){
							var merged = {};
							item.forEach(function(item){_.defaults(merged,item)});	
							return merged;
						}
						else{
							return item[0];
						}	
					})
					.sortBy('DateTime')
					.value();			
		 }

		 function ParseValue(value, metadata) {
			return isDigital(metadata)  
			? StateToValue(value, metadata.States) 
			: {Value: parseFloat(value), Name: value}

		 }
		 function StateToValue(value, states) {
			return (_.findWhere(states, {Name: value}));
		 }

		//
		// Chart configuration helper functions 
        //
		scope.runtimeData.Bullets = [
			"none","round","square", "triangleUp", "triangleDown", "bubble"//, "custom"
		];
		
		scope.runtimeData.GraphTypes = [
			"line", "column", "step", "smoothedLine"
		];
		
		scope.runtimeData.Positions = [
			"left", "right", "top", "bottom"
		];

		var TRACECOLORS = ["rgb(62, 152, 211)", "rgb(224, 138, 0)", "rgb(178, 107, 255)", "rgb(47, 188, 184)", "rgb(219, 70, 70)", "rgb(156, 128, 110)", "rgb(60, 191, 60)", "rgb(197, 86, 13)","rgb(46, 32, 238)","rgb(165, 32, 86)" ];
 
		// The watch is destroyed when scope is destroyed
	    scope.$watch('symbol.DataSources', function (nv, ov) {		
			if (nv && ov && !angular.equals(nv, ov)) {
				if(nv.length > ov.length) {
					var newdatasoucres = _.difference(nv, ov);
					addDataSourcesToChart(newdatasoucres, []);
				}
            }
		}, true);
		
		function configChange(newConfig, oldConfig) {
			if (chart && newConfig && oldConfig && !angular.equals(newConfig, oldConfig)) {	
				
				chart.graphs = angular.copy(scope.config.Graphs);
				chart.valueAxes = angular.copy(scope.config.ValueAxes);
				chart.color = scope.config.TextColor;
				chart.rotate = scope.config.Rotate;
				chart.categoryAxis.labelRotation =  scope.config.LabelRotation;
				chart.legend.position = scope.config.LegendPosition;	

				if (!angular.equals(newConfig.ScaleMin, oldConfig.ScaleMin) || !angular.equals(newConfig.ScaleMax, oldConfig.ScaleMax)) {
					chart.graphs.forEach(function(graph, index) {
						chart.valueAxes[index].minimum = newConfig.ScaleMin;
						chart.valueAxes[index].maximum = newConfig.ScaleMax;
						if (newConfig.ScaleMin === null) {
							 delete chart.valueAxes[index].minimum;
						}		
						if (newConfig.ScaleMax === null) {
							 delete chart.valueAxes[index].maximum;
						}						
					});

				}

				chart.validateData();
				chart.animateAgain();
			}
		}

		function addDataSourcesToChart(datasources, graphs) {
			// Get metadata: minimum, maximum for scales as well as states for plotting digital or enumeration types
			return getMetaData(datasources).then(function(metadata){
				
				scope.runtimeData.MetaData = scope.runtimeData.MetaData.concat(metadata.data);	

				if (graphs.length == 0) {
					var newGraphs = getGraphs(metadata.data);
					scope.config.Graphs = scope.config.Graphs.concat(newGraphs);

					var newAxes = getAxes(metadata.data);
					scope.config.ValueAxes = scope.config.ValueAxes.concat(newAxes);
				}
				updateGraphIndexes(scope.config.Graphs);
				updateAxesIndexes(scope.config.ValueAxes, scope.runtimeData.MetaData);
			
			}).then(function() {
				// Create chart if it doesn't exist
				if(!chart) {
					chart = initChart();
				} 
				// Update the chart's scales and graphs
				// Using map here because splice empties the original Graph and Axes arrays
				chart.graphs = angular.copy(scope.config.Graphs);
				chart.valueAxes = angular.copy(scope.config.ValueAxes);
				chart.validateData();
			});

		}

		function deleteChartDataSources(scope) {
			var index = scope.runtimeData.selectedTrace;
			var datasources = scope.symbol.DataSources;
			var graphs = scope.config.Graphs;
			var axes = scope.config.ValueAxes;
			var metadata = scope.runtimeData.MetaData;
			
			if (datasources.length > 1) {
				datasources.splice(index, 1);
				graphs.splice(index, 1);   
				axes.splice(index, 1);
				metadata.splice(index, 1);
				updateGraphIndexes(graphs);
				updateAxesIndexes(axes, metadata);
				
				scope.$root.$broadcast('refreshDataForChangedSymbols');		
			}
		}

		function getMetaData(sources) {
			var endpoint = scope.runtimeData.def.configRetrieveAttributeMetaData ? 'postForAttributeMetadata' : 'postForDatasourceMetadata';
			return scope.webServices[endpoint](sources).promise;
		} // Gets States for digital tags or attributes of enumeration type

		function getGraphs(metadata){
			return metadata.map(function(item, index){
				return {
					title: PV.Utils.parsePath(item.Path).label,
					bullet: "round", 
					lineThickness: 1,
					type: isDigital(item) ? "step" : "line",
					bulletColor: "rgba(0,0,0,0)",
					fixedColumnWidth: 25,
					pointPosition: 'start'
				};
			});
		}

		function updateGraphIndexes(graphs){
			graphs.forEach(function(graph, index){
				graph.valueField = "Value" + index;
				graph.valueAxis = "ValueAxis" + index;
				graph.balloonText = "<span style='font-size:13px'>[[title]]</span><br> <span style='font-size:13px'>[[Time]]</span><br><span style='font-size:13px'>[[ValueString" + index + "]]</span>";
				graph.lineColor = graph.lineColor || TRACECOLORS[index - ~~(index / TRACECOLORS.length) * TRACECOLORS.length];
			});
			
		}

		function getAxes(metadata){
			return metadata.map(function(item){
				return {
					minimum: scope.config.ScaleMax ? scope.config.ScaleMax : item.Minimum,
					maximum: scope.config.ScaleMin ? scope.config.ScaleMin : (isDigital(item) ? item.Maximum + 2 : item.Maximum)
					//inside: true
				}
			});
		}

		function updateAxesIndexes(axes, metadata) {
			axes.forEach(function(item, index){
				item.id = "ValueAxis" + index;
				item.offset = (-45 * index);
				item.color = item.color || TRACECOLORS[index - ~~(index / TRACECOLORS.length) * TRACECOLORS.length];
				item.maximum = scope.config.ScaleMax ? scope.config.ScaleMax : metadata[index].Maximum;
				item.minimum = scope.config.ScaleMin ? scope.config.ScaleMin : metadata[index].Minimum;
				item.labelFunction = isDigital(metadata[index]) ? convertToLabel : ""
			});
		}

		function convertToLabel(value, valueString, axis) {
			
		   var index = axis.id.slice("ValueAxis".length);
		   var states = scope.runtimeData.MetaData[index].States;

		   var stateValue = _.findWhere(states, {Value: value});

		   if(stateValue != undefined) {
			   return stateValue.Name;
		   }  
		   return "";
	   }

	   function isDigital(metadata) {
			var type = metadata.DataType.toLowerCase();
			return (type == 'bool' || type == 'digital')
	   }

		function initChart() {
			// Get the <div> element id attribute and make it random
			var symbolContainerDiv = elem.find('#container')[0];
			symbolContainerDiv.id = "amchartsLineChart_" + Math.random().toString(36).substr(2, 16);
			
			var chartConfiguration = getChartConfiguration(scope.config);

			var chart = AmCharts.makeChart(symbolContainerDiv.id, chartConfiguration);

			return chart;
		}
	
		function getChartConfiguration(config){
			return {
				"type": "serial",
				"theme": "dark",
				"rotate": config.Rotate,
				"color": config.TextColor,
				"zoomOutText": "",
				"valueAxes": [{
					"position": "left",
					"title": "Value"
				}],    
				"categoryField": "DateTime",
				"categoryAxis": {
					"title": "Time",
					"labelRotation": config.LabelRotation,
					"parseDates": true,
					"minPeriod":"ss",
				},					
				"chartCursor": { 
					"valueLineBalloonEnabled": true,
					"valueLineEnabled": true,
					"valueZoomable": true
				},
				"legend": {
					"enabled": true,
					"useGraphSettings": true,
					"position": config.LegendPosition		
				},
				"colors": TRACECOLORS
			};
		}


	}

	PV.symbolCatalog.register(definition);

})(window.PIVisualization);