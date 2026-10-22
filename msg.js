chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
	try {
		var videosize = 0;
		var videos = document.querySelectorAll("video");
		if (videos) {
			videosize = videos.length
		}
		if (videos.length == 0) {
			videos = document.querySelectorAll("iframe")
		}
		for (var m = 0; m < videos.length; m++) {
			var video = videos[m];
			var box = video.getBoundingClientRect();
			if (box.height > 0 && box.width > 0) {
				//JSInterface.setVideoParm(videosize, box.height / window.innerHeight, box.width / window.innerWidth, box.left / window.innerWidth, (box.top) / window.innerHeight)
			request.value.place = {
            		hbz: box.height / window.innerHeight,
            		wbz: box.width / window.innerWidth,
            		left: box.left / window.innerWidth,
            		top: (box.top) / window.innerHeight
            	}
			}
		}
	} catch(e) {};
	request.value.place = {
		hbz: box.height / window.innerHeight,
		wbz: box.width / window.innerWidth,
		left: box.left / window.innerWidth,
		top: (box.top) / window.innerHeight
	}
	browser.runtime.sendNativeMessage("browser", request);
})