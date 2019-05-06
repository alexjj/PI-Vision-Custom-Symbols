# Image URL Custom Symbol

## Description

This custom symbol allows to display images located on a web server with their URLs stored into a PI tag. The use case is for screenshots of an asset related to other sensor data, allowing to see what what going at that time in case something special or abnormal occured. 

## Configuration

This custom symbol supports two operating modes: tag with full images URL or or tag with filename-only  

### Mode 1: URLs in tag 

In this case, a full URL of the image is stored in the tag. For example http://www.osisoft.com/uploadedImages/Content_(New)/Home/demand-gen-box-it-ot-gap-370x246.jpg. This is the default mode. 

### Mode 2: Filenames in tag

In this case, only a filename is stored in the tag. For example `demand-gen-box-it-ot-gap-370x246.jpg`. The use case is for when screenshots are saved but no webserver is available at the time and/or if it can change over time. 

To enable this mode: 
  * Right-click anywhere on your Image URL custom symbol and select `Format Symbol...`
  * Put the URL prefix to use with the tag filename into the `URL Prefix:` text box
  * Select the `Enable URL` checkbox to make it effective
  
From now on, the image shown in the custom symbol would come from the URL made from the concatenation of the `URL Prefix` and the tag filename value. 

### NOTE: No data tag

When a string tag has no data or if the PIPC\PIVision time window is set to a point before any data was sent to the tag, OSIsoft logo is used as a fill-in image.    

## Custom Symbol Installation 

Follow these simple instructions to install this custom symbol; the overall process should only take a minutes.

1. In Windows Explorer, navigate to the "PIPC\PIVision" installation folder on your PI Vision server; typically, it's located in "C:\Program Files\PIPC\PIVision"

2. From within the folder named "PIVision", navigate to the "\Scripts\app\editor\symbols" sub-folder.  

3. Within the folder named "symbols", if there is not already a folder called "ext", create a folder called "ext".  

4. Now that the "ext" folder exists, or already exits, open it, and paste into the "ext" folder the one .js and two .html files contained in the custom symbol .ZIP folder that you were sent.

5. Within the folder named "ext", if there is not already a folder called "Icons", create a folder called "Icons".  

6. Now that the "Icons" folder exists, or already exits, open it, and paste into the "Icons" folder the one .png image file contained in the custom symbol .ZIP folder that you were sent.

The next time you open a web browser and navigate to PI Vision and create a new PI Vision display, you will see this new symbol appear in the top-left-hand corner of the PI Vision display editor.
