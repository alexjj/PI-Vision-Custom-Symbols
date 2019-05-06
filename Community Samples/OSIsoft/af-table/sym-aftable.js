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

(function (PV) {
	'use strict';
	
	var definition = {
		typeName: 'aftable',
		displayName: 'AF Table',
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/snapshotDataTable.png',
		visObjectType: symbolVis,
		getDefaultConfig: function () {
			return {
				Height: 250,
				Width: 500,
				selectedAFServer: null,
				selectedAFDatabase: null,
				selectedAFTable: null,
				pageSize: 10
			};
		},
		configOptions: function () {
            return [{
				title: 'Format Symbol',
                mode: 'format'
            }];
		},
		inject: ['$http', '$q', '$filter']
	};
	
	function symbolVis() { }
	PV.deriveVisualizationFromBase(symbolVis);
	
	var baseUrl = PV.ClientSettings.PIWebAPIUrl.replace(/\/?$/, '/'); 

	symbolVis.prototype.init = function(scope, elem, $http, $q, $filter) {

		this.onDataUpdate = dataUpdate;
 		getAFServers();

		 function getAFServers() {
			var afServersUrl = baseUrl + 'assetservers?selectedFields=Items.Name;Items.Links.Databases';
			$http.get(afServersUrl).then(function(response) {
				scope.runtimeData.afServers = response.data.Items;
			});
		} 
		scope.config.getAFDatabases =  function() {
			var afDatabaseUrl = scope.config.selectedAFServer.Links.Databases + '?selectedFields=Items.Name;Items.Links.Tables';
			$http.get(afDatabaseUrl).then(function(response) {
				scope.runtimeData.afDatabases = response.data.Items;
			});
		}
		scope.config.getAFTables = function() {
			var afTableUrl = scope.config.selectedAFDatabase.Links.Tables + '?selectedFields=Items.Name;Items.Links.Data';
			$http.get(afTableUrl).then(function(response) {
				scope.runtimeData.afTables = response.data.Items;
			});
		}
		scope.config.getAFTableData = function() {
			var afTableDataUrl = scope.config.selectedAFTable.Links.Data;
			$http.get(afTableDataUrl).then(function(response) {
				formTable(response.data);
			});
		}

		function dataUpdate() {
			if(scope.config.selectedAFTable) {
				scope.config.getAFTableData();
			}
		}

		function formTable(data) {
			scope.columns = Object.keys(data.Columns);
			if (!angular.equals(scope.rows, data.Rows)) {			
				scope.rows = data.Rows;
			}
		}

	}
	PV.symbolCatalog.register(definition);
	
})(window.PIVisualization);