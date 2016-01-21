// adapted from: 
// https://24ways.org/2013/animating-vectors-with-svg/

window.onload=function(){
	var current_frame, total_frames, path1, length1, handle, myobj, svgObj, svgDoc;

	myobj = document.getElementById('driveRouteContainer').cloneNode(true);
	svgObj = document.getElementById('driveRouteObj');
	svgDoc = svgObj.contentDocument;

	var init = function(){
		current_frame = 0;
		total_frames = 300;
		path1 = svgDoc.getElementById('drivePath');
		length1 = path1.getTotalLength();
		path1.style.strokeDasharray = length1 + ' ' + length1; 
		path1.style.strokeDashoffset = length1;

		handle = 0;
	};
		
	var draw = function() {
	   var progress = current_frame/total_frames;
	   if (progress > 1) {
		 window.cancelAnimationFrame(handle);
	   } else {
		 current_frame++;
		 path1.style.strokeDashoffset = Math.floor(length1 * (1 - progress));
		 
		 handle = window.requestAnimationFrame(draw);
	   }
	};
		
	init();	
	draw();


var redraw = function(){
	var old = document.getElementsByTagName('div')[0];
	old.parentNode.removeChild(old);
	document.getElementsByTagName('body')[0].appendChild(myobj);
	init();
	draw();
};
};
