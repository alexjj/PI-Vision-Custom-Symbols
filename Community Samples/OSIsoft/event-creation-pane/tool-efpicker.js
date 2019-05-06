(function (PV){
"use strict";

var def = {
     typeName: "efpicker", 
     inject: ['timeProvider', '$rootScope', '$interval', 'webServices' ],
     init: init 
   } 

function init(scope,elem,timeProvider,$rootScope,$interval, webServices) {

    scope.properties = {}; 
    scope.EFTemplates = ["Questionable Data" , "Bad Data"];
	scope.properties.eventName = "Event Name"; 
	
    var piwebapiBaseUrl = PV.ClientSettings.PIWebAPIUrl +"/";

	//Get databases to populate select menu
	webServices.getDatabases().promise.success(function(response){
	//Example of returned response: 
	//   [
	//  	{Path: "af:\\AFSERVER\IoT", Name: "IoT", IsDatabase: true, CanNav: true},
	//		{Path: "af:\\AFSERVER\OSIDemo Oil and Gas Well Downtime Tracking", Name: "OSIDemo Oil and Gas Well Downtime Tracking", IsDatabase: true, CanNav: true},
	//		{Path: "pi:\\DATAARCHIVE", Name: "DATAARCHIVE", IsArchive: true, CanNav: true}
	//   ]

		if(response && response.length >= 0){
			//filtering out the PI Data Archive databases
			scope.databases = response.filter(function(item){
				if(item.hasOwnProperty('IsDatabase') && item.IsDatabase == true){
					return true;
				}else{
					return false;
				}
			});
			//this is to set the default value of the select in ui
			scope.selectedDatabase = scope.databases[0];
		}
		
	});
	
	scope.$watch( function(){
		return timeProvider.displayTime.start;
	}, function (newStartTime){
		 scope.properties.startTime = newStartTime;
	})
    
	scope.$watch( function(){
		return timeProvider.displayTime.end;
	}, function (newEndTime){
		 scope.properties.endTime = newEndTime;
	})
	
	
	
	scope.createEF = function(selectedDatabase, start, end, template, name) {
		console.log("Creating event frame");
		
		var jsonData = {
			"Name": name,
			"Description": "Test Description",
	        "TemplateName": template,
			"StartTime": start,
			"EndTime": end
		};
		
		console.log(jsonData);
		
		var batchRequest = {
			"getAFDatabase": {
				"Method": "GET",
				"Resource": piwebapiBaseUrl + "assetdatabases?path=" + selectedDatabase.Path.substr(3)
			},
			"createEventFrame":{
				"Method": "POST",
				"Content": JSON.stringify(jsonData),
				"Resource": "$.getAFDatabase.Content.Links.EventFrames",
				"ParentIds": ["getAFDatabase"]
				
			}
			
		}
		
		$.ajax({
			url: piwebapiBaseUrl + "batch",
			type: "POST",
			xhrFields: {
				withCredentials: true
			},
			data: JSON.stringify(batchRequest),
			//headers:{'Content-Type':'application/json'},
			contentType: 'application/json'
			//dataType:"text",
			//processData:"false"
		});
	
	
	};
	
  
}

PV.toolCatalog.register(def); 

})(window.PIVisualization)