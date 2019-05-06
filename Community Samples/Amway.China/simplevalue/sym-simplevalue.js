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

	symbolVis.prototype.init = function (scope) {
        this.onDataUpdate = dataUpdate;

        function dataUpdate(data) {
            if(data) {
                scope.value = data.Value;
            }
        }
    };

    var definition = {
        typeName: 'simplevalue',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		iconUrl: '/Scripts/app/editor/symbols/ext/icons/simplevalue.png',		
        visObjectType: symbolVis,
        getDefaultConfig: function() {
    	    return {
    	        DataShape: 'Value',
    	        Height: 150,
                Width: 150,
                TextColor: 'rgb(0,0,0)'
            };
        },
        configTitle: 'Format Symbol',
        StateVariables: [ 'MultistateColor' ]
    };

    CS.symbolCatalog.register(definition);
})(window.PIVisualization);