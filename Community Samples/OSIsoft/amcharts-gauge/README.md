Follow these simple instructions to install this custom symbol; the overall process should only take a minutes.

1. In Windows Explorer, navigate to the "PIPC\PIVision" installation folder on your PI Vision server; typically, it's located in "C:\Program Files\PIPC\PIVision"

2. From within the folder named "PIVision", navigate to the "\Scripts\app\editor\symbols" sub-folder.  

3. Within the folder named "symbols", if there is not already a folder called "ext", create a folder called "ext".  

4. If this a symbol that uses the amCharts library (if so, the symbol will contain "amcharts" in the name), download the amcharts JavaScript Charts library zip file from https://www.amcharts.com/download/.  Now that the "ext" folder exists, or already exits, extract the contents of the .ZIP file that you just downloaded into the "ext" folder.  The "ext" folder should now contain folders for "images", "lang", "patterns", "plugins", and "themes", and you should have just pasted in the following .js files: amcharts.js, funnel.js, gauge.js, pie.js, radar.js, serial.js, and xy.js.

5. Now that the "ext" folder exists, or already exits, open it, and paste into the "ext" folder the one .js and two .html files contained in the custom symbol .ZIP folder that you were sent.

6. Within the folder named "ext", if there is not already a folder called "Icons", create a folder called "Icons".  

7. Now that the "Icons" folder exists, or already exits, open it, and paste into the "Icons" folder the one .png image file contained in the custom symbol .ZIP folder that you were sent.

The next time you open a web browser and navigate to PI Vision and create a new PI Vision display, you will see this new symbol appear in the top-left-hand corner of the PI Vision display editor.