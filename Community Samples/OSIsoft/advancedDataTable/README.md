Follow these simple instructions to install this custom symbol; the overall process should only take a few minutes.

First, download the custom symbols ZIP file from here:

	https://github.com/osisoft/PI-Coresight-Custom-Symbols

On that web page, click the "Clone or download" link, and download the .ZIP file containing custom symbols.  Extract that .ZIP file that you downloaded, and within the extracted folder, navigate to the "Community Samples\OSIsoft\" sub-folder.  In here, look for the specific sub-folder for this particular custom symbol, which in this case is named "advancedDataTable".

To install this custom symbol you'll need access to your PI Vision server.  On that PI Vision server:

1. In Windows Explorer, navigate to the "PIPC\PIVision" installation folder on your PI Vision server; typically, it's located in "C:\Program Files\PIPC\PIVision"

2. Inside the "PIVision" folder, create a new folder called "Datatables".  From the files for this custom symbol, take the Datatables.zip file extract it into the "PIPC\PIVision\Datatables" folder that you just created; when the extraction is complete, inside the "Datatables" folder you should see several sub-folders, .css, and .js files (this will allow you to properly reference the free Datatables library that will be used to power this custom symbol).

3. Next, from within the folder named "PIVision", navigate to the "\Scripts\app\editor\symbols" sub-folder.  

4. Within the folder named "symbols", if there is not already a folder called "ext", create a folder called "ext".  

5. Now that the "ext" folder exists, or already exits, open it, and paste into the "ext" folder these four files:

	sym-advancedTimeSeriesDataTable.js
	advancedTimeSeriesDataTable.png
	sym-advancedTimeSeriesDataTable-config.html
	sym-advancedTimeSeriesDataTable-template.html files

The next time you open a web browser and navigate to PI Vision and create a new PI Vision display, you will see this new symbol appear as a new icon (using the .png image that was provided) in the top-left-hand corner of the PI Vision display editor.