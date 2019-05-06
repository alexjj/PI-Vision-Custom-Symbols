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
        var id = 'statuslight_' + Math.random().toString(36).substr(2, 16);
        container.id = id;
		
        function convertToChartData(data) {
			return eval(data.Value);
		}		
		var chart;
		var redMin = scope.config.RedMin == undefined ? 10 : parseInt(scope.config.RedMin);
		var redMax = scope.config.RedMin == undefined ? 30 : parseInt(scope.config.RedMax); 
		var yellowMin = scope.config.RedMin == undefined ? 5 : parseInt(scope.config.YellowMin); 
		var yellowMax = scope.config.RedMin == undefined ? 10 : parseInt(scope.config.YellowMax); 
		var greenMin = scope.config.RedMin == undefined ? -1 : parseInt(scope.config.GreenMin);
		var greenMax = scope.config.RedMin == undefined ? 5 : parseInt(scope.config.GreenMax); 
		var whiteMin = scope.config.RedMin == undefined ? -2 : parseInt(scope.config.WhiteMin); 
		var whiteMax = scope.config.RedMin == undefined ? -1 : parseInt(scope.config.WhiteMax);
		var selectlight;
		var dataValue;
		var olddata=9999;
		var splintlightid = 'splintlight_' + Math.random().toString(36).substr(2, 16);
		var $splintlights = $("img[id^='splintlight_']");	
		$splintlights.stop(true,true);	
        function dataUpdate(data) {			
			//console.log(data);
            if(data) {
				dataValue = parseInt(data.Value);
				//console.log(dataValue);
                if(olddata!=dataValue) {
					selectlight = "<img id='"+splintlightid+"' src='../PIVision/Scripts/app/editor/symbols/ext/imgs/white.png' alt='white' style='width:40px;height:40px' />";
					if(dataValue > redMax)
						selectlight = "<img id='"+splintlightid+"' src='../PIVision/Scripts/app/editor/symbols/ext/imgs/white.png' alt='white' style='width:40px;height:40px' />";					
					if(dataValue > redMin && dataValue <= redMax)
						selectlight = "<img id='"+splintlightid+"' src='../PIVision/Scripts/app/editor/symbols/ext/imgs/red.png' alt='red' style='width:40px;height:40px' />";
					if(dataValue > yellowMin && dataValue <=yellowMax)
						selectlight = "<img id='"+splintlightid+"' src='../PIVision/Scripts/app/editor/symbols/ext/imgs/yellow.png' alt='yellow' style='width:40px;height:40px' />";;
					if(dataValue > greenMin && dataValue <=greenMax)
						selectlight = "<img id='"+splintlightid+"' src='../PIVision/Scripts/app/editor/symbols/ext/imgs/green.png' alt='green' style='width:40px;height:40px' />";
					if(dataValue <= whiteMax)
						selectlight = "<img id='"+splintlightid+"' src='../PIVision/Scripts/app/editor/symbols/ext/imgs/white.png' alt='white' style='width:40px;height:40px' />";
					$(container).children().remove();
					$(container).append(selectlight);
					olddata = dataValue;
					function splint() {	
						var $splintlight = $("#"+splintlightid+"");						
						if (!$splintlight.is(":animated")) {
							if ($splintlight[0].width <= 10) $splintlight.animate({ width: "40px", height: "40px" }, 5000, function () { splint(); });
							else $splintlight.animate({ width: "10px", height: "10px" }, 5000, function () { splint(); });
						}
					}
					var $splintlights1 = $("img[id^='splintlight_']");	
					$splintlights1.stop(true,true);	
					splint();					
				}
            }
        }	
    };

    var definition = {
        typeName: 'statuslight',
		displayName: 'status light',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		iconUrl: '/Scripts/app/editor/symbols/ext/icons/green.png',
        visObjectType: symbolVis,
        getDefaultConfig: function() {
    	    return {
    	        DataShape: 'Value',
    	        Height: 150,
                Width: 150
            };
        },
        configOptions: function () {
            return [{
				title: 'Format Symbol',
                mode: 'format'
            }];
        },		
    };

    CS.symbolCatalog.register(definition);
})(window.PIVisualization);