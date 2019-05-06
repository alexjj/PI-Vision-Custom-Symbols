(function (PV) {
	'use strict';

    function symbolVis() { };
    PV.deriveVisualizationFromBase(symbolVis);
	
	var definition = {
		typeName: "ganttchart",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
		getDefaultConfig: function(){
			return {
				DataShape: "Timeseries",
				Height: 150,
				Width: 400,
				colors: []
			}		
		},
		configOptions: function () {
            return [{
				title: 'Format Symbol',
                mode: 'default'
            }];
        },
		inject: [ 'webServices' ]
	}
	
	function getConfig() {
		return { 
		  "type": "gantt",
		  "theme": "light",
		  "marginRight": 70,
		  "period": "ss",
		  "dataDateFormat": "YYYY/MM/DD HH:NN:SS",
		  "columnWidth": 0.5,
		  "valueAxis": {
			"type": "date",
			"minPeriod": "ss",
			"ignoreAxisWidth": true
		  },
		  "graph": {
			"lineAlpha": 1,
			"lineColor": "#fff",
			"fillAlphas": 0.85,
			"balloonText": "[[state]]:<br />[[open]] -- [[value]]"
		  },
		  "rotate": true,
		  "categoryField": "category",
		  "segmentsField": "segments",
		  "colorField": "color",
		  "startDateField": "start",
		  "endDateField": "end",
		  "dataProvider": "",
		  "chartCursor": {
			"cursorColor": "#55bb76",
			"valueBalloonsEnabled": false,
			"cursorAlpha": 0,
			"valueLineAlpha": 0.5,
			"valueLineBalloonEnabled": true,
			"valueLineEnabled": true,
			"zoomable": false,
			"valueZoomable": true
		  },
		  "export": {
			"enabled": true
		  }
		}
	}
	
	var TRACECOLORS = ["rgb(62, 152, 211)", "rgb(224, 138, 0)", "rgb(178, 107, 255)", "rgb(47, 188, 184)", "rgb(219, 70, 70)", "rgb(156, 128, 110)", "rgb(60, 191, 60)", "rgb(197, 86, 13)","rgb(46, 32, 238)","rgb(165, 32, 86)" ];
	
	symbolVis.prototype.init = function(scope, elem, webServices) {
		var symbolContainerDiv = elem.find("#container")[0];
		symbolContainerDiv.id = "barChart_" + Math.random().toString(36).substr(2, 16);
		var chartConfig = getConfig();
		
		var states = [];
		webServices.getDefaultStates(scope.symbol.DataSources[0]).promise.then(function(response){
			states = response.data.States;
			if (scope.config.states != states) {
				scope.config.states = states;
			}
			if (scope.config.colors.length == 0) {
				scope.config.colors = states.map(function(item, index){
					 return TRACECOLORS[index] || index - 1 - (TRACECOLORS.length * Math.floor(index / TRACECOLORS.length));
				});
			}
			
			if(scope.config.colors.length < states.length) {
				var iterations = states.length - scope.config.colors.length;
				for (var i = 0; i < iterations; i++) {
					scope.config.colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
				}
			}
		});
		
		var chart;
		this.onDataUpdate = dataUpdate;

		function dataUpdate(data) {
			if(!data || !states.length > 0) return;
			if(!chart) { chart = AmCharts.makeChart(symbolContainerDiv.id, chartConfig) }
			
			chart.dataProvider = convertToChartDataFormat(data);
			chart.validateData();
		}
		
		function convertToChartDataFormat(data) {
			var valArray = data.Data[0].Values;	
			var segments = [];
			
			valArray.forEach(function(item, index) {
				
				var colorIndex = states.findIndex(function(state){ return state.Name == item.Value});
				if (valArray[index - 1] && item.Value == valArray[index - 1].Value) {
					segments[segments.length - 1].end = index == valArray.length - 1 ? new Date(data.Data[0].EndTime) : new Date(valArray[index + 1].Time);
					
				} else {
						segments.push({
						"start": new Date(item.Time),
						"end": index == valArray.length - 1 ? new Date(data.Data[0].EndTime) : new Date(valArray[index + 1].Time),
						"color": scope.config.colors[colorIndex],
						"state": item.Value
					})
				}
			});
			
			return [{
				"category": "",
				"segments": segments
			}];
		}
	}

	PV.symbolCatalog.register(definition); 
	
})(window.PIVisualization);
