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
		
        var container = elem.find('#container')[0];
        var id = 'namevaluetable_' + Math.random().toString(36).substr(2, 16);
        container.id = id;
		function GetRealName(name){
			var realName = "";
			var length = name.length;
			var lastIndexOf = name.indexOf("|");
			if(length>0 && lastIndexOf <length)
			realName = name.substr(lastIndexOf+1, length-lastIndexOf);
			return realName;
		}
        function convertToChartData(data) {
            var series = [];
            data.Data.forEach(function(item) {
					var t = {};
					if(item.Label!=undefined){
					t.name = GetRealName(item.Label);
					t.data = item.Values.map(function(obj) {
						var date = new Date(obj.Time);
						return [Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()), obj.Value];
					});
					series.push(t);
				}
            });

            return series;            
        }
		
		var chart;
        function dataUpdate(data) {
            if(data) {
                var series = convertToChartData(data);
                if(!chart && series.length>0) {
					$("<link>").attr({rel:"stylesheet",type:"text/css",href:"../PIVision/Scripts/app/editor/symbols/ext/css/extend.css"}).appendTo("head");				
					chart = "<table>";
					var line;
					var lines = "";
					series.forEach(function(obj){
						line = "<tr>";
						line = line + "<td style='font-size:10px'>" + obj.name + "</td>";
						line = line + "<td style='font-size:10px'>" + obj.data[0][1] + "</td>";
						line = line + "</tr>";
						lines = lines + line;
					});
					chart = chart + lines + "</table>";
					$(container).append(chart);
					$("tr:odd").addClass("odd");
					$("tr:even").addClass("even");					
				}
            }
        }		
    };

    var definition = {
        typeName: 'namevaluetable',
		displayName: 'namevaluetable',		
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		iconUrl: '/Scripts/app/editor/symbols/ext/icons/namevaluetable.png',
        visObjectType: symbolVis,
        getDefaultConfig: function() {
    	    return {
    	        DataShape: 'TimeSeries',
                DataQueryMode:  CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Interval: 400,				
    	        Height: 150,
                Width: 150
            };
        }
    };

    CS.symbolCatalog.register(definition);
})(window.PIVisualization);