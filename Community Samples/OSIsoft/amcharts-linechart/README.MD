## Line Chart symbol

This symbol is a work in progress.

This symbol is for PI Vision version 2017.

<img src="https://github.com/AnnaPerry/PI-Coresight-Custom-Symbols/blob/master/Community%20Samples/OSIsoft/amcharts-linechart/ExampleofLineChart.png" 
alt="Line Chart for PI Coresight" />

## To deploy the symbol: 

1. In Windows Explorer, navigate to the "%PIHOME%\PIVision\Scripts\app\editor\symbols\ext" on your PI Vision web server; typically, it's located in "C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext".
If this folder doesn't exist, create it.

2. Place the following symbol files to the .\ext folder

	*sym-amcharts-linechart-template.html*
	
	*sym-amcharts-linechart-config.html*
	
	*sym-amcharts-linechart.js*

3. Place all files with *.png* extension to the .\ext\Icons directory (create if it doesn't exist)
4. Place the Underscore library (*underscore-min.js*) to the .\ext\libraries (create if doesn't exist). The latest version of Underscore can be downloaded from http://underscorejs.org/.
5. Download the amCharts JavaScript library from https://www.amcharts.com/download/ and copy *amcharts.js*, *dark.js* and *serial.js* files to the .\ext\libraries folder.
6. Run iisreset
