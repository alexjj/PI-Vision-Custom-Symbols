(function (PV) {
  'use strict';

  function symbolVis() { }
  PV.deriveVisualizationFromBase(symbolVis);

  var definition = {
    typeName: 'dropdown-menu',
    visObjectType: symbolVis,
    datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
    getDefaultConfig: function() {
      return {
          Height: 150,
          Width: 150,
          Links: [],
          headerLink: { Name: 'Dropdown', Url: '', IsNewTab: true }
      }
    },
    configOptions: function () {
      return [{
          title: 'Format Symbol',
          mode: 'format'
      }];
    }
  };

  symbolVis.prototype.init = function(scope) {
    scope.config.AddNewLink = function() {
      scope.config.Links.push({ Name: '', Url: '', IsNewTab: true });
    }

    scope.config.deleteRow = function(index) {
      if (scope.config.Links.length > 0) {
          scope.config.Links.splice(index, 1);
      }
    }
  };

  PV.symbolCatalog.register(definition);
})(window.PIVisualization);
