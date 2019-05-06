Follow these simple instructions to install this custom symbol; the overall process should only take a minutes.

1. In Windows Explorer, navigate to the "PIPC\PIVision" installation folder on your PI Vision server; typically, it's located in "C:\Program Files\PIPC\PIVision"

2. From within the folder named "PIVision", navigate to the "\Scripts\app\editor\symbols" sub-folder.  

3. Within the folder named "symbols", if there is not already a folder called "ext", create a folder called "ext".  

4. paste into the "ext" folder the "sym-simplevalue", "sym-simplevalue-config.html" , "sym-simplevalue-template.html". 

5. paste into the "ext" folder sub folder "icons" to include "simplevalue.png" which is the icon of simplevalue.

6. create an Element Attribute "LineCount" , give value "16" as the DataSource in PI System Explorer.

The next time you open a web browser and navigate to PI Vision and create a new PI Vision display, you will see this new symbol appear in the top-left-hand corner of the PI Vision display editor.