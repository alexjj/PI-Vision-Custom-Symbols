## Manual Data Entry symbol  

This symbol prototype is for PI Vision version 2017.

<img src="https://github.com/AnnaPerry/PI-Coresight-Custom-Symbols/blob/master/Community%20Samples/OSIsoft/manual-data-entry/Example.png" 
alt="Manual Data Entry for PI Coresight" />

## Feedback needed

If you are using this symbol in your project, would you mind sending me a couple of lines on what your use case for manual entry is? I'd appreciate it very much! aperry @ osisoft.com

## To deploy the symbol: 

1. In Windows Explorer, navigate to the "%PIHOME%\PIVision\Scripts\app\editor\symbols\ext" on your PI Coresight web server; typically, it's located in "C:\Program Files\PIPC\PIVision\Scripts\app\editor\symbols\ext".
If this folder doesn't exist, create it.

2. Place the following symbol files to the .\ext folder

	*sym-sendvalue-template.html*
	
	*sym-sendvalue-config.html*
	
	*sym-sendvalue.js*

3. Place *paper-plane-xxl.png*, *GitHub-Mark-32px.png*, *Q.png* and *loading.gif* to the .\ext\Icons directory (create if it doesn't exist)
4. Place the Underscore library (*underscore-min.js*) to the .\ext\libraries (create if doesn't exist). The latest version of Underscore can be downloaded from http://underscorejs.org/.
5. Place *bootstrap-manual-entry.css* to the "%PIHOME%\PIVision\Scripts\app\editor\tools\ext" directory. If this folder doesn't exist, create it.

## A word about requirements

### Client side configuration
This symbol uses PI Web API to send data to the PI System.

This means that if you use a self-signed certificate for PI Web API, each client machine needs to install that certificate. 
Here is a video on how to install certificates for PI Web API: https://www.youtube.com/watch?list=PLMcG1Hs2JbcvGH0VCE4o-CjjaUkTiW5_D&v=KvYsF5MMQMU#t=04m18s

### Server side configuration
And since the PI Web API requests are made from within PI Coresight server, you may (read: definitely will) run into CORS issues.
I found the following video helpful when trying get CORS working without having to throw my server security wide open
 (i.e. without CorsHeaders=\*, CorsMethods=\* and CorsOrigins=*): https://www.youtube.com/watch?v=EyxieRFRPRw&index=10&list=PLMcG1Hs2JbcvGH0VCE4o-CjjaUkTiW5_D

## Quick Demo Video

(This is a video of the slightly older version of the symbol with different styling. Core functionality didn't change.) 
<a href="http://www.youtube.com/watch?feature=player_embedded&v=CUklG6o9yHc
" target="_blank"><img src="http://img.youtube.com/vi/CUklG6o9yHc/0.jpg" 
alt="Manual Data Entry for PI Coresight" width="500" height="300" border="10" /></a>
