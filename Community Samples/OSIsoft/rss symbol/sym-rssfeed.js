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

    symbolVis.prototype.init = function (scope, elem, log) {

        this.onDataUpdate = dataUpdate;

        var feedURL;  
        var container = elem.find('#container');  

        function dataUpdate(data) {  
            if(data) {  
                if(isValidURL(data.Value)) {  
                    feedURL = data.Value;  
                } else {  
                    log.add('RSS Feed', log.Severity.Error, 'Invalid URL for RSS feed (' + data.Value + ')');  
                }  

                if(data.Path) {  
                    getFeedData();  
                }  
            }  
        }  

        function getFeedData() {  
            $.ajax('https://crossorigin.me/' + feedURL).then(function(result) {  
                // create the unordered list  
                var $ul = $('<ul>').css({ height: '100%', 'overflow-y': 'scroll', 'text-align': 'left'});  

                // find and loop through each of the RSS itesm  
                var items = $(result).find('item');  
                for(var i = 0; i < items.length; i++) {  
                        var $item = $(items[i]);  
                        // create a hyper link based on the RSS item  
                        var $a = $('<a>').attr('href', $item.find('link').text()).text($item.find('title').text()).css('color', 'white');  
                        // add the link to a list item  
                        var $li = $('<li>').append($a).css('margin-bottom', '5px');  
                        // add the list item to the unordered list  
                        $ul.append($li);  
                }  
                // clear any previous links  
                container.children().remove();  
                // add the unordered list to the container  
                container.append($ul);  
            });  
        }  

        function isValidURL(url) {  
            var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;  
            return URL_REGEXP.test(url)  
        }  
    };

     var def = {  
          typeName: 'rssfeed',  
          displayName: 'RSS Feed',  
          visObjectType: symbolVis,
          datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,  
          getDefaultConfig: function() {  
               return {  
                    DataShape: 'Value',  
                    Height: 250,  
                    Width: 500  
               };  
          },   
          inject: ['log']  
     };  
 
  
     CS.symbolCatalog.register(def);  
  
})(window.PIVisualization); 