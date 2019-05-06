# Liquid Gauge / d3

The following example is used to create a PI Vision symbol that uses [d3.js](http://d3js.org/). The actual implementation of the gauge comes from [D3 Liquid Fill Gauge](http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6). These instructions build off the [Simple Value Symbol Instructions](/tutorials/simplevalue/), so please review those first.

1. Create a new file called `sym-liquidgauge.js` in your PI Vision installation folder, `INSTALLATION_FOLDER\Scripts\app\editor\symbols\ext`. If the `ext` folder does not exist, create it.
1. Below is the basic skeleton of a new PI Vision symbol for a liquid gauge. It sets up the `typeName`, `datasourceBehavior`, and `getDefaultConfig` definition options and registers them with the PI Vision application. For the `DataShape`, we are using a gauge shape, which will provide us with some additional, gauge specific, properties that value symbol does not have, mainly Indicator.

    ```javascript
    (function (CS) {
        'use strict';

        function symbolVis() { }
        CS.deriveVisualizationFromBase(symbolVis);

	    var defintion = {
	    	typeName: 'liquidgauge',
	    	datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
            visObjectType: symbolVis,
	    	getDefaultConfig: function() {
	    		return {
	    		    DataShape: 'Gauge',
	                Height: 150,
	                Width: 150
	            };
	    	}
	    };
	    CS.symbolCatalog.register(defintion);
    })(window.PIVisualization);
    ```

1. The next step is to create the HTML template for this symbol. The liquid gauge that we will be using requires a `svg` tag to attach to. So we will create a HTML file in the same directory as our Javascript file and name it `sym-liquidgauge-template.html`. 

    ```html
    <div>
    	<svg style="position: absolute; height:100%; width:100%; top:0; left:0; overflow: visible"></svg>
	</div>
    ```

1. Now we need to initialize the gauge symbol. We will add an `init` to the definition object and define the `init` function. The `init` function will have stubs for data updates and resizing events. The resize function is called by the PI Vision infrastructure anytime the symbol is resized. The resize function is passed the new width and height of the symbol.

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
	    	typeName: 'liquidgauge',
	    	datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
            visObjectType: symbolVis,
	    	getDefaultConfig: function() {
	    		return {
	    		    DataShape: 'Gauge',
	                Height: 150,
	                Width: 150
	            };
	    	}
	    };

	    CS.symbolCatalog.register(defintion);
	})(window.PIVisualization);
    ```
1. Next we must include the d3.js library so that our symbol can use it. This code comes from [d3.js](https://github.com/d3/d3/tree/v3.5.17). Copy d3.js from this GitHub repository and place it into INSTALLATION_FOLDER\Scripts\app\editor\symbols\ext\libraries. This will make d3 available to PI Vision symbols.

1. Next we must include the d3 code for creating the liquid gauge. This code comes unchanged from [D3 Liquid Fill Gauge](http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6) and should be pasted below the `CS.symbolCatalog.register(defintion);` call. It is included below for ease of use, but will be omitted in the following steps.

	```javascript
	/*!
	 * @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
	 * Copyright (c) 2015, Curtis Bratton
	 * All rights reserved.
	 *
	 * Liquid Fill Gauge v1.1
	 */
    function liquidFillGaugeDefaultSettings() {
        return {
            minValue: 0, // The gauge minimum value.
            maxValue: 100, // The gauge maximum value.
            circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
            circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
            circleColor: "#178BCA", // The color of the outer circle.
            waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
            waveCount: 1, // The number of full waves per width of the wave circle.
            waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
            waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
            waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
            waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
            waveAnimate: true, // Controls if the wave scrolls or is static.
            waveColor: "#178BCA", // The color of the fill wave.
            waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
            textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
            textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
            valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
            displayPercent: true, // If true, a % symbol is displayed after the value.
            textColor: "#045681", // The color of the value text when the wave does not overlap it.
            waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
        };
    }

    function loadLiquidFillGauge(elementId, value, config) {
        if (config == null) config = liquidFillGaugeDefaultSettings();

        var gauge = d3.select("#" + elementId);
        //var gauge = d3.select(elementId);
        var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height"))) / 2;
        var locationX = parseInt(gauge.style("width")) / 2 - radius;
        var locationY = parseInt(gauge.style("height")) / 2 - radius;
        var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

        var waveHeightScale;
        if (config.waveHeightScaling) {
            waveHeightScale = d3.scale.linear()
                .range([0, config.waveHeight, 0])
                .domain([0, 50, 100]);
        } else {
            waveHeightScale = d3.scale.linear()
                .range([config.waveHeight, config.waveHeight])
                .domain([0, 100]);
        }

        var textPixels = (config.textSize * radius / 2);
        var textFinalValue = parseFloat(value).toFixed(2);
        var textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
        var percentText = config.displayPercent ? "%" : "";
        var circleThickness = config.circleThickness * radius;
        var circleFillGap = config.circleFillGap * radius;
        var fillCircleMargin = circleThickness + circleFillGap;
        var fillCircleRadius = radius - fillCircleMargin;
        var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

        var waveLength = fillCircleRadius * 2 / config.waveCount;
        var waveClipCount = 1 + config.waveCount;
        var waveClipWidth = waveLength * waveClipCount;

        // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
        var textRounder = function (value) { return Math.round(value); };
        if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
            textRounder = function (value) { return parseFloat(value).toFixed(1); };
        }
        if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
            textRounder = function (value) { return parseFloat(value).toFixed(2); };
        }

        // Data for building the clip wave area.
        var data = [];
        for (var i = 0; i <= 40 * waveClipCount; i++) {
            data.push({ x: i / (40 * waveClipCount), y: (i / (40)) });
        }

        // Scales for drawing the outer circle.
        var gaugeCircleX = d3.scale.linear().range([0, 2 * Math.PI]).domain([0, 1]);
        var gaugeCircleY = d3.scale.linear().range([0, radius]).domain([0, radius]);

        // Scales for controlling the size of the clipping path.
        var waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
        var waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

        // Scales for controlling the position of the clipping path.
        var waveRiseScale = d3.scale.linear()
            // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
            // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
            // circle at 100%.
            .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
            .domain([0, 1]);
        var waveAnimateScale = d3.scale.linear()
            .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
            .domain([0, 1]);

        // Scale for controlling the position of the text within the gauge.
        var textRiseScaleY = d3.scale.linear()
            .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
            .domain([0, 1]);

        // Center the gauge within the parent SVG.
        var gaugeGroup = gauge.append("g")
            .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

        // Draw the outer circle.
        var gaugeCircleArc = d3.svg.arc()
            .startAngle(gaugeCircleX(0))
            .endAngle(gaugeCircleX(1))
            .outerRadius(gaugeCircleY(radius))
            .innerRadius(gaugeCircleY(radius - circleThickness));
        gaugeGroup.append("path")
            .attr("d", gaugeCircleArc)
            .style("fill", config.circleColor)
            .attr('transform', 'translate(' + radius + ',' + radius + ')');

        // Text where the wave does not overlap.
        var text1 = gaugeGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.textColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

        // The clipping wave area.
        var clipArea = d3.svg.area()
            .x(function (d) { return waveScaleX(d.x); })
            .y0(function (d) { return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)); })
            .y1(function (d) { return (fillCircleRadius * 2 + waveHeight); });
        var waveGroup = gaugeGroup.append("defs")
            .append("clipPath")
            .attr("id", "clipWave" + elementId);
        var wave = waveGroup.append("path")
            .datum(data)
            .attr("d", clipArea)
            .attr("T", 0);

        // The inner circle with the clipping wave attached.
        var fillCircleGroup = gaugeGroup.append("g")
            .attr("clip-path", "url(#clipWave" + elementId + ")");
        fillCircleGroup.append("circle")
            .attr("cx", radius)
            .attr("cy", radius)
            .attr("r", fillCircleRadius)
            .style("fill", config.waveColor);

        // Text where the wave does overlap.
        var text2 = fillCircleGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.waveTextColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

        // Make the value count up.
        if (config.valueCountUp) {
            var textTween = function () {
                var i = d3.interpolate(this.textContent, textFinalValue);
                return function (t) { this.textContent = textRounder(i(t)) + percentText; }
            };
            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
        }

        // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
        var waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
        if (config.waveRise) {
            waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')')
                .transition()
                .duration(config.waveRiseTime)
                .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')')
                .each("start", function () { wave.attr('transform', 'translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
        } else {
            waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');
        }

        if (config.waveAnimate) animateWave();

        function animateWave() {
            wave.attr('transform', 'translate(' + waveAnimateScale(wave.attr('T')) + ',0)');
            wave.transition()
                .duration(config.waveAnimateTime * (1 - wave.attr('T')))
                .ease('linear')
                .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
                .attr('T', 1)
                .each('end', function () {
                    wave.attr('T', 0);
                    animateWave(config.waveAnimateTime);
                });
        }

        function GaugeUpdater() {
            this.update = function (value) {
                var newFinalValue = parseFloat(value).toFixed(2);
                var textRounderUpdater = function (value) { return Math.round(value); };
                if (parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))) {
                    textRounderUpdater = function (value) { return parseFloat(value).toFixed(1); };
                }
                if (parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))) {
                    textRounderUpdater = function (value) { return parseFloat(value).toFixed(2); };
                }

                var textTween = function () {
                    var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                    return function (t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
                };

                text1.transition()
                    .duration(config.waveRiseTime)
                    .tween("text", textTween);
                text2.transition()
                    .duration(config.waveRiseTime)
                    .tween("text", textTween);

                var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
                var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
                var waveRiseScale = d3.scale.linear()
                    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
                    // circle at 100%.
                    .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
                    .domain([0, 1]);
                var newHeight = waveRiseScale(fillPercent);
                var waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
                var waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);
                var newClipArea;
                if (config.waveHeightScaling) {
                    newClipArea = d3.svg.area()
                        .x(function (d) { return waveScaleX(d.x); })
                        .y0(function (d) { return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)); })
                        .y1(function (d) { return (fillCircleRadius * 2 + waveHeight); });
                } else {
                    newClipArea = clipArea;
                }

                var newWavePosition = config.waveAnimate ? waveAnimateScale(1) : 0;
                wave.transition()
                    .duration(0)
                    .transition()
                    .duration(config.waveAnimate ? (config.waveAnimateTime * (1 - wave.attr('T'))) : (config.waveRiseTime))
                    .ease('linear')
                    .attr('d', newClipArea)
                    .attr('transform', 'translate(' + newWavePosition + ',0)')
                    .attr('T', '1')
                    .each("end", function () {
                        if (config.waveAnimate) {
                            wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
                            animateWave(config.waveAnimateTime);
                        }
                    });
                waveGroup.transition()
                    .duration(config.waveRiseTime)
                    .attr('transform', 'translate(' + waveGroupXPosition + ',' + newHeight + ')')
            }
        }

        return new GaugeUpdater();
    }
	```

1. In the `init` function, we can now begin to define the gauge. The liquid gauge implementation listed above created a gauge based on a HTML id, a default value, and a gauge configuration. To begin with, we will just use the default gauge configuration, `liquidFillGaugeDefaultSettings`. After that, we need to give the `svg` element a unique id and then create the gauge using `loadLiquidFillGauge`. Below we are using JavaScript to create a unique id for the `svg` element and passing that into the `loadLiquidFillGauge` function.

	```javascript
    symbolVis.prototype.init = function(scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onResize = resize;

        var config = liquidFillGaugeDefaultSettings();

        var svg = elem.find('svg')[0];
        var id = 'liquid_' + Math.random().toString(36).substr(2, 16);
        svg.id = id;
        var gauge = loadLiquidFillGauge(id, 0, config)

        function dataUpdate(data) {

        }

        function resize(width, height) {

        }
    };
    ```

1. The next step is to hook the data updates to the gauge symbols `update` method. Here we are using the `Indicator` property on the data that is passed into the `dataUpdate` function. The Indicator property represents the current value as a percentage of Max - Min, between 0 and 100.

	```javascript
    symbolVis.prototype.init = function(scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onResize = resize;

        var config = liquidFillGaugeDefaultSettings();

        var svg = elem.find('svg')[0];
        var id = 'liquid_' + Math.random().toString(36).substr(2, 16);
        svg.id = id;
        var gauge = loadLiquidFillGauge(id, 0, config)

        function dataUpdate(data) {
            if (data) {
                gauge.update(data.Indicator);
            }
        }

        function resize(width, height) {

        }
    };
    ```

1. We now have a working gauge, but it does not resize properly. To do this, we will fill in the `resize` function and scale the `svg` element to fit the new area.
1. First update the template to include a, soon to be added, scale factor. Here we are using an [SVG transform](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform) to scale the entire symbol. This is used as part of an AngularJS binding using the ng-attr- syntax.

    ```html
    <div>
    	<svg style="position: absolute; height:100%; width:100%; top:0; left:0; overflow: visible" ng-attr-transform="scale({{scale}})"></svg>
	</div>
    ```

1. The implementation for the scale will be in init function to set the initial scale and then the resize function to update the scale as the size of the symbol changes. In `init`, we will default to a scale of 1. On every resize, we will recompute the scale, delete the symbol, and they re-add it.

	```javascript
    symbolVis.prototype.init = function(scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onResize = resize;

        scope.scale = 1;

        var config = liquidFillGaugeDefaultSettings();

        var svg = elem.find('svg')[0];
        var id = 'liquid_' + Math.random().toString(36).substr(2, 16);
        svg.id = id;
        var gauge = loadLiquidFillGauge(id, 0, config)

        function dataUpdate(data) {
            if (data) {
                gauge.update(data.Indicator);
            }
        }

        function resize(width, height) {
            scope.scale = Math.min(width / 150, height / 150);
            d3.select('#' + id).selectAll('*').remove();
            gauge = loadLiquidFillGauge(id, 0, config);
        }
    };
    ```

1. One thing to notice at this point is, while resizing is working, it will only fill in the data at the next update. This is because when we recreate the gauge, we are initilaizing it with 0 for a value. To fix this, we can cache the last value of the indicator and use that during the resizing process.

    ```javascript
    symbolVis.prototype.init = function(scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onResize = resize;

        scope.scale = 1;

        var config = liquidFillGaugeDefaultSettings();

        var svg = elem.find('svg')[0];
        var id = 'liquid_' + Math.random().toString(36).substr(2, 16);
        svg.id = id;
        var gauge = loadLiquidFillGauge(id, 0, config)

        var cachedIndicator = 0;
        function dataUpdate(data) {
            if (data) {
                gauge.update(data.Indicator);
                cachedIndicator = data.Indicator;
            }
        }

        function resize(width, height) {
            scope.scale = Math.min(width / 150, height / 150);
            d3.select('#' + id).selectAll('*').remove();
            gauge = loadLiquidFillGauge(id, cachedIndicator, config);
        }
    };
    ```