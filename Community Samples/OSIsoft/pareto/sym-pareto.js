(function (PV) {
	'use strict';

    function symbolVis() { };
    PV.deriveVisualizationFromBase(symbolVis);
	
	var definition = {
		typeName: "pareto",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single, 
		iconUrl:'/Scripts/app/editor/symbols/ext/Icons/noun_Pareto_diagram_626189.png', 
		getDefaultConfig: function(){
			return {
				DataShape: "Timeseries",
				Height: 300,
				Width: 300,
				states: []
			}		
		},
		inject: [ 'webServices' ]
	}
	
	function getConfig() {
		return {
		  "type": "serial",
		  "theme": "light",
		  "dataProvider": "",
		  "valueAxes": [{
			"id": "v1",
			"axisAlpha": 0,
			"position": "left"
		  }, {
			"id": "v2",
			"axisAlpha": 0,
			"position": "right",
			"unit": "%",
			"gridAlpha": 0,
			"maximum": 100
		  }],
		  "startDuration": 1,
		  "graphs": [{
			"fillAlphas": 1,
			"fillColors": "#008000",
			"title": "reason",
			"type": "column",
			"valueField": "occurrences"
		  }, {
			"valueAxis": "v2",
			"bullet": "round",
			"lineThickness": 3,
			"bulletSize": 7,
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"useLineColorForBulletBorder": true,
			"fillAlphas": 0,
			"lineAlpha": 1,
			"title": "Percent",
			"valueField": "percent"
		  }],
		  "categoryField": "state",
		  "categoryAxis": {
			"gridPosition": "start",
			"axisAlpha": 0,
			"tickLength": 0
		  }
		}
	}
	
	
	symbolVis.prototype.init = function(scope, elem, webServices) {
		var symbolContainerDiv = elem.find("#container")[0];
		symbolContainerDiv.id = "paretoChart_" + Math.random().toString(36).substr(2, 16);
		var chartConfig = getConfig();
		var chart;
		this.onDataUpdate = dataUpdate;
		
		var states = [];
		webServices.getDefaultStates(scope.symbol.DataSources[0]).promise.then(function(response){
			states = response.data.States;
			if (scope.config.states != states) {
				scope.config.states = states;
			}
		});
		
		function dataUpdate(newdata) {
			if(!newdata || !states.length > 0) return;
			if(!chart) { chart = AmCharts.makeChart(symbolContainerDiv.id, chartConfig); }
			
			chart.dataProvider = convertToChartFormat(newdata);
			chart.validateData();
		}
		
		function convertToChartFormat(data) {
			var valArray = data.Data[0].Values.map(function(item){ return item.Value});
			
			var countedStates = valArray.reduce(function(allValues, state){
				if (state in allValues) {
					allValues[state]++;
				} else {
					allValues[state] = 1;
				}
				return allValues;
			}, {});
			
			var totalStates = valArray.length;
			
			var dataProvider = states.map(function(item){
				var occurances = countedStates[item.Name] || 0;
				return {
					"state": item.Name,
					"occurrences": occurances,
					"percent": (occurances / totalStates) * 100
				}
			});
		
			dataProvider.sort(function(a, b){ return b.occurrences - a.occurrences});
			for(var i = 0, j = dataProvider.length - 1; i < j; i++) {
				dataProvider[i+1].percent += dataProvider[i].percent;
			}
			return dataProvider;
		}
	}
	
	PV.symbolCatalog.register(definition); 
	
})(window.PIVisualization);

