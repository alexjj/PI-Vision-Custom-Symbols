Follow these simple instructions to install this custom symbol; the overall process should only take a minutes.

1. In Windows Explorer, navigate to the "PIPC\PIVision" installation folder on your PI Vision server; typically, it's located in "C:\Program Files\PIPC\PIVision"

2. From within the folder named "PIVision", navigate to the "\Scripts\app\editor\symbols" sub-folder.  

3. Within the folder named "symbols", if there is not already a folder called "ext", create a folder called "ext".  

4. The Symbol will use hightchart, you pasted "hightcharts.js" into "ext" folder directly,  you will find the hightcharts.js in svn "linechart" folder, the hightchart version is 4.2.3.

5. Paste into the "ext" folder the "sym-linechart.js" and "sym-linechart-template.html".

6. In PI System Explorer, Create Element Attribute, Value Type: String, Value [{name: '短暂停机123',data: [20]}, {name: '包装瑕疵材料',data: [12]}, {name: '生产前准备',data: [7]}]

The next time you open a web browser and navigate to PI Vision and create a new PI Vision display, you will see this new symbol appear in the top-left-hand corner of the PI Vision display editor.