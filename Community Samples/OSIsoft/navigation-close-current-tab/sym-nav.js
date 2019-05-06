(function (PV) {
  "use strict";

  function symbolVis() { };
  PV.deriveVisualizationFromBase(symbolVis);

  var definition = { 
     typeName: "nav",
     visObjectType: symbolVis,
     datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
     getDefaultConfig: function(){ 
         return { 
                Height: 150,
                Width: 150,
				Text: "Text",
				BackgroundColor: "",
				TextColor: "#FFFFFF"
				
         } 
     } ,
	 configOptions: function(){
		 return [{
			 title:"Format",
			 mode: "format"
			 
		 }]
	 }
  }
	
  symbolVis.prototype.init = function(scope, elem) {
		
		scope.closeCurrentTab = function(){
			window.close();
			
		}
  };
   
  PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
