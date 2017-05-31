// Setting the correct variables
// Shout-out to Gottem for proposing the scrolling

footerID = 'browse_end_of_results_footer'; //Desktop variant
//footerID = '_2jre'; //Mobile variant

imageClassName = '_23q'; //Desktop variant
//imageClassName = '_4-r5'; //Mobile variant

// Some debug variables
runonce = null; // Set to 1 if it should only run once
noscroll = null; // Set to 1 if it should not do the whole srolling thingamajing

console.log('Initialising');
setTimeout(fixScrolling, 1000);

var elems = [];
var counterVariable = 0;
var counter = 0;
var datTimer = null;

// For proper filenames
function padzeroes(num, size) {
	var s = num + "";
	while(s.length < size) s = "0" + s;
	return s;
}

function fixScrolling() {
	// Scroll to bottom of image container thingy
	var objDiv = document.getElementById(footerID);
	//var objDiv = document.getElementsByClassName(footerID)[0];
	if(objDiv == null && noscroll == null) {
		console.log('Continuing scrolling...');
		window.scrollTo(0, document.body.scrollHeight);
		setTimeout(fixScrolling, 1000);
		return;
	}
	window.scrollTo(0, 0);
	objDiv = null;

	elems = document.getElementsByClassName(imageClassName);;
	counterVariable = elems.length;
	console.log("I found " + counterVariable + " downloadable images on this page!");
	datTimer = setInterval(imageDownloadFunction, 10000); // Every 10 seconds
}

function imageDownloadFunction() {
	if(counter >= (counterVariable - 1)) {
		console.log('End of pictures reached!')
		clearInterval(datTimer);
		datTimer = null;
		elems = null;
		return;
	}

	console.log('Downloading next picture...');
	dlPic();
}

function dlPic() {
	var el = elems[counter];
	var num = counter + 1;
	console.log('Counter is: ' + num);

	// <a> tags contain junk usually
	if(el.tagName.toLowerCase() !== "a")
		return;

	var url = el.getAttribute("href");
	var url = "https://www.facebook.com" + url;
	var url = url.replace(/&refid.+/, '');
	var url = url + '&type=1&theater';
	url = url.replace(/type=\d+/, "type=3")
	var xhttp = new XMLHttpRequest();

	el = null;
	elems[counter] = null;

	console.log('Found a picture');
	console.log("Going to load an iframe of: " + url);

	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			var frameid = "frameIDstr" + counter;
			console.log("Xhttp succesfully loaded -- iframe: " + frameid);

			var targetFrame = document.createElement("iframe");
			targetFrame.setAttribute("id", frameid); // So we can refer to it later
			targetFrame.style.display = "none"; // Hide it
			document.body.appendChild(targetFrame);
			targetFrame.contentWindow.document.open();
			targetFrame.contentWindow.document.write(this.responseText);
			targetFrame.contentWindow.document.close();
			
			setTimeout(function() { // Need a timeout to make sure everything was rendered correctly
				var contentVariable = targetFrame.contentDocument || targetFrame.contentWindow.document;
				contentVariable.getElementsByClassName('fbPhotoSnowliftDropdownButton')[0].click(); // Have to simulate click in order for Options table below to show up and provide us with the download link
				setTimeout(function() {
					var lightBox = contentVariable.getElementsByClassName("_54nc");
					var fullsize = null;
					var timestmp = contentVariable.getElementsByClassName('timestampContent')[0].innerHTML;
	
					for(var j = 0; j < lightBox.length; j++) {
						var lb = lightBox[j];
						if(lb.tagName.toLowerCase() == "a" && lb.href.includes('download')) { // changed img to a
							if(lb.href.includes("spacer.gif")) { // changed lb.src to lb.href
								console.log("Image #" + num + ") Facebook returned spacer.gif (timeout is set too low)");
								continue;
							}
							//fullsize = lb.src;
							fullsize = lb.href;
							console.log('looks like the full res URL is at: ' + fullsize);
						}
						lb = null;
					}
	
					if(fullsize == null) {
						console.log("Image #" + num + ") Unable to determine full size picture");
						return;
					}
	
					// Dirty hack for cross-origin downloads with custom filename
					// Credits to Gottem on this one
					var xmlblob = new XMLHttpRequest();
					xmlblob.open("GET", fullsize, true);
					xmlblob.responseType = "blob"; // STOP JUDING ME
					xmlblob.onload = function() {
						//var ext = fullsize.split('.').pop().split(/\#|\?/)[0]; // Figure out extension, just in case fam
						var ext = 'jpg';
						var finalBlob = new Blob([xmlblob.response], { type : "application/octet-stream" }); // Finish up blob
						var a = document.createElement('a'); // For Chrome there's no need to actually append the <a> to a body somewhere
						a.href = window.URL.createObjectURL(finalBlob);
						//a.download = "image-" + padzeroes(num, counterVariable.toString().length) + "." + ext; // Nice filename right?
						a.download = timestmp + '-' + padzeroes(num, counterVariable.toString().length) + "." + ext;
						a.click(); // Simulate click
						a = null;
						ext = null;
						fullsize = null;
						finalBlob = null;
						xmlblob = null;
					}
					xmlblob.send(); // Send request
	
					// Clean up lmao
					console.log("Removing iframe");
					document.body.removeChild(targetFrame);
					targetFrame.remove();
					targetFrame = null;
					contentVariable = null;
					lightBox = null;
					xhttp = null;
				}, 1000);
			}, 8000); // That 8 second timeout because Facebook's photo-box JavaScript is beyond horrible
		}
	}

	xhttp.open("GET", url, true);
	xhttp.send();
	counter++;
	url = null;
	if (runonce == 1) {
		console.log('Test 1');
		clearInterval(datTimer);
		datTimer = null;
		elems = null;
	}
};