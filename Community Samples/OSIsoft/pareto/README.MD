
## Pareto chart symbol  


This symbol is for PI Vision version 2017 and 2017 R2.
This is just a prototype, no bad data validation or error reporting. Use it with digital type data.


<img src="https://github.com/AnnaPerry/PI-Coresight-Custom-Symbols/blob/master/Community%20Samples/OSIsoft/pareto/pareto-example.png" 
alt="Pareto Chart for PI Vision" />

## To deploy the symbol: 

1. In Windows Explorer, navigate to the "%PIHOME%\PIVision\Scripts\app\editor\symbols\ext" on your PI Vision web server; typically, it's located in "C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext".
If this folder doesn't exist, create it.

2. Place the following symbol files to the .\ext folder

	*sym-pareto-template.html*
	
	*sym-pareto.js*

3. Download amCharts Javascript library from https://www.amcharts.com/download/
   Place *serial.js* and *amcharts.js* to .\ext\libraries folder

4. Place *pareto-example.png* to the .ext\Icons\ folder (create it if it doesn't exist)
Chart Icon credit: Pareto diagram by Kirby Wu from the Noun Project
