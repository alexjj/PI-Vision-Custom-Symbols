## AF Table symbol  

This symbol prototype is for PI Vision version 2017.


## To deploy the symbol: 

1. In Windows Explorer, navigate to the "%PIHOME%\PIVision\Scripts\app\editor\symbols\ext" on your PI Vision web server; typically, it's located in "C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext".
If this folder doesn't exist, create it.

2. Place the following symbol files to the .\ext folder

	*sym-aftable-template.html*
	
	*sym-aftable-config.html*
	
	*sym-aftable.js*

3. Download the [smart table js library](http://lorenzofox3.github.io/smart-table-website/#top) and place it under ext\libraries
4. Place bootstrap.css and place it to ext\libraries
5. Create subfolders under the PIVision directory: PIPC\PIVision\template\smart-table 
   Place *pagination.html* into this directory
6. Edit \PIPC\PIVision\Scripts\app\editor\PIVisualization.app.js to inject smart-table into the angular app module:

   `angular.module(APPNAME, ['ngAnimate', 'ngSanitize', 'Chronicle', 'osi.PiToast', 'PIVisualization.routing', 'kendo.directives', 'smart-table'])`


## A word about requirements

### Client side configuration
This symbol uses PI Web API to send data to the PI System.

This means that if you use a self-signed certificate for PI Web API, each client machine needs to install that certificate. 
Here is a video on how to install certificates for PI Web API: https://www.youtube.com/watch?list=PLMcG1Hs2JbcvGH0VCE4o-CjjaUkTiW5_D&v=KvYsF5MMQMU#t=04m18s

### Server side configuration
And since the PI Web API requests are made from within PI Vision server, you may (read: definitely will) run into CORS issues.
I found the following video helpful when trying get CORS working without having to throw my server security wide open
 (i.e. without CorsHeaders=\*, CorsMethods=\* and CorsOrigins=*): https://www.youtube.com/watch?v=EyxieRFRPRw&index=10&list=PLMcG1Hs2JbcvGH0VCE4o-CjjaUkTiW5_D

