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
window.PIVisualization = window.PIVisualization || {};
window.PIVisualization.ClientSettings = window.PIVisualization.ClientSettings || {};
(function (CS) {
    function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);

	symbolVis.prototype.init = function (scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onResize = resize;
		
        var container = elem.find('#container')[0];
        var id = 'linechart_' + Math.random().toString(36).substr(2, 16);
        container.id = id;

        function convertToChartData(data) {
			//console.log(data.Value);
			return eval(data.Value);
		}		
		var chart;
        function dataUpdate(data) {
            if(data) {
				//console.log(data);
                var series = convertToChartData(data);				
                if(!chart) {
                    chart = new Highcharts.Chart({
						chart: {
							type: 'column',
							renderTo: id
						},
						title: {
							text: '停机Top3'
						},
						subtitle: {
							text: 'Source: PIM'
						},
						xAxis: {
							categories: [
								'停机原因'
							],
							crosshair: true
						},
						yAxis: {
							min: 0,
							title: {
								text: '停机次数'
							}
						},
						plotOptions: {
							column: {
								pointPadding: 0.2,
								borderWidth: 0
							}
						},
						series: series
                    });				
				}
            }
        }
        function resize(width, height) {
            if(chart) {
                chart.setSize(width, height);
            }
        }		
    };

    var definition = {
        typeName: 'linechart',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
        visObjectType: symbolVis,
        getDefaultConfig: function() {
    	    return {
    	        DataShape: 'Value',
    	        Height: 150,
                Width: 150
            };
        }
    };

    CS.symbolCatalog.register(definition);
})(window.PIVisualization);