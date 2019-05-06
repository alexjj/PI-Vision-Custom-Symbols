Follow these simple instructions to install this custom symbol; the overall process should only take a minutes.

1. In Windows Explorer, navigate to the "PIPC\PIVision" installation folder on your PI Vision server; typically, it's located in "C:\Program Files\PIPC\PIVision"

2. From within the folder named "PIVision", navigate to the "\Scripts\app\editor\symbols" sub-folder.  

3. Within the folder named "symbols", if there is not already a folder called "ext", create a folder called "ext".  

4. paste into the "ext" folder "sym-statuslight.js", "sym-statuslight-config.html", "sym-statuslight-template" which are contained in the "statuslight" folder.

5. paste into the "ext" folder two sub folders, 
first sub folder "icons" contains "green.png" which is the icon of statuslight; 
second folder "imgs" contains "green.png", "red.png", "white.png", "yellow.png".

6. create an Elements Attribute "LineState", give the value "10" as the data source in PI System Explorer.

The next time you open a web browser and navigate to PI Vision and create a new PI Vision display, you will see this new symbol appear in the top-left-hand corner of the PI Vision display editor.