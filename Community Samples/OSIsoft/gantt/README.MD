## Gantt symbol  


This symbol is for PI Vision version 2017 and 2017 R2.
Warning! This is just a prototype, no bad data validation or error reporting. Use it with digital type data.


<img src="https://github.com/AnnaPerry/PI-Coresight-Custom-Symbols/blob/master/Community%20Samples/OSIsoft/gantt/gantt-example.png" 
alt="Gantt Chart for PI Vision" />

## To deploy the symbol: 

1. In Windows Explorer, navigate to the "%PIHOME%\PIVision\Scripts\app\editor\symbols\ext" on your PI Vision web server; typically, it's located in "C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext".
If this folder doesn't exist, create it.

2. Place the following symbol files to the .\ext folder

	*sym-gantt-template.html*
	
	*sym-gantt-config.html*
	
	*sym-gantt.js*

3. Download amCharts Javascript library from https://www.amcharts.com/download/
   Place *serial.js*, *gantt.js* and *amcharts.js* to .\ext\libraries folder
   Rename gantt.js to z_gantt.js. Here is why:  
   To work properly AmCharts libraries need to be loaded in this specific order: amcharts.js, serial.js and then gantt.js
   Since third-party libraries in PI Vision are loaded (automatically) *in alphabetical order*, gantt.js sneaks its way in before serial.js. 
   This results in console error "Cannot read property "construct" of undefined".
   
