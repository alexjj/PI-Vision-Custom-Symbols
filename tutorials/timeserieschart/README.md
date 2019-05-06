# Time Series Chart / Highcharts

The following example is used to create a PI Vision symbol that uses [Highcharts](http://www.highcharts.com/). These instructions build off the [Simple Value Symbol Instructions](/tutorials/simplevalue/), so please review those first.

1. Create a new file called sym-timeserieschart.js in your PI Vision installation folder, `INSTALLATION_FOLDER\Scripts\app\editor\symbols\ext`. If the `ext` folder does not exist, create it.
1. Below is the basic skeleton of a new PI Vision symbol for the time series chart. It sets up the `typeName`, `datasourceBehavior`, and `getDefaultConfig` definition options and registers them with the PI Vision application. For the `DataShape`, we are using a TimeSeries shape, which will provide us with raw time series data that the chart will use. We are also specifying the `DataQueryMode` to be `ModePlotValues`. This will return data suitable for plotting over a specified number of intervals.

    ```javascript
    (function (CS) {
        'use strict';

        function symbolVis() { }
        CS.deriveVisualizationFromBase(symbolVis);

        var defintion = {
            typeName: 'timeserieschart',
            datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
            visObjectType: symbolVis,
            getDefaultConfig: function() {
                return {
                    DataShape: 'TimeSeries',
                    DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                    Interval: 400,
                    Height: 200,
                    Width: 400
                };
            }
        };
        CS.symbolCatalog.register(defintion);
    })(window.PIVisualization);
    ```

1. The next step is to create the HTML template for this symbol. The chart that we will be using only needs a `div` tag to attach to. So we will create a HTML file in the same directory as our JavaScript file and name it `sym-timeserieschart-template.html`. We are setting the height and width of this `div` to take up the full space available.

    ```html
    <div id="container" style="width:100%;height:100%"></div>
    ```

1. Now we need to initialize the symbol. We will add an `init` to the symbol's prototype and define the `init` function. The `init` function will have stubs for data updates and resizing events. The resize function is called by the PI Vision infrastructure anytime the symbol is resized. The resize function is passed the new width and height of the symbol.

    ```javascript
    (function (CS) {
        'use strict';

        function symbolVis() { }
        CS.deriveVisualizationFromBase(symbolVis);

        symbolVis.prototype.init = function(scope, elem) {
            this.onDataUpdate = dataUpdate;
            this.onResize = resize;

            function dataUpdate(data) {
            }
            
            function resize(width, height) {
            }

        };

        var defintion = {
            typeName: 'timeserieschart',
            datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
            visObjectType: symbolVis,
            getDefaultConfig: function() {
                return {
                    DataShape: 'TimeSeries',
                    DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                    Interval: 400,
                    Height: 200,
                    Width: 400
                };
            }
        };
        CS.symbolCatalog.register(defintion);
    })(window.PIVisualization);
    ```

1. Next we must include the HighCharts library so that our symbol can use it. This code comes from [Highcharts 4.2.3](http://code.highcharts.com/zips/Highcharts-4.2.3.zip). Extract the files from the zip and place highcharts.js into `INSTALLATION_FOLDER\Scripts\app\editor\symbols\ext\libraries`. This will make Highcharts available to PI Vision symbols.

1. In the `init` function, we can now begin to define the chart. Highcharts expects to be passed an HTML selector to create the chart. We need to give the `div` element a unique id and then create the chart. Below we are using JavaScript to create a unique id for the `div` element.

    ```javascript
    symbolVis.prototype.init = function(scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onResize = resize;

        var container = elem.find('#container')[0];
        var id = 'timeseries_' + Math.random().toString(36).substr(2, 16);
        container.id = id;

        function dataUpdate(data) {
        }
        
        function resize(width, height) {
        }

    };
    ```

1. Next we want take the data that is passed to the PI Vision dataUpdate function and convert this to a format that the chart is expected. 

    ```javascript
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
    ```

1. Now we want to use this convert function in the dataUpdate. We add this function to `init` and we create the cache `chart` variable for creating the chart. On the first update, `chart` will not be defined, so we must create the chart.

    ```javascript
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
                }
            }
        }
        
        function resize(width, height) {
        }

    };
    ```

1. Now we have the initial creation of the chart, we must handle subsequent updates. This will happen in data update, when the `chart` variable is already defined. For this, we need to add an else condition to `if(!chart)`. Here we will loop through each entry in the series and update the data if it exist, or add it if it does not.

    ```javascript
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
    ```

1. Lastly, we want to handle resizing the chart appropriately. To do this, we need to use Highcharts setSize method.

    ```javascript
    function resize(width, height) {
        if(chart) {
            chart.setSize(width, height);
        }
    }
    ```

1. Below is the full version of the implementation file.

    ```javascript
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
    ```