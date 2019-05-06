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
  
   var def = {  
      typeName: 'playback',  
      displayName: 'Playback',  
      iconUrl: 'Images/chrome.custom_addin_crossed_tools.svg',  
      inject: [ 'timeProvider', '$interval' ],  
      init: init  
   };    
  
   function init(scope, elem, timeProvider, $interval) {  
  
      scope.options = {  
         numberOfIncrements: 24,  
         increaseIncrementTime: '+1h',  
         incrementTimer: 500  
      };  
  
      scope.isRunning = false;  
  
      // create a variable to hold the return value from $interval for canceling  
      var intervalTimer;  
      scope.start = function() {  
         scope.isRunning = true;  
  
         // call the $interval function with a function that will be executed each time the timer is called  
         // the next 2 parameters are how often it should run the function and how many times it should run the function  
         intervalTimer = $interval(function(count) {  
            timeProvider.requestNewTime(  
               timeProvider.displayTime.start + scope.options.increaseIncrementTime,   
               timeProvider.displayTime.end + scope.options.increaseIncrementTime,  
               true);  
  
            // if we are on the last increment, flip the isRunning flags  
            if(count === scope.options.numberOfIncrements) {  
                 scope.isRunning = false;  
            }  
         }, scope.options.incrementTimer, scope.options.numberOfIncrements);  
      };  
  
      scope.stop = function() {  
         // when stop is pressed cancel the interval timer  
         $interval.cancel(intervalTimer);  
         scope.isRunning = false;  
      };    
   }  
  
   CS.toolCatalog.register(def);    
    
})(window.PIVisualization);   