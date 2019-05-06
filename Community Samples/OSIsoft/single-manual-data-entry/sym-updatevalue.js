(function (CS) {
	var definition = {
	    typeName: 'updatevalue',
	    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
        iconUrl: '/Scripts/app/editor/symbols/ext/Icons/Reset.png',
		visObjectType: symbolVis,
	    getDefaultConfig: function() {
	    	return {
	    		DataShape: 'Value',
		        Height: 40,
		        Width: 100,
				bgColor: "#239a23",
				textColor: "#fff",
				btnWidth: "80px",
				btnHeight: "26px",
				btnText: "Update"
		    };
		},
	    configOptions: function () {
	        return [{
	            title: 'Format Symbol',
	            mode: 'format'
	        }];
	    },
        inject: ['$http']
	  
	};

	var PIWebAPIURL = CS.ClientSettings.PIWebAPIUrl.replace(/\/?$/, '/');
	
	function symbolVis() { }
	CS.deriveVisualizationFromBase(symbolVis);
	
	symbolVis.prototype.init = function (scope, elem, $http){
		
		this.onDataUpdate = onUpdate;
	    function onUpdate(data) {
	        if(data) {
	            scope.value = data.Value;
	            scope.time = data.Time;
	            if(data.Label) {
	                scope.path = data.Path;
                    scope.label = data.Label;
                    scope.config.label = data.Label;
	            }
	        }
	    }
        
        scope.updatevalue = function(){
			scope.config.loading = true;
            if(scope.symbol.DataSources.length > 0){
                 //PI WebAPI query example: https://MyServer/piwebapi/search/query?q=name:attribute1&scope=af:\\sdaf1\test\TestElement
                //scope.path format is like this: path="af:\\PISRV01\UOG Well Drilling\West Texas\Clear Fork\Rig1|Pump Pressure|tagname"
                var itemPath = scope.symbol.DataSources[0];
				
				var searchScope = _.contains(itemPath, "|") ? itemPath.split("|")[0] : itemPath;
				var elementName = _.last(searchScope.split("\\"));
				var attributeName = itemPath.split("|")[1];
				
				
			               
                
				var searchqueryUrl =encodeURI(PIWebAPIURL + "search/query?" +"q=name:*" + "&" + "scope=" + searchScope);
			
                $http.get(searchqueryUrl, {withCredentials: true}).success(function(response){
                    
					var attribute = _.findWhere((_.findWhere(response.Items, {Name: elementName})).Attributes, {Name: attributeName});
					var itemWebId = attribute.WebId;
					var type = attribute.DataType;

					var data = {};
					data["Timestamp"] = "*";
					
                    switch (type){
						case "System.DateTime":{
									var now = moment().format();
									data["Value"] = now;
									break;
								}
						case "System.String":{
							var now = moment().format("MM/DD/YYYY hh:mm:ss A");
							data["Value"] = now.toString();
							break;
						}
						
					}
					
                    var putUrl = PIWebAPIURL + "attributes/" + itemWebId + "/value";
                    $http.put(putUrl,JSON.stringify(data),{withCredentials: true}).success(function(resp){
						setTimeout(function() {
							scope.config.loading = false;
						}, 2000);
						
                    });
                     
                    
                    
                });
                     
                    
                    
                };
                
        }
        
      
	  
	  
	}	

  CS.symbolCatalog.register(definition);
})(window.Coresight);
