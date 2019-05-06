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

(function (CS) {
    'use strict';

    function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);

    symbolVis.prototype.init = function(scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onResize = resize;

        var container = elem.find('#container')[0];
        var id = 'timeseries_' + Math.random().toString(36).substr(2, 16);
        container.id = id;

        function convertToChartData(data) {
            var series = [];
            data.Data.forEach(function(item) {
                var t = {};
                t.name = item.Label;
                t.data = item.Values.map(function(obj) {
                    var date = new Date(obj.Time);
                    // please note, Number(obj.Value) will only work with numbers with . as the decimal separator
                    return [Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()), Number(obj.Value)];
                });
                series.push(t);
            });

            return series;            
        }

        var chart;
        function dataUpdate(data) {
            if(data) {
                var series = convertToChartData(data);
                if(!chart) {
                    chart = new Highcharts.Chart({
                        chart: {
                            type: 'spline',
                            renderTo: id
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: { // don't display the dummy year
                                month: '%e. %b',
                                year: '%b'
                            },
                            title: {
                                text: 'Date'
                            }
                        },
                        plotOptions: {
                            spline: {
                                marker: {
                                    enabled: true
                                }
                            }
                        },
                        series: series
                    });
                } else {
                    series.forEach(function(item, index) {
                        if(chart.series[index]) {
                            chart.series[index].setData(item.data);
                        } else {
                            chart.addSeries(item);
                        }
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
    
    var defintion = {
        typeName: 'timeserieschart',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode:  CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Interval: 400,
                Height: 200,
                Width: 400
            };
        }
    };
    CS.symbolCatalog.register(defintion);
})(window.PIVisualization);