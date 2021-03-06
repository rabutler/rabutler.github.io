// adapted from: 
// https://jakearchibald.com/2013/animated-line-drawing-svg/

var draw = function(mySvgObj, myPath){
	var svgObj, svgDoc;

	svgObj = document.getElementById(mySvgObj);
	svgDoc = svgObj.contentDocument;

	var path = svgDoc.getElementById(myPath);
	var length = path.getTotalLength();
	// Clear any previous transition
	path.style.transition = path.style.WebkitTransition = 'none';
	// Set up the starting positions
	path.style.strokeDasharray = length + ' ' + length;
	path.style.strokeDashoffset = length;
	// Trigger a layout so styles are calculated & the browser
	// picks up the starting position before animating
	path.getBoundingClientRect();
	// Define our transition
	path.style.transition = path.style.WebkitTransition =
	  'stroke-dashoffset 10s linear';
	path.style.strokeOpacity = '1';
	// Go!
	path.style.strokeDashoffset = '0';
}
	